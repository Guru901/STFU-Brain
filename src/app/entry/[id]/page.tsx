"use client";

import { CalenderIcon, ScheduleIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

export default function Entry() {
  const id = useParams().id as string;
  const highLight = useSearchParams().get("highLight") || undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["entry", id],
    queryFn: async () => {
      const res = await fetch(`/api/entry/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch entry");
      }
      return res.json();
    },
  });

  if (isLoading)
    return (
      <main className="max-w-3xl mx-auto my-10 px-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-3/4 rounded-lg" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>
        </div>
      </main>
    );

  if (error) return <div className="p-6">Something went wrong</div>;

  const date = data?.createdAt ? new Date(data.createdAt) : null;

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = date
    ? date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const getHighlightedHTML = (html: string) => {
    if (!highLight) return html;

    const escaped = highLight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
    const regex = new RegExp(`(${escaped})`, "gi");

    return html.replace(
      regex,
      `<mark class="bg-yellow-300 text-black px-1 rounded">$1</mark>`,
    );
  };

  const finalHTML = data?.html.__html
    ? getHighlightedHTML(data.html.__html)
    : "";

  return (
    <main className="max-w-6xl mx-auto my-10">
      <div className="flex flex-col justify-between gap-6 my-20">
        <div className="space-y-2 prototype-link-hover prototype-hotspot">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-on-background leading-none">
            {data?.title}
          </h1>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2">
              <CalenderIcon />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <ScheduleIcon />
              <span className="text-sm font-medium">{formattedTime}</span>
            </div>
          </div>
        </div>

        <div
          className="prose prose-neutral max-w-none my-10"
          dangerouslySetInnerHTML={{ __html: finalHTML }}
        />
      </div>
    </main>
  );
}
