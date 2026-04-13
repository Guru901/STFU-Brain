import { Button, buttonVariants } from "@/components/ui/button";
import { CheckCircleIcon, ScheduleIcon, Texture } from "@/components/ui/icons";
import Link from "next/link";

export default function FocusMode() {
  return (
    <>
      <main className="relative z-10 bg-[#0D0F0E] w-screen h-screen flex flex-col items-center justify-center px-6">
        <Texture />
        <div className="max-w-4xl w-full text-center space-y-16">
          <div className="flex items-center justify-center space-x-3 opacity-40">
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#767C79]">
              Deep Work Session
            </span>
          </div>
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-extralight text-white tracking-tight leading-tight">
              Finalize the Zen Editorial design system
            </h1>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2 text-outline">
                <ScheduleIcon />
                <span className="text-sm text-[#767C79] font-light tracking-wide">
                  Started 14m ago
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-8 pt-8">
            <Link
              href="/dashboard"
              className={`${buttonVariants()} flex items-center space-x-4 px-10 py-4 rounded-lg`}
            >
              <CheckCircleIcon />
              <span className="text-lg font-medium tracking-tight">
                Finish Task
              </span>
            </Link>
            <button className="text-outline hover:text-surface-variant transition-colors duration-300 text-xs uppercase tracking-widest flex items-center space-x-2 opacity-50 text-[#767C79]">
              <span>Press Esc to exit silence</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#767C79] text-outline opacity-30">
              Current Environment
            </span>
            <span className="text-sm font-light text-[#DEE4E0] opacity-40 italic">
              Rain in Kyoto .m4a
            </span>
          </div>
          <div className="flex items-end space-x-1 h-8 opacity-20">
            <div className="w-0.5 bg-primary h-3"></div>
            <div className="w-0.5 bg-primary h-5"></div>
            <div className="w-0.5 bg-primary h-4"></div>
            <div className="w-0.5 bg-primary h-6"></div>
            <div className="w-0.5 bg-primary h-2"></div>
            <div className="w-0.5 bg-primary h-4"></div>
            <div className="w-0.5 bg-primary h-7"></div>
            <div className="w-0.5 bg-primary h-3"></div>
          </div>
        </div>
      </main>
      <div className="fixed top-12 left-12 z-20">
        <span className="text-2xl font-light italic text-[#DEE4E0] tracking-tighter opacity-20">
          STFU Brain
        </span>
      </div>
    </>
  );
}
