"use client";

import { useState } from "react";

const priorityColors: Record<string, string> = {
  high: "bg-[#F5E6E6] text-[#8B1A2F]",
  routine: "bg-[#E0EDEA] text-[#2E4A42]",
  low: "bg-[#E6E8E6] text-[#4A4F4C]",
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
  completed: false,
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

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
        checked
          ? "bg-primary border-primary"
          : "border-[#C0C5C2] bg-white hover:border-primary"
      }`}
    >
      {checked && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1.5 5l2.5 2.5 4.5-4.5" />
        </svg>
      )}
    </button>
  );
}

function TaskDialog({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* dialog */}
      <div
        className="relative bg-white rounded-2xl p-8 w-full max-w-lg mx-4 flex flex-col gap-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#C0C5C2] hover:text-[#767C79] transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* header */}
        <div className="flex flex-col gap-3 pr-6">
          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] font-semibold tracking-widest px-3 py-1 rounded-sm ${priorityColors[task.priority]}`}
            >
              {priorityLabel[task.priority]}
            </span>
            <span className="text-[12px] text-[#9AA09D] tracking-wide">
              {task.category.toUpperCase()}
            </span>
          </div>
          <h2 className="text-[22px] font-medium leading-snug text-[#1C1C1C]">
            {task.content}
          </h2>
        </div>

        <div className="w-full h-px bg-[#F0F2F0]" />

        {/* extra context */}
        <div className="flex flex-col gap-2">
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

        <div className="w-full h-px bg-[#F0F2F0]" />

        {/* meta */}
        <div className="flex items-center gap-6 text-[#9AA09D] text-[13px]">
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
              className={`w-2 h-2 rounded-full ${
                task.priority === "high"
                  ? "bg-[#8B1A2F]"
                  : task.priority === "routine"
                    ? "bg-primary"
                    : "bg-[#B0B5B2]"
              }`}
            />
            <span>{priorityLabel[task.priority]} priority</span>
          </div>
        </div>

        {/* focus mode CTA */}
        <button className="w-full mt-1 bg-[#2E3432] text-white rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-[#1C1C1C] transition-colors group">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:scale-110 transition-transform"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-[15px] font-medium tracking-wide">
            Enter Focus Mode
          </span>
        </button>
      </div>
    </div>
  );
}

export default function AllTasks() {
  const [featuredDone, setFeaturedDone] = useState(false);
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>(
    Object.fromEntries(TASKS.map((t) => [t.id, false])),
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const toggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F0] p-12 flex flex-col gap-10">
      {/* Dialog */}
      {selectedTask && (
        <TaskDialog task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

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

      {/* Main featured row */}
      <div className="flex gap-6">
        {/* Featured task */}
        <div className="bg-white rounded-2xl p-8 flex flex-col justify-between flex-1 min-h-[320px]">
          <div className="flex items-start justify-between">
            <span
              className={`text-[11px] font-semibold tracking-widest px-3 py-1 rounded-sm ${priorityColors[FEATURED_TASK.priority]}`}
            >
              {FEATURED_TASK.category}
            </span>
            <button className="text-[#C0C5C2] hover:text-[#767C79] transition-colors">
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
            </button>
          </div>

          <div className="flex gap-4 items-start mt-6">
            <div className="mt-1">
              <Checkbox
                checked={featuredDone}
                onChange={(e) => {
                  e.stopPropagation();
                  setFeaturedDone((p) => !p);
                }}
              />
            </div>
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
        </div>

        {/* Side task */}
        <div className="bg-white rounded-2xl p-8 flex flex-col justify-between w-[320px]">
          <div className="flex items-start justify-between">
            <span
              className={`text-[11px] font-semibold tracking-widest px-3 py-1 rounded-sm ${priorityColors["routine"]}`}
            >
              PERSONAL
            </span>
          </div>
          <div className="flex gap-4 items-start mt-6">
            <div className="mt-1">
              <Checkbox checked={false} onChange={(e) => e.stopPropagation()} />
            </div>
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
        </div>
      </div>

      {/* Task grid */}
      <div className="grid grid-cols-2 gap-4">
        {TASKS.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Checkbox
                checked={taskStates[task.id]}
                onChange={(e) => toggleTask(task.id, e)}
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

            {/* chevron — opens dialog */}
            <button
              onClick={() => setSelectedTask(task)}
              className="ml-3 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#F0F2F0] transition-all duration-150"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9AA09D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Completed */}
      <div className="bg-[#E8EBE8] rounded-2xl p-8 flex flex-col gap-5">
        <h3 className="text-[28px] font-light text-[#1C1C1C]">
          Completed recently
        </h3>
        <div className="flex flex-col gap-4">
          {COMPLETED_TASKS.map((task) => (
            <div key={task.id} className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-md bg-[#C0C5C2] flex items-center justify-center flex-shrink-0">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              </div>
              <span className="text-[15px] text-[#9AA09D] line-through">
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
