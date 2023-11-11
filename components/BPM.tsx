import { clamp } from "@/common/utils";
import { useBpm } from "@/context/BPMContext";
import { useState } from "react";

export default function BPM() {
  const { bpm, setBpm } = useBpm();
  const [editing, setEditing] = useState(false);

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
              setBpm(clamp(newBpm, 30, 300));
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
