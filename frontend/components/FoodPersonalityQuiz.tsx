"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, RefreshCw, Share2, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const QUESTIONS = [
    {
        id: 1,
        text: "It's pouring rain outside. What hits the spot?",
        options: [
            { text: "Steaming Hot Vada Pav", sub: "With extra red chutney 🔥", type: "spicy" },
            { text: "Warm Gulab Jamun", sub: "Soaked in rose syrup 🌹", type: "sweet" },
            { text: "Buttery Masala Toast", sub: "Loaded with cheese 🧀", type: "cheesy" }
        ]
    },
    {
        id: 2,
        text: "What's the most satisfying texture?",
        options: [
            { text: "The CRUNCH", sub: "Crispy Pani Puri shells", type: "spicy" },
            { text: "The MELT", sub: "Creamy Malai Kulfi", type: "sweet" },
            { text: "The STRETCH", sub: "Gooey Cheese Dosa", type: "cheesy" }
        ]
    },
    {
        id: 3,
        text: "Pick your ideal food vibe:",
        options: [
            { text: "Noisy Street Corner", sub: "Chaos & flavor explosion", type: "spicy" },
            { text: "Late Night Dessert Run", sub: "Sweet endings with friends", type: "sweet" },
            { text: "Lazy Sunday Breakfast", sub: "Comfort food & chill", type: "cheesy" }
        ]
    }
];

export const RESULTS = {
    spicy: {
        title: "The Heat Seeker",
        subtitle: "Bold. Fiery. Unstoppable.",
        desc: "You live for the thrill. Like a spicy Thecha, your personality is intense, memorable, and wakes people up!",
        color: "from-orange-500 to-red-600",
        icon: "🔥",
        bg: "bg-orange-950"
    },
    sweet: {
        title: "The Sweet Soul",
        subtitle: "Warm. Joyful. Delightful.",
        desc: "You bring the good vibes. You're the Jalebi of your group—twisty, fun, and making everything better.",
        color: "from-pink-500 to-rose-600",
        icon: "✨",
        bg: "bg-pink-950"
    },
    cheesy: {
        title: "The Comfort King",
        subtitle: "Reliable. Chill. Classic.",
        desc: "You're the definition of comfort. Like extra cheese on a Pav Bhaji, you make life richer and smoother.",
        color: "from-yellow-400 to-amber-500",
        icon: "👑",
        bg: "bg-yellow-950"
    }
};

export function FoodPersonalityQuiz() {
    const [started, setStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<keyof typeof RESULTS | null>(null);

    // Load saved result on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("tasteArchetype");
            if (saved && RESULTS[saved as keyof typeof RESULTS]) {
                setResult(saved as keyof typeof RESULTS);
                setStarted(true);
            }
        }
    }, []);

    const handleStart = () => setStarted(true);

    const handleAnswer = (type: string) => {
        const newAnswers = [...answers, type];
        setAnswers(newAnswers);

        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: string[]) => {
        const counts: Record<string, number> = {};
        finalAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
        const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

        setResult(winner as keyof typeof RESULTS);
        localStorage.setItem("tasteArchetype", winner);
        window.dispatchEvent(new Event("storage"));
    };

    const resetQuiz = () => {
        setStarted(false);
        setCurrentQ(0);
        setAnswers([]);
        setResult(null);
        localStorage.removeItem("tasteArchetype");
        window.dispatchEvent(new Event("storage"));
    };

    const shareResult = () => {
        toast.success("Archetype copied to clipboard");
    };

    return (
        <Card className="overflow-hidden border-none shadow-2xl bg-[#1a103c] text-white relative ring-1 ring-white/10">
            {/* Background Accents - Midnight Theme */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

            <CardContent className="p-8 relative z-10 min-h-[420px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {!started ? (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center space-y-8"
                        >
                            <div className="relative w-20 h-20 mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse" />
                                <div className="relative w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 rounded-full flex items-center justify-center border border-white/10 shadow-xl">
                                    <Sparkles className="w-8 h-8 text-orange-300" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-white to-orange-200">
                                    TASTE ARCHETYPE
                                </h3>
                                <p className="text-sm text-indigo-200/80 font-medium tracking-widest uppercase mt-3">
                                    Discover your culinary soul
                                </p>
                            </div>

                            <Button
                                onClick={handleStart}
                                className="w-full bg-white text-indigo-950 hover:bg-orange-50 font-bold tracking-widest uppercase py-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                            >
                                Begin Analysis
                            </Button>
                        </motion.div>
                    ) : result ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center space-y-6"
                        >
                            <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${RESULTS[result].color} flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-6 border-4 border-[#1a103c] relative`}>
                                <span className="text-5xl filter drop-shadow-lg">{RESULTS[result].icon}</span>
                                <div className="absolute inset-0 rounded-full border border-white/20" />
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-white mb-2">{RESULTS[result].title}</h3>
                                <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                                    <p className="text-[10px] text-orange-300 uppercase tracking-[0.2em] font-bold">
                                        {RESULTS[result].subtitle}
                                    </p>
                                </div>
                                <p className="text-sm text-indigo-100 leading-relaxed font-medium px-2">
                                    {RESULTS[result].desc}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" onClick={resetQuiz} className="flex-1 text-indigo-300 hover:text-white hover:bg-white/10">
                                    <RefreshCw className="w-4 h-4 mr-2" /> RESTART
                                </Button>
                                <Button onClick={shareResult} className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none shadow-lg hover:shadow-orange-500/25">
                                    <Share2 className="w-4 h-4 mr-2" /> SHARE
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`q-${currentQ}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <span className="text-xs text-orange-400 font-bold tracking-[0.2em]">QUERY {currentQ + 1}</span>
                                <div className="flex gap-1">
                                    {QUESTIONS.map((_, idx) => (
                                        <div key={idx} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${idx === currentQ ? 'bg-orange-400' : idx < currentQ ? 'bg-orange-400/30' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-white text-center leading-relaxed">
                                {QUESTIONS[currentQ].text}
                            </h4>

                            <div className="space-y-3">
                                {QUESTIONS[currentQ].options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(option.type)}
                                        className="w-full p-4 text-left rounded-xl border border-white/10 hover:border-orange-500/50 transition-all duration-300 group bg-white/5 backdrop-blur-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-orange-200 transition-colors mb-0.5">
                                                    {option.text}
                                                </div>
                                                <div className="text-xs text-indigo-200/70 group-hover:text-indigo-100">
                                                    {option.sub}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-orange-400 transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 duration-300" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
