import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopHUD } from "@/components/game/TopHUD";
import { useGame } from "@/context/GameContext";
import { ModuleOutcome } from "@/components/game/ModuleOutcome";
import tortoise from "@/assets/tortoise.png";
import doveImg from "@/assets/dove.png";
import lakeBg from "@/assets/scene-lake.jpg";
import droughtBg from "@/assets/scene-drought.jpg";
import skyBg from "@/assets/scene-sky.jpg";
import neemImg from "@/assets/neem-datun.jpg";
import villageBg from "@/assets/village-bg.jpg";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

export const Route = createFileRoute("/module/healthy-me")({
  head: () => ({ meta: [{ title: "Healthy Me — The Tortoise and the Geese" }, { name: "description", content: "An interactive Panchatantra story that teaches healthy morning habits and the traditional use of neem datun." }] }),
  component: HealthyMe,
});

type Phase = "story" | "practice-intro" | "practice" | "activity" | "outcome" | "update";

function HealthyMe() {
  const [phase, setPhase] = useState<Phase>("story");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const nav = useNavigate();

  const restart = () => { setScore({ correct: 0, total: 0 }); setPhase("activity"); };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.85_0.09_235)]">
      <TopHUD showHome />
      <div className="pt-24 md:pt-28 pb-8 px-3 md:px-8">
        {phase === "story" && <StoryBook onDone={() => setPhase("practice-intro")} />}
        {phase === "practice-intro" && <TortoiseMoral onNext={() => setPhase("practice")} />}
        {phase === "practice" && <NeemPractice onNext={() => setPhase("activity")} />}
        {phase === "activity" && (
          <MorningRoutineActivity
            onDone={(correct, total) => { setScore({ correct, total }); setPhase("outcome"); }}
          />
        )}
        {phase === "outcome" && (
          <ModuleOutcome
            moduleId="healthy-me"
            moduleTitle={{ en: "Healthy Me", hi: "स्वस्थ मैं" }}
            correct={score.correct}
            total={score.total}
            character={tortoise}
            badgeEmoji="🐢"
            themeColor="oklch(0.55 0.19 135)"
            onReplay={restart}
            onContinue={() => setPhase("update")}
            reflection={{
              en: "Small daily habits — brushing with a fresh datun, washing hands, drinking clean water — keep you and Eco-Basti healthy.",
              hi: "छोटी दैनिक आदतें — ताज़ी दातुन से ब्रश, हाथ धोना, साफ़ पानी पीना — तुम्हें और इको-बस्ती को स्वस्थ रखती हैं।",
            }}
          />
        )}
        {phase === "update" && <EcoBastiUpdate />}
      </div>
    </div>
  );
}

/* ---------------- Story Book ---------------- */

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
      bg: lakeBg,
      en: "Long ago, in a beautiful lake in Eco-Basti, lived a friendly tortoise named Kambugriva with his two dear friends — two wise geese.",
      hi: "बहुत समय पहले, इको-बस्ती के एक सुंदर तालाब में, कम्बुग्रीव नाम का एक कछुआ अपने दो हंस मित्रों के साथ रहता था।",
      characters: [
        { src: tortoise, className: "absolute bottom-6 left-[18%] h-40 md:h-56 animate-floaty" },
        { src: doveImg, className: "absolute top-16 right-[24%] h-24 md:h-32 animate-fly" },
        { src: doveImg, className: "absolute top-24 right-[10%] h-24 md:h-32 animate-fly", style: { animationDelay: "-0.8s" } },
      ],
      extra: <Ripples />,
    },
    {
      bg: droughtBg,
      en: "One year, the rains did not come. The lake began to dry. The tortoise felt worried — his home and health were in danger.",
      hi: "एक वर्ष, वर्षा नहीं हुई। तालाब सूखने लगा। कछुआ चिंतित हो गया — उसका घर और स्वास्थ्य खतरे में था।",
      characters: [
        { src: tortoise, className: "absolute bottom-6 left-[35%] h-40 md:h-56 animate-bob" },
      ],
    },
    {
      bg: lakeBg,
      en: "The geese had a plan. ‘Hold this stick in your beak,’ they said. ‘We will carry you to a bigger lake. But you must not open your mouth to speak!’",
      hi: "हंसों के पास एक योजना थी। उन्होंने कहा, ‘इस लकड़ी को अपनी चोंच से पकड़ लो। हम तुम्हें बड़े तालाब तक ले जाएँगे। परन्तु तुम मुँह नहीं खोलना!’",
      characters: [
        { src: doveImg, className: "absolute top-8 left-[20%] h-24 md:h-32 animate-fly" },
        { src: doveImg, className: "absolute top-8 right-[20%] h-24 md:h-32 animate-fly", style: { animationDelay: "-0.8s" } },
        { src: tortoise, className: "absolute top-24 left-1/2 -translate-x-1/2 h-28 md:h-36 animate-floaty" },
      ],
      extra: <Stick />,
    },
    {
      bg: skyBg,
      en: "Up, up they flew across the sky. People below looked up and shouted, ‘Look, a flying tortoise!’",
      hi: "वे आकाश में ऊपर, और ऊपर उड़ने लगे। नीचे लोग देखकर चिल्लाए, ‘देखो, उड़ता हुआ कछुआ!’",
      characters: [
        { src: doveImg, className: "absolute top-10 left-[18%] h-24 md:h-32 animate-fly" },
        { src: doveImg, className: "absolute top-10 right-[18%] h-24 md:h-32 animate-fly", style: { animationDelay: "-0.8s" } },
        { src: tortoise, className: "absolute top-28 left-1/2 -translate-x-1/2 h-28 md:h-36 animate-floaty" },
      ],
      extra: <Stick />,
    },
    {
      bg: skyBg,
      en: "The tortoise felt proud and opened his mouth to reply — and lost his grip! Down he tumbled.",
      hi: "कछुए को गर्व हुआ और उसने उत्तर देने के लिए मुँह खोला — और उसकी पकड़ छूट गई! वह नीचे गिरने लगा।",
      characters: [
        { src: tortoise, className: "absolute top-1/2 left-1/2 -translate-x-1/2 h-28 md:h-36", style: { animation: "bob 0.8s ease-in-out infinite" } },
      ],
    },
    {
      bg: lakeBg,
      en: "Moral: A wise mind and healthy habits — practiced every day — keep us safe. Small daily care protects us from big trouble.",
      hi: "सीख: बुद्धिमानी और स्वस्थ आदतें — जो प्रतिदिन की जाएँ — हमें सुरक्षित रखती हैं। छोटी दैनिक देखभाल बड़ी परेशानी से बचाती है।",
      characters: [
        { src: tortoise, className: "absolute bottom-6 left-1/2 -translate-x-1/2 h-40 md:h-56 animate-floaty" },
      ],
      extra: <Ripples />,
    },
  ], []);

  const [i, setI] = useState(0);
  const scene = scenes[i];

  useEffect(() => {
    g.speak(scene.en, scene.hi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_10px_0_oklch(0.35_0.1_55),0_20px_40px_rgba(0,0,0,.35)]">
        <img key={i + "-bg"} src={scene.bg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover animate-pop" />
        {scene.extra}
        {scene.characters.map((c, idx) => (
          <img key={i + "-c-" + idx} src={c.src} alt="" aria-hidden className={c.className} style={c.style} />
        ))}
        {/* Subtitle */}
        <div className="absolute inset-x-3 md:inset-x-10 bottom-3 md:bottom-6">
          <div key={i + "-t"} className="card-parchment px-4 py-3 md:px-6 md:py-4 text-sm md:text-lg font-semibold animate-pop">
            {g.lang === "en" ? scene.en : scene.hi}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0} className="btn-playful-yellow disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> {g.lang === "en" ? "Back" : "पीछे"}</button>
        <div className="flex gap-1.5">
          {scenes.map((_, idx) => (
            <span key={idx} className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-[oklch(0.55_0.19_135)]" : "w-2.5 bg-white/70 border border-[oklch(0.55_0.11_60)]"}`} />
          ))}
        </div>
        {i < scenes.length - 1 ? (
          <button onClick={() => setI((x) => x + 1)} className="btn-playful">{g.lang === "en" ? "Next" : "आगे"} <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button onClick={onDone} className="btn-playful">{g.lang === "en" ? "Meet Tortoise" : "कछुए से मिलो"} <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
}

function Ripples() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute bottom-16 left-[30%] h-16 w-16 rounded-full border-4 border-white/70 ripple-ring" />
      <div className="absolute bottom-20 right-[30%] h-14 w-14 rounded-full border-4 border-white/70 ripple-ring" style={{ animationDelay: "-1s" }} />
    </div>
  );
}
function Stick() {
  return <div aria-hidden className="absolute top-[38%] left-1/2 -translate-x-1/2 h-2 w-40 md:w-56 rounded-full bg-[oklch(0.45_0.1_55)] rotate-2 shadow-md" />;
}

/* ---------------- Tortoise moral ---------------- */

function TortoiseMoral({ onNext }: { onNext: () => void }) {
  const g = useGame();
  useEffect(() => {
    g.speak(
      "Hello little friend! Just like I stayed safe by holding on, you stay strong by keeping healthy daily habits. Brush your teeth, wash your hands, clean your tongue, and drink safe water every day.",
      "नमस्ते नन्हे मित्र! जैसे मैंने पकड़ बनाए रखकर स्वयं को सुरक्षित रखा, वैसे ही तुम भी हर दिन स्वस्थ आदतें अपनाकर मज़बूत रहते हो। दाँत साफ़ करो, हाथ धोओ, जीभ साफ़ करो और रोज़ स्वच्छ पानी पिओ।"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card-parchment p-5 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={tortoise} alt="Tortoise" className="h-40 md:h-56 animate-floaty drop-shadow-[0_10px_15px_rgba(0,0,0,.25)]" />
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl mb-3" style={{ color: "oklch(0.5 0.19 135)" }}>
              {g.lang === "en" ? "A message from Kambugriva" : "कम्बुग्रीव का संदेश"}
            </h2>
            <div className="relative card-parchment p-4 md:p-5 text-base md:text-lg">
              {g.lang === "en"
                ? "Just like I stayed safe by holding on, you stay strong by keeping healthy daily habits. Brush your teeth, wash your hands, clean your tongue, and drink safe water every day."
                : "जैसे मैंने पकड़ बनाए रखकर स्वयं को सुरक्षित रखा, वैसे ही तुम हर दिन स्वस्थ आदतें अपनाकर मज़बूत रहते हो। दाँत साफ़ करो, हाथ धोओ, जीभ साफ़ करो और रोज़ स्वच्छ पानी पिओ।"}
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={onNext} className="btn-playful">{g.lang === "en" ? "Learn Neem Datun" : "नीम दातुन सीखो"} <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Neem Datun Practice ---------------- */

function NeemPractice({ onNext }: { onNext: () => void }) {
  const g = useGame();
  const steps = [
    {
      en: "Choose a fresh, pencil-thin neem twig from a clean neem tree.",
      hi: "साफ़ नीम के पेड़ से एक ताज़ी, पेंसिल जितनी पतली टहनी चुनो।",
    },
    {
      en: "Wash the twig with clean water to remove dust.",
      hi: "धूल हटाने के लिए टहनी को साफ़ पानी से धोओ।",
    },
    {
      en: "Chew one end gently until it becomes soft and brush-like.",
      hi: "एक सिरे को धीरे-धीरे तब तक चबाओ जब तक वह ब्रश जैसा नरम न हो जाए।",
    },
    {
      en: "Brush all your teeth in small circles for 2 minutes.",
      hi: "सारे दाँतों पर 2 मिनट तक छोटे-छोटे गोलाकार गति में दातुन घुमाओ।",
    },
    {
      en: "After brushing, split the used end into two soft strips. Rub the strips together to smooth them, then use them gently to clean your tongue.",
      hi: "ब्रश करने के बाद चबाए हुए सिरे को दो भागों में बाँटो। दोनों हिस्सों को आपस में रगड़कर मुलायम करो और उनसे धीरे-धीरे अपनी जीभ साफ करो।",
    },
    {
      en: "After cleaning your tongue, throw the used neem twig away safely. For daily oral hygiene, also remember to replace a worn-out toothbrush every 3 months.",
      hi: "जीभ साफ करने के बाद इस्तेमाल किया हुआ नीम का दातून सुरक्षित रूप से फेंक दो। यदि टूथब्रश का उपयोग करते हो, तो उसे हर 3 महीने में बदलना भी याद रखो।",
    },
  ];
  const [i, setI] = useState(0);
  useEffect(() => { g.speak(steps[i].en, steps[i].hi); /* eslint-disable-next-line */ }, [i]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: "oklch(0.5 0.19 135)" }}>{g.lang === "en" ? "Traditional Neem Datun" : "पारंपरिक नीम दातुन"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)] mt-1">{g.lang === "en" ? "A natural, sustainable way to keep teeth healthy" : "दाँतों को स्वस्थ रखने का प्राकृतिक उपाय"}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 items-center">
        <div className="relative rounded-3xl overflow-hidden border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)]">
          <img src={neemImg} alt="Neem twig" className="h-full w-full object-cover aspect-square" />
          <div className="absolute top-3 left-3 card-parchment px-3 py-1 text-xs font-bold">
            {g.lang === "en" ? `Step ${i + 1} / ${steps.length}` : `चरण ${i + 1} / ${steps.length}`}
          </div>
        </div>
        <div className="card-parchment p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.65_0.19_135)] text-white font-extrabold border-2 border-[oklch(0.35_0.1_55)]">{i + 1}</div>
            <div className="h-2 flex-1 rounded-full bg-[oklch(0.85_0.08_80)] overflow-hidden">
              <div className="h-full bg-[oklch(0.65_0.19_135)] transition-all" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
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

/* ---------------- Morning Routine Activity ---------------- */

interface Question {
  en: string; hi: string;
  options: Array<{ en: string; hi: string; correct: boolean; feedbackEn?: string; feedbackHi?: string }>;
}

const QUESTIONS: Question[] = [
  {
    en: "First step of your morning: which tool should you use to brush your teeth?",
    hi: "सुबह का पहला काम: दाँत साफ़ करने के लिए क्या इस्तेमाल करना चाहिए?",
    options: [
      { en: "A fresh neem datun or a new toothbrush", hi: "ताज़ी नीम दातुन या नया टूथब्रश", correct: true },
      { en: "An old, worn-out toothbrush", hi: "पुराना, घिसा-पिटा टूथब्रश", correct: false, feedbackEn: "Worn-out brushes cannot clean well and can hurt your gums.", feedbackHi: "घिसा ब्रश ठीक से साफ़ नहीं करता और मसूड़ों को नुक़सान पहुँचाता है।" },
      { en: "Just your finger", hi: "सिर्फ़ अपनी उंगली", correct: false },
    ],
  },
  {
    en: "How long should you brush?",
    hi: "कितनी देर तक ब्रश करना चाहिए?",
    options: [
      { en: "About 2 minutes in small circles", hi: "लगभग 2 मिनट, छोटे गोलाकार में", correct: true },
      { en: "10 seconds is enough", hi: "10 सेकंड काफ़ी है", correct: false },
      { en: "As hard and fast as possible", hi: "जितना ज़ोर से हो सके", correct: false },
    ],
  },
  {
    en: "After brushing, what should you do next?",
    hi: "ब्रश करने के बाद अगला काम क्या है?",
    options: [
      { en: "Clean your tongue gently with a tongue scraper", hi: "जीभ को धीरे से साफ़ करो", correct: true },
      { en: "Skip it and eat breakfast", hi: "छोड़ दो और नाश्ता करो", correct: false },
    ],
  },
  {
    en: "Before eating, you must…",
    hi: "खाने से पहले तुम्हें ज़रूर…",
    options: [
      { en: "Wash both hands with soap and clean water", hi: "साबुन और साफ़ पानी से दोनों हाथ धोओ", correct: true },
      { en: "Wipe hands on your clothes", hi: "हाथ कपड़ों से पोंछ लो", correct: false },
    ],
  },
  {
    en: "Which water is safest to drink?",
    hi: "पीने के लिए कौन-सा पानी सबसे सुरक्षित है?",
    options: [
      { en: "Boiled or filtered water from a clean container", hi: "साफ़ बर्तन में उबला या फ़िल्टर किया पानी", correct: true },
      { en: "Water from an open puddle", hi: "खुले गड्ढे का पानी", correct: false },
      { en: "Any water, doesn’t matter", hi: "कोई भी पानी", correct: false },
    ],
  },
  {
    en: "How often should you replace a worn-out toothbrush?",
    hi: "घिसा टूथब्रश कितनी बार बदलना चाहिए?",
    options: [
      { en: "Every 3 months (or sooner if bristles bend)", hi: "हर 3 महीने में (या पहले, अगर ब्रिसल मुड़ जाएँ)", correct: true },
      { en: "Once a year", hi: "साल में एक बार", correct: false },
      { en: "Never", hi: "कभी नहीं", correct: false },
    ],
  },
];

function MorningRoutineActivity({ onDone }: { onDone: (correct: number, total: number) => void }) {
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
        <h2 className="text-2xl md:text-4xl" style={{ color: "oklch(0.5 0.19 135)" }}>{g.lang === "en" ? "Build Your Healthy Morning" : "अपनी स्वस्थ सुबह बनाओ"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">{g.lang === "en" ? `Question ${i + 1} of ${QUESTIONS.length}` : `प्रश्न ${i + 1} / ${QUESTIONS.length}`}</p>
      </div>

      <div className="card-parchment p-5 md:p-7 relative">
        <div className="flex items-start gap-4">
          <img src={tortoise} alt="Tortoise" className="hidden md:block h-24 animate-floaty" />
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
                      ${state === "idle" ? "bg-white border-[oklch(0.55_0.11_60)] hover:-translate-y-0.5 hover:bg-[oklch(0.97_0.05_90)]" : ""}
                      ${state === "correct" ? "bg-[oklch(0.9_0.15_140)] border-[oklch(0.5_0.19_135)]" : ""}
                      ${state === "wrong" ? "bg-[oklch(0.9_0.14_25)] border-[oklch(0.55_0.24_20)]" : ""}
                      ${state === "muted" ? "bg-white/60 border-[oklch(0.85_0.08_80)] opacity-70" : ""}
                    `}
                  >
                    <span className="inline-flex items-center gap-2">
                      {state === "correct" && <Check className="h-5 w-5 text-[oklch(0.5_0.19_135)]" />}
                      {state === "wrong" && <X className="h-5 w-5 text-[oklch(0.55_0.24_20)]" />}
                      {g.lang === "en" ? opt.en : opt.hi}
                    </span>
                  </button>
                );
              })}
            </div>

            {chosen !== null && (
              <div className={`mt-4 p-3 rounded-xl text-sm md:text-base font-semibold ${q.options[chosen].correct ? "bg-[oklch(0.95_0.1_140)] text-[oklch(0.35_0.15_140)]" : "bg-[oklch(0.95_0.08_25)] text-[oklch(0.4_0.2_25)]"}`}>
                {q.options[chosen].correct
                  ? (g.lang === "en" ? "Great choice! That’s a healthy habit." : "बहुत बढ़िया! यह एक स्वस्थ आदत है।")
                  : (g.lang === "en"
                    ? (q.options[chosen].feedbackEn ?? "Not quite. Try to pick the healthiest choice.")
                    : (q.options[chosen].feedbackHi ?? "बिल्कुल सही नहीं। सबसे स्वस्थ विकल्प चुनने का प्रयास करो।"))}
              </div>
            )}

            <div className="mt-5 flex justify-between items-center">
              <div className="text-xs md:text-sm text-[oklch(0.45_0.09_55)]">{g.lang === "en" ? "Correct so far:" : "अब तक सही:"} <b>{correctCount}</b></div>
              <button onClick={next} disabled={chosen === null} className="btn-playful disabled:opacity-40">
                {i < QUESTIONS.length - 1 ? (g.lang === "en" ? "Next" : "आगे") : (g.lang === "en" ? "Finish" : "समाप्त")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Eco-Basti Update ---------------- */

function EcoBastiUpdate() {
  const g = useGame();
  const nav = useNavigate();
  const tier = g.tiers["healthy-me"];
  const t = g.lang === "en";
  const headline = tier === "excellent"
    ? (t ? "Eco-Basti Grows Healthier" : "इको-बस्ती अधिक स्वस्थ बनी")
    : tier === "good"
      ? (t ? "Eco-Basti Says Thank You" : "इको-बस्ती धन्यवाद कहती है")
      : (t ? "Eco-Basti Still Needs You" : "इको-बस्ती को अभी तुम्हारी ज़रूरत है");
  const detail = tier === "excellent"
    ? (t ? "A shiny new datun station has appeared near the village well. Children are smiling brighter than ever!" : "गाँव के कुएँ के पास एक चमकदार नया दातुन स्थान बन गया है। बच्चे पहले से अधिक मुस्कुरा रहे हैं!")
    : tier === "good"
      ? (t ? "A few new plants sprout near the well. Come back and help Eco-Basti bloom fully!" : "कुएँ के पास कुछ नए पौधे उग आए हैं। आकर इको-बस्ती को पूरी तरह खिलाओ!")
      : (t ? "Eco-Basti is waiting patiently. Try the activity again and choose the healthiest habits." : "इको-बस्ती धैर्य से प्रतीक्षा कर रही है। गतिविधि फिर से करो और सबसे स्वस्थ आदतें चुनो।");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: "oklch(0.5 0.19 135)" }}>{headline}</h2>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)]">
        <img src={villageBg} alt="Eco-Basti" className="absolute inset-0 h-full w-full object-cover" />
        {tier === "excellent" && <div className="absolute top-6 left-8 h-8 w-8 rounded-full bg-yellow-300 animate-floaty shadow-md" />}
        <img src={tortoise} alt="" aria-hidden className="absolute bottom-6 left-1/2 -translate-x-1/2 h-40 md:h-56 animate-cheer" />
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