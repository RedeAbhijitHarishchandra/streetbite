"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Vendor {
    id: number;
    name: string;
    image: string;
    votes: number;
    color: string;
    gradient: string;
}

const VENDOR_POOL = [
    { id: 1, name: "Raghu's Vada Pav", image: "🥪", color: "text-orange-600", gradient: "from-orange-100 to-orange-200" },
    { id: 2, name: "Sharma Ji's Chaat", image: "🥗", color: "text-green-600", gradient: "from-green-100 to-green-200" },
    { id: 3, name: "Mohan's Misal", image: "🍜", color: "text-red-600", gradient: "from-red-100 to-red-200" },
    { id: 4, name: "Lakshmi's Dosa", image: "🥞", color: "text-yellow-600", gradient: "from-yellow-100 to-yellow-200" },
    { id: 5, name: "Arjun's Momos", image: "🥟", color: "text-slate-600", gradient: "from-slate-100 to-slate-200" },
    { id: 6, name: "Kolkata Rolls", image: "🌯", color: "text-amber-600", gradient: "from-amber-100 to-amber-200" },
    { id: 7, name: "Delhi Kebab", image: "🍖", color: "text-rose-600", gradient: "from-rose-100 to-rose-200" },
    { id: 8, name: "Mumbai Sandwich", image: "🥪", color: "text-lime-600", gradient: "from-lime-100 to-lime-200" },
];

export function VendorBattle() {
    const [pair, setPair] = useState<[Vendor, Vendor] | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [votes, setVotes] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        generateNewBattle();
    }, []);

    const generateNewBattle = () => {
        const shuffled = [...VENDOR_POOL].sort(() => Math.random() - 0.5);
        setPair([
            { ...shuffled[0], votes: Math.floor(Math.random() * 50) + 20 },
            { ...shuffled[1], votes: Math.floor(Math.random() * 50) + 20 }
        ]);
        setHasVoted(false);
        setVotes([0, 0]);
    };

    const handleVote = (index: 0 | 1) => {
        if (hasVoted || !pair) return;

        const newVotes: [number, number] = [...votes];
        newVotes[index] += 1;
        setVotes(newVotes);
        setHasVoted(true);

        toast.success(`Voted for ${pair[index].name}!`);
    };

    if (!pair) return null;

    const total = (pair[0].votes + (hasVoted && votes[0] ? 1 : 0)) + (pair[1].votes + (hasVoted && votes[1] ? 1 : 0));
    const p1Percent = Math.round(((pair[0].votes + (hasVoted && votes[0] ? 1 : 0)) / total) * 100);
    const p2Percent = 100 - p1Percent;

    return (
        <Card className="overflow-hidden border-none shadow-xl bg-white relative group">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-red-50/50 pointer-events-none" />

            <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        <Swords className="w-5 h-5 text-orange-500" />
                        Food Face-off
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={generateNewBattle}
                        className="text-xs h-7 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    >
                        Skip
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-5 relative z-10">
                <div className="flex items-center justify-between gap-4">
                    {/* Vendor 1 */}
                    <motion.button
                        whileHover={!hasVoted ? { scale: 1.05, y: -5 } : {}}
                        whileTap={!hasVoted ? { scale: 0.95 } : {}}
                        onClick={() => handleVote(0)}
                        disabled={hasVoted}
                        className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${hasVoted
                                ? p1Percent > p2Percent
                                    ? "bg-gradient-to-b from-green-50 to-emerald-50 ring-2 ring-green-400 shadow-lg shadow-green-100"
                                    : "opacity-60 grayscale bg-gray-50"
                                : "bg-white shadow-lg hover:shadow-xl border border-gray-100"
                            }`}
                    >
                        <div className={`text-5xl p-4 rounded-2xl bg-gradient-to-br ${pair[0].gradient} shadow-inner mb-1`}>
                            {pair[0].image}
                        </div>
                        <div className="text-center w-full">
                            <h3 className="font-bold text-sm text-gray-800 leading-tight mb-1">{pair[0].name}</h3>
                            {hasVoted && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-lg font-black text-green-600"
                                >
                                    {p1Percent}%
                                </motion.div>
                            )}
                        </div>
                        {hasVoted && p1Percent > p2Percent && (
                            <div className="absolute top-2 right-2">
                                <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-bounce" />
                            </div>
                        )}
                    </motion.button>

                    {/* VS Badge */}
                    <div className="flex flex-col items-center justify-center z-20 -mx-2">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-200 border-4 border-white"
                        >
                            <span className="text-white font-black text-sm italic">VS</span>
                        </motion.div>
                    </div>

                    {/* Vendor 2 */}
                    <motion.button
                        whileHover={!hasVoted ? { scale: 1.05, y: -5 } : {}}
                        whileTap={!hasVoted ? { scale: 0.95 } : {}}
                        onClick={() => handleVote(1)}
                        disabled={hasVoted}
                        className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${hasVoted
                                ? p2Percent > p1Percent
                                    ? "bg-gradient-to-b from-green-50 to-emerald-50 ring-2 ring-green-400 shadow-lg shadow-green-100"
                                    : "opacity-60 grayscale bg-gray-50"
                                : "bg-white shadow-lg hover:shadow-xl border border-gray-100"
                            }`}
                    >
                        <div className={`text-5xl p-4 rounded-2xl bg-gradient-to-br ${pair[1].gradient} shadow-inner mb-1`}>
                            {pair[1].image}
                        </div>
                        <div className="text-center w-full">
                            <h3 className="font-bold text-sm text-gray-800 leading-tight mb-1">{pair[1].name}</h3>
                            {hasVoted && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-lg font-black text-green-600"
                                >
                                    {p2Percent}%
                                </motion.div>
                            )}
                        </div>
                        {hasVoted && p2Percent > p1Percent && (
                            <div className="absolute top-2 right-2">
                                <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-bounce" />
                            </div>
                        )}
                    </motion.button>
                </div>

                {/* Animated Health Bars */}
                <AnimatePresence>
                    {hasVoted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6"
                        >
                            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${p1Percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                </motion.div>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${p2Percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-l from-blue-500 to-purple-500 relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                </motion.div>

                                {/* Center Marker */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 z-10" />
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <span>{total + 1} Votes</span>
                                <span>Winner</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
