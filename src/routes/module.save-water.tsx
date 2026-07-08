import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopHUD } from "@/components/game/TopHUD";
import { useGame } from "@/context/GameContext";
import { ModuleOutcome } from "@/components/game/ModuleOutcome";
import crow from "@/assets/crow.png";
import lakeBg from "@/assets/scene-lake.jpg";
import droughtBg from "@/assets/scene-drought.jpg";
import skyBg from "@/assets/scene-sky.jpg";
import villageBg from "@/assets/village-bg.jpg";
import { ArrowLeft, ArrowRight, Check, Droplet, X } from "lucide-react";

export const Route = createFileRoute("/module/save-water")({
  head: () => ({
    meta: [
      { title: "Save Water — The Thirsty Crow" },
      { name: "description", content: "An interactive classical moral story that teaches children to reuse water and value every drop." },
    ],
  }),
  component: SaveWater,
});

type Phase = "story" | "practice-intro" | "practice" | "activity" | "pond" | "outcome" | "update";

function SaveWater() {
  const [phase, setPhase] = useState<Phase>("story");
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const restart = () => { setScore({ correct: 0, total: 0 }); setPhase("activity"); };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.85_0.09_235)]">
      <TopHUD showHome />
      <div className="pt-24 md:pt-28 pb-8 px-3 md:px-8">
        {phase === "story" && <StoryBook onDone={() => setPhase("practice-intro")} />}
        {phase === "practice-intro" && <CrowMoral onNext={() => setPhase("practice")} />}
        {phase === "practice" && <WaterReusePractice onNext={() => setPhase("activity")} />}
        {phase === "activity" && (
          <SaveWaterActivity
            onDone={(correct, total) => { setScore({ correct, total }); setPhase("pond"); }}
          />
        )}
        {phase === "pond" && (
          <PondFillGame drops={score.correct} onDone={() => setPhase("outcome")} />
        )}
        {phase === "outcome" && (
          <ModuleOutcome
            moduleId="save-water"
            moduleTitle={{ en: "Save Water", hi: "जल बचाओ" }}
            correct={score.correct}
            total={score.total}
            character={crow}
            badgeEmoji="💧"
            themeColor="oklch(0.55 0.18 235)"
            onReplay={restart}
            onContinue={() => setPhase("update")}
            reflection={{
              en: "Every drop has value. Reusing water, closing taps, and bucket bathing keep Eco-Basti's ponds full.",
              hi: "हर बूँद कीमती है। पानी दोबारा उपयोग करना, नल बंद रखना और बाल्टी से नहाना — इससे इको-बस्ती के तालाब भरे रहते हैं।",
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
  const [pebbles, setPebbles] = useState(0);

  const scenes: Scene[] = useMemo(() => [
    {
      bg: droughtBg,
      en: "On a hot summer day in Eco-Basti, a thirsty crow flew far and wide searching for water. His throat felt as dry as the cracked earth below.",
      hi: "इको-बस्ती की एक तपती दोपहर में, एक प्यासा कौआ पानी की खोज में दूर-दूर उड़ता रहा। उसका गला नीचे की सूखी धरती जैसा सूख गया था।",
      characters: [
        { src: crow, className: "absolute top-10 left-1/2 -translate-x-1/2 h-28 md:h-40 animate-fly" },
      ],
    },
    {
      bg: droughtBg,
      en: "At last, near a quiet garden, he spotted a clay pot. He flew down, hopeful — but only a little water rested at the very bottom.",
      hi: "आख़िरकार, एक शांत बगीचे के पास उसे एक मिट्टी का घड़ा दिखा। वह उम्मीद से नीचे उतरा — पर घड़े में बहुत नीचे थोड़ा-सा ही पानी था।",
      characters: [
        { src: crow, className: "absolute top-16 left-[42%] h-24 md:h-32 animate-fly" },
      ],
      extra: <Pot fillPct={12} />,
    },
    {
      bg: droughtBg,
      en: "He stretched his beak in — but it would not reach. He thought and thought. Then he saw small pebbles nearby, and an idea sparkled in his eyes!",
      hi: "उसने चोंच अंदर डाली — पर पानी तक नहीं पहुँची। वह सोचता रहा। तभी पास में छोटे-छोटे कंकड़ दिखे, और उसकी आँखों में एक विचार चमका!",
      characters: [
        { src: crow, className: "absolute bottom-8 left-[40%] h-28 md:h-40 animate-bob" },
      ],
      extra: <Pot fillPct={18} />,
    },
    {
      bg: droughtBg,
      en: "Tap the pebbles to help the crow — drop them into the pot, one by one!",
      hi: "कौए की मदद करो — कंकड़ पर टैप करके एक-एक करके घड़े में डालो!",
      characters: [
        { src: crow, className: "absolute top-8 right-[10%] h-24 md:h-32 animate-fly" },
      ],
      extra: <PebbleDrop pebbles={pebbles} onDrop={() => setPebbles((p) => Math.min(6, p + 1))} />,
    },
    {
      bg: droughtBg,
      en: "Slowly, slowly, the water rose to the top. The clever crow drank happily. Every drop had been saved!",
      hi: "धीरे-धीरे पानी ऊपर आ गया। चतुर कौए ने ख़ुशी-ख़ुशी पानी पिया। हर बूँद बच गई!",
      characters: [
        { src: crow, className: "absolute bottom-6 left-1/2 -translate-x-1/2 h-28 md:h-40 animate-cheer" },
      ],
      extra: <Pot fillPct={92} />,
    },
    {
      bg: villageBg,
      en: "Moral: Every drop has value. With patience and small wise actions, we can save water — and water saves us back.",
      hi: "सीख: हर बूँद कीमती है। धैर्य और छोटे-छोटे बुद्धिमान कामों से हम पानी बचा सकते हैं — और पानी हमें बचाता है।",
      characters: [
        { src: crow, className: "absolute bottom-6 left-1/2 -translate-x-1/2 h-28 md:h-40 animate-floaty" },
      ],
    },
  ], [pebbles]);

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
            <span key={idx} className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-[oklch(0.55_0.18_235)]" : "w-2.5 bg-white/70 border border-[oklch(0.55_0.11_60)]"}`} />
          ))}
        </div>
        {i < scenes.length - 1 ? (
          <button onClick={() => setI((x) => x + 1)} className="btn-playful">{g.lang === "en" ? "Next" : "आगे"} <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button onClick={onDone} className="btn-playful">{g.lang === "en" ? "Meet Crow" : "कौए से मिलो"} <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
}

function Pot({ fillPct }: { fillPct: number }) {
  return (
    <div aria-hidden className="absolute bottom-6 right-[16%] w-28 md:w-36">
      <div className="relative h-32 md:h-40 w-full rounded-b-[45%] rounded-t-2xl border-4 border-[oklch(0.35_0.1_55)] bg-[oklch(0.55_0.12_45)] overflow-hidden shadow-[0_6px_0_oklch(0.25_0.08_45)]">
        <div
          className="absolute inset-x-1 bottom-1 rounded-b-[45%] bg-[oklch(0.6_0.16_235)] transition-[height] duration-700"
          style={{ height: `${fillPct}%` }}
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-white/60 rounded" />
        </div>
      </div>
    </div>
  );
}

function PebbleDrop({ pebbles, onDrop }: { pebbles: number; onDrop: () => void }) {
  const fill = 18 + pebbles * 12;
  return (
    <>
      <Pot fillPct={Math.min(fill, 92)} />
      <div className="absolute bottom-8 left-6 flex flex-wrap gap-2 max-w-[45%]">
        {Array.from({ length: 6 - pebbles }).map((_, i) => (
          <button
            key={i}
            onClick={onDrop}
            aria-label="Drop a pebble"
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[oklch(0.55_0.03_60)] border-2 border-[oklch(0.35_0.06_55)] shadow-md hover:scale-110 active:scale-95 animate-floaty"
            style={{ animationDelay: `${-i * 0.3}s` }}
          />
        ))}
      </div>
    </>
  );
}

/* ---------------- Crow moral ---------------- */

function CrowMoral({ onNext }: { onNext: () => void }) {
  const g = useGame();
  useEffect(() => {
    g.speak(
      "Caw! Little friend, I used every drop wisely — and so can you. In your home, water is precious. Reuse it, don't let it flow away, and every drop will help Eco-Basti stay green.",
      "काँव! नन्हे मित्र, मैंने हर बूँद बुद्धिमानी से इस्तेमाल की — तुम भी कर सकते हो। तुम्हारे घर में पानी बहुत कीमती है। इसे दोबारा उपयोग करो, बहने मत दो, और हर बूँद इको-बस्ती को हरा-भरा रखेगी।"
    );
    // eslint-disable-next-line
  }, []);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card-parchment p-5 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={crow} alt="Crow" className="h-40 md:h-56 animate-fly drop-shadow-[0_10px_15px_rgba(0,0,0,.25)]" />
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl mb-3" style={{ color: "oklch(0.5 0.18 235)" }}>
              {g.lang === "en" ? "A message from Crow" : "कौए का संदेश"}
            </h2>
            <div className="relative card-parchment p-4 md:p-5 text-base md:text-lg">
              {g.lang === "en"
                ? "Just as I saved every drop in the pot, you can save water at home. Reuse it, close taps, and bathe with a bucket — every drop keeps Eco-Basti alive."
                : "जैसे मैंने घड़े की हर बूँद बचाई, वैसे ही तुम घर में पानी बचा सकते हो। दोबारा उपयोग करो, नल बंद रखो और बाल्टी से नहाओ — हर बूँद इको-बस्ती को जीवित रखती है।"}
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={onNext} className="btn-playful">{g.lang === "en" ? "Learn Water Reuse" : "पानी दोबारा उपयोग सीखो"} <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Water Reuse Practice ---------------- */

interface PracticeStep {
  en: string; hi: string;
  visual: React.ReactNode;
  safe: boolean;
}

function WaterReusePractice({ onNext }: { onNext: () => void }) {
  const g = useGame();
  const steps: PracticeStep[] = useMemo(() => [
    {
      en: "Water used to wash vegetables is clean enough to pour into plant pots.",
      hi: "सब्ज़ी धोने का पानी पौधों के गमलों में डालने योग्य होता है।",
      visual: <ReuseScene from="🥬" to="🪴" />,
      safe: true,
    },
    {
      en: "Extra drinking water left in your glass? Give it to plants or a bird bowl instead of throwing it out.",
      hi: "गिलास में बचा हुआ पीने का पानी? फेंकने के बजाय पौधों या पक्षियों के बर्तन में डालो।",
      visual: <ReuseScene from="🥛" to="🐦" />,
      safe: true,
    },
    {
      en: "The last rinse water from washing rice can be used to mop the front step or clean an outdoor area.",
      hi: "चावल धोने का आख़िरी पानी दरवाज़े या बाहर की जगह पोंछने में इस्तेमाल हो सकता है।",
      visual: <ReuseScene from="🍚" to="🧹" />,
      safe: true,
    },
    {
      en: "Bathe with a bucket and mug — you use far less water than a running tap or shower.",
      hi: "बाल्टी और मग से नहाओ — नल या शॉवर से बहुत कम पानी लगेगा।",
      visual: <ReuseScene from="🚿" to="🪣" />,
      safe: true,
    },
    {
      en: "Turn the tap OFF while brushing or soaping — open it only when you actually need water.",
      hi: "ब्रश करते या साबुन लगाते समय नल बंद रखो — पानी की ज़रूरत हो तभी खोलो।",
      visual: <ReuseScene from="🚰" to="✋" />,
      safe: true,
    },
    {
      en: "Warning: water with soap, oil, or toilet water must NOT be reused for plants, animals, or cleaning food.",
      hi: "सावधान: साबुन, तेल या शौचालय का पानी पौधों, जानवरों या भोजन धोने के लिए दोबारा इस्तेमाल न करो।",
      visual: <ReuseScene from="🧼" to="🚫" />,
      safe: false,
    },
  ], []);
  const [i, setI] = useState(0);
  useEffect(() => { g.speak(steps[i].en, steps[i].hi); /* eslint-disable-next-line */ }, [i]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: "oklch(0.5 0.18 235)" }}>{g.lang === "en" ? "Give Every Drop a Second Life" : "हर बूँद को दूसरा जीवन दो"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)] mt-1">{g.lang === "en" ? "Practical water reuse for your home" : "घर में पानी के दोबारा उपयोग के व्यावहारिक तरीके"}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 items-center">
        <div className={`relative rounded-3xl overflow-hidden border-4 shadow-[0_6px_0_oklch(0.35_0.1_55)] aspect-square flex items-center justify-center ${steps[i].safe ? "bg-[oklch(0.9_0.09_200)] border-[oklch(0.35_0.1_55)]" : "bg-[oklch(0.92_0.08_25)] border-[oklch(0.55_0.24_20)]"}`}>
          {steps[i].visual}
          <div className="absolute top-3 left-3 card-parchment px-3 py-1 text-xs font-bold">
            {g.lang === "en" ? `Step ${i + 1} / ${steps.length}` : `चरण ${i + 1} / ${steps.length}`}
          </div>
          {!steps[i].safe && (
            <div className="absolute top-3 right-3 card-parchment px-3 py-1 text-xs font-extrabold text-[oklch(0.5_0.22_25)]">
              {g.lang === "en" ? "DO NOT REUSE" : "दोबारा न करें"}
            </div>
          )}
        </div>
        <div className="card-parchment p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white font-extrabold border-2 border-[oklch(0.35_0.1_55)] ${steps[i].safe ? "bg-[oklch(0.55_0.18_235)]" : "bg-[oklch(0.55_0.24_20)]"}`}>{i + 1}</div>
            <div className="h-2 flex-1 rounded-full bg-[oklch(0.85_0.08_80)] overflow-hidden">
              <div className="h-full bg-[oklch(0.55_0.18_235)] transition-all" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
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

function ReuseScene({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center gap-6 text-6xl md:text-7xl">
      <span className="animate-floaty">{from}</span>
      <Droplet className="h-10 w-10 md:h-14 md:w-14 text-[oklch(0.55_0.18_235)] animate-bob" />
      <span className="animate-floaty" style={{ animationDelay: "-0.6s" }}>{to}</span>
    </div>
  );
}

/* ---------------- Activity ---------------- */

interface Question {
  en: string; hi: string;
  options: Array<{ en: string; hi: string; correct: boolean; feedbackEn?: string; feedbackHi?: string }>;
}

const QUESTIONS: Question[] = [
  {
    en: "Amma just finished washing spinach in a bowl of water. What should you do with the water?",
    hi: "अम्मा ने अभी पालक धोई और कटोरे में पानी बचा है। इस पानी का क्या करोगे?",
    options: [
      { en: "Pour it into the tulsi pot outside", hi: "बाहर तुलसी के गमले में डाल दो", correct: true },
      { en: "Throw it down the drain", hi: "नाली में बहा दो", correct: false, feedbackEn: "That water is clean enough for plants — reuse it!", feedbackHi: "यह पानी पौधों के लिए साफ़ है — दोबारा इस्तेमाल करो!" },
    ],
  },
  {
    en: "You are brushing your teeth. The tap is running. What do you do?",
    hi: "तुम ब्रश कर रहे हो और नल खुला है। क्या करोगे?",
    options: [
      { en: "Turn the tap OFF and open it only to rinse", hi: "नल बंद कर दो, सिर्फ़ कुल्ला करते समय खोलो", correct: true },
      { en: "Leave it running — it's just a little water", hi: "खुला रहने दो — थोड़ा ही तो पानी है", correct: false, feedbackEn: "A running tap can waste 5+ litres in 2 minutes. Close it!", feedbackHi: "खुला नल 2 मिनट में 5 लीटर से ज़्यादा पानी बर्बाद कर सकता है। बंद करो!" },
    ],
  },
  {
    en: "It is bath time. Which is the most water-saving choice?",
    hi: "नहाने का समय है। सबसे कम पानी किसमें लगेगा?",
    options: [
      { en: "One bucket of water with a mug", hi: "एक बाल्टी पानी और मग", correct: true },
      { en: "A long shower under a running tap", hi: "लंबा शॉवर, नल खुला", correct: false, feedbackEn: "A shower uses many buckets of water. Try a bucket bath.", feedbackHi: "शॉवर से कई बाल्टी पानी बहता है। बाल्टी से नहाओ।" },
      { en: "Fill the whole bathroom bucket and let it overflow", hi: "पूरी बाल्टी भर कर बहने दो", correct: false },
    ],
  },
  {
    en: "There is half a glass of clean drinking water left over. What is best?",
    hi: "आधा गिलास पीने का पानी बचा है। सबसे अच्छा क्या है?",
    options: [
      { en: "Pour it into a bird bowl or a plant", hi: "पक्षी के बर्तन या पौधे में डाल दो", correct: true },
      { en: "Throw it into the sink", hi: "सिंक में फेंक दो", correct: false, feedbackEn: "Every clean drop can help a plant or thirsty bird.", feedbackHi: "हर साफ़ बूँद किसी पौधे या प्यासे पक्षी की मदद कर सकती है।" },
    ],
  },
  {
    en: "You washed clothes with soap. Can you use that soapy water for the tulsi plant?",
    hi: "तुमने साबुन से कपड़े धोए। क्या वह साबुन वाला पानी तुलसी में डाल सकते हो?",
    options: [
      { en: "No — soapy water can harm plants and animals", hi: "नहीं — साबुन वाला पानी पौधों और जानवरों को नुक़सान करता है", correct: true },
      { en: "Yes, it is still water", hi: "हाँ, आख़िर पानी ही है", correct: false, feedbackEn: "Soap and chemicals hurt roots. Use it only for outdoor cleaning.", feedbackHi: "साबुन-रसायन जड़ों को हानि पहुँचाते हैं। इसे केवल बाहर सफ़ाई में इस्तेमाल करो।" },
    ],
  },
  {
    en: "You see a tap dripping in the courtyard. What do you do first?",
    hi: "आँगन में एक नल टपक रहा है। पहले क्या करोगे?",
    options: [
      { en: "Tighten it and tell an adult to fix it", hi: "बंद करो और बड़ों को ठीक करवाने को कहो", correct: true },
      { en: "Ignore it, someone else will notice", hi: "छोड़ दो, कोई और देख लेगा", correct: false, feedbackEn: "A dripping tap can waste 30+ litres a day. Act quickly!", feedbackHi: "टपकता नल रोज़ 30+ लीटर पानी बर्बाद करता है। तुरंत कदम उठाओ!" },
    ],
  },
];

function SaveWaterActivity({ onDone }: { onDone: (correct: number, total: number) => void }) {
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
        <h2 className="text-2xl md:text-4xl" style={{ color: "oklch(0.5 0.18 235)" }}>{g.lang === "en" ? "Help Crow Save Every Drop" : "कौए की मदद करो — हर बूँद बचाओ"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">{g.lang === "en" ? `Situation ${i + 1} of ${QUESTIONS.length}` : `स्थिति ${i + 1} / ${QUESTIONS.length}`}</p>
      </div>

      <div className="card-parchment p-5 md:p-7 relative">
        <div className="flex items-start gap-4">
          <img src={crow} alt="Crow" className="hidden md:block h-24 animate-fly" />
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
                      ${state === "idle" ? "bg-white border-[oklch(0.55_0.11_60)] hover:-translate-y-0.5 hover:bg-[oklch(0.97_0.05_235)]" : ""}
                      ${state === "correct" ? "bg-[oklch(0.9_0.1_200)] border-[oklch(0.5_0.18_235)]" : ""}
                      ${state === "wrong" ? "bg-[oklch(0.9_0.14_25)] border-[oklch(0.55_0.24_20)]" : ""}
                      ${state === "muted" ? "bg-white/60 border-[oklch(0.85_0.08_80)] opacity-70" : ""}
                    `}
                  >
                    <span className="inline-flex items-center gap-2">
                      {state === "correct" && <Check className="h-5 w-5 text-[oklch(0.5_0.18_235)]" />}
                      {state === "wrong" && <X className="h-5 w-5 text-[oklch(0.55_0.24_20)]" />}
                      {g.lang === "en" ? opt.en : opt.hi}
                    </span>
                  </button>
                );
              })}
            </div>

            {chosen !== null && (
              <div className={`mt-4 p-3 rounded-xl text-sm md:text-base font-semibold ${q.options[chosen].correct ? "bg-[oklch(0.95_0.08_220)] text-[oklch(0.3_0.16_235)]" : "bg-[oklch(0.95_0.08_25)] text-[oklch(0.4_0.2_25)]"}`}>
                {q.options[chosen].correct
                  ? (g.lang === "en" ? "You earned a Water Drop! Every drop matters." : "तुमने एक जल-बूँद कमाई! हर बूँद कीमती है।")
                  : (g.lang === "en"
                    ? (q.options[chosen].feedbackEn ?? "Not the best choice. Think about saving water.")
                    : (q.options[chosen].feedbackHi ?? "यह सबसे अच्छा विकल्प नहीं। पानी बचाने की सोचो।"))}
              </div>
            )}

            <div className="mt-5 flex justify-between items-center">
              <div className="text-xs md:text-sm text-[oklch(0.45_0.09_55)] inline-flex items-center gap-1">
                <Droplet className="h-4 w-4 text-[oklch(0.55_0.18_235)]" /> {g.lang === "en" ? "Drops earned:" : "बूँदें अर्जित:"} <b>{correctCount}</b>
              </div>
              <button onClick={next} disabled={chosen === null} className="btn-playful disabled:opacity-40">
                {i < QUESTIONS.length - 1 ? (g.lang === "en" ? "Next" : "आगे") : (g.lang === "en" ? "Fill the Pond" : "तालाब भरो")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Pond Fill Game ---------------- */

function PondFillGame({ drops, onDone }: { drops: number; onDone: () => void }) {
  const g = useGame();
  const [added, setAdded] = useState(0);
  const total = Math.max(1, drops);
  const fill = Math.min(100, 10 + (added / total) * 85);

  useEffect(() => {
    g.speak(
      "Tap each water drop to pour it into Crow's dry pond and watch it come back to life!",
      "हर जल-बूँद पर टैप करो और कौए के सूखे तालाब में डालो — देखो कैसे तालाब फिर से जीवित होता है!"
    );
    // eslint-disable-next-line
  }, []);

  const done = added >= drops;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: "oklch(0.5 0.18 235)" }}>
          {g.lang === "en" ? "Fill Crow's Pond" : "कौए का तालाब भरो"}
        </h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">
          {g.lang === "en" ? `Add your ${drops} Water Drops` : `अपनी ${drops} जल-बूँदें डालो`}
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)] bg-gradient-to-b from-[oklch(0.88_0.06_80)] to-[oklch(0.7_0.1_70)]">
        {/* Sky brightens */}
        <div className="absolute inset-0 transition-opacity duration-700"
             style={{ background: "linear-gradient(to bottom, oklch(0.9 0.08 220), transparent 50%)", opacity: fill / 100 }} />

        {/* Pond */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[70%] rounded-[50%] border-4 border-[oklch(0.35_0.1_55)] overflow-hidden transition-all duration-700 shadow-inner"
          style={{ height: `${20 + fill * 0.5}%`, background: `linear-gradient(to top, oklch(0.5 0.18 235), oklch(0.7 0.14 210))` }}
        >
          {fill > 40 && <div className="absolute top-2 left-6 text-2xl animate-floaty">🐟</div>}
          {fill > 60 && <div className="absolute top-4 right-8 text-2xl animate-bob">🐠</div>}
        </div>

        {/* Plants around pond */}
        {fill > 30 && <div className="absolute bottom-6 left-4 text-4xl md:text-5xl animate-floaty">🌱</div>}
        {fill > 50 && <div className="absolute bottom-6 right-4 text-4xl md:text-5xl animate-floaty" style={{ animationDelay: "-0.6s" }}>🌿</div>}
        {fill > 70 && <div className="absolute bottom-14 left-10 text-3xl md:text-4xl animate-pop">🌸</div>}
        {fill > 70 && <div className="absolute bottom-16 right-14 text-3xl md:text-4xl animate-pop">🌼</div>}
        {fill > 80 && <div className="absolute top-8 right-1/3 text-3xl animate-fly">🦋</div>}

        {/* Crow */}
        <img
          src={crow}
          alt=""
          aria-hidden
          className={`absolute h-24 md:h-32 transition-all duration-700 ${done ? "bottom-4 left-8 animate-cheer" : "top-6 left-8 animate-fly"}`}
        />

        {/* Splash particles */}
        {Array.from({ length: added }).map((_, i) => (
          <div key={i} className="absolute bottom-[35%] left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white/70"
               style={{ transform: `translate(${(i - added / 2) * 10}px, 0)` }} />
        ))}
      </div>

      {/* Drop tray */}
      <div className="mt-5 card-parchment p-4 flex flex-wrap items-center justify-center gap-3">
        {Array.from({ length: drops - added }).map((_, i) => (
          <button
            key={i}
            onClick={() => setAdded((a) => Math.min(drops, a + 1))}
            aria-label="Add water drop"
            className="hover:scale-110 active:scale-95 transition-transform animate-floaty"
            style={{ animationDelay: `${-i * 0.25}s` }}
          >
            <Droplet className="h-10 w-10 fill-[oklch(0.7_0.14_220)] text-[oklch(0.4_0.18_235)]" />
          </button>
        ))}
        {drops === 0 && (
          <p className="text-sm font-semibold text-[oklch(0.45_0.09_55)] text-center">
            {g.lang === "en" ? "No drops yet — try the activity again to earn some!" : "अभी कोई बूँद नहीं — गतिविधि दोबारा करो और बूँदें कमाओ!"}
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
  const tier = g.tiers["save-water"];
  const t = g.lang === "en";
  const headline = tier === "excellent"
    ? (t ? "Eco-Basti's Pond is Full Again" : "इको-बस्ती का तालाब फिर भर गया")
    : tier === "good"
      ? (t ? "Eco-Basti Sips Every Drop" : "इको-बस्ती हर बूँद पी रही है")
      : (t ? "Eco-Basti's Pond Still Waits" : "इको-बस्ती का तालाब अभी प्रतीक्षा में है");
  const detail = tier === "excellent"
    ? (t ? "The Save Water pond is sparkling. Fish swim, flowers bloom, and Crow drinks happily every day." : "जल-बचाओ तालाब चमक रहा है। मछलियाँ तैरती हैं, फूल खिलते हैं और कौआ रोज़ ख़ुशी से पानी पीता है।")
    : tier === "good"
      ? (t ? "A little water has returned to Crow's pond. Play again to fill it right up!" : "कौए के तालाब में थोड़ा पानी लौट आया है। दोबारा खेलो और पूरा भर दो!")
      : (t ? "Crow's pond is still dry. Try the activity again and save every drop." : "कौए का तालाब अभी सूखा है। गतिविधि दोबारा करो और हर बूँद बचाओ।");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: "oklch(0.5 0.18 235)" }}>{headline}</h2>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)]">
        <img src={villageBg} alt="Eco-Basti" className="absolute inset-0 h-full w-full object-cover" />
        {/* Save Water area gets its pond bloom only */}
        {tier && tier !== "poor" && (
          <div className="absolute bottom-8 left-[18%] w-40 h-16 rounded-[50%] border-4 border-[oklch(0.35_0.1_55)] bg-gradient-to-b from-[oklch(0.7_0.14_210)] to-[oklch(0.5_0.18_235)] animate-pop" />
        )}
        {tier === "excellent" && (
          <>
            <div className="absolute bottom-24 left-[15%] text-3xl animate-floaty">🌸</div>
            <div className="absolute bottom-24 left-[26%] text-3xl animate-floaty" style={{ animationDelay: "-0.6s" }}>🌼</div>
          </>
        )}
        <img src={crow} alt="" aria-hidden className="absolute bottom-6 left-[36%] h-32 md:h-40 animate-cheer" />
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