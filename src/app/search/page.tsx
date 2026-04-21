"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

type ResultType = "dump" | "random" | "worry" | "task";

type SearchResult = {
  id: string;
  type: ResultType;
  title: string;
  preview: string | null;
  priority?: "low" | "routine" | "high";
  tag?: string | null;
  completed?: boolean;
  createdAt: string | null;
};

const typeBadge: Record<ResultType, { label: string; class: string }> = {
  dump: {
    label: "Entry",
    class: "bg-[#E8E6F0] text-[#3A2E6B] hover:bg-[#E8E6F0]",
  },
  random: {
    label: "Thought",
    class: "bg-[#E0EDEA] text-[#2E4A42] hover:bg-[#E0EDEA]",
  },
  worry: {
    label: "Worry",
    class: "bg-[#F5E6E6] text-[#8B1A2F] hover:bg-[#F5E6E6]",
  },
  task: {
    label: "Task",
    class: "bg-[#E6E8E6] text-[#4A4F4C] hover:bg-[#E6E8E6]",
  },
};

const typeIcon: Record<ResultType, React.ReactNode> = {
  worry: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  random: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="19" cy="9" r="1" />
      <circle cx="19" cy="15" r="1" />
      <circle cx="12" cy="19" r="1" />
      <circle cx="5" cy="15" r="1" />
      <circle cx="5" cy="9" r="1" />
    </svg>
  ),
  task: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  dump: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-[#FFF3C4] text-[#1C1C1C] rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

// ─── Guided Filtering Popup ───────────────────────────────────────────────────

function GuidedFilteringPopup({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E8EAE8] p-5 z-20">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#F0F2F0] flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4A4F4C"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-[14px] font-semibold text-[#1C1C1C]">
          Guided Filtering
        </span>
      </div>
      <p className="text-[13px] text-[#767C79] leading-relaxed mb-4">
        You seem to be searching for past stressors. Should we prioritize
        entries where you found a resolution?
      </p>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          className="text-[11px] tracking-widest font-semibold rounded-lg px-4 h-8"
        >
          YES, GUIDE ME
        </Button>
        <button
          onClick={onDismiss}
          className="text-[11px] tracking-widest text-[#9AA09D] font-semibold hover:text-[#4A4F4C] transition-colors"
        >
          DISMISS
        </button>
      </div>
    </div>
  );
}

// ─── Featured Result Card ─────────────────────────────────────────────────────

function FeaturedCard({
  result,
  query,
}: {
  result: SearchResult;
  query: string;
}) {
  return (
    <Card className="rounded-2xl border border-[#E8EAE8] shadow-none flex-1">
      <CardContent className="p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Badge
            className={`text-[11px] tracking-wide rounded-sm font-semibold px-2.5 py-0.5 ${typeBadge[result.type].class}`}
          >
            {typeBadge[result.type].label}
          </Badge>
          <span className="text-[12px] text-[#9AA09D]">
            {formatDate(result.createdAt)}
          </span>
        </div>
        <h2 className="text-[26px] font-semibold leading-snug text-[#1C1C1C]">
          {highlight(result.title, query)}
        </h2>
        {result.preview && (
          <p className="text-[15px] text-[#767C79] leading-relaxed">
            {highlight(result.preview.slice(0, 220), query)}
          </p>
        )}
        {result.type === "task" && result.priority && (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${result.priority === "high" ? "bg-[#8B1A2F]" : result.priority === "routine" ? "bg-primary" : "bg-[#B0B5B2]"}`}
            />
            <span className="text-[12px] text-[#9AA09D] font-medium uppercase tracking-wide">
              {result.priority} priority
            </span>
            {result.tag && (
              <span className="text-[12px] text-[#9AA09D]">· {result.tag}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Compact Result Row ───────────────────────────────────────────────────────

function CompactResult({
  result,
  query,
}: {
  result: SearchResult;
  query: string;
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#F0F2F0] last:border-0 group cursor-pointer">
      <div className="w-9 h-9 rounded-xl bg-[#F0F2F0] flex items-center justify-center shrink-0 text-[#767C79] group-hover:bg-[#E8EAE8] transition-colors">
        {typeIcon[result.type]}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[14px] font-medium text-[#1C1C1C] truncate">
          {highlight(result.title, query)}
        </span>
        <span className="text-[12px] text-[#9AA09D]">
          {typeBadge[result.type].label} · {formatDate(result.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F0F2F0] flex items-center justify-center text-[#C0C5C2]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-[#4A4F4C]">
          Nothing found for{" "}
          <span className="text-[#1C1C1C]">&ldquo;{query}&rdquo;</span>
        </p>
        <p className="text-[13px] text-[#9AA09D]">
          Try different keywords or check your spelling.
        </p>
      </div>
    </div>
  );
}

function VisualInsightCard() {
  return (
    <Card className="rounded-2xl border border-[#E8EAE8] shadow-none">
      <CardContent className="p-6 flex flex-col gap-4">
        <span className="text-[10px] tracking-widest text-[#9AA09D] font-semibold">
          VISUAL INSIGHT
        </span>
        <div className="w-full h-36 bg-[#E8EAE8] rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[#B0B5B2] absolute left-[38%] top-[40%]" />
          <div className="w-5 h-5 rounded-full bg-[#9AA09D] absolute left-[50%] top-[50%]" />
          <div className="w-6 h-6 rounded-full bg-[#C0C5C2] absolute left-[30%] top-[55%]" />
        </div>
        <p className="text-[13px] text-[#4A4F4C] leading-relaxed">
          Your thoughts regarding <strong>&apos;Work&apos;</strong> have
          increased in intensity by 14% this week. Consider a 5-minute breather.
        </p>
      </CardContent>
    </Card>
  );
}

export default function MindfulRecall() {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showGuided, setShowGuided] = useState(false);
  const [activeType, setActiveType] = useState<ResultType | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(input.trim());
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  useEffect(() => {
    const worryWords = [
      "stress",
      "anxious",
      "worry",
      "pressure",
      "fear",
      "overwhelm",
    ];
    if (worryWords.some((w) => debouncedQuery.toLowerCase().includes(w))) {
      setShowGuided(true);
    }
  }, [debouncedQuery]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return { data: [] };
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
      );
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: true,
    staleTime: 1000 * 30,
  });

  const allResults: SearchResult[] = data?.data ?? [];

  const results = activeType
    ? allResults.filter((r) => r.type === activeType)
    : allResults;

  const featured = results[0] ?? null;
  const sideResults = results.slice(1, 4);
  const hasQuery = debouncedQuery.length > 0;
  const isSearching = isLoading || isFetching;

  return (
    <div className="min-h-screen p-12 flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[52px] font-semibold leading-none tracking-tight text-[#1C1C1C]">
          Mindful Recall
        </h1>
        <p className="text-[#767C79] text-[15px] max-w-sm leading-relaxed">
          Search through the noise. Find the patterns in your thoughts that
          matter most today.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA09D]"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            {isSearching && hasQuery && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search your mental landscape..."
              className="pl-10 pr-10 rounded-xl border-[#E8EAE8] text-[15px] text-[#1C1C1C] placeholder:text-[#C0C5C2] focus-visible:ring-primary h-12"
            />
          </div>

          {/* Type filter buttons */}
          {(["dump", "worry", "random", "task"] as ResultType[]).map((t) => (
            <Button
              key={t}
              variant="outline"
              onClick={() => setActiveType(activeType === t ? null : t)}
              className={`rounded-xl border-[#E8EAE8] text-[13px] h-12 px-4 capitalize transition-all ${
                activeType === t
                  ? "bg-[#2E3432] text-white border-[#2E3432] hover:bg-[#1C1C1C]"
                  : "text-[#4A4F4C]"
              }`}
            >
              {typeBadge[t].label}
            </Button>
          ))}
        </div>
      </div>

      {!hasQuery ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F2F0] flex items-center justify-center text-[#C0C5C2]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p className="text-[15px] text-[#9AA09D]">
            Start typing to search across your dumps, thoughts, worries, and
            tasks.
          </p>
        </div>
      ) : isSearching ? (
        <div className="flex gap-6">
          <div className="flex flex-col gap-6 flex-1">
            <Card className="rounded-2xl border border-[#E8EAE8] shadow-none flex-1">
              <CardContent className="p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-16 h-6 rounded-sm" />
                  <Skeleton className="w-24 h-4 rounded" />
                </div>
                <Skeleton className="w-full h-8 rounded" />
                <Skeleton className="w-3/4 h-8 rounded" />
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-2/3 h-4 rounded" />
              </CardContent>
            </Card>
            <div className="flex gap-6">
              <Skeleton className="w-50 h-48 rounded-2xl" />
              <Skeleton className="flex-1 h-48 rounded-2xl" />
            </div>
          </div>
          <div className="w-85 flex flex-col gap-4">
            <Skeleton className="w-full h-52 rounded-2xl" />
            <Card className="rounded-2xl border border-[#E8EAE8] shadow-none">
              <CardContent className="px-6 py-2 flex flex-col">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-4 border-b border-[#F0F2F0] last:border-0"
                  >
                    <Skeleton className="w-9 h-9 rounded-xl" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Skeleton className="w-full h-4 rounded" />
                      <Skeleton className="w-1/2 h-3 rounded" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState query={debouncedQuery} />
      ) : (
        <div className="flex gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6 flex-1">
            {featured && (
              <FeaturedCard result={featured} query={debouncedQuery} />
            )}

            <div className="flex gap-6">
              <VisualInsightCard />
              {/* extra results as list */}
              {results.length > 4 && (
                <Card className="flex-1 rounded-2xl border border-[#E8EAE8] shadow-none">
                  <CardContent className="px-6 py-2 flex flex-col">
                    {results.slice(4, 7).map((r) => (
                      <CompactResult
                        key={r.id}
                        result={r}
                        query={debouncedQuery}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="w-85 flex flex-col gap-4">
            <div className="relative">
              <Card className="rounded-2xl border border-[#E8EAE8] shadow-none">
                <CardContent className="px-6 py-2 flex flex-col">
                  {sideResults.length > 0 ? (
                    sideResults.map((r) => (
                      <CompactResult
                        key={r.id}
                        result={r}
                        query={debouncedQuery}
                      />
                    ))
                  ) : (
                    <div className="py-6 text-center text-[13px] text-[#9AA09D]">
                      No other results.
                    </div>
                  )}
                </CardContent>
              </Card>

              {showGuided && (
                <GuidedFilteringPopup onDismiss={() => setShowGuided(false)} />
              )}
            </div>

            {/* Result count */}
            <p className="text-[12px] text-[#9AA09D] text-center">
              {results.length} result{results.length !== 1 ? "s" : ""} for
              &ldquo;{debouncedQuery}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
