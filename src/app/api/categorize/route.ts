import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/env";
import { db } from "@/db";
import { randomThoughtsTable, taskTable, worriesTable } from "@/db/schema";

const API_KEY = env.GEMINI_API_KEY;

const systemPrompt = `You are a brain dump processor. 
Input: raw unfiltered thoughts (may include a title and body).
Output: Valid JSON only.
Classification: 
1. "worries": fears/anxieties.
2. "tasks": actionable todos.
3. "random": ideas/observations.
Split compound thoughts and clean grammar slightly.`;

export async function POST(req: NextRequest) {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const { content, title, codes } = await req.json();
    const fullInput = `Title: ${title}\nContent: ${content}`;

    const modelQueue = [
      "gemini-3.1-flash-lite-preview",
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
    ];

    let lastError = null;

    for (const modelId of modelQueue) {
      try {
        console.log(`Attempting classification with ${modelId}...`);

        const response = await ai.models.generateContent({
          model: modelId,
          contents: [{ role: "user", parts: [{ text: fullInput }] }],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                worries: { type: "array", items: { type: "string" } },
                tasks: { type: "array", items: { type: "string" } },
                random: { type: "array", items: { type: "string" } },
              },
              required: ["worries", "tasks", "random"],
            },
          },
        });

        const processedData: {
          worries: string[];
          tasks: string[];
          random: string[];
        } = JSON.parse(response.text || "{}");

        if (processedData.worries.length > 0) {
          await db.insert(worriesTable).values(
            processedData.worries.map((worry) => ({
              content: worry,
              codes,
            })),
          );
        }

        if (processedData.tasks.length > 0) {
          await db.insert(taskTable).values(
            processedData.tasks.map((task) => ({
              content: task,
              codes,
            })),
          );
        }

        if (processedData.random.length > 0) {
          await db.insert(randomThoughtsTable).values(
            processedData.random.map((thought) => ({
              content: thought,
              codes,
            })),
          );
        }

        return NextResponse.json({
          success: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        lastError = error;

        if (error.status === 503 || error.status === 500) {
          console.warn(
            `${modelId} failed with ${error.status}. Trying next fallback...`,
          );
          continue;
        }

        break;
      }
    }

    console.error("All models in queue failed:", lastError);
    return NextResponse.json(
      { success: false, error: lastError?.message || "All models unavailable" },
      { status: 503 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error saving dump" },
      { status: 500 },
    );
  }
}
