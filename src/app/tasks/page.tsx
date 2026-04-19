"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const priorityBadgeClass: Record<string, string> = {
  high: "bg-[#F5E6E6] text-[#8B1A2F] hover:bg-[#F5E6E6]",
  routine: "bg-[#E0EDEA] text-[#2E4A42] hover:bg-[#E0EDEA]",
  low: "bg-[#E6E8E6] text-[#4A4F4C] hover:bg-[#E6E8E6]",
};

const priorityDot: Record<string, string> = {
  high: "bg-[#8B1A2F]",
  routine: "bg-primary",
  low: "bg-[#B0B5B2]",
};

const priorityLabel: Record<string, string> = {
  high: "HIGH",
  routine: "ROUTINE",
  low: "LOW",
};

type Task = {
  id: string;
  content: string;
  priority: "low" | "routine" | "high";
  category: string;
  extraContext: string | null;
  completed: boolean;
  createdAt: string;
};

const FEATURED_TASK = {
  id: "1",
  title: "Refine the creative manifesto for the sanctuary project",
  content:
    "Focus on the intentional use of whitespace and the no-line rule. Ensure the aesthetic remains whisper-quiet.",
  priority: "high" as const,
  category: "DEEP WORK",
};

const TASKS: Task[] = [
  {
    id: "2",
    content: "Order high-texture art paper samples",
    category: "Admin",
    priority: "routine",
    extraContext:
      "Check Washi Paper Co. and Khadi Papers first. Need at least 3 different weights — 90gsm, 120gsm, 180gsm. Delivery should be within the week for the upcoming workshop.",
    completed: false,
    createdAt: "2026-04-19T08:30:00Z",
  },
  {
    id: "3",
    content: "Review monthly cognitive load metrics",
    category: "Analytics",
    priority: "high",
    extraContext:
      "Pull data from the last 30 days. Look for spikes on Mondays and Thursdays specifically. Cross-reference with journal entry volume. Export a summary for the team sync.",
    completed: false,
    createdAt: "2026-04-19T09:15:00Z",
  },
  {
    id: "4",
    content: "Schedule silent meditation session",
    category: "Personal",
    priority: "low",
    extraContext: null,
    completed: false,
    createdAt: "2026-04-18T20:00:00Z",
  },
  {
    id: "5",
    content: "Draft email to the architectural digest",
    category: "Outreach",
    priority: "routine",
    extraContext:
      "Keep it under 150 words. Reference the whitespace editorial from March. Propose a feature on intentional living spaces. CC Priya before sending.",
    completed: false,
    createdAt: "2026-04-19T11:00:00Z",
  },
];

const COMPLETED_TASKS = [
  { id: "c1", title: "Update brand color tokens to Sage & Stone" },
  { id: "c2", title: "Archive 2023 stressful project folders" },
  { id: "c3", title: "Finalize Zen Editorial typeface hierarchy" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-8 gap-0">
        <DialogHeader className="gap-3 pr-2 mb-4">
          <div className="flex items-center gap-3">
            <Badge
              className={`text-[11px] tracking-widest rounded-sm font-semibold ${priorityBadgeClass[task.priority]}`}
            >
              {priorityLabel[task.priority]}
            </Badge>
            <span className="text-[12px] text-[#9AA09D] tracking-wide font-medium">
              {task.category.toUpperCase()}
            </span>
          </div>
          <DialogTitle className="text-[22px] font-medium leading-snug text-[#1C1C1C]">
            {task.content}
          </DialogTitle>
        </DialogHeader>

        <Separator className="mb-5" />

        {/* Extra context */}
        <div className="flex flex-col gap-2 mb-5">
          <p className="text-[11px] font-semibold tracking-widest text-[#9AA09D]">
            EXTRA CONTEXT
          </p>
          {task.extraContext ? (
            <p className="text-[#4A4F4C] text-[15px] leading-relaxed">
              {task.extraContext}
            </p>
          ) : (
            <p className="text-[#C0C5C2] text-[14px] italic">
              No extra context added.
            </p>
          )}
        </div>

        <Separator className="mb-5" />

        {/* Meta */}
        <div className="flex items-center gap-6 text-[#9AA09D] text-[13px] mb-6">
          <div className="flex items-center gap-2">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Added {formatDate(task.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`}
            />
            <span>{priorityLabel[task.priority]} priority</span>
          </div>
        </div>

        {/* Focus mode CTA */}
        <Button className="w-full py-4 text-[15px] font-medium tracking-wide rounded-xl gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Enter Focus Mode
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function AllTasks() {
  const [featuredDone, setFeaturedDone] = useState(false);
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>(
    Object.fromEntries(TASKS.map((t) => [t.id, false])),
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen p-12 flex flex-col gap-10">
      <TaskDetailDialog
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[72px] font-light leading-none tracking-tight text-[#1C1C1C]">
            All Tasks
          </h1>
          <p className="text-[#767C79] italic text-lg">Quiet the noise.</p>
        </div>
        <div className="flex items-center gap-3 pb-3">
          <div className="w-16 h-px bg-[#C0C5C2]" />
          <p className="text-[11px] tracking-[0.2em] text-[#9AA09D] font-medium">
            PRIORITY VIEW
          </p>
        </div>
      </div>

      {/* Featured row */}
      <div className="flex gap-6">
        {/* Featured task card */}
        <Card className="flex-1 min-h-80 rounded-2xl border-none shadow-none">
          <CardContent className="p-8 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <Badge
                className={`text-[11px] tracking-widest rounded-sm font-semibold ${priorityBadgeClass[FEATURED_TASK.priority]}`}
              >
                {FEATURED_TASK.category}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#C0C5C2] hover:text-[#767C79] h-7 w-7"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </Button>
            </div>

            <div className="flex gap-4 items-start mt-6">
              <Checkbox
                checked={featuredDone}
                onCheckedChange={(v) => setFeaturedDone(!!v)}
                className="mt-1 rounded-md border-[#C0C5C2] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex flex-col gap-3">
                <h2
                  className={`text-[26px] font-medium leading-tight text-[#1C1C1C] transition-all duration-300 ${
                    featuredDone ? "line-through text-[#B0B5B2]" : ""
                  }`}
                >
                  {FEATURED_TASK.title}
                </h2>
                {!featuredDone && (
                  <p className="text-[#767C79] text-[15px] leading-relaxed max-w-md">
                    {FEATURED_TASK.content}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 mt-8 text-[#9AA09D] text-[13px]">
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>2 Files</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side task card */}
        <Card className="w-[320px] rounded-2xl border-none shadow-none">
          <CardContent className="p-8 h-full flex flex-col justify-between">
            <Badge
              className={`text-[11px] tracking-widest rounded-sm font-semibold w-fit ${priorityBadgeClass["routine"]}`}
            >
              PERSONAL
            </Badge>

            <div className="flex gap-4 items-start mt-6">
              <Checkbox className="mt-1 rounded-md border-[#C0C5C2] data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
              <div className="flex flex-col gap-3">
                <h2 className="text-[22px] font-medium leading-tight text-[#1C1C1C]">
                  Write in the journal for 10 minutes
                </h2>
                <p className="text-[#767C79] text-[14px] leading-relaxed">
                  No agenda. Just let the thoughts fall out.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-8 text-[#9AA09D] text-[13px]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task grid */}
      <div className="grid grid-cols-3 gap-4">
        {TASKS.map((task) => (
          <Card
            key={task.id}
            className="rounded-2xl border-none shadow-none group"
          >
            <CardContent className="px-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Checkbox
                  checked={taskStates[task.id]}
                  onCheckedChange={(v) =>
                    setTaskStates((prev) => ({ ...prev, [task.id]: !!v }))
                  }
                  className="rounded-md border-[#C0C5C2] data-[state=checked]:bg-primary data-[state=checked]:border-primary flex-shrink-0"
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className={`text-[15px] font-medium text-[#1C1C1C] truncate transition-all duration-200 ${
                      taskStates[task.id] ? "line-through text-[#B0B5B2]" : ""
                    }`}
                  >
                    {task.content}
                  </span>
                  <span className="text-[12px] text-[#9AA09D]">
                    {task.category} •{" "}
                    <span className="font-medium">
                      {priorityLabel[task.priority]}
                    </span>
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDialog(task)}
                className="ml-3 flex-shrink-0 w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 text-[#9AA09D]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completed */}
      <Card className="rounded-2xl border-none shadow-none bg-[#E8EBE8]">
        <CardContent className="p-8 flex flex-col gap-5">
          <h3 className="text-[28px] font-light text-[#1C1C1C]">
            Completed recently
          </h3>
          <div className="flex flex-col gap-4">
            {COMPLETED_TASKS.map((task) => (
              <div key={task.id} className="flex items-center gap-4">
                <Checkbox
                  checked
                  disabled
                  className="rounded-md border-[#C0C5C2] data-[state=checked]:bg-[#C0C5C2] data-[state=checked]:border-[#C0C5C2] opacity-100"
                />
                <span className="text-[15px] text-[#9AA09D] line-through">
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
