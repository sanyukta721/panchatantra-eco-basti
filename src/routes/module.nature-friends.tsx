import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopHUD } from "@/components/game/TopHUD";
import { useGame } from "@/context/GameContext";
import { ModuleOutcome } from "@/components/game/ModuleOutcome";
import deer from "@/assets/deer.png";
import dove from "@/assets/dove.png";
import mouse from "@/assets/mouse.png";
import villageBg from "@/assets/village-bg.jpg";
import skyBg from "@/assets/scene-sky.jpg";
import lakeBg from "@/assets/scene-lake.jpg";
import droughtBg from "@/assets/scene-drought.jpg";
import dovesBg from "@/assets/doves-net.jpg";
import forestGroundBg from "@/assets/forest-ground.jpg";
import { ArrowLeft, ArrowRight, Check, Leaf, X } from "lucide-react";

export const Route = createFileRoute("/module/nature-friends")({
  head: () => ({
    meta: [
      { title: "Nature Friends — The Dove and the Hunter" },
      { name: "description", content: "A Panchatantra tale that teaches children to repair, reuse and use everyday resources wisely." },
    ],
  }),
  component: NatureFriends,
});

const THEME = "oklch(0.7 0.18 195)";
const RING = "oklch(0.88 0.12 195)";

type Phase = "story" | "practice-intro" | "practice" | "activity" | "grove" | "outcome" | "update";

function NatureFriends() {
  const [phase, setPhase] = useState<Phase>("story");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const restart = () => { setScore({ correct: 0, total: 0 }); setPhase("activity"); };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.93_0.05_195)]">
      <TopHUD showHome />
      <div className="pt-24 md:pt-28 pb-8 px-3 md:px-8">
        {phase === "story" && <StoryBook onDone={() => setPhase("practice-intro")} />}
        {phase === "practice-intro" && <DeerMoral onNext={() => setPhase("practice")} />}
        {phase === "practice" && <RepairPractice onNext={() => setPhase("activity")} />}
        {phase === "activity" && (
          <NatureActivity onDone={(correct, total) => { setScore({ correct, total }); setPhase("grove"); }} />
        )}
        {phase === "grove" && (
          <GroveGame items={score.correct} onDone={() => setPhase("outcome")} />
        )}
        {phase === "outcome" && (
          <ModuleOutcome
            moduleId="nature-friends"
            moduleTitle={{ en: "Nature Friends", hi: "प्रकृति मित्र" }}
            correct={score.correct}
            total={score.total}
            character={deer}
            badgeEmoji="🌿"
            themeColor={THEME}
            onReplay={restart}
            onContinue={() => setPhase("update")}
            reflection={{
              en: "Repairing, reusing and switching things off saves resources — that is how we truly care for nature.",
              hi: "मरम्मत करना, दोबारा उपयोग करना और बंद कर देना — इनसे संसाधन बचते हैं और यही असली प्रकृति-प्रेम है।",
            }}
          />
        )}
        {phase === "update" && <EcoBastiUpdate />}
      </div>
    </div>
  );
}

/* ---------------- Story Book: The Dove and the Hunter ---------------- */

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
      bg: skyBg,
      en: "In the forest near Eco-Basti, a large flock of doves flew together. Their leader, King Chitragreeva, always led them safely to food and water.",
      hi: "इको-बस्ती के पास के जंगल में कबूतरों का बड़ा झुंड साथ-साथ उड़ता था। उनका राजा चित्रग्रीव उन्हें हमेशा भोजन और पानी तक सुरक्षित ले जाता।",
      characters: [
        { src: dove, className: "absolute top-6 left-[20%] h-20 md:h-28 animate-fly" },
        { src: dove, className: "absolute top-12 left-[45%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.4s" } },
        { src: dove, className: "absolute top-8 left-[70%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.8s" } },
      ],
    },
    {
      bg: dovesBg,
      en: "One day, they saw grains scattered on the ground. Hungry, they flew down to eat — but a cruel hunter had hidden a big net there.",
      hi: "एक दिन उन्होंने ज़मीन पर अनाज बिखरा देखा। भूख से वे नीचे उतरे — पर वहाँ एक क्रूर बहेलिये ने बड़ा जाल छिपा रखा था।",
      characters: [],
    },
    {
      bg: dovesBg,
      en: "The whole flock was trapped! The doves flapped and cried in fear. Chitragreeva said calmly, ‘If we panic alone, we lose. If we lift the net together, we can fly!’",
      hi: "पूरा झुंड फँस गया! कबूतर डर से फड़फड़ाने और रोने लगे। चित्रग्रीव ने शांति से कहा, ‘अकेले घबराए तो हार जाएँगे। साथ मिलकर जाल उठाएँ तो उड़ सकते हैं!’",
      characters: [
        { src: dove, className: "absolute bottom-16 left-[25%] h-20 md:h-28 animate-bob" },
        { src: dove, className: "absolute bottom-16 left-[45%] h-20 md:h-28 animate-bob", style: { animationDelay: "-0.4s" } },
        { src: dove, className: "absolute bottom-16 left-[65%] h-20 md:h-28 animate-bob", style: { animationDelay: "-0.7s" } },
      ],
      extra: <span aria-hidden className="absolute bottom-6 left-1/2 -translate-x-1/2 text-7xl md:text-8xl">🕸️</span>,
    },
    {
      bg: skyBg,
      en: "Together as one, every dove flapped its wings. Slowly the heavy net rose into the sky — teamwork lifted them above the hunter's reach!",
      hi: "सब एक होकर पंख फड़फड़ाने लगे। धीरे-धीरे भारी जाल आसमान में उठ गया — सहयोग ने उन्हें बहेलिये की पहुँच से ऊपर पहुँचा दिया!",
      characters: [
        { src: dove, className: "absolute top-4 left-[20%] h-20 md:h-28 animate-fly" },
        { src: dove, className: "absolute top-8 left-[40%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.3s" } },
        { src: dove, className: "absolute top-4 left-[60%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.6s" } },
        { src: dove, className: "absolute top-10 left-[78%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.9s" } },
      ],
      extra: <span aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-7xl animate-floaty">🕸️</span>,
    },
    {
      bg: forestGroundBg,
      en: "They flew to their friend, the wise mouse Hiranyaka. ‘Please help us, dear friend!’ said Chitragreeva. The kind mouse smiled and began to nibble.",
      hi: "वे अपने मित्र, बुद्धिमान चूहे हिरण्यक के पास उड़ गए। ‘मित्र, हमारी मदद करो!’ चित्रग्रीव बोला। दयालु चूहा मुस्कुराया और जाल कुतरने लगा।",
      characters: [
        { src: dove, className: "absolute top-8 left-[25%] h-20 md:h-28 animate-bob" },
        { src: dove, className: "absolute top-14 left-[45%] h-20 md:h-28 animate-bob", style: { animationDelay: "-0.4s" } },
        { src: mouse, className: "absolute bottom-6 right-[15%] h-24 md:h-32 animate-floaty" },
      ],
    },
    {
      bg: forestGroundBg,
      en: "One by one, the mouse cut every knot of the net and freed each dove. The whole flock flew away together, safe and free.",
      hi: "एक-एक करके चूहे ने जाल की हर गाँठ काटी और हर कबूतर को आज़ाद किया। पूरा झुंड साथ-साथ, सुरक्षित और आज़ाद, उड़ गया।",
      characters: [
        { src: dove, className: "absolute top-6 left-[20%] h-20 md:h-28 animate-fly" },
        { src: dove, className: "absolute top-10 left-[45%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.3s" } },
        { src: dove, className: "absolute top-6 left-[70%] h-20 md:h-28 animate-fly", style: { animationDelay: "-0.7s" } },
        { src: mouse, className: "absolute bottom-6 left-[10%] h-20 md:h-28 animate-cheer" },
      ],
    },
    {
      bg: villageBg,
      en: "Moral: Teamwork, helping others and caring for every living thing solves the biggest problems — that is how we care for nature.",
      hi: "सीख: सहयोग, दूसरों की मदद और हर जीव की देखभाल बड़ी से बड़ी मुसीबत हल कर देती है — यही असली प्रकृति-प्रेम है।",
      characters: [
        { src: deer, className: "absolute bottom-6 left-1/2 -translate-x-1/2 h-28 md:h-40 animate-floaty" },
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
            <span key={idx} className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-[oklch(0.55_0.18_195)]" : "w-2.5 bg-white/70 border border-[oklch(0.55_0.11_60)]"}`} />
          ))}
        </div>
        {i < scenes.length - 1 ? (
          <button onClick={() => setI((x) => x + 1)} className="btn-playful">{g.lang === "en" ? "Next" : "आगे"} <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button onClick={onDone} className="btn-playful">{g.lang === "en" ? "Meet Deer" : "हिरण से मिलो"} <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Deer moral bridge ---------------- */

function DeerMoral({ onNext }: { onNext: () => void }) {
  const g = useGame();
  useEffect(() => {
    g.speak(
      "Caring for nature isn't only about animals — it also means using resources wisely. Repair small things, reuse what you have, and never waste what is still useful.",
      "प्रकृति की देखभाल केवल जानवरों की मदद नहीं है — इसका मतलब है संसाधनों का समझदारी से उपयोग। छोटी चीज़ों की मरम्मत करो, जो है उसका दोबारा उपयोग करो, और जो अभी काम आ रहा है उसे बर्बाद मत करो।"
    );
    // eslint-disable-next-line
  }, []);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card-parchment p-5 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={deer} alt="Deer" className="h-40 md:h-56 animate-floaty drop-shadow-[0_10px_15px_rgba(0,0,0,.25)]" />
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl mb-3" style={{ color: THEME }}>
              {g.lang === "en" ? "A message from Deer" : "हिरण का संदेश"}
            </h2>
            <div className="relative card-parchment p-4 md:p-5 text-base md:text-lg">
              {g.lang === "en"
                ? "Just as the mouse repaired the doves' problem knot by knot, we can protect nature by repairing small things around us — a torn bag, a wobbly stool, a loose toy — before rushing to buy a new one."
                : "जैसे चूहे ने गाँठ-गाँठ काटकर कबूतरों की मुसीबत हल की, वैसे ही हम अपने आसपास की छोटी चीज़ों की मरम्मत करके प्रकृति की रक्षा कर सकते हैं — फटा थैला, हिलता स्टूल, ढीला खिलौना — नई चीज़ खरीदने से पहले।"}
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={onNext} className="btn-playful">{g.lang === "en" ? "Learn Repair" : "मरम्मत सीखो"} <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Repair Before You Replace Practice ---------------- */

interface PracticeStep {
  en: string; hi: string;
  icon: string;
  safe: boolean;
}

function RepairPractice({ onNext }: { onNext: () => void }) {
  const g = useGame();
  const steps: PracticeStep[] = useMemo(() => [
    { en: "Stitch a torn cloth bag with a needle and thread instead of throwing it away — it will last for many more months.", hi: "फटे कपड़े के थैले को फेंकने के बजाय सुई-धागे से सिलो — यह कई महीने और चलेगा।", icon: "🧵", safe: true },
    { en: "Tighten the loose leg of a wooden stool with a small nail or a piece of wood — it becomes strong again.", hi: "लकड़ी के स्टूल के ढीले पाए को छोटी कील या लकड़ी के टुकड़े से कस दो — यह फिर मज़बूत हो जाएगा।", icon: "🪑", safe: true },
    { en: "Weave a broken strand of a bamboo basket back in place — a small repair saves a whole basket.", hi: "बाँस की टोकरी की टूटी हुई पट्टी को फिर से बुन दो — छोटी मरम्मत पूरी टोकरी बचा लेती है।", icon: "🧺", safe: true },
    { en: "Only the rope of a bucket is broken. Tie a new rope handle instead of throwing away the whole bucket.", hi: "बाल्टी की सिर्फ़ रस्सी टूटी है। पूरी बाल्टी फेंकने के बजाय नई रस्सी बाँध दो।", icon: "🪣", safe: true },
    { en: "Repairing useful things before replacing them saves resources, reduces waste and protects nature.", hi: "उपयोगी चीज़ों को बदलने से पहले मरम्मत करना संसाधन बचाता है, कचरा घटाता है और प्रकृति की रक्षा करता है।", icon: "🌿", safe: true },
    { en: "Warning: don't throw a useful item just because it looks a little old — a small repair almost always brings it back.", hi: "सावधान: कोई भी उपयोगी चीज़ केवल थोड़ी पुरानी दिखने पर मत फेंको — छोटी मरम्मत लगभग हमेशा उसे वापस ठीक कर देती है।", icon: "⚠️", safe: false },
  ], []);
  const [i, setI] = useState(0);
  useEffect(() => { g.speak(steps[i].en, steps[i].hi); /* eslint-disable-next-line */ }, [i]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>{g.lang === "en" ? "Repair Before You Replace" : "बदलने से पहले मरम्मत करो"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)] mt-1">{g.lang === "en" ? "Small repairs that save big resources" : "छोटी मरम्मत, बड़े संसाधनों की बचत"}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 items-center">
        <div className={`relative rounded-3xl overflow-hidden border-4 shadow-[0_6px_0_oklch(0.35_0.1_55)] aspect-square flex items-center justify-center ${steps[i].safe ? "bg-[oklch(0.94_0.06_195)] border-[oklch(0.35_0.1_55)]" : "bg-[oklch(0.92_0.08_25)] border-[oklch(0.55_0.24_20)]"}`}>
          <span className="text-[8rem] md:text-[10rem] animate-floaty">{steps[i].icon}</span>
          <div className="absolute top-3 left-3 card-parchment px-3 py-1 text-xs font-bold">
            {g.lang === "en" ? `Step ${i + 1} / ${steps.length}` : `चरण ${i + 1} / ${steps.length}`}
          </div>
          {!steps[i].safe && (
            <div className="absolute top-3 right-3 card-parchment px-3 py-1 text-xs font-extrabold text-[oklch(0.5_0.22_25)]">
              {g.lang === "en" ? "AVOID THIS" : "इससे बचें"}
            </div>
          )}
        </div>
        <div className="card-parchment p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white font-extrabold border-2 border-[oklch(0.35_0.1_55)] ${steps[i].safe ? "bg-[oklch(0.55_0.18_195)]" : "bg-[oklch(0.55_0.24_20)]"}`}>{i + 1}</div>
            <div className="h-2 flex-1 rounded-full bg-[oklch(0.85_0.08_80)] overflow-hidden">
              <div className="h-full bg-[oklch(0.55_0.18_195)] transition-all" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
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

/* ---------------- Activity: Help Deer Make Smart Choices ---------------- */

interface Question {
  en: string; hi: string;
  options: Array<{ en: string; hi: string; correct: boolean; feedbackEn?: string; feedbackHi?: string }>;
}

const QUESTIONS: Question[] = [
  {
    en: "Amma is going shopping. Which bag should you hand her?",
    hi: "अम्मा बाज़ार जा रही हैं। उन्हें कौन-सा थैला दोगे?",
    options: [
      { en: "A cloth bag she can use again and again", hi: "कपड़े का थैला जो बार-बार काम आए", correct: true, feedbackEn: "A cloth bag saves many plastic bags and lasts for years.", feedbackHi: "कपड़े का थैला कई प्लास्टिक बचाता है और सालों चलता है।" },
      { en: "A new plastic bag from the shop", hi: "दुकान से नई प्लास्टिक थैली", correct: false, feedbackEn: "Plastic bags are used once and pollute for years. A cloth bag is a wiser choice.", feedbackHi: "प्लास्टिक थैली एक बार में फेंक दी जाती है और सालों तक प्रदूषण करती है। कपड़े का थैला बेहतर है।" },
    ],
  },
  {
    en: "There is good food left after lunch. What should you do?",
    hi: "दोपहर के खाने के बाद अच्छा भोजन बचा है। क्या करोगे?",
    options: [
      { en: "Cover it and save it for later", hi: "ढककर बाद के लिए रख दो", correct: true, feedbackEn: "Saving food respects the water, soil and hands that made it.", feedbackHi: "भोजन बचाना उस पानी, मिट्टी और मेहनत का सम्मान है जिसने उसे बनाया।" },
      { en: "Throw it in the dustbin", hi: "कूड़ेदान में फेंक दो", correct: false, feedbackEn: "Wasted food wastes water, land and effort. Save it or share it.", feedbackHi: "बर्बाद भोजन पानी, ज़मीन और मेहनत की बर्बादी है। बचा लो या बाँट दो।" },
    ],
  },
  {
    en: "Everyone is leaving the room. The lights and fan are still on. What do you do?",
    hi: "सब कमरे से बाहर जा रहे हैं। बत्तियाँ और पंखा अब भी चल रहे हैं। क्या करोगे?",
    options: [
      { en: "Switch off the lights and the fan", hi: "बत्तियाँ और पंखा बंद कर दो", correct: true, feedbackEn: "A quick switch off saves electricity every single day.", feedbackHi: "एक झटपट बटन बंद करना हर दिन बिजली बचाता है।" },
      { en: "Leave them running — we'll be back soon", hi: "चलते रहने दो — जल्दी वापस आ जाएँगे", correct: false, feedbackEn: "Even short times add up. Switching off protects nature and saves money.", feedbackHi: "थोड़ा-थोड़ा समय भी जुड़ जाता है। बंद करना प्रकृति बचाता है और पैसा भी।" },
    ],
  },
  {
    en: "Your favourite wooden toy has become a little loose. What is the best choice?",
    hi: "तुम्हारा प्रिय लकड़ी का खिलौना थोड़ा ढीला हो गया है। सबसे अच्छा क्या है?",
    options: [
      { en: "Repair it with a little glue or a tight thread", hi: "थोड़े गोंद या मज़बूत धागे से मरम्मत करो", correct: true, feedbackEn: "A small repair saves the toy and saves the tree that made it.", feedbackHi: "छोटी मरम्मत खिलौना भी बचाती है और उस पेड़ को भी जिससे यह बना।" },
      { en: "Throw it away and ask for a new one", hi: "फेंक दो और नया माँग लो", correct: false, feedbackEn: "Throwing useful things wastes resources. Repair first, replace only if you must.", feedbackHi: "उपयोगी चीज़ फेंकना संसाधनों की बर्बादी है। पहले मरम्मत करो, ज़रूरी हो तभी बदलो।" },
    ],
  },
];

function NatureActivity({ onDone }: { onDone: (correct: number, total: number) => void }) {
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
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>{g.lang === "en" ? "Help Deer Make Smart Choices" : "हिरण की मदद करो — समझदार निर्णय"}</h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">{g.lang === "en" ? `Situation ${i + 1} of ${QUESTIONS.length}` : `स्थिति ${i + 1} / ${QUESTIONS.length}`}</p>
      </div>

      <div className="card-parchment p-5 md:p-7 relative">
        <div className="flex items-start gap-4">
          <img src={deer} alt="Deer" className="hidden md:block h-24 animate-floaty" />
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
                      ${state === "idle" ? "bg-white border-[oklch(0.55_0.11_60)] hover:-translate-y-0.5 hover:bg-[oklch(0.97_0.05_195)]" : ""}
                      ${state === "correct" ? "bg-[oklch(0.92_0.09_195)] border-[oklch(0.5_0.18_195)]" : ""}
                      ${state === "wrong" ? "bg-[oklch(0.9_0.14_25)] border-[oklch(0.55_0.24_20)]" : ""}
                      ${state === "muted" ? "bg-white/60 border-[oklch(0.85_0.08_80)] opacity-70" : ""}
                    `}
                  >
                    <span className="inline-flex items-center gap-2">
                      {state === "correct" && <Check className="h-5 w-5 text-[oklch(0.5_0.18_195)]" />}
                      {state === "wrong" && <X className="h-5 w-5 text-[oklch(0.55_0.24_20)]" />}
                      {g.lang === "en" ? opt.en : opt.hi}
                    </span>
                  </button>
                );
              })}
            </div>

            {chosen !== null && (
              <div className={`mt-4 p-3 rounded-xl text-sm md:text-base font-semibold ${q.options[chosen].correct ? "bg-[oklch(0.95_0.07_195)] text-[oklch(0.3_0.15_195)]" : "bg-[oklch(0.95_0.08_25)] text-[oklch(0.4_0.2_25)]"}`}>
                {q.options[chosen].correct
                  ? (g.lang === "en"
                    ? ("You earned a Green Sapling! " + (q.options[chosen].feedbackEn ?? ""))
                    : ("तुमने एक हरा पौधा कमाया! " + (q.options[chosen].feedbackHi ?? "")))
                  : (g.lang === "en"
                    ? (q.options[chosen].feedbackEn ?? "Not the wisest choice. Think about repair and reuse.")
                    : (q.options[chosen].feedbackHi ?? "यह समझदारी नहीं। मरम्मत और दोबारा उपयोग के बारे में सोचो।"))}
              </div>
            )}

            <div className="mt-5 flex justify-between items-center">
              <div className="text-xs md:text-sm text-[oklch(0.45_0.09_55)] inline-flex items-center gap-1">
                <Leaf className="h-4 w-4 text-[oklch(0.55_0.18_195)]" /> {g.lang === "en" ? "Saplings:" : "पौधे:"} <b>{correctCount}</b>
              </div>
              <button onClick={next} disabled={chosen === null} className="btn-playful disabled:opacity-40">
                {i < QUESTIONS.length - 1 ? (g.lang === "en" ? "Next" : "आगे") : (g.lang === "en" ? "Grow the Grove" : "बगीचा उगाओ")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Deer's Grove Game ---------------- */

const SAPLINGS = ["🌱", "🌿", "🌾", "🍀"];

function GroveGame({ items, onDone }: { items: number; onDone: () => void }) {
  const g = useGame();
  const [placed, setPlaced] = useState(0);
  const total = Math.max(1, items);
  const grown = Math.min(100, (placed / total) * 100);

  useEffect(() => {
    g.speak(
      "Tap each sapling to plant it in Deer's grove — watch flowers bloom and butterflies come to visit!",
      "हर पौधे पर टैप करके हिरण के बगीचे में लगाओ — देखो कैसे फूल खिलते हैं और तितलियाँ आती हैं!"
    );
    // eslint-disable-next-line
  }, []);

  const done = placed >= items;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>
          {g.lang === "en" ? "Deer's Green Grove" : "हिरण का हरा बगीचा"}
        </h2>
        <p className="text-sm md:text-base text-[oklch(0.45_0.09_55)]">
          {g.lang === "en" ? `Plant your ${items} saplings` : `अपने ${items} पौधे लगाओ`}
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)] bg-gradient-to-b from-[oklch(0.9_0.06_210)] to-[oklch(0.82_0.09_150)]">
        {/* Sky brightens as grove grows */}
        <div className="absolute inset-0 transition-opacity duration-700"
             style={{ background: "linear-gradient(to bottom, oklch(0.95 0.06 210), transparent 55%)", opacity: grown / 100 }} />

        {/* Bare patches disappearing */}
        {grown < 90 && (
          <>
            <span className="absolute bottom-8 left-[18%] text-3xl md:text-4xl transition-opacity" style={{ opacity: 1 - grown / 100 }} aria-hidden>🪨</span>
            <span className="absolute bottom-16 left-[38%] text-3xl md:text-4xl transition-opacity" style={{ opacity: 1 - grown / 100 }} aria-hidden>🍂</span>
            <span className="absolute bottom-12 right-[32%] text-3xl md:text-4xl transition-opacity" style={{ opacity: 1 - grown / 100 }} aria-hidden>🌵</span>
          </>
        )}

        {/* Growing grove */}
        <div
          className="absolute right-[8%] bottom-6 w-40 md:w-56 h-32 md:h-44 rounded-2xl border-4 border-[oklch(0.35_0.1_55)] transition-all duration-700 flex flex-col items-center justify-center"
          style={{ background: `linear-gradient(to bottom, oklch(${0.75 + grown / 500} 0.14 150), oklch(${0.55 + grown / 500} 0.16 150))` }}
        >
          <Leaf className="h-10 w-10 md:h-14 md:w-14 text-white drop-shadow" />
          <div className="text-white font-extrabold text-sm md:text-base mt-1" style={{ textShadow: "0 2px 0 rgba(0,0,0,.35)" }}>
            {g.lang === "en" ? "Deer's Grove" : "हिरण का बगीचा"}
          </div>
          <div className="mt-1 h-2 w-24 rounded-full bg-white/40 overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${grown}%` }} />
          </div>
        </div>

        {/* Rewards appearing as grove grows */}
        {grown > 25 && <div className="absolute bottom-8 left-4 text-4xl md:text-5xl animate-floaty">🌱</div>}
        {grown > 45 && <div className="absolute bottom-8 left-24 text-4xl md:text-5xl animate-floaty" style={{ animationDelay: "-0.6s" }}>🌿</div>}
        {grown > 60 && <div className="absolute bottom-16 left-14 text-3xl md:text-4xl animate-pop">🌸</div>}
        {grown > 70 && <div className="absolute bottom-20 left-40 text-3xl md:text-4xl animate-pop">🌼</div>}
        {grown > 75 && <div className="absolute top-10 left-1/3 text-3xl animate-fly">🦋</div>}
        {grown > 85 && <div className="absolute top-16 right-1/3 text-3xl animate-fly" style={{ animationDelay: "-0.5s" }}>🐦</div>}
        {grown > 90 && <div className="absolute top-8 left-1/2 text-3xl animate-fly" style={{ animationDelay: "-0.8s" }}>🦋</div>}

        {/* Deer */}
        <img
          src={deer}
          alt=""
          aria-hidden
          className={`absolute h-24 md:h-32 transition-all duration-700 ${done ? "bottom-4 left-[38%] animate-cheer" : "bottom-4 left-6 animate-floaty"}`}
        />
      </div>

      {/* Sapling tray */}
      <div className="mt-5 card-parchment p-4 flex flex-wrap items-center justify-center gap-3">
        {Array.from({ length: items - placed }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPlaced((p) => Math.min(items, p + 1))}
            aria-label="Plant sapling"
            className="text-3xl md:text-4xl hover:scale-110 active:scale-95 transition-transform animate-floaty"
            style={{ animationDelay: `${-i * 0.25}s` }}
          >
            <span aria-hidden>{SAPLINGS[i % SAPLINGS.length]}</span>
          </button>
        ))}
        {items === 0 && (
          <p className="text-sm font-semibold text-[oklch(0.45_0.09_55)] text-center">
            {g.lang === "en" ? "No saplings yet — try the activity again to earn some!" : "अभी कोई पौधा नहीं — गतिविधि दोबारा करो और कमाओ!"}
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
  const tier = g.tiers["nature-friends"];
  const t = g.lang === "en";
  const headline = tier === "excellent"
    ? (t ? "Eco-Basti's Grove Blooms" : "इको-बस्ती का बगीचा खिल उठा")
    : tier === "good"
      ? (t ? "Eco-Basti is Turning Greener" : "इको-बस्ती और हरी हो रही है")
      : (t ? "Eco-Basti's Grove Waits for You" : "इको-बस्ती का बगीचा तुम्हारा इंतज़ार कर रहा है");
  const detail = tier === "excellent"
    ? (t ? "Deer's grove is full of flowers and saplings. Butterflies and birds have returned to Eco-Basti's nature corner." : "हिरण का बगीचा फूलों और पौधों से भरा है। तितलियाँ और पक्षी इको-बस्ती के प्रकृति-कोने में लौट आए हैं।")
    : tier === "good"
      ? (t ? "New saplings have taken root. Play again to fill the grove with butterflies and birds!" : "नए पौधे जड़ पकड़ चुके हैं। दोबारा खेलो और बगीचे को तितलियों-पक्षियों से भर दो!")
      : (t ? "The grove is still bare. Try again — every wise choice plants a new sapling." : "बगीचा अभी सूना है। फिर से कोशिश करो — हर समझदार निर्णय एक नया पौधा लगाता है।");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl" style={{ color: THEME }}>{headline}</h2>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-[oklch(0.35_0.1_55)] shadow-[0_6px_0_oklch(0.35_0.1_55)]">
        <img src={villageBg} alt="Eco-Basti" className="absolute inset-0 h-full w-full object-cover" />
        {/* Nature Friends grove near deer's area */}
        {tier && tier !== "poor" && (
          <div
            className="absolute bottom-10 left-[42%] w-36 h-24 rounded-2xl border-4 border-[oklch(0.35_0.1_55)] flex items-center justify-center animate-pop"
            style={{ background: `linear-gradient(to bottom, ${RING}, ${THEME})` }}
          >
            <Leaf className="h-10 w-10 text-white drop-shadow" />
          </div>
        )}
        {tier === "excellent" && (
          <>
            <div className="absolute bottom-8 left-[38%] text-3xl animate-floaty">🌸</div>
            <div className="absolute bottom-8 left-[56%] text-3xl animate-floaty" style={{ animationDelay: "-0.6s" }}>🌼</div>
            <div className="absolute top-20 left-[48%] text-2xl animate-fly">🦋</div>
            <div className="absolute top-14 left-[60%] text-2xl animate-fly" style={{ animationDelay: "-0.4s" }}>🐦</div>
          </>
        )}
        <img src={deer} alt="" aria-hidden className="absolute bottom-6 left-[30%] h-28 md:h-36 animate-cheer" />
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