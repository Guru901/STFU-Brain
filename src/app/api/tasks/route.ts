import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const codes = request.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json(
        { success: false, message: "No codes found" },
        { status: 400 },
      );
    }

    const [incomplete, completed] = await Promise.all([
      db
        .select()
        .from(taskTable)
        .where(and(eq(taskTable.codes, codes), eq(taskTable.completed, false)))
        .orderBy(desc(taskTable.createdAt)),
      db
        .select()
        .from(taskTable)
        .where(and(eq(taskTable.codes, codes), eq(taskTable.completed, true)))
        .orderBy(desc(taskTable.createdAt))
        .limit(5),
    ]);

    // featured = highest priority incomplete task
    const priorityOrder = { high: 0, routine: 1, low: 2 };
    const featured =
      [...incomplete].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      )[0] ?? null;

    // rest = remaining incomplete tasks (excluding featured)
    const rest = incomplete.filter((t) => t.id !== featured?.id);

    return NextResponse.json({
      success: true,
      data: { featured, tasks: rest, completed },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
