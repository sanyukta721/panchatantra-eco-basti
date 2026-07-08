import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopHUD } from "@/components/game/TopHUD";
import { useGame } from "@/context/GameContext";
import { ModuleOutcome } from "@/components/game/ModuleOutcome";
import mouse from "@/assets/mouse.png";
import crow from "@/assets/crow.png";
import villageBg from "@/assets/village-bg.jpg";
import lakeBg from "@/assets/scene-lake.jpg";
import skyBg from "@/assets/scene-sky.jpg";
import droughtBg from "@/assets/scene-drought.jpg";
import banyanBg from "@/assets/banyantree.jpg";
import forestGroundBg from "@/assets/forest-ground.jpg";
import { ArrowLeft, ArrowRight, Check, Recycle, X } from "lucide-react";

export const Route = createFileRoute("/module/waste-warrior")({
  head: () => ({
    meta: [
      { title: "Waste Warrior — The Crow and the Snake" },
      { name: "description", content: "A Panchatantra tale that teaches children clean surroundings, safe drinking water and smart waste sorting." },
    ],
  }),
  component: WasteWarrior,
});

const THEME = "oklch(0.55 0.22 300)";
const RING = "oklch(0.82 0.14 300)";

type Phase = "story" | "practice-intro" | "practice" | "activity" | "cleanup" | "outcome" | "update";

function WasteWarrior() {
  const [phase, setPhase] = useState<Phase>("story");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const restart = () => { setScore({ correct: 0, total: 0 }); setPhase("activity"); };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.9_0.06_300)]">
      <TopHUD showHome />
      <div className="pt-24 md:pt-28 pb-8 px-3 md:px-8">
        {phase === "story" && <StoryBook onDone={() => setPhase("practice-intro")} />}
        {phase === "practice-intro" && <MouseMoral onNext={() => setPhase("practice")} />}
        {phase === "practice" && <SafeWaterPractice onNext={() => setPhase("activity")} />}
        {phase === "activity" && (
          <WasteActivity onDone={(correct, total) => { setScore({ correct, total }); setPhase("cleanup"); }} />
        )}
        {phase === "cleanup" && (
          <RecyclingCentreGame items={score.correct} onDone={() => setPhase("outcome")} />
        )}
        {phase === "outcome" && (
          <ModuleOutcome
            moduleId="waste-warrior"
            moduleTitle={{ en: "Waste Warrior", hi: "कचरा योद्धा" }}
            correct={score.correct}
            total={score.total}
            character={mouse}
            badgeEmoji="♻️"
            themeColor={THEME}
            onReplay={restart}
            onContinue={() => setPhase("update")}
            reflection={{
              en: "Sorting waste, covering drinking water and reusing containers keep Eco-Basti clean and everyone healthy.",
              hi: "कचरे को अलग करना, पीने के पानी को ढकना और डिब्बे दोबारा उपयोग करना — इनसे इको-बस्ती साफ़ और सब स्वस्थ रहते हैं।",
            }}
          />
        )}
        {phase === "update" && <EcoBastiUpdate />}
      </div>
    </div>
  );
}

/* ---------------- Story Book: The Crow and the Snake ---------------- */

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
      bg: banyanBg,
      en: "In a tall banyan tree in Eco-Basti, a pair of crows had built a happy nest. But a wicked snake lived in a hollow of the same tree.",
      hi: "इको-बस्ती के एक ऊँचे बरगद पर कौओं के जोड़े ने ख़ुशी-ख़ुशी घोंसला बनाया था। पर उसी पेड़ की एक कोटर में एक दुष्ट साँप भी रहता था।",
      characters: [
        { src: crow, className: "absolute top-8 left-[25%] h-24 md:h-32 animate-fly" },
        { src: crow, className: "absolute top-14 left-[55%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.6s" } },
      ],
    },
    {
      bg: banyanBg,
      en: "Every time the crows laid eggs, the greedy snake slid up and swallowed them. The crows grew very sad and afraid.",
      hi: "जब भी कौए अंडे देते, लालची साँप ऊपर चढ़कर उन्हें निगल जाता। कौए बहुत दुखी और डरे रहते थे।",
      characters: [
        { src: crow, className: "absolute top-6 left-[20%] h-24 md:h-32 animate-bob" },
        { src: crow, className: "absolute top-8 left-[60%] h-24 md:h-32 animate-bob", style: { animationDelay: "-0.4s" } },
      ],
      extra: <span aria-hidden className="absolute bottom-16 left-1/2 -translate-x-1/2 text-5xl md:text-6xl animate-floaty">🐍</span>,
    },
    {
      bg: forestGroundBg,
      en: "The crows flew to their wise friend, the old jackal. He thought carefully and said, ‘Do not fight the snake with your beaks. Use your cleverness — use a plan.’",
      hi: "कौए अपने बुद्धिमान मित्र, बूढ़े सियार के पास उड़कर गए। उसने ध्यान से सोचकर कहा, ‘चोंच से मत लड़ो। बुद्धि से — योजना से काम लो।’",
      characters: [
        { src: crow, className: "absolute top-10 left-[20%] h-24 md:h-32 animate-fly" },
        { src: crow, className: "absolute top-10 left-[45%] h-24 md:h-32 animate-fly", style: { animationDelay: "-0.5s" } },
      ],
      extra: <span aria-hidden className="absolute bottom-10 right-10 text-6xl md:text-7xl animate-bob">🦊</span>,
    },
    {
      bg: forestGroundBg,
      en: "‘Fly to the palace pond,’ the jackal said. ‘Pick up the princess’s golden necklace and drop it near the snake’s hollow. The guards will do the rest!’",
      hi: "‘राजमहल के तालाब पर उड़ो,’ सियार बोला। ‘राजकुमारी का सोने का हार उठाकर साँप की कोटर के पास गिरा दो। बाकी काम पहरेदार कर देंगे!’",
      characters: [
        { src: crow, className: "absolute top-6 left-[35%] h-24 md:h-32 animate-fly" },
      ],
      extra: <span aria-hidden className="absolute bottom-12 right-[20%] text-5xl md:text-6xl animate-floaty">👑</span>,
    },
    {
      bg: banyanBg,
      en: "The clever crows did exactly that. The guards followed the shining necklace, saw the snake, and drove it far away from the tree forever.",
      hi: "चतुर कौओं ने ठीक वैसा ही किया। पहरेदार चमकते हार के पीछे-पीछे पेड़ तक पहुँचे, साँप को देखा और उसे हमेशा के लिए दूर भगा दिया।",
      characters: [
        { src: crow, className: "absolute top-8 left-[30%] h-24 md:h-32 animate-cheer" },
        { src: crow, className: "absolute top-8 left-[55%] h-24 md:h-32 animate-cheer", style: { animationDelay: "-0.3s" } },
      ],
      extra: <span aria-hidden className="absolute bottom-10 left-10 text-5xl md:text-6xl animate-bob">🛡️</span>,
    },
    {
      bg: villageBg,
      en: "Moral: A little wisdom and a smart plan can solve big problems. Every day, small clever choices protect our home and our Eco-Basti.",
      hi: "सीख: थोड़ी सी बुद्धि और अच्छी योजना बड़ी मुसीबतें भी हल कर देती है। हर दिन के छोटे-छोटे समझदार निर्णय हमारे घर और इको-बस्ती की रक्षा करते हैं।",
      characters: [
        { src: mouse, className: "absolute bottom-6 left-1/2 -translate-x-1/2 h-28 md:h-40 animate-floaty" },
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
            <span key={idx} className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-[oklch(0.55_0.22_300)]" : "w-2.5 bg-white/70 border border-[oklch(0.55_0.11_60)]"}`} />
          ))}
        </div>
        {i < scenes.length - 1 ? (
          <button onClick={() => setI((x) => x + 1)} className="btn-playful">{g.lang === "en" ? "Next" : "आगे"} <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button onClick={onDone} className="btn-playful">{g.lang === "en" ? "Meet Mouse" : "चूहे से मिलो"} <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Mouse moral bridge ---------------- */

function MouseMoral({ onNext }: { onNext: () => void }) {
  const g = useGame();
  useEffect(() => {
    g.speak(
      "Squeak! Just as the clever crows made a smart plan, we can protect our homes with everyday smart choices — sort our waste, cover our drinking water, and never litter.",
      "चूँ-चूँ! जैसे चतुर कौओं ने अच्छी योजना बनाई, वैसे ही हम रोज़ के छोटे-छोटे समझदार निर्णयों से अपने घर की रक्षा कर सकते हैं — कचरा अलग-अलग करो, पीने का पानी ढको और कभी कहीं भी मत फेंको।"
    );
    // eslint-disable-next-line
  }, []);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card-parchment p-5 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={mouse} alt="Mouse" className="h-40 md:h-56 animate-floaty drop-shadow-[0_10px_15px_rgba(0,0,0,.25)]" />
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl mb-3" style={{ color: THEME }}>
              {g.lang === "en" ? "A message from Mouse" : "चूहे का संदेश"}
            </h2>
            <div className="relative card-parchment p-4 md:p-5 text-base md:text-lg">
              {g.lang === "en"
                ? "Just as the crows solved a big problem with a smart plan, you can keep Eco-Basti safe by sorting waste, storing drinking water safely, and never throwing plastic on the ground."
                : "जैसे कौओं ने अच्छी योजना से बड़ी मुसीबत हल की, वैसे ही तुम कचरा अलग करके, पीने का पानी सुरक्षित रखकर और प्लास्टिक ज़मीन पर न फेंककर इको-बस्ती को साफ़ रख सकते हो।"}
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={onNext} className="btn-playful">{g.lang === "en" ? "Learn Safe Water" : "सुरक्षित पानी सीखो"} <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Safe Water & Container Practice ---------------- */

interface PracticeStep {
  en: string; hi: string;
  icon: string;
  safe: boolean;
}

function SafeWaterPractice({ onNext }: { onNext: () => void }) {
  const g = useGame();
  const steps: PracticeStep[] = useMemo(() => [
    { en: "Always keep the drinking water pot covered with a clean lid so dust and insects can't get in.", hi: "पीने के पानी के बर्तन को हमेशा साफ़ ढक्कन से ढको ताकि धूल और कीड़े अंदर न जाएँ।", icon: "🫗", safe: true },
    { en: "Wash your reusable bottle every day with warm water and a little soap — germs love dirty bottles.", hi: "अपनी बोतल को रोज़ गरम पानी और थोड़े साबुन से धोओ — गंदी बोतल में कीटाणु पनपते हैं।", icon: "🧴", safe: true },
    { en: "Serve water only in clean steel or glass containers — never in dirty or broken cups.", hi: "पानी हमेशा साफ़ स्टील या काँच के बर्तन में दो — गंदे या टूटे कप में कभी नहीं।", icon: "🥤", safe: true },
    { en: "An earthen pot (matka) keeps water naturally cool and safe — a traditional sustainable choice.", hi: "मिट्टी का मटका पानी को प्राकृतिक रूप से ठंडा और सुरक्षित रखता है — यह पारंपरिक और टिकाऊ तरीका है।", icon: "🏺", safe: true },
    { en: "Reuse a clean glass jar or steel tin for storing pulses or snacks before throwing it away.", hi: "फेंकने से पहले साफ़ काँच के जार या स्टील के डिब्बे को दालें या नाश्ता रखने में दोबारा उपयोग करो।", icon: "🥫", safe: true },
    { en: "Warning: never store drinking water in a leftover chemical, oil or cleaning-liquid bottle.", hi: "सावधान: पीने का पानी कभी भी बचे हुए रसायन, तेल या सफ़ाई-द्रव की बोतल में मत रखो।", icon: "⚠️", safe: false },
  ], []);
  const [i, setI] = useState(0);
  useEffect(() => { g.speak(steps[i].en, steps[i].hi); /* eslint-disable-next-line */ }, [i]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>{g.lang === "en" ? "Keep Water Safe" : "पानी सुरक्षित रखो"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)] mt-1">{g.lang === "en" ? "Everyday clean-water and container habits" : "रोज़ के साफ़ पानी और डिब्बों की आदतें"}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 items-center">
        <div className={`relative rounded-3xl overflow-hidden border-4 shadow-[0_6px_0_oklch(0.35_0.1_55)] aspect-square flex items-center justify-center ${steps[i].safe ? "bg-[oklch(0.94_0.06_300)] border-[oklch(0.35_0.1_55)]" : "bg-[oklch(0.92_0.08_25)] border-[oklch(0.55_0.24_20)]"}`}>
          <span className="text-[8rem] md:text-[10rem] animate-floaty">{steps[i].icon}</span>
          <div className="absolute top-3 left-3 card-parchment px-3 py-1 text-xs font-bold">
            {g.lang === "en" ? `Step ${i + 1} / ${steps.length}` : `चरण ${i + 1} / ${steps.length}`}
          </div>
          {!steps[i].safe && (
            <div className="absolute top-3 right-3 card-parchment px-3 py-1 text-xs font-extrabold text-[oklch(0.5_0.22_25)]">
              {g.lang === "en" ? "NEVER DO THIS" : "कभी न करें"}
            </div>
          )}
        </div>
        <div className="card-parchment p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white font-extrabold border-2 border-[oklch(0.35_0.1_55)] ${steps[i].safe ? "bg-[oklch(0.55_0.22_300)]" : "bg-[oklch(0.55_0.24_20)]"}`}>{i + 1}</div>
            <div className="h-2 flex-1 rounded-full bg-[oklch(0.85_0.08_80)] overflow-hidden">
              <div className="h-full bg-[oklch(0.55_0.22_300)] transition-all" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
            </div>
          </div>
          <p className="text-base md:text-lg font-semibold">{g.lang === "en" ? steps[i].en : steps[i].hi}</p>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0} className="btn-playful-yellow disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> {g.lang === "en" ? "Back" : "पीछे"}</button>
            {i < steps.length - 1 ? (
              <button onClick={() => setI((x) => x + 1)} className="btn-playful">{g.lang === "en" ? "Next Step" : "अगला चरण"} <ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={onNext} className="btn-playful">{g.lang === "en" ? "Start Activity" : "गतिविधि शुरू करो"} <ArrowRight className="h-4 w-4" /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Activity: Help Mouse Sort Smartly ---------------- */

interface Question {
  en: string; hi: string;
  options: Array<{ en: string; hi: string; correct: boolean; feedbackEn?: string; feedbackHi?: string }>;
}

const QUESTIONS: Question[] = [
  {
    en: "You see a plastic bottle lying on the path. What do you do?",
    hi: "रास्ते पर एक प्लास्टिक की बोतल पड़ी है। क्या करोगे?",
    options: [
      { en: "Pick it up and put it in the dry-waste / recycling bin", hi: "उठाकर सूखा-कचरा / रीसाइक्लिंग डिब्बे में डालो", correct: true },
      { en: "Kick it aside — someone else will clean it", hi: "एक तरफ़ धकेल दो — कोई और साफ़ करेगा", correct: false, feedbackEn: "Plastic litter blocks drains and hurts animals. Pick it up and recycle.", feedbackHi: "प्लास्टिक कचरा नालियाँ रोकता है और जानवरों को नुक़सान पहुँचाता है। उठाकर रीसाइक्लिंग करो।" },
    ],
  },
  {
    en: "Amma just peeled a banana. Where does the banana peel go?",
    hi: "अम्मा ने केला छीला है। छिलका कहाँ जाएगा?",
    options: [
      { en: "Wet-waste bin (it turns into compost)", hi: "गीला-कचरा डिब्बा (यह खाद बन जाता है)", correct: true },
      { en: "Dry-waste bin with plastics", hi: "प्लास्टिक वाले सूखा-कचरा डिब्बे में", correct: false, feedbackEn: "Peels are wet waste — they rot and become plant food.", feedbackHi: "छिलके गीला कचरा हैं — ये सड़कर पौधों की खाद बनते हैं।" },
    ],
  },
  {
    en: "The drinking water container is sitting open in the kitchen. What is best?",
    hi: "रसोई में पीने के पानी का बर्तन खुला रखा है। सबसे अच्छा क्या है?",
    options: [
      { en: "Cover it with a clean lid", hi: "साफ़ ढक्कन से ढक दो", correct: true },
      { en: "Leave it open, water needs air", hi: "खुला रहने दो, पानी को हवा चाहिए", correct: false, feedbackEn: "Open water collects dust and germs. Always cover drinking water.", feedbackHi: "खुला पानी धूल और कीटाणु सोख लेता है। पीने का पानी हमेशा ढको।" },
    ],
  },
  {
    en: "After cooking, there is a pile of fruit and vegetable peels. What do you do?",
    hi: "खाना बनाने के बाद फल-सब्ज़ी के छिलकों का ढेर है। क्या करोगे?",
    options: [
      { en: "Add them to the compost pit", hi: "खाद के गड्ढे में डाल दो", correct: true },
      { en: "Mix them with plastic wrappers and throw", hi: "प्लास्टिक रैपर के साथ मिलाकर फेंक दो", correct: false, feedbackEn: "Mixing wet and dry waste ruins both. Compost the peels.", feedbackHi: "गीला और सूखा मिलाने से दोनों बेकार हो जाते हैं। छिलकों की खाद बनाओ।" },
    ],
  },
  {
    en: "You just finished a packet of biscuits. Where does the empty plastic wrapper go?",
    hi: "तुमने बिस्किट का पैकेट खाया। खाली प्लास्टिक रैपर कहाँ जाएगा?",
    options: [
      { en: "Dry-waste bin", hi: "सूखा-कचरा डिब्बा", correct: true },
      { en: "Wet-waste bin", hi: "गीला-कचरा डिब्बा", correct: false, feedbackEn: "Plastic wrappers are dry waste — they don't rot.", feedbackHi: "प्लास्टिक रैपर सूखा कचरा हैं — ये सड़ते नहीं।" },
      { en: "Just drop it — it's tiny", hi: "बस गिरा दो — बहुत छोटा है", correct: false },
    ],
  },
];

function WasteActivity({ onDone }: { onDone: (correct: number, total: number) => void }) {
  const g = useGame();
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const q = QUESTIONS[i];
  useEffect(() => { g.speak(q.en, q.hi); /* eslint-disable-next-line */ }, [i]);

  const pick = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    if (q.options[idx].correct) setCorrectCount((c) => c + 1);
  };
  const next = () => {
    if (i < QUESTIONS.length - 1) { setI(i + 1); setChosen(null); }
    else onDone(correctCount, QUESTIONS.length);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>{g.lang === "en" ? "Help Mouse Sort Smartly" : "चूहे की मदद करो — समझदारी से छाँटो"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">{g.lang === "en" ? `Situation ${i + 1} of ${QUESTIONS.length}` : `स्थिति ${i + 1} / ${QUESTIONS.length}`}</p>
      </div>

      <div className="card-parchment p-5 md:p-7 relative">
        <div className="flex items-start gap-4">
          <img src={mouse} alt="Mouse" className="hidden md:block h-24 animate-floaty" />
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold mb-4">{g.lang === "en" ? q.en : q.hi}</p>
            <div className="grid gap-3">
              {q.options.map((opt, idx) => {
                const state = chosen === null ? "idle" : opt.correct ? "correct" : chosen === idx ? "wrong" : "muted";
                return (
                  <button
                    key={idx}
                    onClick={() => pick(idx)}
                    className={`text-left px-4 py-3 md:px-5 md:py-4 rounded-2xl border-4 font-semibold transition-all
                      ${state === "idle" ? "bg-white border-[oklch(0.55_0.11_60)] hover:-translate-y-0.5 hover:bg-[oklch(0.97_0.05_300)]" : ""}
                      ${state === "correct" ? "bg-[oklch(0.92_0.09_300)] border-[oklch(0.5_0.22_300)]" : ""}
                      ${state === "wrong" ? "bg-[oklch(0.9_0.14_25)] border-[oklch(0.55_0.24_20)]" : ""}
                      ${state === "muted" ? "bg-white/60 border-[oklch(0.85_0.08_80)] opacity-70" : ""}
                    `}
                  >
                    <span className="inline-flex items-center gap-2">
                      {state === "correct" && <Check className="h-5 w-5 text-[oklch(0.5_0.22_300)]" />}
                      {state === "wrong" && <X className="h-5 w-5 text-[oklch(0.55_0.24_20)]" />}
                      {g.lang === "en" ? opt.en : opt.hi}
                    </span>
                  </button>
                );
              })}
            </div>

            {chosen !== null && (
              <div className={`mt-4 p-3 rounded-xl text-sm md:text-base font-semibold ${q.options[chosen].correct ? "bg-[oklch(0.95_0.07_300)] text-[oklch(0.3_0.18_300)]" : "bg-[oklch(0.95_0.08_25)] text-[oklch(0.4_0.2_25)]"}`}>
                {q.options[chosen].correct
                  ? (g.lang === "en" ? "You earned a Recyclable! Mouse's centre is filling up." : "तुमने एक रीसाइक्लिंग आइटम कमाया! चूहे का केंद्र भर रहा है।")
                  : (g.lang === "en"
                    ? (q.options[chosen].feedbackEn ?? "Not the best choice. Think about clean surroundings.")
                    : (q.options[chosen].feedbackHi ?? "यह सबसे अच्छा विकल्प नहीं। साफ़-सफ़ाई के बारे में सोचो।"))}
              </div>
            )}

            <div className="mt-5 flex justify-between items-center">
              <div className="text-xs md:text-sm text-[oklch(0.45_0.09_55)] inline-flex items-center gap-1">
                <Recycle className="h-4 w-4 text-[oklch(0.55_0.22_300)]" /> {g.lang === "en" ? "Recyclables:" : "रीसाइक्लिंग:"} <b>{correctCount}</b>
              </div>
              <button onClick={next} disabled={chosen === null} className="btn-playful disabled:opacity-40">
                {i < QUESTIONS.length - 1 ? (g.lang === "en" ? "Next" : "आगे") : (g.lang === "en" ? "Clean the Centre" : "केंद्र साफ़ करो")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Recycling Centre Cleanup ---------------- */

const RECYCLABLES = ["🧴", "🥫", "📦", "🍾", "📰", "🥤"];

function RecyclingCentreGame({ items, onDone }: { items: number; onDone: () => void }) {
  const g = useGame();
  const [placed, setPlaced] = useState(0);
  const total = Math.max(1, items);
  const clean = Math.min(100, (placed / total) * 100);

  useEffect(() => {
    g.speak(
      "Tap each recyclable item to place it in Mouse's recycling centre — watch the litter disappear!",
      "हर रीसाइक्लिंग आइटम पर टैप करके चूहे के रीसाइक्लिंग केंद्र में रखो — देखो कैसे कचरा गायब हो जाता है!"
    );
    // eslint-disable-next-line
  }, []);

  const done = placed >= items;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>
          {g.lang === "en" ? "Mouse's Recycling Centre" : "चूहे का रीसाइक्लिंग केंद्र"}
        </h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">
          {g.lang === "en" ? `Place your ${items} recyclables` : `अपने ${items} रीसाइक्लिंग आइटम रखो`}
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)] bg-gradient-to-b from-[oklch(0.9_0.05_300)] to-[oklch(0.75_0.08_300)]">
        {/* Sky brightens with cleanup */}
        <div className="absolute inset-0 transition-opacity duration-700"
             style={{ background: "linear-gradient(to bottom, oklch(0.92 0.07 240), transparent 50%)", opacity: clean / 100 }} />

        {/* Litter that disappears */}
        {clean < 90 && (
          <>
            <span className="absolute bottom-8 left-[15%] text-3xl md:text-4xl transition-opacity" style={{ opacity: 1 - clean / 100 }} aria-hidden>🗑️</span>
            <span className="absolute bottom-16 left-[35%] text-3xl md:text-4xl transition-opacity" style={{ opacity: 1 - clean / 100 }} aria-hidden>🧴</span>
            <span className="absolute bottom-10 right-[30%] text-3xl md:text-4xl transition-opacity" style={{ opacity: 1 - clean / 100 }} aria-hidden>🥫</span>
            <span className="absolute bottom-20 right-[15%] text-3xl md:text-4xl transition-opacity" style={{ opacity: 1 - clean / 100 }} aria-hidden>📰</span>
          </>
        )}

        {/* Recycling centre building */}
        <div
          className="absolute right-[8%] bottom-6 w-40 md:w-56 h-32 md:h-44 rounded-2xl border-4 border-[oklch(0.35_0.1_55)] transition-all duration-700 flex flex-col items-center justify-center"
          style={{ background: `linear-gradient(to bottom, oklch(${0.65 + clean / 400} 0.14 300), oklch(${0.55 + clean / 500} 0.18 300))` }}
        >
          <Recycle className="h-10 w-10 md:h-14 md:w-14 text-white drop-shadow" />
          <div className="text-white font-extrabold text-sm md:text-base mt-1" style={{ textShadow: "0 2px 0 rgba(0,0,0,.35)" }}>
            {g.lang === "en" ? "Recycling Centre" : "रीसाइक्लिंग केंद्र"}
          </div>
          <div className="mt-1 h-2 w-24 rounded-full bg-white/40 overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${clean}%` }} />
          </div>
        </div>

        {/* Rewards appearing as cleanup progresses */}
        {clean > 30 && <div className="absolute bottom-8 left-4 text-4xl md:text-5xl animate-floaty">🌱</div>}
        {clean > 55 && <div className="absolute bottom-8 left-24 text-4xl md:text-5xl animate-floaty" style={{ animationDelay: "-0.6s" }}>🌿</div>}
        {clean > 70 && <div className="absolute bottom-16 left-12 text-3xl md:text-4xl animate-pop">🌸</div>}
        {clean > 70 && <div className="absolute bottom-20 left-36 text-3xl md:text-4xl animate-pop">🌼</div>}
        {clean > 80 && <div className="absolute top-8 left-1/3 text-3xl animate-fly">🦋</div>}
        {clean > 90 && <div className="absolute top-12 right-1/3 text-3xl animate-fly" style={{ animationDelay: "-0.5s" }}>🦋</div>}

        {/* Mouse */}
        <img
          src={mouse}
          alt=""
          aria-hidden
          className={`absolute h-24 md:h-32 transition-all duration-700 ${done ? "bottom-4 left-[38%] animate-cheer" : "bottom-4 left-6 animate-floaty"}`}
        />
      </div>

      {/* Recyclable tray */}
      <div className="mt-5 card-parchment p-4 flex flex-wrap items-center justify-center gap-3">
        {Array.from({ length: items - placed }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPlaced((p) => Math.min(items, p + 1))}
            aria-label="Place recyclable"
            className="text-3xl md:text-4xl hover:scale-110 active:scale-95 transition-transform animate-floaty"
            style={{ animationDelay: `${-i * 0.25}s` }}
          >
            <span aria-hidden>{RECYCLABLES[i % RECYCLABLES.length]}</span>
          </button>
        ))}
        {items === 0 && (
          <p className="text-sm font-semibold text-[oklch(0.45_0.09_55)] text-center">
            {g.lang === "en" ? "No recyclables yet — try the activity again to earn some!" : "अभी कोई रीसाइक्लिंग आइटम नहीं — गतिविधि दोबारा करो और कमाओ!"}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button onClick={onDone} className="btn-playful">
          {g.lang === "en" ? "See your result" : "अपना परिणाम देखो"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Eco-Basti Update ---------------- */

function EcoBastiUpdate() {
  const g = useGame();
  const nav = useNavigate();
  const tier = g.tiers["waste-warrior"];
  const t = g.lang === "en";
  const headline = tier === "excellent"
    ? (t ? "Eco-Basti Sparkles Clean" : "इको-बस्ती चमक उठी")
    : tier === "good"
      ? (t ? "Eco-Basti is Getting Tidier" : "इको-बस्ती और साफ़ हो रही है")
      : (t ? "Eco-Basti Still Needs You" : "इको-बस्ती को अभी तुम्हारी ज़रूरत है");
  const detail = tier === "excellent"
    ? (t ? "Mouse's recycling centre is glowing. Litter is gone, flowers bloom, and butterflies dance around clean bins." : "चूहे का रीसाइक्लिंग केंद्र चमक रहा है। कचरा गायब है, फूल खिले हैं और साफ़ डिब्बों के आसपास तितलियाँ नाच रही हैं।")
    : tier === "good"
      ? (t ? "Some plastic is cleared and bins are sorted. Play again to make it spotless!" : "थोड़ा प्लास्टिक साफ़ हो गया और डिब्बे छाँटे गए। दोबारा खेलो और पूरी तरह साफ़ करो!")
      : (t ? "The recycling area is still dirty. Try again — every correct choice cleans a corner." : "रीसाइक्लिंग क्षेत्र अभी गंदा है। फिर से कोशिश करो — हर सही निर्णय एक कोना साफ़ करता है।");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>{headline}</h2>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)]">
        <img src={villageBg} alt="Eco-Basti" className="absolute inset-0 h-full w-full object-cover" />
        {/* Waste Warrior area gets a recycling centre bloom */}
        {tier && tier !== "poor" && (
          <div
            className="absolute bottom-10 left-[14%] w-36 h-24 rounded-2xl border-4 border-[oklch(0.35_0.1_55)] flex items-center justify-center animate-pop"
            style={{ background: `linear-gradient(to bottom, ${RING}, ${THEME})` }}
          >
            <Recycle className="h-10 w-10 text-white drop-shadow" />
          </div>
        )}
        {tier === "excellent" && (
          <>
            <div className="absolute bottom-8 left-[8%] text-3xl animate-floaty">🌸</div>
            <div className="absolute bottom-8 left-[28%] text-3xl animate-floaty" style={{ animationDelay: "-0.6s" }}>🌼</div>
            <div className="absolute top-16 left-[22%] text-2xl animate-fly">🦋</div>
          </>
        )}
        <img src={mouse} alt="" aria-hidden className="absolute bottom-6 left-[34%] h-28 md:h-36 animate-cheer" />
        <div className="absolute inset-x-4 bottom-4">
          <div className="card-parchment px-4 py-3 text-center font-semibold">{detail}</div>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={() => nav({ to: "/home" })} className="btn-playful">{t ? "Back to Eco-Basti" : "इको-बस्ती लौटो"}</button>
      </div>
    </div>
  );
}