import { db } from "@/db";
import { dumpTable, usersTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const dumpSchema = z.object({
  content: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const safeDump = dumpSchema.safeParse(data);

    if (!safeDump.success) {
      return NextResponse.json(
        { success: false, message: safeDump.error.message },
        { status: 400 },
      );
    }

    const { content } = safeDump.data;
    const codes = String(req.cookies.get("codes")?.value);

    await db.insert(dumpTable).values({
      codes,
      content,
    });

    const res = NextResponse.json({
      success: true,
      data: { codes },
      message: "User saved successfully!",
    });

    return res;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error saving user",
    });
  }
}
