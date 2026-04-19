import Editor from "@/components/editor";
import { DividerIcon } from "@/components/ui/icons";

export default function Dump() {
  return (
    <div className="relative h-full p-24">
      <div className="flex flex-col gap-8">
        <div>
          <p className="inline text-[#2E3432] text-7xl font-extralight">
            What&apos;s
          </p>
          <p className="inline text-7xl text-[#4E635AB3] font-light">
            {" "}
            on your mind?
          </p>
        </div>
        <DividerIcon />
      </div>
      <Editor />
      <p className="text-9xl font-extrabold text-[#DEE4E0] leading-tight tracking-tight absolute bottom-0 left-5 pointer-events-none">
        BREATH.
      </p>
    </div>
  );
}
