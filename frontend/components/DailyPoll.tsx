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
        <Card className="hover:shadow-lg transition-shadow border-primary/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Daily Poll
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground font-medium">{currentPoll.question}</p>
                <div className="space-y-2">
                    {currentPoll.options.map((option, index) => {
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isSelected = selectedOption === index;

                        return (
                            <button
                                key={index}
                                onClick={() => handleVote(index)}
                                disabled={hasVoted}
                                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all relative overflow-hidden ${hasVoted
                                    ? isSelected
                                        ? "border-orange-500 bg-orange-50"
                                        : "border-gray-200 bg-gray-50"
                                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer"
                                    }`}
                            >
                                {hasVoted && (
                                    <div
                                        className="absolute top-0 left-0 h-full bg-orange-100/50 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}
                                <div className="relative z-10 flex justify-between items-center">
                                    <span className="font-medium text-gray-800">{option.text}</span>
                                    {hasVoted && (
                                        <span className="text-sm font-bold text-orange-600">{percentage}%</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
                {hasVoted && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                        {totalVotes} votes • New poll tomorrow!
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
