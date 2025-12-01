"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Share2, RefreshCw, Star, Moon, Sun } from "lucide-react";
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

const ZODIAC_INFO: Record<string, { emoji: string; element: string; color: string; bg: string }> = {
    "Aries": { emoji: "♈", element: "Fire", color: "from-red-500 to-orange-500", bg: "bg-red-50" },
    "Taurus": { emoji: "♉", element: "Earth", color: "from-green-600 to-emerald-500", bg: "bg-green-50" },
    "Gemini": { emoji: "♊", element: "Air", color: "from-yellow-500 to-amber-500", bg: "bg-yellow-50" },
    "Cancer": { emoji: "♋", element: "Water", color: "from-blue-400 to-cyan-400", bg: "bg-blue-50" },
    "Leo": { emoji: "♌", element: "Fire", color: "from-orange-500 to-yellow-500", bg: "bg-orange-50" },
    "Virgo": { emoji: "♍", element: "Earth", color: "from-green-500 to-teal-500", bg: "bg-green-50" },
    "Libra": { emoji: "♎", element: "Air", color: "from-pink-500 to-rose-500", bg: "bg-pink-50" },
    "Scorpio": { emoji: "♏", element: "Water", color: "from-purple-600 to-indigo-600", bg: "bg-purple-50" },
    "Sagittarius": { emoji: "♐", element: "Fire", color: "from-purple-500 to-pink-500", bg: "bg-purple-50" },
    "Capricorn": { emoji: "♑", element: "Earth", color: "from-gray-700 to-slate-600", bg: "bg-gray-50" },
    "Aquarius": { emoji: "♒", element: "Air", color: "from-blue-500 to-purple-500", bg: "bg-blue-50" },
    "Pisces": { emoji: "♓", element: "Water", color: "from-teal-500 to-cyan-500", bg: "bg-teal-50" }
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
            // Fallback for demo if backend is not running
            setData({
                zodiacSign: sign,
                prediction: "Today is a great day to try something spicy! Your taste buds are craving adventure.",
                luckyDish: "Masala Dosa",
                luckyTime: "7:00 PM",
                challenge: "Eat something with green chutney"
            });
            setSelectedSign(sign);
            setXpClaimed(false);
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

    if (loading) return (
        <Card className="w-full max-w-2xl mx-auto h-64 flex items-center justify-center bg-white/50 backdrop-blur-sm border-none shadow-soft">
            <div className="flex flex-col items-center gap-3 animate-pulse">
                <Sparkles className="w-8 h-8 text-orange-400 animate-spin-slow" />
                <p className="text-muted-foreground font-medium">Consulting the stars... 🔮</p>
            </div>
        </Card>
    );

    if (!selectedSign || !data) {
        return <ZodiacSelector onSelect={fetchHoroscopeBySign} />;
    }

    const zodiacInfo = ZODIAC_INFO[data.zodiacSign] || ZODIAC_INFO["Aries"];

    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden border-none shadow-floating bg-white/90 backdrop-blur-xl ring-1 ring-white/20">
            <div className={`absolute inset-0 bg-gradient-to-br ${zodiacInfo.color} opacity-[0.03] -z-10`} />

            <CardHeader className="pb-2 pt-6 px-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${zodiacInfo.color} flex items-center justify-center shadow-lg transform rotate-3 transition-transform hover:rotate-0`}>
                            <span className="text-4xl text-white drop-shadow-md">{zodiacInfo.emoji}</span>
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black text-foreground tracking-tight">
                                {data.zodiacSign}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${zodiacInfo.color} text-white`}>
                                    {zodiacInfo.element}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    <Moon className="w-3 h-3" /> Daily Horoscope
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleChangeDate}
                            className="text-xs h-8 px-3 hover:bg-orange-50 text-muted-foreground hover:text-orange-600 transition-colors"
                        >
                            <RefreshCw className="w-3 h-3 mr-1.5" />
                            Change
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4 pb-6 px-6 space-y-5">
                <div className="relative bg-gradient-to-br from-orange-50/80 to-amber-50/80 p-6 rounded-3xl border border-orange-100/50 shadow-sm">
                    <Sparkles className="absolute top-4 right-4 w-5 h-5 text-orange-400 opacity-50" />
                    <p className="text-lg font-medium text-gray-700 leading-relaxed italic text-center">
                        "{data.prediction}"
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-lg">🍽️</span>
                            </div>
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Lucky Dish</p>
                        </div>
                        <p className="text-base font-bold text-gray-800 pl-11">{data.luckyDish}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-lg">⏰</span>
                            </div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Lucky Time</p>
                        </div>
                        <p className="text-base font-bold text-gray-800 pl-11">{data.luckyTime}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-1 border border-yellow-100 shadow-sm">
                    <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                                <h4 className="text-sm font-bold text-gray-800">Daily Challenge</h4>
                            </div>
                            <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-full">+10 XP</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 pl-7">{data.challenge}</p>
                        <Button
                            onClick={handleClaimXP}
                            disabled={xpClaimed}
                            className={`w-full h-10 rounded-xl font-bold shadow-md transition-all hover:scale-[1.02] ${xpClaimed
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                                }`}
                        >
                            {xpClaimed ? (
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Challenge Completed!
                                </span>
                            ) : "Claim Reward"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
