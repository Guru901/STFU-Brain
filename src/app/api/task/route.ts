import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const taskSchema = z.object({
  content: z.string(),
  codes: z.string(),
  context: z.string().optional(),
  tag: z.string().optional(),
  priority: z.enum(["low", "routine", "high"]),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const safeTask = taskSchema.safeParse(data);

    if (!safeTask.success) {
      return NextResponse.json(
        { success: false, message: safeTask.error.message },
        { status: 400 },
      );
    }

    const { codes, content, priority, context, tag } = safeTask.data;

    await db.insert(taskTable).values({
      content,
      codes,
      priority,
      extraContext: context,
      tag,
    });

    return NextResponse.json({
      success: true,
      message: "Task saved successfully!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error saving user",
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const codes = req.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json({ success: false, message: "No codes found" });
    }

    const tasks = await db
      .select({
        id: taskTable.id,
        content: taskTable.content,
        priority: taskTable.priority,
        extraContext: taskTable.extraContext,
        completed: taskTable.completed,
      })
      .from(taskTable)
      .where(
        and(ilike(taskTable.codes, codes), eq(taskTable.completed, false)),
      );

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error fetching tasks",
    });
  }
}
