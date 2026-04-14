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
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

type OnboardingFormValues = {
  name: string;
};

type RecoveryFormValues = {
  recoverName: string;
  recoverCodes: string;
};

export default function OnBoarding() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Recovery dialog state
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverError, setRecoverError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OnboardingFormValues>({
    defaultValues: { name: "" },
  });
  const recoveryForm = useForm<RecoveryFormValues>({
    defaultValues: { recoverName: "", recoverCodes: "" },
    mode: "onChange",
  });

  const router = useRouter();

  const createUserMutation = useMutation({
    mutationFn: async ({ name }: OnboardingFormValues) => {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      const jsonData = await response.json();
      return jsonData.data.codes as string[];
    },
    onSuccess: (codes) => {
      setRecoveryCode(codes);
      setOpen(true);
    },
  });

  const recoverMutation = useMutation({
    mutationFn: async ({ recoverName, recoverCodes }: RecoveryFormValues) => {
      const response = await fetch("/api/user/recover", {
        method: "POST",
        body: JSON.stringify({ name: recoverName, codes: recoverCodes }),
      });

      if (!response.ok) {
        throw new Error(
          "Couldn't verify your account. Check your name and codes.",
        );
      }
      return response.json();
    },

    onSuccess: () => {
      setRecoverOpen(false);
      recoveryForm.reset();
      router.push("/dashboard");
    },
    onError: () => {
      setRecoverError(
        "Couldn't verify your account. Check your name and codes.",
      );
    },
  });

  useHotkeys("shift+enter", async () => {
    await handleSubmit(async (values) => {
      await createUserMutation.mutateAsync(values);
    })();
  });

  async function submitForm(values: OnboardingFormValues) {
    await createUserMutation.mutateAsync(values);
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
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!recoverOpen) return;
    recoveryForm.setFocus("recoverName");
  }, [recoverOpen, recoveryForm]);

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

  async function handleRecover(values: RecoveryFormValues) {
    setRecoverError("");
    await recoverMutation.mutateAsync(values);
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-5xl my-auto w-screen h-screen gap-16">
      <h1 className="font-extralight text-7xl">What's your name?</h1>
      <form className="w-full" onSubmit={handleSubmit(submitForm)}>
        <div className="w-full flex items-center">
          <Input
            type="text"
            placeholder="Write it here"
            {...register("name", { required: true })}
            onKeyDown={async (e) => {
              if (e.key === "Escape") {
                inputRef.current?.blur();
              }
              if (e.key === "Enter") {
                await handleSubmit(submitForm)();
              }
            }}
            className="bg-transparent! h-20! border-none border-b! outline-none focus:ring-0! text-4xl!"
          />
          <ReturnIcon />
        </div>
        <Separator className="mx-auto" />
      </form>
      <div className="flex flex-col gap-5 items-center">
        <Button
          size="lg"
          onClick={handleSubmit(submitForm)}
          disabled={isSubmitting}
          className="text-2xl py-8 px-12 flex items-center gap-2"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
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
            setRecoverError("");
            recoveryForm.reset();
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

          <form
            className="w-full flex flex-col gap-6"
            onSubmit={recoveryForm.handleSubmit(handleRecover)}
          >
            <div className="w-full">
              <div className="w-full flex items-center">
                <Input
                  type="text"
                  placeholder="Your username"
                  {...recoveryForm.register("recoverName", { required: true })}
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
                  {...recoveryForm.register("recoverCodes", { required: true })}
                  className="bg-transparent! h-14! border-none border-b! outline-none focus:ring-0! text-xl! font-mono"
                />
              </div>
              <Separator />
              <p className="text-[#767676] text-xs">
                Even one valid code may be enough depending on your setup.
              </p>
            </div>
          </form>

          {recoverError && (
            <p className="text-red-500 text-sm text-center w-full">
              {recoverError}
            </p>
          )}

          <Separator className="w-full" />

          <Button
            size="lg"
            className="w-full text-lg py-6 flex items-center gap-2"
            onClick={recoveryForm.handleSubmit(handleRecover)}
            disabled={
              recoverMutation.isPending || !recoveryForm.formState.isValid
            }
          >
            {recoverMutation.isPending ? "Verifying..." : "Recover Account"}
            {recoverMutation.isPending ? (
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
