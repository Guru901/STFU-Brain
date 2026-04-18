import { db } from "@/db";
import { dumpTable, randomThoughtsTable, taskTable } from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";
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

    const entriesCount = entries.length;
    const tasksCount = tasksCleared.length;
    const thoughtsCount = thoughts.length;

    const total = entriesCount + tasksCount + thoughtsCount;

    const round = (num: number) => Math.round(num);

    const percentages =
      total === 0
        ? {
            entries: 0,
            tasksCleared: 0,
            thoughts: 0,
          }
        : {
            entries: round((entriesCount / total) * 100),
            tasksCleared: round((tasksCount / total) * 100),
            thoughts: round((thoughtsCount / total) * 100),
          };

    return NextResponse.json({
      success: true,
      counts: {
        entries: entriesCount,
        tasksCleared: tasksCount,
        thoughts: thoughtsCount,
      },
      percentages,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching profile data" },
      { status: 500 },
    );
  }
}
