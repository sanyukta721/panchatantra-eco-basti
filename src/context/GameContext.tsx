import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ModuleId = "healthy-me" | "save-water" | "waste-warrior" | "nature-friends" | "healthy-community";

type Lang = "en" | "hi";
export type OutcomeTier = "excellent" | "good" | "poor";

const TIER_RANK: Record<OutcomeTier, number> = { poor: 1, good: 2, excellent: 3 };

export function computeTier(correct: number, total: number): OutcomeTier {
  if (total <= 0) return "poor";
  const pct = correct / total;
  if (pct >= 0.8) return "excellent";
  if (pct >= 0.5) return "good";
  return "poor";
}

interface GameState {
  greenPoints: number;
  health: number;
  unlocked: Record<ModuleId, boolean>;
  completed: Record<ModuleId, boolean>;
  tiers: Record<ModuleId, OutcomeTier | null>;
  lang: Lang;
  narrationOn: boolean;
  toggleLang: () => void;
  toggleNarration: () => void;
  submitModuleResult: (id: ModuleId, tier: OutcomeTier) => { awardedPoints: number; awardedHealth: number; badgeUnlocked: boolean; advanced: boolean };
  speak: (en: string, hi: string) => void;
}

const Ctx = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [greenPoints, setGreenPoints] = useState(0);
  const [health, setHealth] = useState(0);
  const [unlocked, setUnlocked] = useState<Record<ModuleId, boolean>>({
    "healthy-me": true,
    "save-water": false,
    "waste-warrior": false,
    "nature-friends": false,
    "healthy-community": false,
  });
  const [completed, setCompleted] = useState<Record<ModuleId, boolean>>({
    "healthy-me": false, "save-water": false, "waste-warrior": false, "nature-friends": false, "healthy-community": false,
  });
  const [tiers, setTiers] = useState<Record<ModuleId, OutcomeTier | null>>({
    "healthy-me": null, "save-water": null, "waste-warrior": null, "nature-friends": null, "healthy-community": null,
  });
  const [lang, setLang] = useState<Lang>("en");
  const [narrationOn, setNarrationOn] = useState(true);

  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "hi" : "en")), []);
  const toggleNarration = useCallback(() => setNarrationOn((n) => !n), []);

  const speak = useCallback((en: string, hi: string) => {
    if (!narrationOn) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(lang === "en" ? en : hi);
      u.lang = lang === "en" ? "en-IN" : "hi-IN";
      u.rate = 0.95;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    } catch {}
  }, [lang, narrationOn]);

  const submitModuleResult = useCallback((id: ModuleId, tier: OutcomeTier) => {
    const rewards: Record<OutcomeTier, { pts: number; h: number }> = {
      excellent: { pts: 20, h: 20 },
      good: { pts: 10, h: 8 },
      poor: { pts: 0, h: 0 },
    };
    let previousTier: OutcomeTier | null = null;
    let previouslyCompleted = false;
    setTiers((prev) => {
      previousTier = prev[id];
      const keep = previousTier && TIER_RANK[previousTier] >= TIER_RANK[tier];
      return keep ? prev : { ...prev, [id]: tier };
    });
    setCompleted((prev) => {
      previouslyCompleted = prev[id];
      return tier === "excellent" && !prev[id] ? { ...prev, [id]: true } : prev;
    });

    // Only award incremental delta: reward for the improvement over previous tier
    const prevReward = previousTier ? rewards[previousTier] : { pts: 0, h: 0 };
    const nowReward = rewards[tier];
    const deltaPts = Math.max(0, nowReward.pts - prevReward.pts);
    const deltaH = Math.max(0, nowReward.h - prevReward.h);
    if (deltaPts) setGreenPoints((p) => Math.min(100, p + deltaPts));
    if (deltaH) setHealth((v) => Math.min(100, v + deltaH));

    let advanced = false;
    if (tier === "excellent" || tier === "good") {
      setUnlocked((u) => {
        const order: ModuleId[] = ["healthy-me", "save-water", "waste-warrior", "nature-friends", "healthy-community"];
        const idx = order.indexOf(id);
        const next = order[idx + 1];
        if (next && !u[next]) { advanced = true; return { ...u, [next]: true }; }
        return u;
      });
    }
    return {
      awardedPoints: deltaPts,
      awardedHealth: deltaH,
      badgeUnlocked: tier === "excellent" && !previouslyCompleted,
      advanced,
    };
  }, []);

  return (
    <Ctx.Provider value={{ greenPoints, health, unlocked, completed, tiers, lang, narrationOn, toggleLang, toggleNarration, submitModuleResult, speak }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGame() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGame must be used within GameProvider");
  return v;
}

export function t(g: { lang: Lang }, en: string, hi: string) {
  return g.lang === "en" ? en : hi;
}