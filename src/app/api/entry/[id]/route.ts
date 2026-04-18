import { db } from "@/db";
import { dumpTable } from "@/db/schema";
import { eq, and, ilike } from "drizzle-orm";
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

    const entry = await db
      .select()
      .from(dumpTable)
      .where(and(eq(dumpTable.id, id), ilike(dumpTable.codes, `%${codes}%`)));

    if (entry.length === 0) {
      return NextResponse.json({ success: false, message: "No entry found" });
    }

    return NextResponse.json({
      success: true,
      message: "Entry fetched",
      createdAt: entry[0].createdAt,
      title: entry[0].title,
      html: { __html: entry[0].content },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error fetching entry",
    });
  }
}
