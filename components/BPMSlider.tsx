import { useBpm } from "@/context/BPMContext";

export default function BPMSlider() {
  const { bpm, setBpm } = useBpm();

  const sliderValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    setBpm(value);
  };

  return (
    <div className="flex items-center justify-center">
      <input
        className="w-60"
        type="range"
        min="30"
        max="300"
        step="0.01"
        value={bpm}
        onChange={sliderValueChanged}
      />
    </div>
  );
}
