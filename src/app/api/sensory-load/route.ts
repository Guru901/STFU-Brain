import { db } from "@/db";
import {
  dumpTable,
  randomThoughtsTable,
  taskTable,
  worriesTable,
} from "@/db/schema";
import { and, eq, gte, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const NOISY_THRESHOLD = 10;

const RECOMMENDATIONS: Record<
  "clear" | "active" | "noisy" | "overloaded",
  { activity: string; duration: string }[]
> = {
  clear: [
    { activity: "Morning Pages", duration: "10m" },
    { activity: "Free Writing", duration: "15m" },
    { activity: "Gratitude Log", duration: "5m" },
  ],
  active: [
    { activity: "Pomodoro Focus Block", duration: "25m" },
    { activity: "Task Prioritization", duration: "10m" },
    { activity: "Brain Dump Session", duration: "10m" },
  ],
  noisy: [
    { activity: "Box Breathing", duration: "4m" },
    { activity: "5-4-3-2-1 Grounding", duration: "5m" },
    { activity: "Cold Water Reset", duration: "2m" },
    { activity: "Walk Away from Screen", duration: "10m" },
  ],
  overloaded: [
    { activity: "Box Breathing", duration: "4m" },
    { activity: "Full Body Scan", duration: "8m" },
    { activity: "Step Outside", duration: "15m" },
    { activity: "Shut Everything Down", duration: "30m" },
  ],
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStatusLabel(score: number): {
  status: "clear" | "active" | "noisy" | "overloaded";
  headline: string;
  description: string;
} {
  if (score === 0) {
    return {
      status: "clear",
      headline: "Quiet Day",
      description: "Nothing logged yet. A blank slate — or a well-rested mind.",
    };
  }
  if (score < NOISY_THRESHOLD * 0.5) {
    return {
      status: "active",
      headline: "Low Activity",
      description: "A few things on your mind. You're moving, not spinning.",
    };
  }
  if (score < NOISY_THRESHOLD) {
    return {
      status: "active",
      headline: "Moderate Load",
      description: "Your mental bandwidth is filling up. Pace yourself.",
    };
  }
  if (score < NOISY_THRESHOLD * 1.5) {
    return {
      status: "noisy",
      headline: "High Sensory Input",
      description:
        "You've logged a lot today. Your mental bandwidth is reaching capacity.",
    };
  }
  return {
    status: "overloaded",
    headline: "Overloaded",
    description:
      "You're running at full capacity. Step back before you add anything else.",
  };
}

function pickRecommendation(
  status: "clear" | "active" | "noisy" | "overloaded",
) {
  const list = RECOMMENDATIONS[status];
  return list[Math.floor(Math.random() * list.length)];
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

    const since = startOfToday();

    const [dumps, worries, randoms, tasks] = await Promise.all([
      db
        .select({ id: dumpTable.id })
        .from(dumpTable)
        .where(
          and(ilike(dumpTable.codes, codes), gte(dumpTable.createdAt, since)),
        ),
      db
        .select({ id: worriesTable.id })
        .from(worriesTable)
        .where(
          and(
            eq(worriesTable.codes, codes),
            gte(worriesTable.createdAt, since),
          ),
        ),
      db
        .select({ id: randomThoughtsTable.id })
        .from(randomThoughtsTable)
        .where(
          and(
            eq(randomThoughtsTable.codes, codes),
            gte(randomThoughtsTable.createdAt, since),
          ),
        ),
      db
        .select({ id: taskTable.id })
        .from(taskTable)
        .where(
          and(eq(taskTable.codes, codes), gte(taskTable.createdAt, since)),
        ),
    ]);

    const dumpCount = dumps.length;
    const worryCount = worries.length;
    const randomCount = randoms.length;
    const taskCount = tasks.length;

    const score = worryCount * 2 + dumpCount + randomCount + taskCount;
    const intensity = Math.min(score / NOISY_THRESHOLD, 1);

    const { status, headline, description } = getStatusLabel(score);
    const recommendation = pickRecommendation(status);

    return NextResponse.json({
      success: true,
      data: {
        status,
        headline,
        description,
        score,
        intensity,
        recommendation,
        counts: {
          dumps: dumpCount,
          worries: worryCount,
          randoms: randomCount,
          tasks: taskCount,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
