"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  tag: string | null;
  extraContext: string | null;
  completed: boolean;
  createdAt: string;
  codes: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function FocusButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  return (
    <Button
      className="w-full py-4 text-[15px] font-medium tracking-wide rounded-xl gap-3"
      onClick={() => router.push(`/focus?tasks=${taskId}`)}
    >
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
  );
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
            {task.tag && (
              <span className="text-[12px] text-[#9AA09D] tracking-wide font-medium">
                {task.tag.toUpperCase()}
              </span>
            )}
          </div>
          <DialogTitle className="text-[22px] font-medium leading-snug text-[#1C1C1C]">
            {task.content}
          </DialogTitle>
        </DialogHeader>

        <Separator className="mb-5" />

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

        <FocusButton taskId={task.id} />
      </DialogContent>
    </Dialog>
  );
}

export default function AllTasks() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // track which task ids are pending a toggle for optimistic UI
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    staleTime: 1000 * 60 * 2,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onMutate: ({ id }) => {
      setPendingIds((prev) => new Set(prev).add(id));
    },
    onSettled: (_, __, { id }) => {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["next-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["sensory-load"] });
    },
  });

  const toggle = (id: string, completed: boolean) =>
    toggleMutation.mutate({ id, completed });

  const featured: Task | null = data?.data?.featured ?? null;
  const tasks: Task[] = data?.data?.tasks ?? [];
  const completedTasks: Task[] = data?.data?.completed ?? [];

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

      <div className="flex flex-col gap-10 mx-auto max-w-6xl w-6xl">
        {/* Featured row */}
        <div className="flex gap-6">
          {/* Featured task card */}
          <Card className="flex-1 min-h-80 rounded-2xl border-none shadow-none">
            <CardContent className="p-8 h-full flex flex-col justify-between gap-6">
              {isLoading ? (
                <>
                  <Skeleton className="w-24 h-6 rounded-sm" />
                  <div className="flex gap-4 items-start">
                    <Skeleton className="w-5 h-5 rounded-md mt-1 shrink-0" />
                    <div className="flex flex-col gap-3 flex-1">
                      <Skeleton className="w-full h-8 rounded" />
                      <Skeleton className="w-3/4 h-8 rounded" />
                      <Skeleton className="w-full h-4 rounded" />
                      <Skeleton className="w-2/3 h-4 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="w-16 h-4 rounded" />
                    <Skeleton className="w-16 h-4 rounded" />
                  </div>
                  <Skeleton className="w-full h-12 rounded-xl" />
                </>
              ) : featured ? (
                <>
                  <div className="flex items-start justify-between">
                    <Badge
                      className={`text-[11px] tracking-widest rounded-sm font-semibold ${priorityBadgeClass[featured.priority]}`}
                    >
                      {featured.tag?.toUpperCase() ??
                        priorityLabel[featured.priority]}
                    </Badge>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="mt-1 relative">
                      <Checkbox
                        checked={featured.completed}
                        onCheckedChange={(v) => toggle(featured.id, !!v)}
                        disabled={pendingIds.has(featured.id)}
                        className="rounded-md border-[#C0C5C2] data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:opacity-50"
                      />
                      {pendingIds.has(featured.id) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <h2
                        className={`text-[26px] font-medium leading-tight text-[#1C1C1C] transition-all duration-300 ${
                          featured.completed
                            ? "line-through text-[#B0B5B2]"
                            : ""
                        }`}
                      >
                        {featured.content}
                      </h2>
                      {!featured.completed && featured.extraContext && (
                        <p className="text-[#767C79] text-[15px] leading-relaxed max-w-md">
                          {featured.extraContext}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-[#9AA09D] text-[13px]">
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
                      <span>{formatDate(featured.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${priorityDot[featured.priority]}`}
                      />
                      <span>{priorityLabel[featured.priority]} priority</span>
                    </div>
                  </div>

                  <FocusButton taskId={featured.id} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#9AA09D] text-[15px] italic">
                    No tasks remaining. Clean slate.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side card — second highest priority task */}
          <Card className="w-[320px] rounded-2xl border-none shadow-none">
            <CardContent className="p-8 h-full flex flex-col justify-between gap-6">
              {isLoading ? (
                <>
                  <Skeleton className="w-20 h-6 rounded-sm" />
                  <div className="flex gap-4 items-start">
                    <Skeleton className="w-5 h-5 rounded-md mt-1 flex-shrink-0" />
                    <div className="flex flex-col gap-3 flex-1">
                      <Skeleton className="w-full h-6 rounded" />
                      <Skeleton className="w-3/4 h-6 rounded" />
                      <Skeleton className="w-full h-4 rounded" />
                    </div>
                  </div>
                  <Skeleton className="w-16 h-4 rounded" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </>
              ) : tasks[0] ? (
                <>
                  <Badge
                    className={`text-[11px] tracking-widest rounded-sm font-semibold w-fit ${priorityBadgeClass[tasks[0].priority]}`}
                  >
                    {tasks[0].tag?.toUpperCase() ??
                      priorityLabel[tasks[0].priority]}
                  </Badge>

                  <div className="flex gap-4 items-start">
                    <div className="mt-1 relative">
                      <Checkbox
                        checked={tasks[0].completed}
                        onCheckedChange={(v) => toggle(tasks[0].id, !!v)}
                        disabled={pendingIds.has(tasks[0].id)}
                        className="rounded-md border-[#C0C5C2] data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:opacity-50"
                      />
                      {pendingIds.has(tasks[0].id) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <h2 className="text-[22px] font-medium leading-tight text-[#1C1C1C]">
                        {tasks[0].content}
                      </h2>
                      {tasks[0].extraContext && (
                        <p className="text-[#767C79] text-[14px] leading-relaxed">
                          {tasks[0].extraContext}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#9AA09D] text-[13px]">
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
                    <span>{formatDate(tasks[0].createdAt)}</span>
                  </div>

                  <FocusButton taskId={tasks[0].id} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#9AA09D] text-[14px] italic">
                    Nothing else pending.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Task grid */}
        {(isLoading || tasks.length > 1) && (
          <div className="grid grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="rounded-2xl border-none shadow-none">
                    <CardContent className="px-6 py-5 flex items-center gap-4">
                      <Skeleton className="w-5 h-5 rounded-md flex-shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <Skeleton className="w-full h-4 rounded" />
                        <Skeleton className="w-1/2 h-3 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : tasks.slice(1).map((task) => (
                  <Card
                    key={task.id}
                    className="rounded-2xl border-none shadow-none group"
                  >
                    <CardContent className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(v) => toggle(task.id, !!v)}
                            disabled={pendingIds.has(task.id)}
                            className="rounded-md border-[#C0C5C2] data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:opacity-50"
                          />
                          {pendingIds.has(task.id) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span
                            className={`text-[15px] font-medium text-[#1C1C1C] truncate transition-all duration-200 ${
                              task.completed
                                ? "line-through text-[#B0B5B2]"
                                : ""
                            }`}
                          >
                            {task.content}
                          </span>
                          <span className="text-[12px] text-[#9AA09D]">
                            {task.tag ?? "—"} •{" "}
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
        )}

        {/* Completed */}
        {(isLoading || completedTasks.length > 0) && (
          <Card className="rounded-2xl border-none shadow-none bg-[#E8EBE8]">
            <CardContent className="p-8 flex flex-col gap-5">
              <h3 className="text-[28px] font-light text-[#1C1C1C]">
                Completed recently
              </h3>
              <div className="flex flex-col gap-4">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-5 h-5 rounded-md" />
                        <Skeleton className="w-56 h-4 rounded" />
                      </div>
                    ))
                  : completedTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4">
                        <div className="relative">
                          <Checkbox
                            checked
                            onCheckedChange={() => toggle(task.id, false)}
                            disabled={pendingIds.has(task.id)}
                            className="rounded-md border-[#C0C5C2] data-[state=checked]:bg-[#C0C5C2] data-[state=checked]:border-[#C0C5C2] opacity-100 disabled:opacity-50"
                          />
                          {pendingIds.has(task.id) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 border-2 border-[#9AA09D] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <span className="text-[15px] text-[#9AA09D] line-through">
                          {task.content}
                        </span>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
