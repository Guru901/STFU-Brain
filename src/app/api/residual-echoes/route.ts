import { db } from "@/db";
import { dumpTable, randomThoughtsTable, taskTable } from "@/db/schema";
import { GoogleGenAI } from "@google/genai";
import { eq, ilike, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

const API_KEY = env.GEMINI_API_KEY;

const systemPrompt = `You are a brain dump processor.
Input: journal entries, tasks, and random thoughts from a user's brain dump session (may include titles and bodies).
Output: Valid JSON only.
Give me 4 things which are the most common themes across all the entries, tasks, and thoughts.
Keep it short.
Split compound thoughts and clean grammar slightly.
Classify each theme as one of: WORRY, TASK, or RANDOM.`;

export async function GET(request: NextRequest) {
  try {
    const codes = request.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json(
        { success: false, message: "No codes found" },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const modelQueue = [
      "gemini-3.1-flash-lite-preview",
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
    ];

    const [entries, tasksCleared, thoughts] = await Promise.all([
      db.select().from(dumpTable).where(ilike(dumpTable.codes, codes)),
      db
        .select()
        .from(taskTable)
        .where(and(eq(taskTable.codes, codes), eq(taskTable.completed, true))),
      db
        .select()
        .from(randomThoughtsTable)
        .where(ilike(randomThoughtsTable.codes, codes)),
    ]);

    const fullInput = `THOUGHTS: ${JSON.stringify(thoughts)}\nTASKS: ${JSON.stringify(tasksCleared)}\nENTRIES: ${JSON.stringify(entries)}`;

    let lastError = null;

    for (const modelId of modelQueue) {
      try {
        console.log(`Attempting with ${modelId}...`);

        const response = await ai.models.generateContent({
          model: modelId,
          contents: [{ role: "user", parts: [{ text: fullInput }] }],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  type: { type: "string", enum: ["WORRY", "TASK", "RANDOM"] },
                },
                required: ["text", "type"],
              },
            },
          },
        });

        const json = JSON.parse(response.text!);
        console.log(json);

        return NextResponse.json({ success: true, data: json });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        lastError = error;
        console.error(`Error with model ${modelId}:`, error);

        if (error.status === 503 || error.status === 500) {
          console.warn(
            `${modelId} failed with ${error.status}. Trying next fallback...`,
          );
          continue;
        }

        break;
      }
    }

    return NextResponse.json(
      { success: false, message: lastError?.message ?? "All models failed" },
      { status: 503 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching residual echoes" },
      { status: 500 },
    );
  }
}
