"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface PollOption {
    text: string;
    votes: number;
}

interface Poll {
    question: string;
    options: PollOption[];
}

const POLLS: Poll[] = [
    {
        question: "What's the best rainy day snack?",
        options: [
            { text: "Vada Pav", votes: 120 },
            { text: "Bhajiya", votes: 85 },
            { text: "Corn", votes: 65 }
        ]
    },
    {
        question: "Which late-night food hits different?",
        options: [
            { text: "Pav Bhaji", votes: 95 },
            { text: "Cutting Chai & Bun Maska", votes: 110 },
            { text: "Misal Pav", votes: 75 }
        ]
    },
    {
        question: "Best street food for breakfast?",
        options: [
            { text: "Poha", votes: 100 },
            { text: "Upma", votes: 60 },
            { text: "Samosa", votes: 90 }
        ]
    },
    {
        question: "Which chaat is the GOAT?",
        options: [
            { text: "Pani Puri", votes: 150 },
            { text: "Sev Puri", votes: 80 },
            { text: "Dahi Puri", votes: 70 }
        ]
    },
    {
        question: "Best post-workout street food?",
        options: [
            { text: "Fruit Chaat", votes: 65 },
            { text: "Momos", votes: 105 },
            { text: "Frankies", votes: 90 }
        ]
    }
];

export function DailyPoll() {
    const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        // Select poll based on day of year (rotates daily)
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const pollIndex = dayOfYear % POLLS.length;
        setCurrentPoll(POLLS[pollIndex]);
        // No localStorage - resets on every refresh!
    }, []);

    const handleVote = (optionIndex: number) => {
        if (hasVoted || !currentPoll) return;

        setSelectedOption(optionIndex);
        setHasVoted(true);

        // Increment vote count (session-only, resets on refresh)
        currentPoll.options[optionIndex].votes += 1;
        setCurrentPoll({ ...currentPoll });
    };

    if (!currentPoll) return null;

    const totalVotes = currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);

    return (
        <Card className="bg-[#1a103c] border-none shadow-xl relative overflow-hidden ring-1 ring-white/10">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    <span className="tracking-tight">Daily Poll</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-5 text-indigo-100 font-medium leading-relaxed">{currentPoll.question}</p>
                <div className="space-y-3">
                    {currentPoll.options.map((option, index) => {
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isSelected = selectedOption === index;

                        return (
                            <button
                                key={index}
                                onClick={() => handleVote(index)}
                                disabled={hasVoted}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all relative overflow-hidden group ${hasVoted
                                    ? isSelected
                                        ? "border-orange-500/50 bg-orange-500/10"
                                        : "border-white/5 bg-white/5"
                                    : "border-white/10 hover:border-orange-400/50 hover:bg-white/5 cursor-pointer"
                                    }`}
                            >
                                {hasVoted && (
                                    <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out ${isSelected ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20" : "bg-white/5"}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}
                                <div className="relative z-10 flex justify-between items-center">
                                    <span className={`font-medium transition-colors ${isSelected ? "text-orange-200" : "text-gray-300 group-hover:text-white"}`}>
                                        {option.text}
                                    </span>
                                    {hasVoted && (
                                        <span className={`text-sm font-bold ${isSelected ? "text-orange-400" : "text-indigo-300"}`}>
                                            {percentage}%
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
                {hasVoted && (
                    <p className="text-[10px] text-indigo-300/60 mt-4 text-center uppercase tracking-widest font-medium">
                        {totalVotes} votes • New poll tomorrow
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
