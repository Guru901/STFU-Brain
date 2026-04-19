import { db } from "@/db";
import { dumpTable, randomThoughtsTable, worriesTable } from "@/db/schema";
import { GoogleGenAI } from "@google/genai";
import { desc, eq, ilike } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

const API_KEY = env.GEMINI_API_KEY;

const MIND_STATES = [
  {
    id: "calm",
    label: "Calm",
    description: "You're settled. The noise has cleared — use it.",
  },
  {
    id: "focused",
    label: "Focused",
    description: "You're locked in. Stay there as long as you can.",
  },
  {
    id: "scattered",
    label: "Scattered",
    description: "You're pulled in too many directions. Pick one thread.",
  },
  {
    id: "anxious",
    label: "Anxious",
    description:
      "You're running on edge. Most of what you're fearing won't happen.",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description:
      "You're carrying too much. Put it down and do just the next thing.",
  },
  {
    id: "numb",
    label: "Numb",
    description:
      "You're present but not really here. That's okay — rest counts.",
  },
  {
    id: "restless",
    label: "Restless",
    description: "You're charged with nowhere to send it. Find an outlet fast.",
  },
  {
    id: "reflective",
    label: "Reflective",
    description:
      "You're sitting with something. Let it finish before you move.",
  },
] as const;

export type MindStateId = (typeof MIND_STATES)[number]["id"];
export type MindState = (typeof MIND_STATES)[number];

const systemPrompt = `You are a mental state classifier for a brain dump journaling app.
You will be given recent journal entries, worries, and random thoughts from a user.
Based on the emotional tone, urgency, and content patterns — classify the user's current mind state.

You must pick EXACTLY ONE state from this list:
${MIND_STATES.map((s) => `- "${s.id}": ${s.label}`).join("\n")}

Output valid JSON only. No preamble. No explanation.`;

const computeMindState = async (codes: string): Promise<MindState> => {
  const [recentDumps, recentWorries, recentThoughts] = await Promise.all([
    db
      .select({ title: dumpTable.title, content: dumpTable.content })
      .from(dumpTable)
      .where(ilike(dumpTable.codes, codes))
      .orderBy(desc(dumpTable.createdAt))
      .limit(5),
    db
      .select({ content: worriesTable.content })
      .from(worriesTable)
      .where(eq(worriesTable.codes, codes))
      .orderBy(desc(worriesTable.createdAt))
      .limit(5),
    db
      .select({ content: randomThoughtsTable.content })
      .from(randomThoughtsTable)
      .where(eq(randomThoughtsTable.codes, codes))
      .orderBy(desc(randomThoughtsTable.createdAt))
      .limit(5),
  ]);

  if (
    recentDumps.length === 0 &&
    recentWorries.length === 0 &&
    recentThoughts.length === 0
  ) {
    return MIND_STATES.find((s) => s.id === "calm")!;
  }

  const fullInput = [
    recentDumps.length > 0
      ? `JOURNAL ENTRIES:\n${recentDumps.map((d) => `[${d.title}] ${d.content}`).join("\n")}`
      : null,
    recentWorries.length > 0
      ? `WORRIES:\n${recentWorries.map((w) => w.content).join("\n")}`
      : null,
    recentThoughts.length > 0
      ? `RANDOM THOUGHTS:\n${recentThoughts.map((t) => t.content).join("\n")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const modelQueue = [
    "gemini-2.5-flash",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
  ];

  let lastError: any = null;

  for (const modelId of modelQueue) {
    try {
      console.log(`Mind state: attempting with ${modelId}...`);

      const response = await ai.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: fullInput }] }],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              state: {
                type: "string",
                enum: MIND_STATES.map((s) => s.id),
              },
            },
            required: ["state"],
          },
        },
      });

      const json = JSON.parse(response.text!);
      const matched = MIND_STATES.find((s) => s.id === json.state);

      if (!matched) throw new Error(`Unknown state returned: ${json.state}`);

      console.log("Mind state:", matched.label);
      return matched;
    } catch (error: any) {
      lastError = error;
      console.error(`Error with model ${modelId}:`, error);
      if (error.status === 503 || error.status === 500) continue;
      break;
    }
  }

  throw lastError ?? new Error("All models failed");
};

// cached per user (codes), revalidates every 10 minutes
// bust this with revalidateTag("mind-state") after a new dump is saved
const getCachedMindState = (codes: string) =>
  unstable_cache(() => computeMindState(codes), ["mind-state", codes], {
    revalidate: 60 * 10,
    tags: ["mind-state"],
  })();

export async function GET(request: NextRequest) {
  try {
    const codes = request.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json(
        { success: false, message: "No codes found" },
        { status: 400 },
      );
    }

    const data = await getCachedMindState(codes);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
