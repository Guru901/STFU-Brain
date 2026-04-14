"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRightIcon, ReturnIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { FirstBracketIcon, Loading } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";

// Generate 8 recovery codes
function generateRecoveryCodes(): string[] {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase(),
    ).join("-"),
  );
}

const RECOVERY_CODES = generateRecoveryCodes();

export default function OnBoarding() {
  const [buttonText, setButtonText] = useState("Submit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useHotkeys("shift+enter", () => alert("Submitting form"));

  async function submitForm() {
    setIsSubmitting(true);
    setButtonText("Submitting...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setButtonText("Generating unique id");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setButtonText("Submitted");
    setIsSubmitting(false);
    setOpen(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(RECOVERY_CODES.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([RECOVERY_CODES.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClose() {
    setOpen(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-5xl my-auto w-screen h-screen gap-16">
      <h1 className="font-extralight text-7xl">What's your name?</h1>
      <div className="w-full">
        <div className="w-full flex items-center">
          <Input
            type="text"
            placeholder="Write it here"
            className="bg-transparent! h-20! border-none border-b! outline-none focus:ring-0! text-4xl!"
          />
          <ReturnIcon />
        </div>
        <Separator className="mx-auto" />
      </div>
      <div className="flex flex-col gap-5 items-center">
        <Button
          size="lg"
          onClick={submitForm}
          disabled={isSubmitting}
          className="text-2xl py-8 px-12 flex items-center gap-2"
        >
          {buttonText}
          {isSubmitting ? (
            <HugeiconsIcon
              icon={FirstBracketIcon}
              stroke="2"
              className="animate-spin"
            />
          ) : (
            <ArrowRightIcon color="#E6FDF2" />
          )}
        </Button>
        <div>
          <p className="text-[16px] text-center">
            Press Shift+Return to submit
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl px-16 py-12 flex flex-col items-center gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-extralight text-4xl">Recovery Codes</h2>
            <p className="text-[#767676] text-sm max-w-sm">
              Save these somewhere safe. You'll need them if you ever lose
              access to your account.
            </p>
          </div>

          <Separator className="w-full" />

          {/* Codes grid */}
          <div className="grid grid-cols-2 gap-2 w-full font-mono text-sm">
            {RECOVERY_CODES.map((code, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-muted/50 border border-border/50"
              >
                <span className="text-muted-foreground text-xs w-4 shrink-0">
                  {i + 1}.
                </span>
                <span>{code}</span>
              </div>
            ))}
          </div>

          <Separator className="w-full" />

          {/* Actions */}
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="secondary"
              className="gap-2 flex-1 py-2 text-[14px]"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy all"}
            </Button>
            <Button
              variant="secondary"
              className="gap-2 flex-1 py-2 text-[14px]"
              onClick={handleDownload}
            >
              Download .txt
            </Button>
          </div>

          {/* Go to dashboard */}
          <Button
            size="lg"
            className="w-full text-lg py-6 flex items-center gap-2 mt-1"
            onClick={handleClose}
          >
            Go to Dashboard
            <ArrowRightIcon color="#E6FDF2" />
          </Button>

          <p className="text-[#767676] text-xs text-center">
            These codes won't be shown again after you close this dialog.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
