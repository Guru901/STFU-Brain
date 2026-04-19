"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, ReturnIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/lib/useUser";

type AddTaskFormValues = {
  title: string;
  priority: string;
  note: string;
  tag: string;
};

export default function AddTask() {
  const router = useRouter();
  const { codes } = useUser();

  const { register, handleSubmit, control } = useForm<AddTaskFormValues>({
    defaultValues: {
      title: "",
      priority: "routine",
      note: "",
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async ({ note, priority, title, tag }: AddTaskFormValues) => {
      const response = await fetch("/api/task", {
        method: "POST",
        body: JSON.stringify({
          content: title,
          tag,
          codes,
          context: note,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  async function onSubmit(data: AddTaskFormValues) {
    await addTaskMutation.mutateAsync(data);
  }

  useHotkeys("shift+enter", () => {
    void handleSubmit(onSubmit)();
  });

  useHotkeys("esc", () => {
    router.back();
  });

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-5xl my-auto w-screen h-screen gap-16">
      <h1 className="font-extralight text-7xl">What needs doing?</h1>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex items-center">
          <Input
            type="text"
            autoFocus
            placeholder="Write it here and let it go..."
            {...register("title", { required: true })}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                router.back();
              }
            }}
            className="bg-transparent! h-20! border-none border-b! outline-none focus:ring-0! text-4xl!"
          />
          <ReturnIcon />
        </div>
        <Separator className="mx-auto" />
      </form>
      <div className="flex gap-2 w-full">
        <Card className="ring-0! p-0!">
          <CardContent className="p-8 flex flex-col gap-4">
            <CardTitle className="text-[#767C79] text-[16px]">
              PRIORITY LEVEL
            </CardTitle>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Tabs defaultValue={field.value} onValueChange={field.onChange}>
                  <TabsList className="bg-white px-4 py-8 h-auto">
                    {["low", "routine", "high"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="px-6 py-4! text-[14px] font-normal capitalize"
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            />
          </CardContent>
        </Card>
        <Card className="ring-0! p-0! w-[65%]">
          <CardContent className="p-8 flex flex-col gap-4">
            <CardTitle className="text-[#767C79] text-[16px]">
              ADD A QUICK NOTE
            </CardTitle>
            <Input
              type="text"
              placeholder="Any context to quiet the mind?"
              {...register("note")}
              className="bg-transparent! h-8! border-none border-b! outline-none focus:ring-0! text-lg!"
            />
            <Input
              type="text"
              placeholder="Any tag about the task (deep work or personal)?"
              {...register("tag")}
              className="bg-transparent! h-8! border-none border-b! outline-none focus:ring-0! text-lg!"
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <Button
          size="lg"
          onClick={handleSubmit(onSubmit)}
          className="text-2xl py-8 px-12 flex items-center gap-2"
          disabled={addTaskMutation.isPending}
        >
          {addTaskMutation.isPending ? "SAVING..." : "Commit to Task"}
          <ArrowRightIcon color="#E6FDF2" />
        </Button>
        <div>
          <p className="text-[16px] text-center">Press Esc to exit silence</p>
          <p className="text-[16px] text-center">
            Press Shift+Return to submit
          </p>
        </div>
      </div>
    </div>
  );
}
