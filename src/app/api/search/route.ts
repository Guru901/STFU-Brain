import { db } from "@/db";
import {
  dumpTable,
  randomThoughtsTable,
  taskTable,
  worriesTable,
} from "@/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
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

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    if (!q) {
      return NextResponse.json({ success: true, data: [] });
    }

    const pattern = `%${q}%`;

    const [dumps, thoughts, worries, tasks] = await Promise.all([
      db
        .select({
          id: dumpTable.id,
          title: dumpTable.title,
          content: dumpTable.content,
          createdAt: dumpTable.createdAt,
        })
        .from(dumpTable)
        .where(
          and(
            ilike(dumpTable.codes, `%${codes}%`),
            or(
              ilike(dumpTable.title, pattern),
              ilike(dumpTable.content, pattern),
            ),
          ),
        )
        .orderBy(dumpTable.createdAt)
        .limit(10),

      db
        .select({
          id: randomThoughtsTable.id,
          content: randomThoughtsTable.content,
          createdAt: randomThoughtsTable.createdAt,
        })
        .from(randomThoughtsTable)
        .where(
          and(
            eq(randomThoughtsTable.codes, codes),
            ilike(randomThoughtsTable.content, pattern),
          ),
        )
        .orderBy(randomThoughtsTable.createdAt)
        .limit(10),

      db
        .select({
          id: worriesTable.id,
          content: worriesTable.content,
          createdAt: worriesTable.createdAt,
        })
        .from(worriesTable)
        .where(
          and(
            eq(worriesTable.codes, codes),
            ilike(worriesTable.content, pattern),
          ),
        )
        .orderBy(worriesTable.createdAt)
        .limit(10),

      db
        .select({
          id: taskTable.id,
          content: taskTable.content,
          extraContext: taskTable.extraContext,
          priority: taskTable.priority,
          tag: taskTable.tag,
          completed: taskTable.completed,
          createdAt: taskTable.createdAt,
        })
        .from(taskTable)
        .where(
          and(
            eq(taskTable.codes, codes),
            or(
              ilike(taskTable.content, pattern),
              ilike(taskTable.extraContext, pattern),
            ),
          ),
        )
        .orderBy(taskTable.createdAt)
        .limit(10),
    ]);

    const results = [
      ...dumps.map((d) => ({
        id: d.id,
        type: "dump" as const,
        title: d.title,
        preview: stripHtml(d.content).slice(0, 180),
        createdAt: d.createdAt,
      })),
      ...thoughts.map((t) => ({
        id: t.id,
        type: "random" as const,
        title: t.content,
        preview: null,
        createdAt: t.createdAt,
      })),
      ...worries.map((w) => ({
        id: w.id,
        type: "worry" as const,
        title: w.content,
        preview: null,
        createdAt: w.createdAt,
      })),
      ...tasks.map((t) => ({
        id: t.id,
        type: "task" as const,
        title: t.content,
        preview: t.extraContext ?? null,
        priority: t.priority,
        tag: t.tag,
        completed: t.completed,
        createdAt: t.createdAt,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    );

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
