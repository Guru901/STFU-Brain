import { DumpsIcon } from "@/components/ui/icons";

export default function Dumps() {
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
        <div className="flex justify-between gap-8">
          <div className="max-w-2xl h-full bg-white p-10 flex flex-col gap-6 rounded-xl">
            <div>
              <p className="text-[16px] font-semibold text-primary">TODAY</p>
              <p className="text-[16px] font-semibold text-[#767C79]">
                October 24, 2023 • 10:14 AM
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold">
                The lingering anxiety about next Tuesday&apos;s project delivery
                and the weird dream about the giant cat.
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-[16px] text-[#767C79]">
              <p>
                It started with a small thought about the presentation slides.
                Then it spiraled into whether I had enough coffee beans for the
                morning. Why does the brain do this at 3 AM? The cat in the
                dream was wearing a tuxedo. I think it represents my boss, or
                maybe just a cat in a tuxedo.
              </p>
              <p>
                I&apos;m letting go of the need for perfection. The slides are
                90% there. That is enough. Peace is better than a perfect font
                choice.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="bg-[#F2F4F2] p-8 h-full flex flex-col gap-3 rounded-xl">
              <div>
                <p className="text-[16px] font-semibold text-primary">TODAY</p>
              </div>
              <div>
                <p className="font-bold text-lg">
                  Grocery list & existential dread
                </p>
              </div>
              <div className="flex flex-col gap-4 text-[16px] text-[#767C79]">
                <p>
                  Milk, eggs, flour. Why am I here? Are we all just cosmic dust
                  floating in a void? Also…
                </p>
              </div>
            </div>
            <div className="bg-[#F2F4F2] p-8 h-full flex flex-col gap-3 rounded-xl">
              <div>
                <p className="text-[16px] font-semibold text-primary">TODAY</p>
              </div>
              <div>
                <p className="font-bold text-lg">
                  Grocery list & existential dread
                </p>
              </div>
              <div className="flex flex-col gap-4 text-[16px] text-[#767C79]">
                <p>
                  Milk, eggs, flour. Why am I here? Are we all just cosmic dust
                  floating in a void? Also…
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold mb-2">Older entries</h3>
          <div className="w-full bg-white p-6 flex items-center justify-start gap-12 rounded-xl cursor-pointer">
            <p className="text-[#767676]">Oct 19</p>
            <div className="w-2 h-2 rounded-full bg-[#767676]"></div>
            <p className="font-semibold">
              Unnecessary guilt about not calling back immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
