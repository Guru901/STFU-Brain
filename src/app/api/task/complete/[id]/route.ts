import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { eq, and, ilike, DrizzleQueryError } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const codes = req.cookies.get("codes")?.value;

    if (!id) {
      return NextResponse.json({ success: false, message: "No id found" });
    }

    if (!codes) {
      return NextResponse.json({ success: false, message: "No codes found" });
    }

    await db
      .update(taskTable)
      .set({ completed: true })
      .where(and(eq(taskTable.id, id), ilike(taskTable.codes, codes)));

    return NextResponse.json({
      success: true,
      message: "Task marked as complete",
    });
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      NextResponse.json(
        {
          success: false,
          message: "Error marking task as complete",
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json({
        success: false,
        status: 500,
        message: "Error marking task as complete",
      });
    }
  }
}
