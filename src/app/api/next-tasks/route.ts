import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { and, eq, asc, ilike } from "drizzle-orm";
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

    const tasks = await db
      .select()
      .from(taskTable)
      .where(and(ilike(taskTable.codes, codes), eq(taskTable.completed, false)))
      .orderBy(asc(taskTable.createdAt))
      .limit(3);

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
