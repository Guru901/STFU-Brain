import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  BrainDumpHomeIcon,
  NoNotificationsIcon,
  ShutUpModeIcon,
} from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-between p-8 bg-[#FAFAF9CC]">
        <h1 className="font-bold text-xl text-[#022C22]">STFU Brain</h1>
        <Button className="px-6 py-5 text-[16px] rounded-lg">
          Begin journey
        </Button>
      </header>

      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30"
            data-alt="abstract soft mist flowing over calm water at dawn with ethereal light and muted sage tones"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxw6OcpzO_SB1mMHpeZm_ykf5JuhTCYx5sLEWQD6XkHkqKJTKucDjY8b97lqDbnHiFnKbbIBK6-t4YPtnTws05C2l0B1WTrZRCI7ovDg3Y__tW5Zf94XBZqmClkVD6O9zKiW43fBs9sMVbfGNtqhf6eYh1_IcRouBcUlW_KPYYg2dsbE9s1N9DnG07C9HowZNwblcHzrTIjlexYppYZB6aQzPo4ACqzhvAGtAkDu_EteznDB30oaVWCMMeGdHUfXHPqoMcHqlYDLo"
          />
          <div className="absolute inset-0 bg-linear-to-b from-surface/0 via-surface/60 to-surface"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-[0.9] mb-8 font-headline">
              Mute the Noise.
              <br />
              <span className="text-primary">Reclaim</span> Your Mind.
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed mb-12 max-w-xl">
              A digital sanctuary for the overstimulated. Transform mental chaos
              into curated clarity with intentional design.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button className="text-lg px-10 py-8 rounded-lg font-semibold">
                Begin Your Silence
              </Button>
              <Button
                variant={"ghost"}
                className="text-lg px-10 py-8 rounded-lg font-semibold"
              >
                Learn the Method
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-42 right-24 max-w-xs text-right">
          <span className="text-xs uppercase tracking-[0.3em] text-outline mb-4 block">
            Current State
          </span>
          <h3 className="text-4xl font-light italic text-on-surface/40 leading-tight">
            Focus on the space between thoughts.
          </h3>
        </div>
      </section>
      <section className="py-32 bg-[#F9F9F7]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <span className="text-primary font-semibold tracking-widest uppercase text-sm">
                The Modern Burden
              </span>
              <h2 className="text-5xl font-bold tracking-tight leading-tight">
                The Noisy Brain
              </h2>
              <div className="space-y-6 text-lg leading-relaxed max-w-140">
                <p>
                  We are living in an era of cognitive debt. Every notification,
                  every open tab, and every half-remembered task accumulates
                  like digital sediment in your mind.
                </p>
                <p>
                  Mental fatigue isn't just about being busy—it's the friction
                  of unorganized thought. When your brain is a junk drawer,
                  clarity becomes an impossible luxury.
                </p>
              </div>
            </div>
            <div className="relative h-150 bg-[#F9F9F7]-container-low rounded-xl overflow-hidden shadow-sm">
              <img
                className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply"
                data-alt="dramatic minimalist composition of gray clouds meeting dark ocean with high contrast and moody atmosphere"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVo-T-ngLjiyruVzZ10wBWoWv1f7k9Sx0hk9Atgz-zn0do4ajBwxF0TOoFa0mklbTrJnReqm0U_shKO_PlvA000OkseFbB41rz1fuop-ES0XOH8dnkMjGIU1MOqk-GW_7lHszfZKYZ7_272Ef0-HTg2jIybOFZBugbbyYJlDgwouyT2UCPW4ebZ4_Uk2ceVoEEPwpxpvLB5RJpCBRIIvbCyhcfmJ00hPI91ArW6u-GSTPWSVAZm13RCL0y351st1hz8g48nnOlrSU"
              />
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <div className="glass-effect bg-white/10 p-8 rounded-xl">
                  <p className="text-white text-2xl font-light italic">
                    "The average person has 6,000 thoughts per day. Most are
                    just noise."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32 bg-[#F2F4F2]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-display-md text-5xl font-bold tracking-tight mb-4">
              Functional Stillness
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
              Sophisticated tools designed to disappear, allowing your
              intentions to take center stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 p-12 rounded-xl bg-white">
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-4">
                  <BrainDumpHomeIcon />
                  <h3 className="text-3xl font-bold mb-4">Brain Dump</h3>
                  <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
                    A borderless, distraction-free canvas. No folders, no tags,
                    no friction. Just the pure extraction of thought to relieve
                    cognitive load instantly.
                  </p>
                </div>
                <Separator className="mt-12" />
                <div className="pt-12">
                  <div className="flex items-center gap-4 text-primary font-semibold">
                    <span>Experience Pure Capture</span>
                    <ArrowRightIcon size={16} />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 bg-primary text-white p-12 rounded-xl group overflow-hidden relative">
              <div className="relative z-10 flex flex-col gap-4">
                <NoNotificationsIcon />
                <h3 className="text-3xl font-bold mb-4">Shut Up Mode</h3>
                <p className="text-on-primary/80 text-lg leading-relaxed">
                  The radical focus protocol. One active thought, everything
                  else is shrouded in 95% opacity. Digital asceticism at its
                  finest.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 opacity-10">
                <ShutUpModeIcon />
              </div>
            </div>
            <div className="md:col-span-12 bg-[#DEE4E0] p-12 rounded-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#F9F9F7]-container-lowest p-6 rounded-lg shadow-sm">
                      <div className="text-primary font-bold mb-2">Tasks</div>
                      <div className="w-12 h-1 bg-primary mb-4"></div>
                      <div className="space-y-2 opacity-40">
                        <div className="h-2 bg-[#ADB3B0] rounded"></div>
                        <div className="h-2 bg-[#ADB3B0] rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="bg-[#F9F9F7]-container-lowest p-6 rounded-lg shadow-sm">
                      <div className="text-primary font-bold mb-2">Worries</div>
                      <div className="w-12 h-1 bg-primary mb-4"></div>
                      <div className="space-y-2 opacity-40">
                        <div className="h-2 bg-[#ADB3B0] rounded"></div>
                        <div className="h-2 bg-[#ADB3B0] rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="bg-[#F9F9F7]-container-lowest p-6 rounded-lg shadow-sm">
                      <div className="text-primary font-bold mb-2">
                        Thoughts
                      </div>
                      <div className="w-12 h-1 bg-primary mb-4"></div>
                      <div className="space-y-2 opacity-40">
                        <div className="h-2 bg-[#ADB3B0] rounded"></div>
                        <div className="h-2 bg-[#ADB3B0] rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 ">
                  <h3 className="text-3xl font-bold mb-4">
                    Linguistic Alchemy
                  </h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed">
                    Our proprietary AI doesn't just categorize; it deciphers
                    intent. It splits your brain dump into actionable tasks,
                    persistent worries, and fleeting reflections automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-40 bg-[#F9F9F7]">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-outline mb-12 block">
            The Philosophy
          </span>
          <blockquote className="text-4xl md:text-6xl font-light tracking-tight text-on-surface leading-tight mb-16">
            "Design as a Sanctuary. We believe that the tools you use shouldn't
            compete for your attention—they should protect it."
          </blockquote>
          <div className="flex flex-col items-center">
            <img
              className="w-20 h-20 rounded-full mb-6 object-cover grayscale"
              data-alt="portrait of an elegant minimalist designer in neutral tones with soft natural lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxDPXmS2tXdq2y3PflQXUAUOnHdLeu__vIfXpcHoTLuHhHg0FRZBCVrZJlHevp26e5v-8WuCL1XjON5HMoMte_tmtyq8X_9EwvOzzTOMvSi7UsHS60zxueHatAYgsJmo7YaLxsR4-13AaVuaBMTVe0AEnm3UYfkM-qatwImj38rS_wcjqjI-ZZ6KJqKtJGhK0G3CGxmtTB9E3kZ5YopBZDQpHNFH7RWERaHMsizpfTRqVXw8lO--C_4JTw_yn8fkWHUcZ6zgYQq5U"
            />
            <p className="font-bold text-lg">Elias Thorne</p>
            <p className="text-on-surface-variant">
              Chief of Intentionality, STFU Brain
            </p>
          </div>
        </div>
      </section>
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-[#F2F4F2] rounded-4xl p-16 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8">
                Start Your Digital Reset.
              </h2>
              <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">
                Join 50,000+ thinkers who have traded noise for clarity. The
                first step toward a quiet mind is simply beginning.
              </p>
              <Button className="text-lg px-10 py-8 rounded-lg font-semibold">
                Begin Your Silence
              </Button>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full mt-20 bg-stone-100 dark:bg-stone-900 tonal-transition-no-lines">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full border-t border-stone-200/20  mx-auto">
          <div className="mb-8 md:mb-0">
            <div className="text-lg font-semibold text-stone-800 dark:text-stone-200 font-headline mb-2">
              STFU Brain
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm tracking-wide font-manrope">
              © 2024 STFU Brain. Breathe deeply.
            </p>
          </div>
          <div className="flex gap-12"></div>
        </div>
      </footer>
    </div>
  );
}
