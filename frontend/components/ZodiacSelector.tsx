"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ZodiacSelectorProps {
    onSelect: (sign: string) => void;
}

export function ZodiacSelector({ onSelect }: ZodiacSelectorProps) {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");

    const getZodiacSign = (day: number, month: number): string => {
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
        return "Unknown";
    };

    const handleSubmit = () => {
        const d = parseInt(day);
        const m = parseInt(month);

        if (!day || !month || isNaN(d) || isNaN(m) || d < 1 || d > 31 || m < 1 || m > 12) {
            toast.error("Please enter a valid date and month.");
            return;
        }

        const sign = getZodiacSign(d, m);
        if (sign === "Unknown") {
            toast.error("Could not determine zodiac sign.");
            return;
        }

        // No backend save - just return the sign
        onSelect(sign);
        toast.success(`You are a ${sign}! 🌟`);
    };

    return (
        <Card className="w-full max-w-md mx-auto mb-8 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-primary">🌟 Discover Your Foodtaar</CardTitle>
                <CardDescription className="text-sm">
                    Enter your birth date to reveal your food personality!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="day">Day</Label>
                        <Input
                            id="day"
                            type="number"
                            placeholder="DD"
                            min="1"
                            max="31"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="month">Month</Label>
                        <Input
                            id="month"
                            type="number"
                            placeholder="MM"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        />
                    </div>
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
                    onClick={handleSubmit}
                    disabled={!day || !month}
                >
                    Reveal My Sign 🔮
                </Button>
            </CardContent>
        </Card>
    );
}
