import { usePattern } from "@/context/PatternContext";
import { BarComponentButton } from "./BarComponent";
import { BarType } from "@/common/types";
import { PatternViewer } from "./PatternViewer";
import { FiDelete } from "react-icons/fi";
import { useEffect } from "react";

export function PatternInterface() {
  const { setPattern } = usePattern();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "1":
          setPattern((prev) => [...prev, "full"]);
          break;
        case "2":
          setPattern((prev) => [...prev, "backbeat"]);
          break;
        case "3":
          setPattern((prev) => [...prev, "silence"]);
          break;
        case "Backspace":
          setPattern((prev) => prev.slice(0, prev.length - 1));
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setPattern]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center justify-center space-x-1">
        {["full", "backbeat", "silence"].map((type) => (
          <button
            key={type}
            className=""
            onClick={() => {
              setPattern((prev) => [...prev, type as BarType]);
            }}
          >
            <BarComponentButton type={type as BarType} />
          </button>
        ))}

        <button
          className="rounded border border-gray-300 bg-gray-200 px-2 py-0.5 text-xl hover:bg-white"
          onClick={() => setPattern((prev) => prev.slice(0, prev.length - 1))}
        >
          <FiDelete />
        </button>
      </div>

      <PatternViewer />
    </div>
  );
}
