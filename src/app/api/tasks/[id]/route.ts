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
    const { completed } = body as { completed: boolean };

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { success: false, message: "completed must be a boolean" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(taskTable)
      .set({ completed })
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
