"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { BreatheIcon, NoisyIcon, ResetIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Greetings from "./greetings";
import Link from "next/link";

const priorityDot: Record<string, string> = {
  high: "bg-[#8B1A2F]",
  routine: "bg-primary",
  low: "bg-[#B0B5B2]",
};

const STATE_CONFIG: Record<string, { image: string; dot: string }> = {
  calm: {
    image: "/calm.png",
    dot: "bg-primary",
  },
  focused: {
    image: "/focused.jpg",
    dot: "bg-[#2E4A42]",
  },
  scattered: {
    image: "/scattered.jpg",
    dot: "bg-[#C4832A]",
  },
  anxious: {
    image: "/anxious.jpg",
    dot: "bg-[#8B5A2E]",
  },
  overwhelmed: {
    image: "/overwhelmed.jpg",
    dot: "bg-[#8B1A2F]",
  },
  numb: {
    image: "/numb.jpg",
    dot: "bg-[#B0B5B2]",
  },
  restless: {
    image: "/restless.jpg",
    dot: "bg-[#4A6B8B]",
  },
  reflective: {
    image: "/reflective.jpg",
    dot: "bg-[#6B4A8B]",
  },
};

const FALLBACK_CONFIG = {
  image: "/calm.png",
  dot: "bg-primary",
};

export default function Dashboard() {
  const { data: tasksData, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["next-tasks"],
    queryFn: async () => {
      const res = await fetch("/api/next-tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: mindStateData, isLoading: isLoadingMindState } = useQuery({
    queryKey: ["mind-state"],
    queryFn: async () => {
      const res = await fetch("/api/mind-state");
      if (!res.ok) throw new Error("Failed to fetch mind state");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
  });

  const mindState: {
    id: string;
    label: string;
    description: string;
  } | null = mindStateData?.data ?? null;

  const config = STATE_CONFIG[mindState?.id ?? "calm"] ?? FALLBACK_CONFIG;

  const tasks: {
    id: string;
    content: string;
    priority: "low" | "routine" | "high";
  }[] = tasksData?.data ?? [];

  return (
    <div className="p-12 flex flex-col gap-16">
      <div className="flex flex-col gap-2">
        <Greetings />
      </div>
      <div className="flex flex-col gap-8 mx-auto">
        <div className="flex gap-8">
          {/* Mind State Card */}
          <div className="bg-white w-max overflow-hidden rounded-xl flex">
            <div className="flex flex-col p-10 justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {isLoadingMindState ? (
                    <Skeleton className="w-3 h-3 rounded-full" />
                  ) : (
                    <div className={`h-3 w-3 rounded-full ${config.dot}`} />
                  )}
                  <p className="text-[#767C79] font-semibold">MIND STATE</p>
                </div>
                {isLoadingMindState ? (
                  <>
                    <Skeleton className="w-28 h-9 rounded" />
                    <Skeleton className="w-56 h-16 rounded" />
                  </>
                ) : (
                  <>
                    <h3 className="text-4xl font-light">
                      {mindState?.label ?? "Calm"}
                    </h3>
                    <p className="max-w-64.25 leading-6.5 text-[#767C79]">
                      {mindState?.description}
                    </p>
                  </>
                )}
              </div>
              <Link
                className={`${buttonVariants({ variant: "secondary" })} font-medium text-[14px] w-min px-6 py-2`}
                href={"/dump"}
              >
                Log Nuance
              </Link>
            </div>
            {isLoadingMindState ? (
              <Skeleton className="w-66.75 h-100" />
            ) : (
              <Image
                src={config.image}
                alt={mindState?.label ?? "Calm"}
                width={267}
                height={400}
                className="object-cover"
              />
            )}
          </div>

          {/* Noisy card */}
          <div className="bg-[#DDEDFE4D] max-w-[288px] p-8 pb-28 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between">
              <NoisyIcon />
              <div className={buttonVariants({ variant: "secondary" })}>
                STATUS: NOISY
              </div>
            </div>
            <div className="py-4.25 flex flex-col gap-2">
              <h3 className="font-semibold text-xl">High Sensory Input</h3>
              <p className="text-[#4A5866CC]">
                You&apos;ve logged 12 rapid entries today. Your mental bandwidth
                is reaching capacity.
              </p>
            </div>
            <div className="bg-white p-4 flex items-center gap-4 rounded-xl">
              <BreatheIcon />
              <div>
                <p className="text-[#52616F] font-bold text-[12px]">
                  RECOMMENDED
                </p>
                <p className="text-[#2E3432] font-medium text-[14px]">
                  Box Breathing (4m)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Next tasks */}
          <div className="col-span-12 lg:col-span-5 bg-[#F2F4F2] rounded-3xl p-10 max-w-101.5">
            <div className="mb-8">
              <h3 className="text-xl font-medium">Next in Declutter</h3>
            </div>
            <div className="flex flex-col gap-6">
              {isLoadingTasks ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 w-48 rounded" />
                  </div>
                ))
              ) : tasks.length === 0 ? (
                <p className="text-sm text-[#767C79] font-light">
                  No pending tasks. Clean slate.
                </p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full border border-primary ${priorityDot[task.priority]}`}
                    />
                    <span className="text-sm font-light">{task.content}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quote card */}
          <div className="col-span-12 lg:col-span-7 bg-[#2E3432] text-white rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-light mb-6">
                &quot;Simplicity is the ultimate sophistication.&quot;
              </h3>
              <p className="text-surface-variant/60 text-sm max-w-sm">
                — Leonardo da Vinci
              </p>
            </div>
            <div className="relative z-10 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-surface-variant/40">
                  Daily Focus
                </span>
                <span className="text-lg">Eliminate the Non-Essential</span>
              </div>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvYlZpf2ut7lOSFjxkkxxivBGGtKjp_yDyeX6ZS553b2YLjqRIg7nfgwSU1J-CwGiuY7BnC5wgxGUgp2htkJSOpTcmKjQqm_demOeAs0LXczhHWq57ys7OiDUAlJknBOE-Skqrz_eYXenF63RVZMyputNa5TIJ2yrHYknc9HPA-ZEjCijVpuMVaJJXWN3HWaruJa63FsEUFrQgw__yZx-TVfevyssZYgGO7cySVk32yNwrKgPytWxtnywf65-Y1-aqBr3vYpPibSo"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 flex flex-col items-center gap-8">
        <div className="w-32 h-px bg-[#ADB3B0]" />
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-[#767C79]">
            Feeling overwhelmed? Clear the slate for a fresh perspective.
          </p>
          <Button className="py-5 px-12 text-[18px] rounded-xl flex items-center gap-3">
            <ResetIcon />
            Begin Daily Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
