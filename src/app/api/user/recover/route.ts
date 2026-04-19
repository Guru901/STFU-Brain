import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const recoverSchema = z.object({
  name: z.string(),
  codes: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const safeData = recoverSchema.safeParse(data);

    if (!safeData.success) {
      return NextResponse.json(
        { success: false, message: safeData.error.message },
        { status: 400 },
      );
    }

    const { name, codes } = safeData.data;

    const userFromDb = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.name, name));

    if (!userFromDb.length) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const codesFromDb = userFromDb[0].code;
    const codesFromUser = codes.split(",").join("||");

    if (codesFromDb.includes(codesFromUser)) {
      const res = NextResponse.json({
        success: true,
        message: "User recovered successfully!",
      });

      res.cookies.set("user", name);
      res.cookies.set("codes", codesFromDb);
      return res;
    }

    return NextResponse.json({
      success: false,
      message: "Invalid recovery codes",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error saving user",
    });
  }
}
