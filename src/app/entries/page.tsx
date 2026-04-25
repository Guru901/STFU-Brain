"use client";
import { DumpsIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Dump = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return {
    label: isToday ? "TODAY" : null,
    full: date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    short: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

function getPreview(html: string) {
  const withBreaks = html.replace(/<\/(p|div|h[1-6]|li)>/gi, "\n");
  const clean = stripHtml(withBreaks);
  return clean
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function getShortPreview(html: string) {
  const withBreaks = html.replace(/<\/(p|div|h[1-6]|li)>/gi, " · ");
  const clean = stripHtml(withBreaks);
  return clean.replace(/\s+/g, " ").trim().slice(0, 120);
}

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto w-full flex gap-8">
      <div className="max-w-2xl w-full bg-white p-10 flex flex-col gap-6 rounded-xl">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex flex-col gap-8 flex-1">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-[#F2F4F2] p-8 flex flex-col gap-3 rounded-xl"
          >
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function OlderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-40" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full bg-white p-6 flex items-center gap-12 rounded-xl"
        >
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-64" />
        </div>
      ))}
    </div>
  );
}

export default function Dumps() {
  const { data, isLoading } = useQuery({
    queryKey: ["dumps"],
    queryFn: async () => {
      const res = await fetch("/api/dump/newer");
      if (!res.ok) throw new Error("Failed to fetch dumps");
      return res.json();
    },
  });

  const { data: olderData, isLoading: olderLoading } = useQuery({
    queryKey: ["dumps-older"],
    queryFn: async () => {
      const res = await fetch("/api/dump/older");
      if (!res.ok) throw new Error("Failed to fetch older dumps");
      return res.json();
    },
  });

  const dumps: Dump[] = data?.dumps ?? [];
  const older: Dump[] = olderData?.dumps ?? [];
  const [first, ...rest] = dumps;

  return (
    <div className="p-16 min-h-screen flex flex-col gap-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-8xl font-light leading-32">
            Mental <br />
            <b className="font-bold!">Releases</b>
          </h1>
          <p className="text-xl font-light text-[#767676] pt-2">
            A digital graveyard for the noise you&apos;ve successfully evicted
            from your mind.
          </p>
        </div>
        <DumpsIcon />
      </div>

      <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-between gap-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="flex justify-between gap-8 items-stretch">
            {first &&
              (() => {
                const d = formatDate(first.createdAt);
                return (
                  <Link
                    href={`/entry/${first.id}`}
                    className="max-w-2xl flex-1 bg-white p-10 flex flex-col gap-6 rounded-xl"
                  >
                    <div>
                      {d.label && (
                        <p className="text-[16px] font-semibold text-primary">
                          {d.label}
                        </p>
                      )}
                      <p className="text-[16px] font-semibold text-[#767C79]">
                        {d.full} • {d.time}
                      </p>
                    </div>
                    <h2 className="text-3xl font-semibold">{first.title}</h2>
                    <p className="text-[16px] text-[#767C79] whitespace-pre-line leading-relaxed line-clamp-12">
                      {getPreview(first.content)}
                    </p>
                  </Link>
                );
              })()}

            <div className="flex flex-col gap-8 flex-1">
              {rest.map((dump) => {
                const d = formatDate(dump.createdAt);
                return (
                  <Link
                    key={dump.id}
                    href={`/entry/${dump.id}`}
                    className="bg-[#F2F4F2] p-8 flex-1 flex flex-col gap-3 rounded-xl"
                  >
                    {d.time && (
                      <p className="text-[14px] font-semibold text-primary">
                        {d.full} • {d.time}
                      </p>
                    )}
                    {d.label && (
                      <p className="text-[16px] font-semibold text-primary">
                        {d.label}
                      </p>
                    )}
                    <p className="font-bold text-lg">{dump.title}</p>
                    <p className="text-[16px] text-[#767C79]">
                      {getShortPreview(dump.content)}…
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {olderLoading ? (
          <OlderSkeleton />
        ) : older.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold mb-2">Older entries</h3>
            {older.map((dump) => {
              const d = formatDate(dump.createdAt);
              return (
                <Link
                  key={dump.id}
                  href={`/entry/${dump.id}`}
                  className="w-full bg-white p-6 flex items-center justify-start gap-12 rounded-xl"
                >
                  <p className="text-[#767676]">{d.short}</p>
                  <div className="w-2 h-2 rounded-full bg-[#767676]" />
                  <p className="font-semibold">{dump.title}</p>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
