import { useGame } from "@/context/GameContext";
import { Heart, Star, Volume2, VolumeX, Settings, Languages, Home as HomeIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function TopHUD({ showHome = false }: { showHome?: boolean }) {
  const g = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 md:p-5">
      {/* Green Points */}
      <div className="pointer-events-auto card-parchment flex items-center gap-3 px-3 py-2 md:px-4 md:py-2.5 min-w-[180px] md:min-w-[240px]">
        <div className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-[oklch(0.9_0.17_90)] border-2 border-[oklch(0.35_0.1_55)]">
          <Star className="h-5 w-5 md:h-6 md:w-6 fill-[oklch(0.55_0.2_75)] text-[oklch(0.35_0.1_55)]" />
        </div>
        <div className="flex-1">
          <div className="text-xs md:text-sm font-bold leading-none">{g.lang === "en" ? "Green Points" : "हरित अंक"}</div>
          <div className="mt-1 h-2.5 md:h-3 w-full rounded-full bg-[oklch(0.85_0.08_80)] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[oklch(0.75_0.19_135)] to-[oklch(0.55_0.19_135)] transition-all" style={{ width: `${g.greenPoints}%` }} />
          </div>
          <div className="mt-0.5 text-[10px] md:text-xs font-semibold text-[oklch(0.45_0.09_55)]">{g.greenPoints}%</div>
        </div>
      </div>

      {/* Middle controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        {showHome && (
          <Link to="/home" aria-label="Home" className="btn-playful-yellow !px-3 !py-2"><HomeIcon className="h-5 w-5" /></Link>
        )}
        <button onClick={g.toggleLang} className="btn-playful-yellow !px-3 !py-2" aria-label="Toggle language">
          <Languages className="h-4 w-4" /> <span className="text-sm">{g.lang === "en" ? "EN" : "हिन्दी"}</span>
        </button>
        <button onClick={g.toggleNarration} className="btn-playful-yellow !px-3 !py-2" aria-label="Toggle narration">
          {g.narrationOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        <button onClick={() => setSettingsOpen((s) => !s)} className="btn-playful-yellow !px-3 !py-2" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </button>
        {settingsOpen && (
          <div className="absolute right-3 top-16 md:top-20 card-parchment w-64 p-4 text-sm animate-pop">
            <div className="font-bold mb-2">{g.lang === "en" ? "Settings" : "सेटिंग्स"}</div>
            <div className="flex items-center justify-between py-1"><span>{g.lang === "en" ? "Narration" : "वर्णन"}</span><button onClick={g.toggleNarration} className="btn-playful-yellow !px-2 !py-1 text-xs">{g.narrationOn ? "On" : "Off"}</button></div>
            <div className="flex items-center justify-between py-1"><span>{g.lang === "en" ? "Language" : "भाषा"}</span><button onClick={g.toggleLang} className="btn-playful-yellow !px-2 !py-1 text-xs">{g.lang === "en" ? "English" : "हिन्दी"}</button></div>
            <div className="mt-2 text-xs text-[oklch(0.45_0.09_55)]">{g.lang === "en" ? "Made with love for young eco-warriors." : "छोटे पर्यावरण-योद्धाओं के लिए।"}</div>
          </div>
        )}
      </div>

      {/* Eco-Basti Health */}
      <div className="pointer-events-auto card-parchment flex items-center gap-3 px-3 py-2 md:px-4 md:py-2.5 min-w-[180px] md:min-w-[240px]">
        <div className="flex-1 order-2">
          <div className="text-xs md:text-sm font-bold leading-none text-right">{g.lang === "en" ? "Eco-Basti Health" : "इको-बस्ती स्वास्थ्य"}</div>
          <div className="mt-1 h-2.5 md:h-3 w-full rounded-full bg-[oklch(0.85_0.08_80)] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[oklch(0.7_0.2_25)] to-[oklch(0.55_0.24_20)] transition-all" style={{ width: `${g.health}%` }} />
          </div>
          <div className="mt-0.5 text-[10px] md:text-xs font-semibold text-right text-[oklch(0.45_0.09_55)]">{g.health}%</div>
        </div>
        <div className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-[oklch(0.9_0.12_25)] border-2 border-[oklch(0.35_0.1_55)] order-3">
          <Heart className="h-5 w-5 md:h-6 md:w-6 fill-[oklch(0.55_0.24_20)] text-[oklch(0.35_0.1_55)]" />
        </div>
      </div>
    </div>
  );
}