import { useBpm } from "@/context/BPMContext";

import * as Slider from "@radix-ui/react-slider";

export default function BPMSlider() {
  const { bpm, setBpm } = useBpm();

  const sliderValueChanged = (values: number[]) => {
    setBpm(values[0]);
  };

  return (
    <div className="flex items-center justify-center">
      <Slider.Root
        min={30}
        max={300}
        step={1}
        defaultValue={[bpm]}
        value={[bpm]}
        onValueChange={sliderValueChanged}
        className="relative flex h-4 w-60 select-none items-center"
      >
        <Slider.Track className="h-1 w-full rounded-full bg-gray-300">
          <Slider.Range className="absolute h-1 rounded-full bg-gray-400" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full bg-gray-700 shadow ring-gray-700/40 focus:outline-none focus:ring-4" />
      </Slider.Root>
    </div>
  );
}
