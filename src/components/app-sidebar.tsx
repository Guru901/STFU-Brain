"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AllEntriesIcon,
  AllTasksIcon,
  BrainIcon,
  CreateIcon,
  DashboardIcon,
  DeclutterIcon,
  DumpIcon,
  FocusMode,
  TaskIcon,
} from "./ui/icons";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";

type Task = { id: string; content: string; priority: string };

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>("");

  const { data: tasks } = useQuery({
    queryKey: ["get-tasks"],
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch("/api/task");
      const data = await response.json();
      return data;
    },
  });

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  function handleStartFocus() {
    if (selectedTask.length === 0) return;
    setFocusOpen(false);
    // Pass selected task IDs via query params or your state management
    const params = new URLSearchParams({ tasks: selectedTask });
    router.push(`/focus?${params.toString()}`);
  }

  return pathname === "/" ||
    pathname === "/focus" ||
    pathname === "/onboarding" ||
    pathname === "/add-task" ? (
    <></>
  ) : (
    <Sidebar
      className="sticky top-0 flex min-h-screen flex-col gap-12 px-6 py-8 bg-[#F2F4F2]"
      collapsible="none"
    >
      <SidebarHeader className="pb-8 px-2">
        <h1 className="text-2xl font-light text-[#4E635A]">
          <i>STFU Brain</i>
        </h1>
        <p className="text-sm font-light text-[#4E635A]">SHUT THE FUCK UP</p>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-12">
        <SidebarGroup>
          <div className="flex flex-col gap-3">
            <Link
              href={"/dashboard"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active === "/dashboard" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}`}
            >
              <DashboardIcon
                fill={active === "/dashboard" ? "#4e635a" : "#767676"}
              />
              Dashboard
            </Link>

            <Link
              href={"/dump"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active === "/dump" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}`}
            >
              <DumpIcon fill={active === "/dump" ? "#4e635a" : "#767676"} />
              Brain Dump
            </Link>

            <Link
              href={"/declutter"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active === "/declutter" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}`}
            >
              <DeclutterIcon
                fill={active === "/declutter" ? "#4e635a" : "#767676"}
              />
              Declutter
            </Link>

            <Link
              href={"/entries"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active === "/entries" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}`}
            >
              <AllEntriesIcon />
              All Entries
            </Link>

            <Link
              href={"/tasks"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active === "/tasks" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}`}
            >
              <AllTasksIcon />
              All Tasks
            </Link>

            {/* Focus Mode — opens dialog instead of navigating */}
            <Dialog
              open={focusOpen}
              onOpenChange={(v) => {
                setFocusOpen(v);
                if (!v) setSelectedTask(""); // reset on close
              }}
            >
              <DialogTrigger
                className={`flex items-center gap-4 text-md px-5 py-3 text-left w-full cursor-pointer
                    ${active === "/focus" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}`}
              >
                <FocusMode fill={active === "/focus" ? "#4e635a" : "#767676"} />
                Focus Mode
              </DialogTrigger>

              <DialogContent className="max-w-xl px-10 py-10 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <FocusMode fill="#4E635A" />
                    <h2 className="text-3xl font-light text-[#4E635A]">
                      Focus Mode
                    </h2>
                  </div>
                  <p className="text-[#767C79] text-sm pl-9">
                    Pick what needs your attention right now.
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {!tasks || tasks?.length === 0 ? (
                    <p className="text-[#767C79] text-sm text-center py-8">
                      No pending tasks. You&apos;re all clear 🌿
                    </p>
                  ) : (
                    tasks?.map((task) => {
                      const isSelected = selectedTask.includes(task.id);
                      return (
                        <button
                          key={task.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTask("");
                            } else {
                              setSelectedTask(task.id);
                            }
                          }}
                          className={`flex items-center justify-between px-5 py-3.5 rounded-xl border text-left transition-all duration-150
                            ${
                              isSelected
                                ? "bg-[#4E635A] border-[#4E635A] text-white"
                                : "bg-white border-[#E2E6E3] text-[#4E635A] hover:border-[#4E635A]/40"
                            }`}
                        >
                          <span className="text-sm font-medium">
                            {task.content}
                          </span>
                          {task.priority && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-3
                                ${isSelected ? "bg-white/20 text-white" : "bg-[#F2F4F2] text-[#767C79]"}`}
                            >
                              {task.priority}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                <Separator />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#767C79]">
                    {selectedTask.length === 0
                      ? "Nothing selected"
                      : "1 task selected"}
                  </p>
                  <Button
                    onClick={handleStartFocus}
                    disabled={selectedTask.length === 0}
                    className="px-8 py-2 text-[16px]"
                  >
                    Start Focus
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarGroup>

        {/* New Entry dialog — unchanged */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={buttonVariants({ className: "py-3" })}>
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={12}
              color="currentColor"
              strokeWidth={1.5}
            />
            <span className="text-[16px]">New Entry</span>
          </DialogTrigger>
          <DialogContent className="max-w-3xl px-28 py-12 flex flex-col items-center w-max gap-3">
            <CreateIcon />
            <h1 className="text-4xl font-light pt-7">Create Sanctuary</h1>
            <p className="text-[#767C79] text-xl">
              Let it out, then let it go.
            </p>
            <div className="w-full flex pt-9 gap-6">
              <div
                className="bg-[#F2F4F2] p-8 rounded-xl flex flex-col gap-6 cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  router.push("/dump");
                }}
              >
                <BrainIcon />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[18px]">
                    Start Brain Dump
                  </h3>
                  <p className="text-[16px] text-[#5A605E]">
                    A stream of consciousness space for unfiltered thoughts.
                  </p>
                </div>
              </div>
              <div
                className="bg-[#F2F4F2] p-8 rounded-xl flex flex-col gap-6 cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  router.push("/add-task");
                }}
              >
                <TaskIcon />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[18px]">Quick Task</h3>
                  <p className="text-[16px] text-[#5A605E]">
                    Capture a single, focused action to clear your mental tray.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
