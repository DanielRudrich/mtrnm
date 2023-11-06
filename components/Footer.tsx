import Link from "next/link";

export function Footer() {
  return (
    <div className="text-xs font-light text-slate-400">
      made by{" "}
      <Link
        className="font-bold hover:text-slate-500"
        href="https://danielrudrich.de"
      >
        Daniel Rudrich
      </Link>
      <span className="px-2 font-music text-xl">♫</span>
      checkout{" "}
      <Link
        className="font-bold hover:text-slate-500"
        href="https://github.com/DanielRudrich/mtrnm"
      >
        Source Code
      </Link>
    </div>
  );
}
