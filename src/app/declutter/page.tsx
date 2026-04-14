"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon, WorryIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";

export type Task = {
  id: string;
  content: string;
  priority: string;
  extraContext: string;
  createdAt: string;
  completed: boolean;
};
type RandomThought = { id: string; content: string; codes: string };
type Worry = { id: string; content: string; codes: string };

const worryCardClasses = [
  "rounded-t-4xl rounded-br-4xl rounded-bl-xl",
  "rounded-tl-2xl rounded-tr-[48px] rounded-b-4xl",
  "rounded-l-[48px] rounded-r-2xl",
];

function TasksSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-5 bg-[#F2F4F2] flex gap-4 items-center">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ThoughtsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 bg-[#FFFFFF] flex flex-col gap-4 rounded-xl relative"
        >
          <div className="w-0.5 h-2/3 absolute left-0 bg-muted-foreground" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function WorriesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`p-8 bg-linear-to-r from-[#FFFFFF] to-[#F2F4F2] flex flex-col gap-3 ${worryCardClasses[i]}`}
        >
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function TaskDialog({
  task,
  open,
  onOpenChange,
  refetch,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}) {
  const markAsCompletedMutation = useMutation({
    mutationKey: ["mark-task-as-complete"],
    mutationFn: async (taskId: string) => {
      const response = await fetch("/api/task/complete/" + taskId);

      if (!response.ok) {
        toast.error("Failed to mark task as complete");
      }
    },
    onSuccess: async () => {
      await refetch();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to mark task as complete");
    },
  });

  async function markTaskAsComplete(taskId: string) {
    await markAsCompletedMutation.mutateAsync(taskId);
  }

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg border-0 bg-[#F9F9F7]">
        <div className="p-8 flex flex-col gap-6">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-xl font-light leading-snug text-left">
                {task.content}
              </DialogTitle>
              <div
                className={buttonVariants({
                  variant:
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "routine"
                        ? "default"
                        : "secondary",
                  className:
                    "shrink-0 px-2 py-1 pointer-events-none text-[10px]",
                })}
              >
                {task.priority}
              </div>
            </div>
          </DialogHeader>

          {task.extraContext && (
            <div className="bg-white rounded-2xl p-5 relative">
              <div className="w-0.5 h-2/3 absolute left-0 top-1/6 bg-muted-foreground rounded-full" />
              <p className="text-sm text-[#767C79] leading-relaxed">
                {task.extraContext}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant={"secondary"}
              onClick={async () => await markTaskAsComplete(task.id)}
              disabled={markAsCompletedMutation.isPending ?? task.completed}
              className="w-full p-5 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <span className="font-medium text-sm">
                {markAsCompletedMutation.isPending
                  ? "Marking..."
                  : "Mark as complete"}
              </span>
              {task.completed ? (
                <span className="text-[#2D5A45] text-lg">✓</span>
              ) : (
                <span className="w-5 h-5 rounded-full border border-[#767C79] group-hover:border-[#2D5A45] transition-colors" />
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full p-5 text-start! bg-white hover:bg-[#F2F4F2] rounded-2xl justify-start!  transition-all"
            >
              <span className="font-medium text-sm text-[#767C79]">
                Dismiss
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Declutter() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [tasks, randomThoughts, worries] = useQueries({
    queries: [
      {
        queryKey: ["get-tasks"],
        queryFn: async (): Promise<Task[]> => {
          const response = await fetch("/api/task");
          const data = await response.json();
          return data;
        },
      },
      {
        queryKey: ["get-random-thoughts"],
        queryFn: async (): Promise<RandomThought[]> => {
          const response = await fetch("/api/random-thoughts");
          const data = await response.json();
          return data;
        },
      },
      {
        queryKey: ["get-worries"],
        queryFn: async (): Promise<Worry[]> => {
          const response = await fetch("/api/worries");
          const data = await response.json();
          return data;
        },
      },
    ],
  });

  const pendingTasks = tasks.data ?? [];
  const thoughts = randomThoughts.data ?? [];
  const worriesList = worries.data ?? [];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  return (
    <div className="p-12 h-full flex flex-col gap-16 bg-[#F9F9F7CC]">
      <p className="text-9xl font-extrabold text-[#DEE4E0] leading-tight tracking-tight absolute bottom-0 right-5 pointer-events-none">
        FOCUS.
      </p>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light">Mental Declutter</h1>
        <h2 className="text-[#767C79]">
          Organize the noise into actionable steps, passing thoughts, and things
          to let go.
        </h2>
      </div>
      <div className="flex gap-12 w-full max-w-6xl mx-auto">
        {/* TASKS */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full pb-8">
            <p className="font-semibold">TASKS</p>
            {tasks.isLoading ? (
              <Skeleton className="h-4 w-16 rounded-full" />
            ) : (
              <p className="bg-[#D1E8DD] text-primary rounded-full px-2 text-[10px]">
                {pendingTasks.length} Pending
              </p>
            )}
          </div>
          {tasks.isLoading ? (
            <TasksSkeleton />
          ) : (
            <div className="flex flex-col gap-6">
              {pendingTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="p-5 bg-[#F2F4F2] flex flex-col gap-2 items-start text-left hover:bg-[#EAECE9] transition-colors w-full"
                >
                  <p>{task.content}</p>
                  <div
                    className={buttonVariants({
                      variant:
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "routine"
                            ? "default"
                            : "secondary",
                      className:
                        "w-max px-2 py-1 pointer-events-none text-[10px]",
                    })}
                  >
                    {task.priority}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RANDOM THOUGHTS */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full pb-8">
            <p className="font-semibold">RANDOM THOUGHTS</p>
            <p className="font-bold text-[#767C79] text-[24px]">+</p>
          </div>
          {randomThoughts.isLoading ? (
            <ThoughtsSkeleton />
          ) : (
            <div className="flex flex-col gap-6">
              {thoughts.map((thought) => (
                <div
                  key={thought.id}
                  className="p-5 bg-[#FFFFFF] flex flex-col gap-4 rounded-xl relative"
                >
                  <div className="w-0.5 h-2/3 absolute left-0 bg-muted-foreground" />
                  <p>{thought.content}</p>
                  <div className="flex gap-2 items-center text-[#4E635A]">
                    <p className="font-bold">Convert</p>
                    <ArrowRightIcon size={10} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WORRIES */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full pb-8">
            <p className="font-semibold">WORRIES</p>
            <WorryIcon />
          </div>
          {worries.isLoading ? (
            <WorriesSkeleton />
          ) : (
            <div className="flex flex-col gap-6">
              {worriesList.map((worry, index) => (
                <div
                  key={worry.id}
                  className={`p-8 bg-linear-to-r from-[#FFFFFF] to-[#F2F4F2] flex gap-4 items-center ${
                    worryCardClasses[index % worryCardClasses.length]
                  }`}
                >
                  <p>{worry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskDialog
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        refetch={tasks.refetch}
      />
    </div>
  );
}
