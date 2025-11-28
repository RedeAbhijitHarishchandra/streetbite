"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Share2, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { ZodiacSelector } from "./ZodiacSelector";

interface ZodiacData {
    zodiacSign: string;
    prediction: string;
    luckyDish: string;
    luckyTime: string;
    challenge: string;
}

const ZODIAC_INFO: Record<string, { emoji: string; element: string; color: string }> = {
    "Aries": { emoji: "♈", element: "Fire", color: "from-red-500 to-orange-500" },
    "Taurus": { emoji: "♉", element: "Earth", color: "from-green-600 to-emerald-500" },
    "Gemini": { emoji: "♊", element: "Air", color: "from-yellow-500 to-amber-500" },
    "Cancer": { emoji: "♋", element: "Water", color: "from-blue-400 to-cyan-400" },
    "Leo": { emoji: "♌", element: "Fire", color: "from-orange-500 to-yellow-500" },
    "Virgo": { emoji: "♍", element: "Earth", color: "from-green-500 to-teal-500" },
    "Libra": { emoji: "♎", element: "Air", color: "from-pink-500 to-rose-500" },
    "Scorpio": { emoji: "♏", element: "Water", color: "from-purple-600 to-indigo-600" },
    "Sagittarius": { emoji: "♐", element: "Fire", color: "from-purple-500 to-pink-500" },
    "Capricorn": { emoji: "♑", element: "Earth", color: "from-gray-700 to-slate-600" },
    "Aquarius": { emoji: "♒", element: "Air", color: "from-blue-500 to-purple-500" },
    "Pisces": { emoji: "♓", element: "Water", color: "from-teal-500 to-cyan-500" }
};

export function ZodiacCard() {
    const [selectedSign, setSelectedSign] = useState<string | null>(null);
    const [data, setData] = useState<ZodiacData | null>(null);
    const [loading, setLoading] = useState(false);
    const [xpClaimed, setXpClaimed] = useState(false);

    const fetchHoroscopeBySign = async (sign: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/zodiac/sign/${sign}`);
            setData(response.data);
            setSelectedSign(sign);
            setXpClaimed(false);
        } catch (error) {
            console.error("Error fetching horoscope:", error);
            toast.error("Failed to load horoscope. Try again!");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeDate = () => {
        setSelectedSign(null);
        setData(null);
        setXpClaimed(false);
    };

    const handleClaimXP = () => {
        setXpClaimed(true);
        toast.success("Challenge Completed! +10 XP 🌟");
    };

    const handleShare = async () => {
        if (navigator.share && data) {
            try {
                await navigator.share({
                    title: `My Food Horoscope for ${data.zodiacSign} 🔮`,
                    text: `Today's Prediction: ${data.prediction}\nLucky Dish: ${data.luckyDish}\nPlay the Zodiac Game on StreetBite!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            toast.info("Sharing not supported on this device");
        }
    };

    if (loading) return <div className="text-center p-8">Loading your stars... 🔮</div>;

    if (!selectedSign || !data) {
        return <ZodiacSelector onSelect={fetchHoroscopeBySign} />;
    }

    const zodiacInfo = ZODIAC_INFO[data.zodiacSign] || ZODIAC_INFO["Aries"];

    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden border border-orange-100 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${zodiacInfo.color} opacity-5 -z-10`} />

            <CardHeader className="pb-2 pt-4 px-4 bg-gradient-to-br from-white to-orange-50/30">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${zodiacInfo.color} flex items-center justify-center shadow-md`}>
                            <span className="text-3xl text-white">{zodiacInfo.emoji}</span>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-800">
                                {data.zodiacSign}
                            </CardTitle>
                            <p className="text-xs text-orange-600 font-medium">{zodiacInfo.element} Sign</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleChangeDate}
                            className="text-xs h-8 px-2"
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Change
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-3 pb-4 px-4">
                <div className="space-y-3">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-100">
                        <p className="text-base font-medium italic text-gray-700 leading-relaxed">
                            "{data.prediction}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">🍽️</span>
                                <p className="text-xs font-bold text-orange-600 uppercase">Lucky Dish</p>
                            </div>
                            <p className="text-sm font-bold text-gray-800">{data.luckyDish}</p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">⏰</span>
                                <p className="text-xs font-bold text-blue-600 uppercase">Lucky Time</p>
                            </div>
                            <p className="text-sm font-bold text-gray-800">{data.luckyTime}</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                            <h4 className="text-sm font-bold text-gray-800">Today's Challenge</h4>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{data.challenge}</p>
                        <Button
                            onClick={handleClaimXP}
                            disabled={xpClaimed}
                            size="sm"
                            className={`w-full text-sm font-bold ${xpClaimed
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                }`}
                        >
                            {xpClaimed ? "✅ Claimed +10 XP" : "Claim +10 XP"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
