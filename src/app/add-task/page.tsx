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

export default function AddTask() {
  const router = useRouter();

  useHotkeys("shift+enter", () => alert("Submitting form"));

  useHotkeys("esc", () => {
    router.back();
  });

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-5xl my-auto w-screen h-screen gap-16">
      <h1 className="font-extralight text-7xl">What needs doing?</h1>
      <div className="w-full">
        <div className="w-full flex items-center">
          <Input
            type="text"
            placeholder="Write it here and let it go..."
            className="bg-transparent! h-20! border-none border-b! outline-none focus:ring-0! text-4xl!"
          />
          <ReturnIcon />
        </div>
        <Separator className="mx-auto" />
      </div>
      <div className="flex gap-2 w-full">
        <Card className="ring-0! p-0!">
          <CardContent className="p-8 flex flex-col gap-4">
            <CardTitle className="text-[#767C79] text-[16px]">
              PRIORITY LEVEL
            </CardTitle>
            <Tabs defaultValue="analytics">
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
              className="bg-transparent! h-8! border-none border-b! outline-none focus:ring-0! text-lg!"
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <Button
          size="lg"
          className="text-2xl py-8 px-12 flex items-center gap-2"
        >
          Commit to Task
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
