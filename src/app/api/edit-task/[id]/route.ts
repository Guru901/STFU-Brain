import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const codes = request.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json(
        { success: false, message: "No codes found" },
        { status: 400 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    // build update payload from only what's present in the body
    const update: Partial<{
      completed: boolean;
      content: string;
      extraContext: string | null;
      priority: "low" | "routine" | "high";
    }> = {};

    if (typeof body.completed === "boolean") update.completed = body.completed;
    if (typeof body.content === "string" && body.content.trim()) {
      update.content = body.content.trim();
    }
    if ("extraContext" in body) {
      update.extraContext = body.extraContext?.trim() || null;
    }
    if (["low", "routine", "high"].includes(body.priority)) {
      update.priority = body.priority;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(taskTable)
      .set(update)
      .where(and(eq(taskTable.id, id), eq(taskTable.codes, codes)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
