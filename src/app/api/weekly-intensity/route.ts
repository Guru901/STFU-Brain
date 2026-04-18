import { db } from "@/db";
import {
  dumpTable,
  randomThoughtsTable,
  taskTable,
  worriesTable,
} from "@/db/schema";
import { and, eq, gte, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getLast14Days() {
  const days: { label: string; start: Date; end: Date }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const start = startOfDay(d);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      start,
      end,
    });
  }
  return days;
}

export async function GET(request: NextRequest) {
  try {
    const codes = request.cookies.get("codes")?.value;
    if (!codes) {
      return NextResponse.json(
        { success: false, message: "No codes found" },
        { status: 400 },
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - 13);
    startOfDay(since);

    const [worries, tasks, randoms, entries] = await Promise.all([
      db
        .select()
        .from(worriesTable)
        .where(
          and(
            eq(worriesTable.codes, codes),
            gte(worriesTable.createdAt, since),
          ),
        ),
      db
        .select()
        .from(taskTable)
        .where(
          and(eq(taskTable.codes, codes), gte(taskTable.createdAt, since)),
        ),
      db
        .select()
        .from(randomThoughtsTable)
        .where(
          and(
            eq(randomThoughtsTable.codes, codes),
            gte(randomThoughtsTable.createdAt, since),
          ),
        ),
      db
        .select()
        .from(dumpTable)
        .where(
          and(ilike(dumpTable.codes, codes), gte(dumpTable.createdAt, since)),
        ),
    ]);

    const days = getLast14Days();

    const result = days.map(({ label, start, end }) => {
      const inRange = (d: Date | null) => d && d >= start && d <= end;

      const w = worries.filter((r) => inRange(r.createdAt)).length;
      const t = tasks.filter((r) => inRange(r.createdAt)).length;
      const r = randoms.filter((r) => inRange(r.createdAt)).length;
      const e = entries.filter((r) => inRange(r.createdAt)).length;

      const score = w * 2 + t + r + e;

      return { label, worries: w, tasks: t, random: r, entries: e, score };
    });

    // normalize scores to 0-1 for color mapping
    const maxScore = Math.max(...result.map((d) => d.score), 1);
    const normalized = result.map((d) => ({
      ...d,
      intensity: parseFloat((d.score / maxScore).toFixed(2)),
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
