import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, RotateCcw, Sparkles, Star } from "lucide-react";
import { useGame, computeTier, type ModuleId, type OutcomeTier } from "@/context/GameContext";

interface ModuleOutcomeProps {
  moduleId: ModuleId;
  moduleTitle: { en: string; hi: string };
  correct: number;
  total: number;
  character: string; // asset src
  badgeEmoji: string;
  themeColor: string; // oklch string
  onReplay: () => void;
  onContinue: () => void; // e.g. go to Eco-Basti update / home
  reflection?: { en: string; hi: string };
}

/**
 * Reusable behaviour-change outcome screen.
 * Decision -> Feedback -> Consequence -> Reflection -> Retry -> Reward.
 *
 * Renders Excellent / Good / Try Again based on correct-vs-total.
 * Awards Green Points, Eco-Basti health, and unlocks the badge only on Excellent.
 * Never punishes: on Poor, nothing is lost — the child is invited to try again.
 */
export function ModuleOutcome({
  moduleId,
  moduleTitle,
  correct,
  total,
  character,
  badgeEmoji,
  themeColor,
  onReplay,
  onContinue,
  reflection,
}: ModuleOutcomeProps) {
  const g = useGame();
  const tier: OutcomeTier = useMemo(() => computeTier(correct, total), [correct, total]);
  const submittedRef = useRef(false);
  const rewardRef = useRef<{ awardedPoints: number; awardedHealth: number; badgeUnlocked: boolean } | null>(null);

  if (!submittedRef.current) {
    submittedRef.current = true;
    rewardRef.current = g.submitModuleResult(moduleId, tier);
  }

  const t = g.lang === "en";
  const copy = {
    excellent: {
      title: t ? "Excellent Eco-Warrior!" : "उत्कृष्ट इको-योद्धा!",
      body: t
        ? "You made sustainable choices again and again. Eco-Basti is glowing because of you!"
        : "तुमने बार-बार टिकाऊ विकल्प चुने। तुम्हारी वजह से इको-बस्ती चमक रही है!",
      cta: t ? "See Eco-Basti bloom" : "इको-बस्ती को खिलते देखो",
      color: "oklch(0.55 0.19 135)",
      ring: "oklch(0.8 0.2 140)",
    },
    good: {
      title: t ? "Good Try!" : "अच्छा प्रयास!",
      body: t
        ? "You made several healthy choices — with a little more practice you can earn the badge. Play again to help Eco-Basti even more!"
        : "तुमने कई अच्छे विकल्प चुने — थोड़े और अभ्यास से तुम बैज पा सकते हो। इको-बस्ती की और मदद के लिए फिर खेलो!",
      cta: t ? "Try again for the badge" : "बैज के लिए फिर से खेलो",
      color: "oklch(0.6 0.18 75)",
      ring: "oklch(0.85 0.18 90)",
    },
    poor: {
      title: t ? "Let's Try Again" : "फिर से कोशिश करते हैं",
      body: t
        ? "Every friend of the Earth learns by trying. Think about the healthier choice for each question, and give it another go!"
        : "पृथ्वी का हर मित्र प्रयास से सीखता है। हर प्रश्न में सबसे टिकाऊ विकल्प सोचो और दोबारा कोशिश करो!",
      cta: t ? "Try again" : "फिर से कोशिश करो",
      color: "oklch(0.55 0.18 25)",
      ring: "oklch(0.85 0.14 25)",
    },
  }[tier];

  useEffect(() => {
    g.speak(copy.title + ". " + copy.body, copy.title + "। " + copy.body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reward = rewardRef.current;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-parchment relative p-6 md:p-8 text-center overflow-hidden">
        <img src={character} alt="" aria-hidden className="mx-auto h-32 md:h-44 animate-cheer" />
        <h2 className="text-2xl md:text-4xl mt-2" style={{ color: copy.color }}>{copy.title}</h2>
        <p className="mt-1 text-sm md:text-base font-semibold text-[oklch(0.45_0.09_55)]">
          {t ? moduleTitle.en : moduleTitle.hi} — {t ? "your score" : "तुम्हारा स्कोर"}: <b>{correct}/{total}</b> ({pct}%)
        </p>
        <p className="mt-3 text-base md:text-lg font-semibold">{copy.body}</p>

        {reflection && (
          <div className="mt-4 rounded-2xl border-2 border-dashed p-3 text-sm md:text-base"
               style={{ borderColor: copy.ring, background: "oklch(1 0 0 / .6)" }}>
            <span className="font-bold" style={{ color: copy.color }}>{t ? "Think about it: " : "सोचो: "}</span>
            {t ? reflection.en : reflection.hi}
          </div>
        )}

        {reward && (reward.awardedPoints > 0 || reward.awardedHealth > 0 || reward.badgeUnlocked) && (
          <div className="mt-5 flex flex-wrap justify-center items-center gap-3">
            {reward.awardedPoints > 0 && (
              <div className="card-parchment !p-2.5 flex items-center gap-2">
                <Star className="h-5 w-5 text-[oklch(0.6_0.2_75)] fill-[oklch(0.8_0.2_85)]" />
                <span className="font-bold">+{reward.awardedPoints} {t ? "Green Points" : "हरित अंक"}</span>
              </div>
            )}
            {reward.awardedHealth > 0 && (
              <div className="card-parchment !p-2.5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[oklch(0.55_0.24_20)]" />
                <span className="font-bold">+{reward.awardedHealth}% {t ? "Eco-Basti" : "इको-बस्ती"}</span>
              </div>
            )}
            {reward.badgeUnlocked && (
              <div className="inline-block animate-pop">
                <div className="relative mx-auto h-24 w-24 rounded-full border-4 flex items-center justify-center shadow-[0_6px_0_oklch(0.35_0.1_55)]"
                     style={{ borderColor: copy.ring, background: `linear-gradient(to bottom, ${copy.ring}, ${themeColor})` }}>
                  <div className="text-center text-white">
                    <div className="text-2xl">{badgeEmoji}</div>
                    <div className="text-[9px] font-extrabold mt-0.5" style={{ textShadow: "0 2px 0 rgba(0,0,0,.35)" }}>{t ? "BADGE" : "बैज"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {tier === "excellent" ? (
            <button onClick={onContinue} className="btn-playful">
              {copy.cta} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button onClick={onReplay} className="btn-playful">
                <RotateCcw className="h-4 w-4" /> {copy.cta}
              </button>
              <button onClick={onContinue} className="btn-playful-yellow">
                {t ? "Back to Eco-Basti" : "इको-बस्ती लौटो"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}