"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoltIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/lib/useUser";
import { useState } from "react";

const blocks1 = [
  "#ECEFEC",
  "#D1E8DD",
  "#D1E8DDc2",
  "#4E635A99",
  "#4E635A",
  "#4E635A66",
  "#ECEFEC",
];

const blocks2 = [
  "#ECEFEC",
  "#D1E8DD33",
  "#ECEFEC",
  "#4E635A99",
  "#D1E8DD",
  "#4E635A66",
  "#4E635A",
];

const thoughts = [
  { text: "am I shipping fast enough", type: "WORRY" },
  { text: "write docs for Ripress", type: "TASK" },
  { text: "the geometry of fern leaves", type: "RANDOM" },
  { text: "check expiration on passport", type: "TASK" },
];

const tagStyles: Record<string, string> = {
  WORRY: "bg-[#F5E6E6] text-[#8B1A2F]",
  TASK: "bg-[#E0EDEA] text-[#2E4A42]",
  RANDOM: "bg-[#E6E8E6] text-[#4A4F4C]",
};

export default function Me() {
  const { user, avatar, updateAvatar } = useUser();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      updateAvatar(b64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-20 p-16 max-w-6xl mx-auto">
      <div className="flex items-end justify-between">
        <h1 className="text-[105px] font-light">{user}</h1>

        <Label
          htmlFor="avatar-upload"
          className="relative group cursor-pointer rounded-xl overflow-hidden max-w-72 w-72 h-72 border border-dashed border-[#C0C5C2] bg-[#F5F5F3] flex items-center justify-center"
        >
          {avatar ? (
            <>
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm tracking-wide">
                  change photo
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-[#888C89] select-none">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-sm tracking-wide">upload avatar</span>
            </div>
          )}
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </Label>
      </div>

      <div className="flex w-full justify-between">
        <Card className="bg-white w-[58%] p-10">
          <CardHeader>
            <CardTitle className="text-lg">Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex justify-evenly">
              <div className="text-center">
                <p className="text-[#2E3432] text-3xl">142</p>
                <p className="text-[#767C79] text-[16px]">SESSIONS</p>
              </div>
              <div className="text-center">
                <p className="text-[#2E3432] text-3xl">3.2k</p>
                <p className="text-[#767C79] text-[16px]">THOUGHTS</p>
              </div>
              <div className="text-center">
                <p className="text-[#2E3432] text-3xl">840</p>
                <p className="text-[#767C79] text-[16px]">TASKS CLEARED</p>
              </div>
            </div>
            <div className="h-16" />
            <Separator />
            <div className="h-8" />
            <div className="flex gap-2">
              <p className="text-[#767C79] text-[16px]">
                Peak clarity achieved on Thursdays.
              </p>
              <BoltIcon />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#F2F4F2] w-[40%] p-10">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-lg">LAST 2 WEEKS</CardTitle>
            <p className="text-[16px] text-[#767C79]">Intensity Scale</p>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex flex-col gap-3">
              <div className="flex justify-evenly">
                {blocks1.map((b, i) => (
                  <div
                    key={b + i}
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: b }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-evenly">
                {blocks2.map((b, i) => (
                  <div
                    key={b + i}
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: b }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between">
                <p className="text-[14px] text-[#ADB3B0]">MON</p>
                <p className="text-[14px] text-[#ADB3B0]">SUN</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-between">
        <Card className="bg-[#F2F4F2] w-[40%] p-10">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-lg">MENTAL COMPOSITION</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex flex-col gap-7">
              {[
                { label: "worries", value: 25, color: "#8B1A2F" },
                { label: "tasks", value: 41, color: "#2E4A42" },
                { label: "random", value: 34, color: "#B0B5B2" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-baseline mb-2.5">
                    <span className="text-[15px] text-[#1A1A1A]">{label}</span>
                    <span className="text-[15px] text-[#1A1A1A]">{value}%</span>
                  </div>
                  <div className="relative h-2.5 bg-[#D9DDD9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${value}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white w-[58%] p-10">
          <CardHeader>
            <CardTitle className="text-lg">RESIDUAL ECHOES</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="flex flex-col divide-y divide-[#E8EAE8]">
              {thoughts.map(({ text, type }, i) => (
                <div key={i} className="flex items-center justify-between py-6">
                  <div className="flex items-center gap-5">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#888"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 1l4 4-4 4" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <path d="M7 23l-4-4 4-4" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    <span className="text-[18px] text-[#1C1C1C] font-light">
                      {text}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-widest px-3 py-1 rounded-sm ${tagStyles[type]}`}
                  >
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-8 items-center">
        <p className="text-4xl font-light text-center leading-relaxed">
          "The primary cause of unhappiness is never the situation but your
          thoughts about it."
        </p>
        <div className="bg-primary h-0.5 w-32" />
        <p className="text-xl text-center leading-relaxed">ECKHART TOLLE</p>
      </div>
    </div>
  );
}
