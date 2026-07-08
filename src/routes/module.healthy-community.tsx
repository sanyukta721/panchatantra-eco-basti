import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopHUD } from "@/components/game/TopHUD";
import { useGame } from "@/context/GameContext";
import { ModuleOutcome } from "@/components/game/ModuleOutcome";
import dove from "@/assets/dove.png";
import deer from "@/assets/deer.png";
import crow from "@/assets/crow.png";
import mouse from "@/assets/mouse.png";
import tortoise from "@/assets/tortoise.png";
import villageBg from "@/assets/village-bg.jpg";
import skyBg from "@/assets/scene-sky.jpg";
import lakeBg from "@/assets/scene-lake.jpg";
import droughtBg from "@/assets/scene-drought.jpg";
import forestGroundBg from "@/assets/forest-ground.jpg";
import deerNetBg from "@/assets/deer-net.jpg";
import { ArrowLeft, ArrowRight, Check, Sparkles, Star, Trophy, X } from "lucide-react";

export const Route = createFileRoute("/module/healthy-community")({
  head: () => ({
    meta: [
      { title: "Healthy Community — The Four Friends and the Hunter" },
      { name: "description", content: "A Panchatantra tale that shows how teamwork and everyday sustainable habits keep a whole community healthy." },
    ],
  }),
  component: HealthyCommunity,
});

const THEME = "oklch(0.65 0.24 20)";
const RING = "oklch(0.88 0.14 25)";

type Phase = "story" | "brief" | "missions" | "outcome" | "finale";

function HealthyCommunity() {
  const [phase, setPhase] = useState<Phase>("story");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const restart = () => { setScore({ correct: 0, total: 0 }); setPhase("missions"); };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.95_0.04_25)]">
      <TopHUD showHome />
      <div className="pt-24 md:pt-28 pb-8 px-3 md:px-8">
        {phase === "story" && <StoryBook onDone={() => setPhase("brief")} />}
        {phase === "brief" && <DoveBrief onNext={() => setPhase("missions")} />}
        {phase === "missions" && (
          <MissionsActivity onDone={(c, t) => { setScore({ correct: c, total: t }); setPhase("outcome"); }} />
        )}
        {phase === "outcome" && (
          <ModuleOutcome
            moduleId="healthy-community"
            moduleTitle={{ en: "Healthy Community", hi: "स्वस्थ समुदाय" }}
            correct={score.correct}
            total={score.total}
            character={dove}
            badgeEmoji="🕊"
            themeColor={THEME}
            onReplay={restart}
            onContinue={() => setPhase("finale")}
            reflection={{
              en: "When every friend does a small sustainable act, the whole community becomes healthy — that is real teamwork.",
              hi: "जब हर मित्र एक छोटा-सा टिकाऊ काम करता है, तब पूरा समुदाय स्वस्थ बनता है — यही असली सहयोग है।",
            }}
          />
        )}
        {phase === "finale" && <Finale />}
      </div>
    </div>
  );
}

/* ---------------- Story: The Four Friends and the Hunter ---------------- */

interface Scene {
  bg: string;
  en: string;
  hi: string;
  characters: Array<{ src: string; className: string; style?: React.CSSProperties }>;
  extra?: React.ReactNode;
}

function StoryBook({ onDone }: { onDone: () => void }) {
  const g = useGame();
  const scenes: Scene[] = useMemo(() => [
    {
      bg: forestGroundBg,
      en: "Near Eco-Basti's lake lived four best friends — a wise Deer, a clever Crow, a tiny Mouse and a kind Tortoise. Every day they met to share stories and food.",
      hi: "इको-बस्ती के तालाब के पास चार पक्के मित्र रहते थे — बुद्धिमान हिरण, चतुर कौआ, नन्हा चूहा और दयालु कछुआ। हर दिन वे मिलकर कहानियाँ और भोजन बाँटते थे।",
      characters: [
        { src: deer, className: "absolute bottom-6 left-[10%] h-24 md:h-32 animate-floaty" },
        { src: crow, className: "absolute top-10 right-[18%] h-20 md:h-28 animate-fly" },
        { src: mouse, className: "absolute bottom-8 left-[42%] h-16 md:h-24 animate-walk" },
        { src: tortoise, className: "absolute bottom-6 right-[10%] h-20 md:h-28 animate-floaty" },
      ],
    },
    {
      bg: deerNetBg,
      en: "One morning, Deer did not come. The friends grew worried. Crow flew up high and saw Deer caught in a hunter's net near the forest edge!",
      hi: "एक सुबह हिरण नहीं आया। मित्र चिंतित हो गए। कौआ ऊँचा उड़ा और देखा — हिरण जंगल के किनारे शिकारी के जाल में फँसा है!",
      characters: [
        { src: crow, className: "absolute top-6 left-[25%] h-20 md:h-28 animate-fly" },
      ],
    },
    {
      bg: droughtBg,
      en: "‘Alone I cannot cut this net,’ said Crow. ‘But together we can!’ Mouse hurried on his tiny feet, ready to nibble every knot. Tortoise walked steadily behind.",
      hi: "‘अकेले मैं जाल नहीं काट सकता,’ कौआ बोला। ‘पर मिलकर हम कर सकते हैं!’ चूहा अपने नन्हे पैरों से दौड़ पड़ा — हर गाँठ कुतरने को तैयार। कछुआ पीछे-पीछे धीरे चला।",
      characters: [
        { src: mouse, className: "absolute bottom-6 left-[20%] h-20 md:h-28 animate-walk" },
        { src: tortoise, className: "absolute bottom-6 left-[45%] h-20 md:h-28 animate-floaty" },
        { src: crow, className: "absolute top-8 right-[20%] h-20 md:h-28 animate-fly" },
      ],
    },
    {
      bg: villageBg,
      en: "Mouse nibbled every knot and freed Deer. Just then the hunter arrived — but slow Tortoise was still there! The hunter grabbed him in a sack.",
      hi: "चूहे ने हर गाँठ कुतर दी और हिरण को छुड़ा लिया। तभी शिकारी आ पहुँचा — पर धीरे-चलने वाला कछुआ अभी वहीं था! शिकारी ने उसे थैले में पकड़ लिया।",
      characters: [
        { src: deer, className: "absolute bottom-6 left-[15%] h-24 md:h-32 animate-cheer" },
        { src: mouse, className: "absolute bottom-6 left-[42%] h-16 md:h-24 animate-walk" },
      ],
      extra: <span aria-hidden className="absolute bottom-6 right-[10%] text-6xl md:text-7xl animate-bob">🎒</span>,
    },
    {
      bg: skyBg,
      en: "‘Do not worry — teamwork will save Tortoise too!’ said Deer. Deer lay still, pretending to be hurt. The hunter dropped the sack and ran to catch Deer.",
      hi: "‘चिंता मत करो — सहयोग कछुए को भी बचाएगा!’ हिरण बोला। हिरण घायल होने का नाटक करके ज़मीन पर लेट गया। शिकारी थैला छोड़कर हिरण की ओर दौड़ पड़ा।",
      characters: [
        { src: deer, className: "absolute bottom-6 left-[30%] h-24 md:h-32 animate-bob" },
        { src: crow, className: "absolute top-6 left-[55%] h-20 md:h-28 animate-fly" },
      ],
    },
    {
      bg: lakeBg,
      en: "Quickly Mouse nibbled the sack open and freed Tortoise. Crow cawed, Deer sprang up, and all four friends escaped safely — together.",
      hi: "फुर्ती से चूहे ने थैला कुतरकर कछुए को छुड़ा लिया। कौआ काँव-काँव करने लगा, हिरण उछल पड़ा, और चारों मित्र मिलकर सुरक्षित निकल गए।",
      characters: [
        { src: deer, className: "absolute bottom-6 left-[10%] h-24 md:h-32 animate-cheer" },
        { src: crow, className: "absolute top-8 left-[35%] h-20 md:h-28 animate-fly" },
        { src: mouse, className: "absolute bottom-6 left-[55%] h-16 md:h-24 animate-walk" },
        { src: tortoise, className: "absolute bottom-6 right-[10%] h-20 md:h-28 animate-cheer" },
      ],
    },
    {
      bg: villageBg,
      en: "Moral: Every friend has a unique strength. When we join our strengths and help each other, no problem is too big to solve.",
      hi: "सीख: हर मित्र में एक ख़ास शक्ति होती है। जब हम अपनी शक्तियाँ मिलाते और एक-दूसरे की मदद करते हैं, तब कोई भी मुसीबत बड़ी नहीं रहती।",
      characters: [
        { src: dove, className: "absolute top-6 left-1/2 -translate-x-1/2 h-24 md:h-32 animate-fly" },
        { src: deer, className: "absolute bottom-4 left-[12%] h-20 md:h-28 animate-floaty" },
        { src: crow, className: "absolute bottom-8 left-[36%] h-16 md:h-24 animate-bob" },
        { src: mouse, className: "absolute bottom-6 left-[58%] h-14 md:h-20 animate-walk" },
        { src: tortoise, className: "absolute bottom-4 right-[12%] h-20 md:h-28 animate-floaty" },
      ],
    },
  ], []);

  const [i, setI] = useState(0);
  const scene = scenes[i];
  useEffect(() => { g.speak(scene.en, scene.hi); /* eslint-disable-next-line */ }, [i]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_10px_0_oklch(0.35_0.1_55),0_20px_40px_rgba(0,0,0,.35)]">
        <img key={i + "-bg"} src={scene.bg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover animate-pop" />
        {scene.extra}
        {scene.characters.map((c, idx) => (
          <img key={i + "-c-" + idx} src={c.src} alt="" aria-hidden className={c.className} style={c.style} />
        ))}
        <div className="absolute inset-x-3 md:inset-x-10 bottom-3 md:bottom-6">
          <div key={i + "-t"} className="card-parchment px-4 py-3 md:px-6 md:py-4 text-sm md:text-lg font-semibold animate-pop">
            {g.lang === "en" ? scene.en : scene.hi}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0} className="btn-playful-yellow disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> {g.lang === "en" ? "Back" : "पीछे"}</button>
        <div className="flex gap-1.5">
          {scenes.map((_, idx) => (
            <span key={idx} className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-[oklch(0.55_0.22_20)]" : "w-2.5 bg-white/70 border border-[oklch(0.55_0.11_60)]"}`} />
          ))}
        </div>
        {i < scenes.length - 1 ? (
          <button onClick={() => setI((x) => x + 1)} className="btn-playful">{g.lang === "en" ? "Next" : "आगे"} <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button onClick={onDone} className="btn-playful">{g.lang === "en" ? "Meet Dove" : "कबूतर से मिलो"} <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Dove Brief ---------------- */

function DoveBrief({ onNext }: { onNext: () => void }) {
  const g = useGame();
  useEffect(() => {
    g.speak(
      "You have already learnt many sustainable habits. When everyone practises them together, the whole community becomes healthier. Let's help Eco-Basti one last time!",
      "तुमने पहले ही कई टिकाऊ आदतें सीख ली हैं। जब हर कोई मिलकर उन्हें अपनाता है, तब पूरा समुदाय स्वस्थ बनता है। आओ, इको-बस्ती की एक आख़िरी मदद करें!"
    );
    // eslint-disable-next-line
  }, []);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card-parchment p-5 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={dove} alt="Dove" className="h-40 md:h-56 animate-fly drop-shadow-[0_10px_15px_rgba(0,0,0,.25)]" />
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl mb-3" style={{ color: THEME }}>
              {g.lang === "en" ? "A message from Dove" : "कबूतर का संदेश"}
            </h2>
            <div className="relative card-parchment p-4 md:p-5 text-base md:text-lg">
              {g.lang === "en"
                ? "You have already learnt many sustainable habits. When everyone practises them together, the whole community becomes healthier. Let's help Eco-Basti one last time!"
                : "तुमने पहले ही कई टिकाऊ आदतें सीख ली हैं। जब हर कोई मिलकर उन्हें अपनाता है, तब पूरा समुदाय स्वस्थ बनता है। आओ, इको-बस्ती की एक आख़िरी मदद करें!"}
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={onNext} className="btn-playful">{g.lang === "en" ? "Start Missions" : "मिशन शुरू करो"} <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Community Restoration Missions ---------------- */

interface Mission {
  icon: string;
  titleEn: string; titleHi: string;
  sceneEn: string; sceneHi: string;
  options: Array<{ en: string; hi: string; correct: boolean; feedbackEn: string; feedbackHi: string }>;
}

const MISSIONS: Mission[] = [
  {
    icon: "🧹",
    titleEn: "Keep Surroundings Clean", titleHi: "आसपास साफ़ रखो",
    sceneEn: "A house near the lane has litter scattered outside its gate.",
    sceneHi: "गली के एक घर के बाहर कचरा बिखरा हुआ है।",
    options: [
      { en: "Sweep it up and put it in the bin", hi: "झाड़ू लगाकर कूड़ेदान में डालो", correct: true, feedbackEn: "A clean street keeps flies, germs and smells away from every neighbour.", feedbackHi: "साफ़ गली मक्खी, कीटाणु और बदबू सबसे दूर रखती है।" },
      { en: "Ignore the litter — it's not my house", hi: "छोड़ दो — यह मेरा घर नहीं", correct: false, feedbackEn: "The community is our shared home. One kind sweep helps everyone stay healthy.", feedbackHi: "समुदाय हम सबका घर है। एक झाड़ू सबकी सेहत बचाती है।" },
    ],
  },
  {
    icon: "🐄",
    titleEn: "Protect Animals from Plastic", titleHi: "जानवरों को प्लास्टिक से बचाओ",
    sceneEn: "A cow and a bird are sniffing at discarded plastic bags in the lane.",
    sceneHi: "एक गाय और एक पक्षी गली में फेंकी प्लास्टिक थैलियाँ सूँघ रहे हैं।",
    options: [
      { en: "Pick up the plastic safely and drop it in a bin", hi: "प्लास्टिक सावधानी से उठाकर कूड़ेदान में डालो", correct: true, feedbackEn: "Animals often swallow plastic and fall ill. Removing it saves lives.", feedbackHi: "जानवर अक्सर प्लास्टिक निगल लेते हैं और बीमार पड़ते हैं। उसे हटाना जान बचाता है।" },
      { en: "Leave it — the animals will move away", hi: "छोड़ दो — जानवर हट जाएँगे", correct: false, feedbackEn: "Plastic stays for years and can choke animals. A small act protects them.", feedbackHi: "प्लास्टिक सालों रहता है और जानवरों का दम घोंट सकता है। छोटा-सा काम उन्हें बचाता है।" },
    ],
  },
  {
    icon: "🦟",
    titleEn: "Prevent Mosquito Breeding", titleHi: "मच्छरों को पनपने से रोको",
    sceneEn: "An old bucket in the courtyard is full of stagnant rainwater.",
    sceneHi: "आँगन में रखी पुरानी बाल्टी में बरसात का रुका हुआ पानी भरा है।",
    options: [
      { en: "Empty the bucket and cover it", hi: "बाल्टी खाली करके ढक दो", correct: true, feedbackEn: "Mosquitoes breed in still water. Emptying and covering stops dengue and malaria.", feedbackHi: "मच्छर रुके पानी में पनपते हैं। खाली करना और ढकना डेंगू-मलेरिया रोकता है।" },
      { en: "Leave it — it will dry on its own", hi: "छोड़ दो — अपने आप सूख जाएगा", correct: false, feedbackEn: "By then hundreds of mosquitoes may hatch. Empty it today itself.", feedbackHi: "तब तक सैकड़ों मच्छर पैदा हो सकते हैं। आज ही खाली कर दो।" },
    ],
  },
  {
    icon: "🌱",
    titleEn: "Care for Existing Plants", titleHi: "पौधों की देखभाल करो",
    sceneEn: "A neem sapling near the wall is drooping in the afternoon heat.",
    sceneHi: "दीवार के पास लगा नीम का पौधा दोपहर की गर्मी में मुरझा रहा है।",
    options: [
      { en: "Water it with the rinse water saved from washing vegetables", hi: "सब्ज़ी धोने के बचे पानी से सींच दो", correct: true, feedbackEn: "Reused household water gives the plant life without wasting fresh water.", feedbackHi: "घर का दोबारा उपयोग किया पानी पौधे को जीवन देता है और ताज़ा पानी भी बचता है।" },
      { en: "Walk past — someone else will water it", hi: "आगे बढ़ जाओ — कोई और सींच देगा", correct: false, feedbackEn: "If everyone waits, the plant dies. A small mug of reused water saves it now.", feedbackHi: "अगर सब इंतज़ार करेंगे, पौधा सूख जाएगा। एक मग बचा हुआ पानी अभी उसे बचा लेगा।" },
    ],
  },
  {
    icon: "🗣️",
    titleEn: "Become a Green Ambassador", titleHi: "हरित दूत बनो",
    sceneEn: "A friend tears open a chocolate and throws the wrapper on the ground.",
    sceneHi: "एक दोस्त चॉकलेट खोलकर उसका रैपर ज़मीन पर फेंक देता है।",
    options: [
      { en: "Kindly ask them to pick it up and use the bin", hi: "प्यार से कहो कि उठाकर कूड़ेदान में डाल दे", correct: true, feedbackEn: "A gentle reminder teaches your friend and keeps Eco-Basti clean.", feedbackHi: "प्यार भरी याद दिलाना दोस्त को भी सिखाता है और इको-बस्ती साफ़ रखता है।" },
      { en: "Say nothing — it's just one wrapper", hi: "कुछ मत कहो — एक ही तो रैपर है", correct: false, feedbackEn: "One wrapper becomes many when no one speaks up. Be a friend to the Earth.", feedbackHi: "जब कोई नहीं बोलता, एक रैपर कई बन जाते हैं। पृथ्वी के मित्र बनो।" },
    ],
  },
];

function MissionsActivity({ onDone }: { onDone: (correct: number, total: number) => void }) {
  const g = useGame();
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const m = MISSIONS[i];
  useEffect(() => { g.speak(m.sceneEn, m.sceneHi); /* eslint-disable-next-line */ }, [i]);

  const pick = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    if (m.options[idx].correct) setCorrectCount((c) => c + 1);
  };
  const next = () => {
    if (i < MISSIONS.length - 1) { setI(i + 1); setChosen(null); }
    else onDone(correctCount, MISSIONS.length);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>{g.lang === "en" ? "Community Restoration Challenge" : "समुदाय पुनर्जीवन चुनौती"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">{g.lang === "en" ? `Mission ${i + 1} of ${MISSIONS.length}` : `मिशन ${i + 1} / ${MISSIONS.length}`}</p>
      </div>

      <div className="card-parchment p-5 md:p-7 relative">
        <div className="flex items-start gap-4">
          <img src={dove} alt="Dove" className="hidden md:block h-24 animate-fly" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl md:text-5xl" aria-hidden>{m.icon}</span>
              <h3 className="text-lg md:text-2xl font-extrabold" style={{ color: THEME }}>{g.lang === "en" ? m.titleEn : m.titleHi}</h3>
            </div>
            <p className="text-base md:text-lg font-semibold mb-4">{g.lang === "en" ? m.sceneEn : m.sceneHi}</p>
            <div className="grid gap-3">
              {m.options.map((opt, idx) => {
                const state = chosen === null ? "idle" : opt.correct ? "correct" : chosen === idx ? "wrong" : "muted";
                return (
                  <button
                    key={idx}
                    onClick={() => pick(idx)}
                    className={`text-left px-4 py-3 md:px-5 md:py-4 rounded-2xl border-4 font-semibold transition-all
                      ${state === "idle" ? "bg-white border-[oklch(0.55_0.11_60)] hover:-translate-y-0.5 hover:bg-[oklch(0.97_0.05_25)]" : ""}
                      ${state === "correct" ? "bg-[oklch(0.93_0.09_140)] border-[oklch(0.5_0.18_140)]" : ""}
                      ${state === "wrong" ? "bg-[oklch(0.9_0.14_25)] border-[oklch(0.55_0.24_20)]" : ""}
                      ${state === "muted" ? "bg-white/60 border-[oklch(0.85_0.08_80)] opacity-70" : ""}
                    `}
                  >
                    <span className="inline-flex items-center gap-2">
                      {state === "correct" && <Check className="h-5 w-5 text-[oklch(0.5_0.18_140)]" />}
                      {state === "wrong" && <X className="h-5 w-5 text-[oklch(0.55_0.24_20)]" />}
                      {g.lang === "en" ? opt.en : opt.hi}
                    </span>
                  </button>
                );
              })}
            </div>

            {chosen !== null && (
              <div className={`mt-4 p-3 rounded-xl text-sm md:text-base font-semibold ${m.options[chosen].correct ? "bg-[oklch(0.95_0.08_140)] text-[oklch(0.3_0.15_140)]" : "bg-[oklch(0.95_0.08_25)] text-[oklch(0.4_0.2_25)]"}`}>
                {g.lang === "en" ? m.options[chosen].feedbackEn : m.options[chosen].feedbackHi}
              </div>
            )}

            <div className="mt-5 flex justify-between items-center">
              <div className="text-xs md:text-sm text-[oklch(0.45_0.09_55)] inline-flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-[oklch(0.55_0.22_20)]" /> {g.lang === "en" ? "Missions cleared:" : "पूरे मिशन:"} <b>{correctCount}</b>
              </div>
              <button onClick={next} disabled={chosen === null} className="btn-playful disabled:opacity-40">
                {i < MISSIONS.length - 1 ? (g.lang === "en" ? "Next Mission" : "अगला मिशन") : (g.lang === "en" ? "See Results" : "परिणाम देखो")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Grand Finale ---------------- */

function Finale() {
  const g = useGame();
  const nav = useNavigate();
  const t = g.lang === "en";
  const [stage, setStage] = useState(0); // 0=transforming, 1=celebration

  useEffect(() => {
    g.speak(
      "Watch Eco-Basti bloom! Flowers, trees, rivers and birds — everything comes alive because of your sustainable choices.",
      "देखो इको-बस्ती कैसे खिल रही है! फूल, पेड़, नदी और पक्षी — सब तुम्हारे टिकाऊ निर्णयों से जीवित हो उठे हैं।"
    );
    const to = setTimeout(() => {
      setStage(1);
      g.speak(
        "Congratulations! You have completed all Panchatantra Eco-Basti missions. Your sustainable choices have helped restore Eco-Basti. Remember, every small action creates a big change when everyone works together.",
        "बधाई हो! तुमने पंचतंत्र इको-बस्ती के सभी मिशन पूरे कर लिए हैं। तुम्हारे टिकाऊ निर्णयों ने इको-बस्ती को फिर से हरा-भरा कर दिया है। याद रखो, जब सब मिलकर काम करते हैं, तब छोटा-सा काम भी बड़ा बदलाव लाता है।"
      );
    }, 4200);
    return () => clearTimeout(to);
    // eslint-disable-next-line
  }, []);

  const badges: Array<{ id: string; emoji: string; en: string; hi: string }> = [
    { id: "healthy-me", emoji: "🌱", en: "Healthy Me", hi: "स्वस्थ मैं" },
    { id: "save-water", emoji: "💧", en: "Save Water", hi: "जल बचाओ" },
    { id: "waste-warrior", emoji: "♻️", en: "Waste Warrior", hi: "कचरा योद्धा" },
    { id: "nature-friends", emoji: "🌿", en: "Nature Friends", hi: "प्रकृति मित्र" },
    { id: "healthy-community", emoji: "🕊", en: "Healthy Community", hi: "स्वस्थ समुदाय" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {stage === 0 ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_10px_0_oklch(0.35_0.1_55)]">
          <img src={villageBg} alt="Eco-Basti" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.95_0.08_210)]/40 to-transparent animate-fade-in" />
          {/* blooming flowers */}
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={"f" + i} aria-hidden className="absolute text-2xl md:text-3xl animate-pop"
                  style={{
                    bottom: `${8 + ((i * 17) % 40)}%`,
                    left: `${4 + ((i * 41) % 92)}%`,
                    animationDelay: `${i * 0.15}s`,
                  }}>
              {["🌸", "🌼", "🌺", "🌻", "🌷"][i % 5]}
            </span>
          ))}
          {/* butterflies & birds */}
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={"b" + i} aria-hidden className="absolute text-2xl md:text-3xl animate-fly"
                  style={{ top: `${8 + i * 9}%`, left: `${10 + i * 17}%`, animationDelay: `${-i * 0.4}s` }}>
              {i % 2 === 0 ? "🦋" : "🐦"}
            </span>
          ))}
          {/* trees getting greener */}
          <div className="absolute bottom-4 left-4 text-5xl md:text-6xl animate-floaty" aria-hidden>🌳</div>
          <div className="absolute bottom-4 right-6 text-5xl md:text-6xl animate-floaty" style={{ animationDelay: "-0.6s" }} aria-hidden>🌳</div>
          <div className="absolute bottom-6 left-1/3 text-4xl md:text-5xl animate-floaty" style={{ animationDelay: "-1s" }} aria-hidden>🌲</div>

          <div className="absolute inset-x-4 bottom-4">
            <div className="card-parchment px-4 py-3 text-center font-semibold animate-pop">
              {t ? "Eco-Basti is blooming because of you…" : "इको-बस्ती तुम्हारी वजह से खिल रही है…"}
            </div>
          </div>
        </div>
      ) : (
        <div className="card-parchment relative p-6 md:p-8 text-center overflow-hidden animate-pop">
          {/* mascots together */}
          <div className="relative h-40 md:h-56">
            <img src={tortoise} alt="Tortoise" className="absolute bottom-0 left-[6%] h-24 md:h-40 animate-floaty" />
            <img src={crow} alt="Crow" className="absolute top-0 left-[28%] h-24 md:h-36 animate-fly" />
            <img src={mouse} alt="Mouse" className="absolute bottom-0 left-[46%] h-20 md:h-32 animate-walk" />
            <img src={deer} alt="Deer" className="absolute bottom-0 right-[26%] h-24 md:h-40 animate-cheer" />
            <img src={dove} alt="Dove" className="absolute top-0 right-[6%] h-24 md:h-36 animate-fly" style={{ animationDelay: "-0.4s" }} />
          </div>

          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border-4 animate-pop"
               style={{ borderColor: RING, background: `linear-gradient(to bottom, ${RING}, ${THEME})`, color: "white", textShadow: "0 2px 0 rgba(0,0,0,.35)" }}>
            <Trophy className="h-5 w-5" />
            <span className="font-extrabold">{t ? "Panchatantra Green Champion" : "पंचतंत्र हरित चैंपियन"}</span>
          </div>

          <h2 className="text-2xl md:text-4xl mt-3" style={{ color: THEME }}>
            {t ? "Congratulations, Eco-Warrior!" : "बधाई हो, इको-योद्धा!"}
          </h2>
          <p className="mt-3 text-sm md:text-lg font-semibold max-w-2xl mx-auto">
            {t
              ? "You have completed all Panchatantra Eco-Basti missions. Your sustainable choices have helped restore Eco-Basti. Remember, every small action creates a big change when everyone works together."
              : "तुमने पंचतंत्र इको-बस्ती के सभी मिशन पूरे कर लिए हैं। तुम्हारे टिकाऊ निर्णयों ने इको-बस्ती को फिर से हरा-भरा कर दिया है। याद रखो, जब सब मिलकर काम करते हैं, तब छोटा-सा काम भी बड़ा बदलाव लाता है।"}
          </p>

          {/* Badges row */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {badges.map((b) => {
              const earned = g.completed[b.id as keyof typeof g.completed];
              return (
                <div key={b.id} className={`card-parchment !p-3 flex flex-col items-center min-w-[92px] ${earned ? "" : "opacity-50"}`}>
                  <div className="h-14 w-14 rounded-full border-4 flex items-center justify-center text-2xl"
                       style={{ borderColor: RING, background: earned ? `linear-gradient(to bottom, ${RING}, ${THEME})` : "oklch(0.9 0.02 60)" }}>
                    <span aria-hidden>{b.emoji}</span>
                  </div>
                  <div className="mt-1 text-xs font-extrabold text-[oklch(0.35_0.1_55)]">{t ? b.en : b.hi}</div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
            <div className="card-parchment !p-2.5 flex items-center gap-2">
              <Star className="h-5 w-5 text-[oklch(0.6_0.2_75)] fill-[oklch(0.8_0.2_85)]" />
              <span className="font-bold">{g.greenPoints} {t ? "Green Points" : "हरित अंक"}</span>
            </div>
            <div className="card-parchment !p-2.5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[oklch(0.55_0.24_20)]" />
              <span className="font-bold">{t ? "Eco-Basti Health:" : "इको-बस्ती स्वास्थ्य:"} {Math.max(g.health, 100)}%</span>
            </div>
            <div className="card-parchment !p-2.5 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[oklch(0.5_0.2_140)]" />
              <span className="font-bold">{t ? "Journey Completed" : "यात्रा पूर्ण"}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => nav({ to: "/home" })} className="btn-playful">
              {t ? "Explore Eco-Basti" : "इको-बस्ती घूमो"} <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => window.location.reload()} className="btn-playful-yellow">
              {t ? "Play Again" : "फिर से खेलो"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}