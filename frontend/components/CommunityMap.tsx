"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Filter, Star, Clock } from "lucide-react";
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
        <Card className="hover:shadow-lg transition-shadow border-primary/10">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="w-5 h-5 text-blue-500" />
                            Community Food Map
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            Discover hidden gems near you
                        </p>
                    </div>
                    <Button size="sm" onClick={handleAddPin} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        Add Pin
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {FOOD_TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedFilter(type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedFilter === type
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Map Placeholder */}
                <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 via-cyan-50 to-green-100 rounded-xl overflow-hidden border-2 border-blue-200">
                    {/* Simple visual representation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <Navigation className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
                            <p className="text-sm font-medium text-gray-600">Interactive Map</p>
                            <p className="text-xs text-gray-500">Click on pins below to explore</p>
                        </div>
                    </div>

                    {/* Sample pins visualization */}
                    <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>

                {/* Pins List */}
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Locations ({filteredPins.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredPins.map(pin => (
                            <button
                                key={pin.id}
                                onClick={() => handlePinClick(pin)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedPin?.id === pin.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">{pin.emoji}</div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-sm">{pin.name}</h5>
                                        <p className="text-xs text-muted-foreground">{pin.foodType}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs">
                                            <span className="flex items-center gap-1 text-yellow-600">
                                                <Star className="w-3 h-3 fill-current" />
                                                {pin.rating}
                                            </span>
                                            <span className="text-muted-foreground">by @{pin.addedBy}</span>
                                        </div>
                                    </div>
                                    <MapPin className="w-4 h-4 text-red-500" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-center text-muted-foreground bg-blue-50 p-2 rounded-lg">
                    🗺️ Full Google Maps integration coming soon!
                </p>
            </CardContent>
        </Card>
    );
}
