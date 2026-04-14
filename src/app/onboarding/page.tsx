"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRightIcon, ReturnIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FirstBracketIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";

export default function OnBoarding() {
  const [buttonText, setButtonText] = useState("Submit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [recoveryCode, setRecoveryCode] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Recovery dialog state
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverName, setRecoverName] = useState("");
  const [recoverCodes, setRecoverCodes] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverError, setRecoverError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useHotkeys("shift+enter", async () => {
    await submitForm();
  });

  async function submitForm() {
    setIsSubmitting(true);
    setButtonText("Submitting...");
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to save user");
    }

    const jsonData = await response.json();
    const {
      data: { codes },
    } = jsonData;

    setRecoveryCode(codes);
    setIsSubmitting(false);
    setOpen(true);
  }

  useEffect(() => {
    if (!isLoggedIn) {
      const user = getCookie("user");
      const codes = getCookie("codes");
      if (user && codes) {
        setIsLoggedIn(true);
      }
    } else {
      router.push("/dashboard");
    }
  }, [isLoggedIn]);

  function handleCopy() {
    navigator.clipboard.writeText(recoveryCode.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([recoveryCode.join("\n")], { type: "text/plain" });
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

  async function handleRecover() {
    setIsRecovering(true);
    setRecoverError("");

    const response = await fetch("/api/user/recover", {
      method: "POST",
      body: JSON.stringify({ name: recoverName, codes: recoverCodes }),
    });

    if (!response.ok) {
      setRecoverError(
        "Couldn't verify your account. Check your name and codes.",
      );
      setIsRecovering(false);
      return;
    }

    setIsRecovering(false);
    setRecoverOpen(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-5xl my-auto w-screen h-screen gap-16">
      <h1 className="font-extralight text-7xl">What's your name?</h1>
      <div className="w-full">
        <div className="w-full flex items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Write it here"
            value={name}
            onChange={(e) => {
              if (e.target.value === "esc") {
                console.log("esc");
              }
              setName(e.target.value);
            }}
            onKeyDown={async (e) => {
              if (e.key === "Escape") {
                inputRef.current?.blur();
              }
              if (e.key === "Enter") {
                await submitForm();
              }
            }}
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
        <div className="flex flex-col items-center gap-1">
          <p className="text-[16px] text-center">
            Press Shift+Return to submit
          </p>
          <p>
            Already a user?{" "}
            <button
              onClick={() => setRecoverOpen(true)}
              className="underline cursor-pointer"
            >
              Recover your account
            </button>
          </p>
        </div>
      </div>

      {/* Recovery codes dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl px-16 py-12 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-extralight text-4xl">Recovery Codes</h2>
            <p className="text-[#767676] text-sm max-w-sm">
              Save these somewhere safe. You'll need them if you ever lose
              access to your account.
            </p>
          </div>

          <Separator className="w-full" />

          <div className="grid grid-cols-2 gap-2 w-full font-mono text-sm">
            {recoveryCode.map((code, i) => (
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

      {/* Account recovery dialog */}
      <Dialog
        open={recoverOpen}
        onOpenChange={(v) => {
          setRecoverOpen(v);
          if (!v) {
            setRecoverName("");
            setRecoverCodes("");
            setRecoverError("");
          }
        }}
      >
        <DialogContent className="max-w-2xl px-16 py-12 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-extralight text-4xl">Recover Account</h2>
            <p className="text-[#767676] text-sm max-w-sm">
              Enter your username and as many recovery codes as you remember,
              separated by commas.
            </p>
          </div>

          <Separator className="w-full" />

          <div className="w-full flex flex-col gap-6">
            <div className="w-full">
              <div className="w-full flex items-center">
                <Input
                  type="text"
                  placeholder="Your username"
                  value={recoverName}
                  onChange={(e) => setRecoverName(e.target.value)}
                  className="bg-transparent! h-14! border-none border-b! outline-none focus:ring-0! text-2xl!"
                />
              </div>
              <Separator />
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex items-center">
                <Input
                  type="text"
                  placeholder="code-1, code-2, code-3..."
                  value={recoverCodes}
                  onChange={(e) => setRecoverCodes(e.target.value)}
                  className="bg-transparent! h-14! border-none border-b! outline-none focus:ring-0! text-xl! font-mono"
                />
              </div>
              <Separator />
              <p className="text-[#767676] text-xs">
                Even one valid code may be enough depending on your setup.
              </p>
            </div>
          </div>

          {recoverError && (
            <p className="text-red-500 text-sm text-center w-full">
              {recoverError}
            </p>
          )}

          <Separator className="w-full" />

          <Button
            size="lg"
            className="w-full text-lg py-6 flex items-center gap-2"
            onClick={handleRecover}
            disabled={
              isRecovering || !recoverName.trim() || !recoverCodes.trim()
            }
          >
            {isRecovering ? "Verifying..." : "Recover Account"}
            {isRecovering ? (
              <HugeiconsIcon
                icon={FirstBracketIcon}
                stroke="2"
                className="animate-spin"
              />
            ) : (
              <ArrowRightIcon color="#E6FDF2" />
            )}
          </Button>

          <p className="text-[#767676] text-xs text-center">
            Can't remember any codes? You'll need to create a new account.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
