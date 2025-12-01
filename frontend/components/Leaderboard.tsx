"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Crown, Sparkles } from "lucide-react";

interface User {
    id: number;
    name: string;
    xp: number;
    level: number;
    avatar: string;
}

const LEADERBOARD_DATA: User[] = [
    { id: 1, name: "foodie_king", xp: 8450, level: 42, avatar: "👑" },
    { id: 2, name: "street_master", xp: 7830, level: 39, avatar: "🌟" },
    { id: 3, name: "spice_guru", xp: 7210, level: 36, avatar: "🔥" },
    { id: 4, name: "chaat_lover", xp: 6890, level: 34, avatar: "💫" },
    { id: 5, name: "vada_champion", xp: 6520, level: 33, avatar: "⚡" },
];

export function Leaderboard() {
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />;
            case 2: return <Medal className="w-5 h-5 text-gray-400 fill-gray-100" />;
            case 3: return <Medal className="w-5 h-5 text-orange-600 fill-orange-100" />;
            default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm scale-[1.02]";
            case 2: return "bg-white border-gray-100";
            case 3: return "bg-white border-orange-100";
            default: return "bg-white/50 border-transparent hover:bg-white hover:shadow-sm";
        }
    };

    return (
        <Card className="border-none shadow-soft overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-4 border-b border-orange-100/50 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <span className="block text-base font-bold">Top Foodies</span>
                        <span className="block text-xs font-normal text-muted-foreground">Weekly Ranking</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 px-4">
                {LEADERBOARD_DATA.map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${getRankStyles(index + 1)}`}
                    >
                        <div className="flex items-center justify-center w-8 font-bold text-lg">
                            {getRankIcon(index + 1)}
                        </div>

                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-xl shadow-inner border-2 border-white">
                                {user.avatar}
                            </div>
                            {index === 0 && (
                                <div className="absolute -top-1 -right-1">
                                    <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-spin-slow" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-foreground truncate flex items-center gap-1">
                                {user.name}
                                {index < 3 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">PRO</span>}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                                Level {user.level}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                                {user.xp.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">XP</div>
                        </div>
                    </div>
                ))}

                <div className="pt-2 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg text-white transform transition-transform hover:scale-[1.02] cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-lg shadow-lg ring-2 ring-white/20">
                                👤
                            </div>
                            <div>
                                <div className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors">You</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Level 12</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-orange-400">2,340</div>
                            <div className="text-[10px] text-gray-500 font-bold">#42</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
