"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Filter, Star, Clock, Locate } from "lucide-react";
import { toast } from "sonner";

interface FoodPin {
    id: number;
    name: string;
    foodType: string;
    lat: number;
    lng: number;
    rating: number;
    addedBy: string;
    emoji: string;
}

const SAMPLE_PINS: FoodPin[] = [
    { id: 1, name: "Raghu's Vada Pav", foodType: "Street Food", lat: 19.0760, lng: 72.8777, rating: 4.8, addedBy: "foodie_raj", emoji: "🥪" },
    { id: 2, name: "Sharma Ji's Chaat", foodType: "Chaat", lat: 28.6139, lng: 77.2090, rating: 4.9, addedBy: "delhi_eats", emoji: "🥟" },
    { id: 3, name: "Lakshmi's Dosa Corner", foodType: "South Indian", lat: 12.9716, lng: 77.5946, rating: 4.7, addedBy: "dosa_king", emoji: "🥞" },
    { id: 4, name: "Khan's Kebab House", foodType: "Kebab", lat: 26.8467, lng: 80.9462, rating: 4.6, addedBy: "kebab_lover", emoji: "🍖" },
    { id: 5, name: "Mohan's Misal", foodType: "Maharashtrian", lat: 18.5204, lng: 73.8567, rating: 4.8, addedBy: "pune_foodie", emoji: "🍲" }
];

const FOOD_TYPES = ["All", "Street Food", "Chaat", "South Indian", "Kebab", "Maharashtrian"];

export function CommunityMap() {
    const [pins, setPins] = useState<FoodPin[]>(SAMPLE_PINS);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [selectedPin, setSelectedPin] = useState<FoodPin | null>(null);

    const filteredPins = selectedFilter === "All"
        ? pins
        : pins.filter(pin => pin.foodType === selectedFilter);

    const handlePinClick = (pin: FoodPin) => {
        setSelectedPin(pin);
        toast.info(`${pin.name} - ${pin.rating}⭐`);
    };

    const handleAddPin = () => {
        toast.info("Add location feature coming soon! 📍", {
            description: "Help the community discover hidden gems!"
        });
    };

    return (
        <Card className="hover:shadow-elevated transition-shadow border-none shadow-soft bg-white/80 backdrop-blur-xl overflow-hidden group">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-b border-blue-100/50 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            Community Food Map
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 ml-1">
                            Discover hidden gems near you
                        </p>
                    </div>
                    <Button size="sm" onClick={handleAddPin} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-105">
                        <MapPin className="w-4 h-4 mr-2" />
                        Add Pin
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4 px-4">
                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {FOOD_TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedFilter(type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${selectedFilter === type
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Map Placeholder */}
                <div className="relative w-full h-64 bg-[#e5e9ec] rounded-2xl overflow-hidden border-4 border-white shadow-inner group-hover:shadow-md transition-shadow">
                    {/* Abstract Map Pattern */}
                    <div className="absolute inset-0 opacity-40" style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px), radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px'
                    }}></div>

                    {/* Animated Radar Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse"></div>

                    {/* Center Marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="relative">
                            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-blue-600"></div>
                        </div>
                    </div>

                    {/* Floating Pins */}
                    <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDuration: '2s' }}>
                        <div className="bg-white p-1.5 rounded-lg shadow-lg border border-gray-100 transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                            <span className="text-xl">🥪</span>
                        </div>
                    </div>
                    <div className="absolute bottom-1/3 right-1/4 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                        <div className="bg-white p-1.5 rounded-lg shadow-lg border border-gray-100 transform rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                            <span className="text-xl">🥟</span>
                        </div>
                    </div>
                    <div className="absolute top-1/3 right-1/3 animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '1s' }}>
                        <div className="bg-white p-1.5 rounded-lg shadow-lg border border-gray-100 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                            <span className="text-xl">🥞</span>
                        </div>
                    </div>

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
                        <Navigation className="w-3 h-3 text-blue-500 animate-spin-slow" />
                        <span className="text-xs font-bold text-gray-700">Interactive Map Coming Soon</span>
                    </div>
                </div>

                {/* Pins List */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 px-1">
                        <Locate className="w-3 h-3" />
                        Nearby Hotspots
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
                        {filteredPins.map(pin => (
                            <button
                                key={pin.id}
                                onClick={() => handlePinClick(pin)}
                                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group/item ${selectedPin?.id === pin.id
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm bg-white"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl border border-gray-100 group-hover/item:scale-110 transition-transform">
                                        {pin.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-bold text-sm text-gray-800 truncate">{pin.name}</h5>
                                        <p className="text-xs text-muted-foreground">{pin.foodType}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-md border border-yellow-100">
                                                <Star className="w-2.5 h-2.5 fill-current" />
                                                {pin.rating}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground truncate">by @{pin.addedBy}</span>
                                        </div>
                                    </div>
                                    <div className={`p-1.5 rounded-full transition-colors ${selectedPin?.id === pin.id ? 'bg-blue-100 text-blue-600' : 'text-gray-300 group-hover/item:text-blue-400'}`}>
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
