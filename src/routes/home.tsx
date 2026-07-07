import { createFileRoute, Link } from "@tanstack/react-router";
import { TopHUD } from "@/components/game/TopHUD";
import { useGame, type ModuleId, type OutcomeTier } from "@/context/GameContext";
import villageBg from "@/assets/village-bg.jpg";
import tortoise from "@/assets/tortoise.png";
import crow from "@/assets/crow.png";
import mouse from "@/assets/mouse.png";
import deer from "@/assets/deer.png";
import dove from "@/assets/dove.png";
import { Lock, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Eco-Basti — Home Map" }, { name: "description", content: "Explore Eco-Basti and start your sustainable adventure." }] }),
  component: HomeMap,
});

interface Node {
  id: ModuleId;
  character: string;
  name: { en: string; hi: string };
  color: string;
  pos: { top: string; left: string };
  charPos: { top: string; left: string };
  anim: string;
  route?: string;
}

const NODES: Node[] = [
  { id: "healthy-me", character: tortoise, name: { en: "Healthy Me", hi: "स्वस्थ मैं" }, color: "oklch(0.65 0.19 145)", pos: { top: "18%", left: "70%" }, charPos: { top: "6%", left: "76%" }, anim: "animate-floaty", route: "/module/healthy-me" },
  { id: "save-water", character: crow, name: { en: "Save Water", hi: "जल बचाओ" }, color: "oklch(0.65 0.18 235)", pos: { top: "34%", left: "20%" }, charPos: { top: "18%", left: "6%" }, anim: "animate-fly", route: "/module/save-water" },
    { id: "waste-warrior", character: mouse, name: { en: "Waste Warrior", hi: "कचरा योद्धा" }, color: "oklch(0.55 0.22 300)", pos: { top: "68%", left: "18%" }, charPos: { top: "58%", left: "6%" }, anim: "animate-walk", route: "/module/waste-warrior" },
  { id: "nature-friends", character: deer, name: { en: "Nature Friends", hi: "प्रकृति मित्र" }, color: "oklch(0.7 0.18 195)", pos: { top: "72%", left: "48%" }, charPos: { top: "56%", left: "44%" }, anim: "animate-floaty", route: "/module/nature-friends" },
  { id: "healthy-community", character: dove, name: { en: "Healthy Community", hi: "स्वस्थ समुदाय" }, color: "oklch(0.65 0.24 20)", pos: { top: "62%", left: "78%" }, charPos: { top: "48%", left: "82%" }, anim: "animate-fly" },
];

function HomeMap() {
  const g = useGame();
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <img src={villageBg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

      {/* drifting clouds */}
      <div aria-hidden className="pointer-events-none absolute top-6 left-0 right-0 h-16 opacity-70">
        <div className="absolute top-2 h-10 w-24 rounded-full bg-white/80 blur-[1px] animate-drift-slow" />
        <div className="absolute top-8 h-8 w-20 rounded-full bg-white/70 blur-[1px] animate-drift-slow" style={{ animationDuration: "60s", animationDelay: "-15s" }} />
      </div>

      <TopHUD />

      <BastiVitality tiers={g.tiers} />

      {/* Module nodes */}
      {NODES.map((n) => {
        const unlocked = g.unlocked[n.id];
        const done = g.completed[n.id];
        return (
          <div key={n.id} className="absolute z-10" style={{ top: n.pos.top, left: n.pos.left, transform: "translate(-50%, -50%)" }}>
            <ModuleCard node={n} unlocked={unlocked} done={done} lang={g.lang} />
          </div>
        );
      })}

      {/* Characters always visible next to their module */}
      {NODES.map((n) => (
        <img
          key={n.id + "-char"}
          src={n.character}
          alt=""
          aria-hidden
          className={`absolute z-10 h-24 md:h-36 drop-shadow-[0_10px_15px_rgba(0,0,0,.35)] ${n.anim}`}
          style={{ top: n.charPos.top, left: n.charPos.left }}
          loading="lazy"
        />
      ))}

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        <button className="btn-playful-yellow" aria-label="Trophies"><Trophy className="h-5 w-5" /> <span className="text-sm">{g.lang === "en" ? "Badges" : "बैज"}</span></button>
        <button className="btn-playful-yellow" aria-label="Achievements"><Sparkles className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

/** Overlays flowers, greenery and happy critters that scale with the child's
 * cumulative sustainable behaviour across modules. Poor performance never
 * damages the village — it simply doesn't add improvements yet. */
function BastiVitality({ tiers }: { tiers: Record<ModuleId, OutcomeTier | null> }) {
  const score = Object.values(tiers).reduce((acc, t) => acc + (t === "excellent" ? 2 : t === "good" ? 1 : 0), 0);
  if (score === 0) return null;
  const flowers = Math.min(score * 3, 12);
  const spots = Array.from({ length: flowers }).map((_, i) => ({
    top: `${55 + ((i * 37) % 40)}%`,
    left: `${5 + ((i * 53) % 90)}%`,
    color: ["#f472b6", "#fbbf24", "#a3e635", "#f87171", "#c084fc"][i % 5],
    delay: `${(i % 6) * -0.4}s`,
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
      {spots.map((s, i) => (
        <span key={i} className="absolute h-3 w-3 rounded-full animate-floaty shadow-md"
              style={{ top: s.top, left: s.left, backgroundColor: s.color, animationDelay: s.delay }} />
      ))}
      {score >= 4 && (
        <div className="absolute top-10 left-[15%] h-6 w-6 rounded-full bg-white/90 blur-[1px] animate-drift-slow" />
      )}
    </div>
  );
}

function ModuleCard({ node, unlocked, done, lang }: { node: Node; unlocked: boolean; done: boolean; lang: "en" | "hi" }) {
  const content = (
    <div className={`card-parchment px-4 py-2 md:px-5 md:py-3 flex items-center gap-2 min-w-[140px] md:min-w-[170px] ${unlocked ? "hover:-translate-y-1 transition-transform" : "opacity-90"}`}>
      <div className="flex-1 text-center">
        <div className="font-extrabold text-sm md:text-base leading-tight" style={{ color: node.color }}>{lang === "en" ? node.name.en : node.name.hi}</div>
        {done && <div className="text-[10px] font-bold text-[oklch(0.55_0.19_135)]">✓ {lang === "en" ? "Completed" : "पूर्ण"}</div>}
      </div>
      {!unlocked && <Lock className="h-4 w-4 text-[oklch(0.45_0.09_55)]" aria-hidden />}
    </div>
  );
  if (unlocked && node.route) {
    return <Link to={node.route as "/module/healthy-me" | "/module/save-water" | "/module/waste-warrior" | "/module/nature-friends"}>{content}</Link>;
  }
  return <div aria-disabled>{content}</div>;
}