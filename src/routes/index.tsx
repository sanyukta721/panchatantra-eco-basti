import { createFileRoute, Link } from "@tanstack/react-router";
import splashAsset from "@/assets/splash.png.asset.json";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.85_0.09_235)]">
      <img
        src="/splash.png"
        alt="Panchatantra Eco-Basti"
        className="absolute inset-0 h-full w-full object-cover object-center select-none"
        draggable={false}
      />
      {/* Interactive Start Adventure button positioned over the green button in the artwork */}
      <div className="absolute inset-0 flex items-end justify-center pb-[6vh]">
        <Link
          to="/home"
          aria-label="Start Adventure"
          className="group relative block"
          style={{ width: "min(38vw, 460px)", aspectRatio: "3 / 1.4" }}
        >
          {/* Transparent overlay preserves the artwork's own Start Adventure button while making it clickable */}
          <span className="absolute inset-0 rounded-full transition-transform group-hover:scale-105 group-active:scale-95" />
          {/* Subtle pulsing ring to indicate tappability */}
          <span className="absolute inset-2 rounded-full ring-4 ring-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
      {/* Small caption on mobile: hint to tap */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[oklch(0.99_0.01_100)]/90 text-xs md:text-sm font-semibold tracking-wide drop-shadow animate-floaty">
        Tap “Start Adventure”
      </div>
    </div>
  );
}