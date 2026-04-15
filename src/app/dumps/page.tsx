import { DumpsIcon } from "@/components/ui/icons";

export default function Dumps() {
  return (
    <div className="p-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-8xl font-light leading-32">
            Mental <br />
            <b className="font-bold!">Releases</b>
          </h1>
          <p className="text-xl font-light text-[#767676] pt-2">
            A digital graveyard for the noise you've successfully evicted from
            your mind.
          </p>
        </div>
        <DumpsIcon />
      </div>
    </div>
  );
}
