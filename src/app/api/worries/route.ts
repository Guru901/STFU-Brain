import { db } from "@/db";
import { worriesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc, ilike } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const codes = req.cookies.get("codes")?.value;

    if (!codes) {
      return NextResponse.json({ success: false, message: "No codes found" });
    }

    const worries = await db
      .select({
        id: worriesTable.id,
        content: worriesTable.content,
      })
      .from(worriesTable)
      .orderBy(desc(worriesTable.createdAt))
      .where(ilike(worriesTable.codes, codes));

    return NextResponse.json(worries);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error fetching tasks",
    });
  }
}
