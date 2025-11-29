"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

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
            case 1: return <Crown className="w-4 h-4 text-yellow-500" />;
            case 2: return <Medal className="w-4 h-4 text-gray-400" />;
            case 3: return <Medal className="w-4 h-4 text-orange-600" />;
            default: return <span className="text-xs font-bold text-gray-400">#{rank}</span>;
        }
    };

    const getRankBg = (rank: number) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
            case 2: return "bg-gradient-to-r from-slate-400/20 to-gray-400/20 border-slate-400/30";
            case 3: return "bg-gradient-to-r from-orange-700/20 to-amber-700/20 border-orange-700/30";
            default: return "bg-white/5 border-white/5 hover:bg-white/10";
        }
    };

    return (
        <Card className="bg-[#1a103c] border-none shadow-xl ring-1 ring-white/10">
            <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
                {LEADERBOARD_DATA.map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${getRankBg(index + 1)}`}
                    >
                        <div className="flex items-center justify-center w-6">
                            {getRankIcon(index + 1)}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-lg shadow-lg ring-2 ring-[#1a103c]">
                            {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-white truncate">
                                {user.name}
                            </div>
                            <div className="text-[10px] text-indigo-200 uppercase tracking-wider">
                                Level {user.level}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-orange-400">
                                {user.xp.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-indigo-300/50 font-bold">XP</div>
                        </div>
                    </div>
                ))}

                <div className="pt-4 mt-2 border-t border-white/10">
                    <div className="flex items-center justify-between p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-lg shadow-lg">
                                👤
                            </div>
                            <div>
                                <div className="font-bold text-sm text-white">You</div>
                                <div className="text-[10px] text-indigo-200 uppercase tracking-wider">Level 12</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-blue-400">2,340</div>
                            <div className="text-[10px] text-blue-300/50 font-bold">#42</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
