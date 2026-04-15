import { db } from "@/db";
import { dumpTable, usersTable } from "@/db/schema";
import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const dumpSchema = z.object({
  title: z.string(),
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

    const { content, title } = safeDump.data;
    const codes = String(req.cookies.get("codes")?.value);

    await db.insert(dumpTable).values({
      codes,
      content,
      title,
    });

    const res = NextResponse.json({
      success: true,
      message: "Dump saved successfully!",
    });

    after(() => {
      console.log("fetch called");
      fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/categorize`,
        {
          method: "POST",
          body: JSON.stringify({ title, content, codes }),
          headers: { "Content-Type": "application/json" },
        },
      ).catch(console.error);
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error saving dump",
      },
      { status: 500 },
    );
  }
}
