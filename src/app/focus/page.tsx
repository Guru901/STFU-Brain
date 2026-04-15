"use client";

import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ScheduleIcon, Texture } from "@/components/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Task } from "../declutter/page";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function FocusMode() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [minutes, setMinutes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["get-task"],
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch("/api/task");
      const data = await response.json();
      return data;
    },
  });

  useHotkeys("esc", () => {
    router.back();
  });

  useHotkeys("space", (e) => {
    e.preventDefault();

    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  });

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 60000);
      setMinutes(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchParam.get("tasks")) {
      const taskId = searchParam.get("tasks")?.split(",")[0];
      const task = tasks?.find((task) => task.id === taskId);
      setSelectedTask(task);
    }
  }, [searchParam, tasks]);

  if (isLoading) {
    return (
      <main className="w-screen h-screen flex items-center justify-center bg-[#0D0F0E] text-white">
        <p className="text-lg opacity-60 animate-pulse">
          Loading your focus session...
        </p>
      </main>
    );
  }
  return (
    <>
      <audio
        ref={audioRef}
        src="/rain.mp3"
        className="hidden"
        loop
        autoPlay
        controls
      />

      <main className="relative z-10 bg-[#0D0F0E] w-screen h-screen flex flex-col items-center justify-center px-6">
        <Texture />
        <div className="max-w-4xl w-full text-center space-y-16">
          <div className="flex items-center justify-center space-x-3 opacity-40">
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#767C79]">
              Deep Work Session
            </span>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-extralight text-white tracking-tight leading-tight">
              {selectedTask?.content}
            </h1>
            <p className="text-2xl font-extralight text-white tracking-tight leading-tight">
              {selectedTask?.extraContext}
            </p>

            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2 text-outline">
                <ScheduleIcon />
                <span className="text-sm text-[#767C79] font-light tracking-wide">
                  Started {minutes}m ago
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-8 pt-8">
            <Button
              onClick={() => router.back()}
              className="flex items-center space-x-4 px-10 py-4 rounded-lg"
            >
              <CheckCircleIcon />
              <span className="text-lg font-medium tracking-tight">
                Finish Task
              </span>
            </Button>

            <button className="text-outline hover:text-surface-variant transition-colors duration-300 text-xs uppercase tracking-widest flex items-center space-x-2 opacity-50 text-[#767C79]">
              <span>
                Press Esc to exit • Space to {isPlaying ? "pause" : "play"}
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#767C79] text-outline opacity-30">
              Current Environment
            </span>
            <span className="text-sm font-light text-[#DEE4E0] opacity-40 italic">
              Rain in Kyoto .m4a {isPlaying ? "(Playing)" : "(Paused)"}
            </span>
          </div>

          <div className="flex items-end space-x-1 h-8 opacity-20">
            <div className="w-0.5 bg-primary h-3"></div>
            <div className="w-0.5 bg-primary h-5"></div>
            <div className="w-0.5 bg-primary h-4"></div>
            <div className="w-0.5 bg-primary h-6"></div>
            <div className="w-0.5 bg-primary h-2"></div>
            <div className="w-0.5 bg-primary h-4"></div>
            <div className="w-0.5 bg-primary h-7"></div>
            <div className="w-0.5 bg-primary h-3"></div>
          </div>
        </div>
      </main>

      <div className="fixed top-12 left-12 z-20">
        <span className="text-2xl font-light italic text-[#DEE4E0] tracking-tighter opacity-20">
          STFU Brain
        </span>
      </div>
    </>
  );
}
