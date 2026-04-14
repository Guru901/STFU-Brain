import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
});

function generateRecoveryCodes(): string[] {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase(),
    ).join("-"),
  );
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const safeUser = userSchema.safeParse(data);

    if (!safeUser.success) {
      return NextResponse.json(
        { success: false, message: safeUser.error.message },
        { status: 400 },
      );
    }

    const codes = generateRecoveryCodes();

    const { name } = safeUser.data;

    await saveUser(name, codes);

    const res = NextResponse.json({
      success: true,
      data: { codes },
      message: "User saved successfully!",
    });

    res.cookies.set("user", name);
    res.cookies.set("codes", codes.join("||"));

    return res;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error saving user",
    });
  }
}

async function saveUser(name: string, codes: string[]) {
  const codeString = codes.join("||");
  const user = { name, code: codeString };
  await db.insert(usersTable).values(user);
}
