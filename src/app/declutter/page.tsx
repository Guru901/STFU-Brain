import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRightIcon, WorryIcon } from "@/components/ui/icons";

export default function Declutter() {
  return (
    <div className="p-12 h-full flex flex-col gap-16 bg-[#F9F9F7CC]">
      <p className="text-9xl font-extrabold text-[#DEE4E0] leading-tight tracking-tight absolute bottom-0 right-5 pointer-events-none">
        FOCUS.
      </p>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light">Mental Declutter</h1>
        <h2 className="text-[#767C79]">
          Organize the noise into actionable steps, passing thoughts, and things
          to let go.{" "}
        </h2>
      </div>
      <div className="flex gap-12 w-full max-w-6xl mx-auto">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full pb-8">
            <p className="font-semibold">TASKS</p>
            <p className="bg-[#D1E8DD] text-primary rounded-full px-2 text-[10px]">
              8 Pending
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="p-5 bg-[#F2F4F2] flex gap-4 items-center">
              <Checkbox />
              <div className="flex flex-col gap-2">
                <p>Finalize the sanctuary moodboard for the new project</p>
                <div
                  className={buttonVariants({
                    variant: "destructive",
                    className: "w-max px-2 py-1",
                  })}
                >
                  High Priority
                </div>
              </div>
            </div>
            <div className="p-5 bg-[#F2F4F2] flex gap-4 items-center">
              <Checkbox />
              <div className="flex flex-col">
                <p>Finalize the sanctuary moodboard for the new project</p>
                <div
                  className={buttonVariants({
                    variant: "destructive",
                    className: "w-max px-2 py-1",
                  })}
                >
                  High Priority
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full pb-8">
            <p className="font-semibold">RANDOM THOUGHTS</p>
            <p className="font-bold text-[#767C79] text-[24px]">+</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="p-5 bg-[#FFFFFF] flex flex-col gap-4 rounded-xl relative">
              <div className="w-0.5 h-2/3 absolute left-0 bg-muted-foreground" />
              <p>
                I need to drink more water during the deep work sessions.
                Headaches are becoming a pattern.
              </p>
              <div className="flex gap-2 items-center text-[#4E635A]">
                <p className="font-bold">Convert</p>{" "}
                <ArrowRightIcon size={10} />
              </div>
            </div>
            <div className="p-5 bg-[#FFFFFF] flex flex-col gap-4 rounded-xl relative">
              <div className="w-0.5 h-2/3 absolute left-0 bg-muted-foreground" />
              <p>
                I need to drink more water during the deep work sessions.
                Headaches are becoming a pattern.
              </p>
              <div className="flex gap-2 items-center text-[#4E635A]">
                <p className="font-bold">Convert</p>{" "}
                <ArrowRightIcon size={10} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full pb-8">
            <p className="font-semibold">WORRIES</p>
            <WorryIcon />
          </div>
          <div className="flex flex-col gap-6">
            <div className="p-8 bg-linear-to-r from-[#FFFFFF] to-[#F2F4F2] flex gap-4 items-center rounded-t-4xl rounded-br-4xl rounded-bl-xl">
              <p>
                Am I falling behind on the aesthetic trends of 2024? Everything
                feels too fast right now.
              </p>
            </div>
            <div className="p-8 bg-linear-to-r from-[#FFFFFF] to-[#F2F4F2] flex gap-4 items-center rounded-tl-2xl rounded-tr-[48px] rounded-b-4xl">
              <p>
                Am I falling behind on the aesthetic trends of 2024? Everything
                feels too fast right now.
              </p>
            </div>
            <div className="p-8 bg-linear-to-r from-[#FFFFFF] to-[#F2F4F2] flex gap-4 items-center rounded-l-[48px] rounded-r-2xl">
              <p>
                Am I falling behind on the aesthetic trends of 2024? Everything
                feels too fast right now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
