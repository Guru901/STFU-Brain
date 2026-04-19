import { db } from "@/db";
import { randomThoughtsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { ilike } from "drizzle-orm";
import { z } from "zod";

const randomThoughtSchema = z.object({
  content: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const safeThought = randomThoughtSchema.safeParse(data);
    const codes = req.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json({ success: false, message: "No codes found" });
    }

    if (!safeThought.success) {
      return NextResponse.json(
        { success: false, message: safeThought.error.message },
        { status: 400 },
      );
    }

    const { content } = safeThought.data;

    await db.insert(randomThoughtsTable).values({
      content,
      codes,
    });

    return NextResponse.json({
      success: true,
      message: "Thought saved successfully!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error saving thought",
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const codes = req.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json({ success: false, message: "No codes found" });
    }

    const thoughts = await db
      .select({
        id: randomThoughtsTable.id,
        content: randomThoughtsTable.content,
      })
      .from(randomThoughtsTable)
      .where(ilike(randomThoughtsTable.codes, codes))
      .limit(10);

    return NextResponse.json(thoughts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error fetching tasks",
    });
  }
}
