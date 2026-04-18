import { db } from "@/db";
import { dumpTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const codes = req.cookies.get("codes")?.value;
    if (!codes) {
      return NextResponse.json({ success: false, message: "No codes found" });
    }

    const dumps = await db
      .select({
        id: dumpTable.id,
        title: dumpTable.title,
        content: dumpTable.content,
        createdAt: dumpTable.createdAt,
      })
      .from(dumpTable)
      .where(eq(dumpTable.codes, codes))
      .orderBy(desc(dumpTable.createdAt))
      .limit(3);

    return NextResponse.json({ success: true, dumps });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error fetching dumps",
    });
  }
}
