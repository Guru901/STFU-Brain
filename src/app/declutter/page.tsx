"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon, WorryIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { cn } from "@/lib/utils";
import {
  BoldIcon,
  ColorIcon,
  ItalicsIcon,
  ListIcon,
} from "@/components/ui/icons";

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

const COLORS = [
  { label: "Default", value: null },
  { label: "Slate", value: "#475569" },
  { label: "Rose", value: "#e11d48" },
  { label: "Orange", value: "#ea580c" },
  { label: "Amber", value: "#d97706" },
  { label: "Emerald", value: "#059669" },
  { label: "Teal", value: "#0d9488" },
  { label: "Sky", value: "#0284c7" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
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

function TasksEmpty() {
  return (
    <div className="flex flex-col gap-3 items-center py-10 px-5 bg-[#F2F4F2]">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        className="opacity-25"
      >
        <rect x="6" y="10" width="26" height="3" rx="1.5" fill="#4E635A" />
        <rect x="6" y="18" width="20" height="3" rx="1.5" fill="#4E635A" />
        <rect x="6" y="26" width="14" height="3" rx="1.5" fill="#4E635A" />
        <circle
          cx="30"
          cy="29"
          r="8"
          fill="#F2F4F2"
          stroke="#4E635A"
          strokeWidth="2"
        />
        <path
          d="M27 29l2 2 4-4"
          stroke="#4E635A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-sm font-medium text-center">All clear</p>
      <p className="text-xs text-[#767C79] text-center leading-relaxed">
        No pending tasks. Dump a thought and it might become one.
      </p>
    </div>
  );
}

function ThoughtsEmpty(onClick: { onClick: () => void }) {
  return (
    <div className="p-8 bg-white rounded-xl relative flex flex-col gap-3 items-center">
      <div className="w-0.5 h-2/3 absolute left-0 top-1/6 bg-muted-foreground/30 rounded-full" />
      <span className="text-2xl opacity-20">💭</span>
      <p className="text-sm font-medium text-center">Nothing floating around</p>
      <p className="text-xs text-[#767C79] text-center leading-relaxed">
        Hit <strong className="text-[#4E635A]">+</strong> to capture
        whatever&apos;s on your mind — no filter needed.
      </p>
      <div
        className="flex gap-1.5 items-center text-[#4E635A] text-xs font-bold opacity-50 mt-1 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick.onClick}
      >
        <span>Add a thought</span>
        <ArrowRightIcon size={10} />
      </div>
    </div>
  );
}

function WorriesEmpty() {
  const ghostLabels = ["quiet here…", "no worries yet", "keep it that way"];
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`p-7 bg-linear-to-r from-[#FFFFFF] to-[#F2F4F2] flex flex-col gap-2.5 ${worryCardClasses[i]}`}
        >
          <div
            className="h-2.5 rounded bg-[#DEE4E0]"
            style={{ width: `${[85, 70, 90][i]}%` }}
          />
          <div
            className="h-2.5 rounded bg-[#DEE4E0]"
            style={{ width: `${[55, 45, 60][i]}%` }}
          />
          <span className="text-[11px] text-[#A8B4AE] italic mt-1">
            {ghostLabels[i]}
          </span>
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
              onClick={async () =>
                await markAsCompletedMutation.mutateAsync(task.id)
              }
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
              className="w-full p-5 text-start! bg-white hover:bg-[#F2F4F2] rounded-2xl justify-start! transition-all"
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

function AddThoughtEditor({
  onSave,
  isPending,
  onDismiss,
}: {
  onSave: (html: string) => void;
  isPending: boolean;
  onDismiss: () => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "What's floating around in your head...",
      }),
    ],
    content: "",
    immediatelyRender: false,
    autofocus: true,
  });

  const isItalicActive = editor?.isActive("italic") ?? false;
  const isBoldActive = editor?.isActive("bold") ?? false;
  const isBulletActive = editor?.isActive("bulletList") ?? false;
  const currentColor = editor?.getAttributes("textStyle").color ?? null;

  return (
    <div className="flex flex-col gap-0">
      <div className="bg-white rounded-2xl p-6 relative min-h-52">
        <div className="w-0.5 h-2/3 absolute left-0 top-1/6 bg-muted-foreground rounded-full" />
        <EditorContent
          editor={editor}
          className={cn(
            "[&_.ProseMirror]:outline-none",
            "[&_.ProseMirror]:min-h-40",
            "[&_.ProseMirror]:text-lg",
            "[&_.ProseMirror]:font-light",
            "[&_.ProseMirror]:text-slate-700",
            "[&_.ProseMirror]:leading-relaxed",
            "[&_.ProseMirror_ul]:list-disc",
            "[&_.ProseMirror_ul]:pl-6",
            "[&_.ProseMirror_ol]:list-decimal",
            "[&_.ProseMirror_ol]:pl-6",
            "[&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
            "[&_.ProseMirror_.is-editor-empty:first-child::before]:text-[#ABABAB]",
            "[&_.ProseMirror_.is-editor-empty:first-child::before]:float-left",
            "[&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none",
            "[&_.ProseMirror_.is-editor-empty:first-child::before]:h-0",
          )}
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={isItalicActive}
            onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100",
              "data-[state=on]:bg-teal-50 data-[state=on]:text-teal-600",
              "transition-colors",
            )}
          >
            <ItalicsIcon />
          </Toggle>

          <Toggle
            size="sm"
            pressed={isBoldActive}
            onPressedChange={() => editor?.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100",
              "data-[state=on]:bg-teal-50 data-[state=on]:text-teal-600",
              "transition-colors",
            )}
          >
            <BoldIcon />
          </Toggle>

          <Toggle
            size="sm"
            pressed={isBulletActive}
            onPressedChange={() =>
              editor?.chain().focus().toggleBulletList().run()
            }
            className={cn(
              "h-8 w-8 p-0 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100",
              "data-[state=on]:bg-teal-50 data-[state=on]:text-teal-600",
              "transition-colors",
            )}
          >
            <ListIcon />
          </Toggle>

          <Popover>
            <PopoverTrigger
              className={cn(
                "h-8 w-8 p-0 rounded-md flex items-center justify-center relative",
                "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
                "transition-colors",
              )}
            >
              <ColorIcon />
              {currentColor && (
                <span
                  className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ring-1 ring-white"
                  style={{ backgroundColor: currentColor }}
                />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start" sideOffset={8}>
              <p className="text-xs text-slate-400 mb-2 font-medium tracking-wide uppercase">
                Text color
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {COLORS.map(({ label, value }) => (
                  <button
                    key={label}
                    aria-label={label}
                    title={label}
                    onClick={() => {
                      if (value === null) {
                        editor?.chain().focus().unsetColor().run();
                      } else {
                        editor?.chain().focus().setColor(value).run();
                      }
                    }}
                    className={cn(
                      "w-7 h-7 rounded-md border-2 transition-all hover:scale-110",
                      currentColor === value
                        ? "border-slate-500 scale-110"
                        : "border-transparent hover:border-slate-300",
                    )}
                    style={{ backgroundColor: value ?? "#e2e8f0" }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={onDismiss}
            className="px-4 py-2 text-sm text-[#767C79] hover:bg-[#F2F4F2] rounded-xl"
          >
            Dismiss
          </Button>
          <Button
            variant="secondary"
            onClick={() => onSave(editor?.getHTML() ?? "")}
            disabled={isPending}
            className="px-5 py-2 rounded-xl flex gap-2 items-center"
          >
            <span className="text-sm font-medium">
              {isPending ? "Saving..." : "Save thought"}
            </span>
            <ArrowRightIcon size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddThoughtDialog({
  open,
  onOpenChange,
  refetch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}) {
  const addThoughtMutation = useMutation({
    mutationKey: ["add-random-thought"],
    mutationFn: async (content: string) => {
      const response = await fetch("/api/random-thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to add thought");
      return response.json();
    },
    onSuccess: async () => {
      await refetch();
      onOpenChange(false);
      toast.success("Thought captured");
    },
    onError: () => {
      toast.error("Failed to save thought");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-0 bg-[#F9F9F7]">
        <div className="p-8 flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light leading-snug text-left">
              Capture a thought
            </DialogTitle>
            <p className="text-sm text-[#767C79]">
              Dump whatever&apos;s on your mind — no filter needed.
            </p>
          </DialogHeader>

          <AddThoughtEditor
            onSave={(html) => addThoughtMutation.mutateAsync(html)}
            isPending={addThoughtMutation.isPending}
            onDismiss={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Declutter() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addThoughtDialogOpen, setAddThoughtDialogOpen] = useState(false);

  const [tasks, randomThoughts, worries] = useQueries({
    queries: [
      {
        queryKey: ["get-tasks"],
        queryFn: async (): Promise<Task[]> => {
          const response = await fetch("/api/task");
          return response.json();
        },
      },
      {
        queryKey: ["get-random-thoughts"],
        queryFn: async (): Promise<RandomThought[]> => {
          const response = await fetch("/api/random-thoughts");
          return response.json();
        },
      },
      {
        queryKey: ["get-worries"],
        queryFn: async (): Promise<Worry[]> => {
          const response = await fetch("/api/worries");
          return response.json();
        },
      },
    ],
  });

  const pendingTasks = tasks.data ?? [];
  const thoughts = randomThoughts.data ?? [];
  const worriesList = worries.data ?? [];

  return (
    <div className="p-12 h-full flex flex-col gap-16">
      <p className="text-9xl font-extrabold text-[#DEE4E0] -z-10 leading-tight tracking-tight fixed bottom-0 right-5 pointer-events-none">
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
          ) : pendingTasks.length === 0 ? (
            <TasksEmpty />
          ) : (
            <div className="flex flex-col gap-6">
              {pendingTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setDialogOpen(true);
                  }}
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
            <button
              onClick={() => setAddThoughtDialogOpen(true)}
              className="font-bold text-[#767C79] text-[24px] leading-none hover:text-[#2D5A45] transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
          {randomThoughts.isLoading ? (
            <ThoughtsSkeleton />
          ) : thoughts.length === 0 ? (
            <ThoughtsEmpty onClick={() => setAddThoughtDialogOpen(true)} />
          ) : (
            <div className="flex flex-col gap-6">
              {thoughts.map((thought) => (
                <div
                  key={thought.id}
                  className="p-5 bg-[#FFFFFF] flex flex-col gap-4 rounded-xl relative"
                >
                  <div className="w-0.5 h-2/3 absolute left-0 bg-muted-foreground" />
                  <div
                    className="text-sm text-slate-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                    dangerouslySetInnerHTML={{ __html: thought.content }}
                  />
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
          ) : worriesList.length === 0 ? (
            <WorriesEmpty />
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

      <AddThoughtDialog
        open={addThoughtDialogOpen}
        onOpenChange={setAddThoughtDialogOpen}
        refetch={randomThoughts.refetch}
      />
    </div>
  );
}
