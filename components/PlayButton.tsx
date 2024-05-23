import { useEffect, useRef } from "react";
import { BsFillPlayFill, BsStopFill } from "react-icons/bs";

export default function PlayButton({
  playing,
  togglePlaying,
}: {
  playing: boolean;
  togglePlaying: () => void;
}) {
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === " " && e.target !== button.current) {
        e.preventDefault();
        togglePlaying();
      }
    };

    window.addEventListener("keydown", keydown);

    return () => {
      window.removeEventListener("keydown", keydown);
    };
  }, [togglePlaying]);

  return (
    <button
      ref={button}
      className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 px-2 py-1 font-mono text-2xl text-gray-600 hover:bg-gray-300"
      onClick={togglePlaying}
    >
      {playing ? <BsStopFill /> : <BsFillPlayFill />}
    </button>
  );
}
