import { Button, buttonVariants } from "@/components/ui/button";
import { BreatheIcon, NoisyIcon, ResetIcon } from "@/components/ui/icons";
import { MenuIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Greetings from "./greetings";

export default function Dashboard() {
  return (
    <div className="p-12 flex flex-col gap-16">
      <div className="flex flex-col gap-2">
        <Greetings />
      </div>
      <div className="flex flex-col gap-8 mx-auto">
        <div className="flex gap-8">
          <div className="bg-white w-max overflow-hidden rounded-xl flex">
            <div className="flex flex-col p-10 justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-primary rounded-full" />
                  <p className="text-[#767C79] font-semibold">MIND STATE</p>
                </div>
                <h3 className="text-4xl font-light">Calm</h3>
                <p className="max-w-64.25 leading-6.5 text-[#767C79]">
                  Your thoughts are settled like dust after a gentle rain. A
                  perfect moment for deep creative work.
                </p>
              </div>
              <Button
                variant={"secondary"}
                className="font-medium text-[14px] w-min px-6 py-2"
              >
                Log Nuance
              </Button>
            </div>
            <img src={"/calm.png"} height={400} />
          </div>
          <div className="bg-[#DDEDFE4D] max-w-[288px] p-8 pb-28 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between">
              <NoisyIcon />
              <div className={buttonVariants({ variant: "secondary" })}>
                STATUS: NOISY
              </div>
            </div>
            <div className="py-4.25 flex flex-col gap-2">
              <h3 className="font-semibold text-xl">High Sensory Input</h3>
              <p className="text-[#4A5866CC]">
                You've logged 12 rapid entries today. Your mental bandwidth is
                reaching capacity.
              </p>
            </div>
            <div className="bg-white p-4 flex items-center gap-4 rounded-xl">
              <BreatheIcon />
              <div>
                <p className="text-[#52616F] font-bold text-[12px]">
                  RECOMMENDED
                </p>
                <p className="text-[#2E3432] font-medium text-[14px]">
                  Box Breathing (4m)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="col-span-12 lg:col-span-5 bg-[#F2F4F2] rounded-3xl p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-medium">Next in Declutter</h3>
              <HugeiconsIcon icon={MenuIcon} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between group cursor-pointer gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full border border-primary group-hover:bg-primary transition-colors"></div>
                  <span className="text-sm font-light">
                    Archive 'Project Phoenix' brainstorming
                  </span>
                </div>
                <span className="text-[10px] text-outline uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Archive
                </span>
              </div>
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full border border-primary group-hover:bg-primary transition-colors"></div>
                  <span className="text-sm font-light">
                    Refine 'Growth Strategy' scribbles
                  </span>
                </div>
                <span className="text-[10px] text-outline uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </span>
              </div>
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full border border-primary group-hover:bg-primary transition-colors"></div>
                  <span className="text-sm font-light">
                    Delete duplicate 'Meeting Notes'
                  </span>
                </div>
                <span className="text-[10px] text-outline uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Discard
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 bg-[#2E3432] text-white rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-light mb-6">
                "Simplicity is the ultimate sophistication."
              </h3>
              <p className="text-surface-variant/60 text-sm max-w-sm">
                — Leonardo da Vinci
              </p>
            </div>
            <div className="relative z-10 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-surface-variant/40">
                  Daily Focus
                </span>
                <span className="text-lg">Eliminate the Non-Essential</span>
              </div>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
              <img
                className="w-full h-full object-cover"
                data-alt="high-quality subtle concrete texture with fine grain and natural imperfections"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvYlZpf2ut7lOSFjxkkxxivBGGtKjp_yDyeX6ZS553b2YLjqRIg7nfgwSU1J-CwGiuY7BnC5wgxGUgp2htkJSOpTcmKjQqm_demOeAs0LXczhHWq57ys7OiDUAlJknBOE-Skqrz_eYXenF63RVZMyputNa5TIJ2yrHYknc9HPA-ZEjCijVpuMVaJJXWN3HWaruJa63FsEUFrQgw__yZx-TVfevyssZYgGO7cySVk32yNwrKgPytWxtnywf65-Y1-aqBr3vYpPibSo"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-12 flex flex-col items-center gap-8">
        <div className="w-32 h-px bg-[#ADB3B0]" />
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-[#767C79]">
            Feeling overwhelmed? Clear the slate for a fresh perspective.
          </p>
          <Button className="py-5 px-12 text-[18px] rounded-xl flex items-center gap-3">
            <ResetIcon />
            Begin Daily Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
