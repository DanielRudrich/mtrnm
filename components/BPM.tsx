import { sanitizeBPM } from "@/common/utils";
import { useBpm } from "@/context/BPMContext";
import { useEffect, useState } from "react";

export default function BPM() {
  const { bpm, setBpm } = useBpm();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (
        e.target &&
        e.target instanceof HTMLElement &&
        e.target.getAttribute("role") == "slider"
      )
        return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();

          if (e.metaKey || e.ctrlKey) {
            setBpm((prev) => sanitizeBPM(Math.round(prev * 1.1)));
          } else {
            const step = e.shiftKey ? 10 : 1;
            setBpm((prev) => sanitizeBPM(prev + step));
          }

          break;
        case "ArrowDown":
          e.preventDefault();

          if (e.metaKey || e.ctrlKey) {
            setBpm((prev) => sanitizeBPM(Math.round(prev / 1.1)));
          } else {
            const step = e.shiftKey ? 10 : 1;
            setBpm((prev) => sanitizeBPM(prev - step));
          }

          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-16 w-32 items-center justify-center text-7xl font-bold tracking-tighter text-gray-700">
      {editing ? (
        <input
          className="h-16 w-full rounded border-2 border-blue-400 bg-transparent  text-center text-5xl focus:outline-none"
          defaultValue={bpm}
          maxLength={3}
          type="tel"
          onChange={(e) => {
            const newBpm = parseInt(e.target.value);
            if (!isNaN(newBpm)) {
              setBpm(sanitizeBPM(newBpm));
            }
          }}
          onBlur={() => setEditing(false)}
          autoFocus
        />
      ) : (
        <div onClick={() => setEditing(true)} className="">
          {bpm}
        </div>
      )}
    </div>
  );
}
