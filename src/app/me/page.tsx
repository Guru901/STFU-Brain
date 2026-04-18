"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoltIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/lib/useUser";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const tagStyles: Record<string, string> = {
  WORRY: "bg-[#F5E6E6] text-[#8B1A2F]",
  TASK: "bg-[#E0EDEA] text-[#2E4A42]",
  RANDOM: "bg-[#E6E8E6] text-[#4A4F4C]",
};

type IntensityDay = {
  label: string;
  intensity: number;
  worries: number;
  tasks: number;
  random: number;
  entries: number;
  score: number;
};

type EchoItem = {
  text: string;
  type: string;
};

export default function Me() {
  const { user, avatar, updateAvatar } = useUser();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      updateAvatar(b64);
    };
    reader.readAsDataURL(file);
  };

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const res = await fetch("/api/profile-data");
      if (!res.ok) throw new Error("Failed to fetch profile data");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: residualEchoes, isLoading: isLoadingResidualEchoes } = useQuery(
    {
      queryKey: ["residual-echoes"],
      queryFn: async () => {
        const res = await fetch("/api/residual-echoes");
        if (!res.ok) throw new Error("Failed to fetch residual echoes");
        return res.json();
      },
      staleTime: 1000 * 60 * 5,
    },
  );

  const { data: weeklyData, isLoading: isLoadingWeekly } = useQuery({
    queryKey: ["weekly-intensity"],
    queryFn: async () => {
      const res = await fetch("/api/weekly-intensity");
      if (!res.ok) throw new Error("Failed to fetch weekly intensity");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (residualEchoes?.success) {
      console.log("residual echoes:", residualEchoes.data);
    }
  }, [residualEchoes]);

  const echoItems: EchoItem[] = residualEchoes?.data ?? [];
  const intensityDays: IntensityDay[] = weeklyData?.data ?? [];

  return (
    <div className="flex flex-col gap-20 p-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <h1 className="text-[105px] font-light">{user}</h1>

        <Label
          htmlFor="avatar-upload"
          className="relative group cursor-pointer rounded-xl overflow-hidden max-w-72 w-72 h-72 border border-dashed border-[#C0C5C2] bg-[#F5F5F3] flex items-center justify-center"
        >
          {avatar ? (
            <>
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm tracking-wide">
                  change photo
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-[#888C89] select-none">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-sm tracking-wide">upload avatar</span>
            </div>
          )}
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </Label>
      </div>

      {/* Row 1 — Profile Overview + Weekly Intensity */}
      <div className="flex w-full justify-between">
        <Card className="bg-white w-[58%] p-10">
          <CardHeader>
            <CardTitle className="text-lg">Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex justify-evenly">
              <div className="text-center">
                {isLoadingProfile ? (
                  <Skeleton className="w-16 h-8 mx-auto" />
                ) : (
                  <p className="text-[#2E3432] text-3xl">
                    {profileData?.counts.entries}
                  </p>
                )}
                <p className="text-[#767C79] text-[16px]">SESSIONS</p>
              </div>
              <div className="text-center">
                {isLoadingProfile ? (
                  <Skeleton className="w-16 h-8 mx-auto" />
                ) : (
                  <p className="text-[#2E3432] text-3xl">
                    {profileData?.counts.thoughts}
                  </p>
                )}
                <p className="text-[#767C79] text-[16px]">THOUGHTS</p>
              </div>
              <div className="text-center">
                {isLoadingProfile ? (
                  <Skeleton className="w-16 h-8 mx-auto" />
                ) : (
                  <p className="text-[#2E3432] text-3xl">
                    {profileData?.counts.tasksCleared}
                  </p>
                )}
                <p className="text-[#767C79] text-[16px]">TASKS CLEARED</p>
              </div>
            </div>
            <div className="h-16" />
            <Separator />
            <div className="h-8" />
            <div className="flex gap-2">
              <p className="text-[#767C79] text-[16px]">
                Peak clarity achieved on Thursdays.
              </p>
              <BoltIcon />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F2F4F2] w-[40%] p-10">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-lg">LAST 2 WEEKS</CardTitle>
            <p className="text-[16px] text-[#767C79]">Intensity Scale</p>
          </CardHeader>
          <CardContent className="py-8">
            {isLoadingWeekly ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-evenly">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded" />
                  ))}
                </div>
                <div className="flex justify-evenly">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[intensityDays.slice(0, 7), intensityDays.slice(7)].map(
                  (week, wi) => (
                    <div key={wi} className="flex justify-evenly">
                      {week.map((day, i) => (
                        <div key={i} className="relative group">
                          <div
                            className="h-8 w-8 rounded cursor-default transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `rgba(78, 99, 90, ${Math.max(day.intensity, 0.08)})`,
                            }}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-[#1C1C1C] text-white text-[11px] rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                            <p className="font-medium mb-1 text-[#A8B5B0]">
                              {day.label}
                            </p>
                            <p>Worries: {day.worries}</p>
                            <p>Tasks: {day.tasks}</p>
                            <p>Random: {day.random}</p>
                            <p>Entries: {day.entries}</p>
                            <div className="mt-1 pt-1 border-t border-[#333] text-[#A8B5B0]">
                              Score: {day.score}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                )}
                <div className="flex justify-between mt-1">
                  <p className="text-[14px] text-[#ADB3B0]">
                    {intensityDays[0]?.label ?? "MON"}
                  </p>
                  <p className="text-[14px] text-[#ADB3B0]">
                    {intensityDays[intensityDays.length - 1]?.label ?? "SUN"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — Mental Composition + Residual Echoes */}
      <div className="flex w-full justify-between">
        <Card className="bg-[#F2F4F2] w-[40%] p-10">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-lg">MENTAL COMPOSITION</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex flex-col gap-7">
              {[
                {
                  label: "worries",
                  value: profileData?.percentages.thoughts,
                  color: "#8B1A2F",
                },
                {
                  label: "tasks",
                  value: profileData?.percentages.tasksCleared,
                  color: "#2E4A42",
                },
                {
                  label: "random",
                  value: profileData?.percentages.entries,
                  color: "#B0B5B2",
                },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-baseline mb-2.5">
                    <span className="text-[15px] text-[#1A1A1A]">{label}</span>
                    {isLoadingProfile ? (
                      <Skeleton className="w-10 h-4" />
                    ) : (
                      <span className="text-[15px] text-[#1A1A1A]">
                        {value}%
                      </span>
                    )}
                  </div>
                  <div className="relative h-2.5 bg-[#D9DDD9] rounded-full overflow-hidden">
                    {isLoadingProfile ? (
                      <Skeleton className="h-full w-full rounded-full" />
                    ) : (
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${value}%`, background: color }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white w-[58%] p-10">
          <CardHeader>
            <CardTitle className="text-lg">RESIDUAL ECHOES</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex flex-col divide-y divide-[#E8EAE8]">
              {isLoadingResidualEchoes
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-6"
                    >
                      <div className="flex items-center gap-5">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="w-48 h-5 rounded" />
                      </div>
                      <Skeleton className="w-16 h-6 rounded-sm" />
                    </div>
                  ))
                : echoItems.map(({ text, type }, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-6"
                    >
                      <div className="flex items-center gap-5">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#888"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 1l4 4-4 4" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <path d="M7 23l-4-4 4-4" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        <span className="text-[18px] text-[#1C1C1C] font-light">
                          {text}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-medium tracking-widest px-3 py-1 rounded-sm ${tagStyles[type]}`}
                      >
                        {type}
                      </span>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quote */}
      <div className="flex flex-col gap-8 items-center">
        <p className="text-4xl font-light text-center leading-relaxed">
          &quot;The primary cause of unhappiness is never the situation but your
          thoughts about it.&quot;
        </p>
        <div className="bg-primary h-0.5 w-32" />
        <p className="text-xl text-center leading-relaxed">ECKHART TOLLE</p>
      </div>
    </div>
  );
}
