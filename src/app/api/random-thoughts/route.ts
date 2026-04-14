import { db } from "@/db";
import { randomThoughtsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { ilike } from "drizzle-orm";

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
      .where(ilike(randomThoughtsTable.codes, codes));

    return NextResponse.json(thoughts);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error fetching tasks",
    });
  }
}
