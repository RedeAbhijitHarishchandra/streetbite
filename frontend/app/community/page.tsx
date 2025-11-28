'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ZodiacCard } from '@/components/ZodiacCard'
import { DailyPoll } from '@/components/DailyPoll'
import { Sparkles, MessageSquare, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const VENDORS = [
    { name: "Raghu's Vada Pav", location: "Mumbai", rating: "4.8★" },
    { name: "Sharma Ji's Chaat", location: "Delhi", rating: "4.9★" },
    { name: "Mohan's Misal", location: "Pune", rating: "4.7★" },
    { name: "Lakshmi's Dosa", location: "Bangalore", rating: "4.6★" },
    { name: "Arjun's Momos", location: "Kolkata", rating: "4.8★" }
];

const DISCUSSIONS = [
    { text: "What's your go-to midnight snack?", replies: 142 },
    { text: "Best street food in Pune?", replies: 89 },
    { text: "Spicy vs. Sweet - what's your vibe?", replies: 67 },
    { text: "Hidden gem near you?", replies: 234 },
    { text: "Favorite chaat combination?", replies: 156 },
    { text: "Rainy day food mood?", replies: 198 }
];

export default function CommunityPage() {
    const [vendor, setVendor] = useState(VENDORS[0]);
    const [discussions, setDiscussions] = useState(DISCUSSIONS.slice(0, 3));

    useEffect(() => {
        const randomVendor = VENDORS[Math.floor(Math.random() * VENDORS.length)];
        setVendor(randomVendor);

        const shuffled = [...DISCUSSIONS].sort(() => Math.random() - 0.5);
        setDiscussions(shuffled.slice(0, 3));
    }, []);

    const handleDiscussionClick = (discussion: typeof DISCUSSIONS[0]) => {
        toast.info(`Opening: ${discussion.text}`, {
            description: "Discussion feature coming soon! 🚀"
        });
    };

    const handleVendorClick = () => {
        toast.info(`Viewing ${vendor.name}`, {
            description: "Vendor profiles coming soon! 🏪"
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="relative py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold mb-3">
                            <Sparkles className="w-3 h-3" />
                            COMMUNITY
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                            Join the <span className="text-gradient-animate">Foodie Tribe</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Play games, vote on polls, and connect with street food lovers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ZodiacCard />
                        </div>

                        <div className="space-y-6">
                            <DailyPoll />

                            <Card className="hover:shadow-lg transition-shadow border-primary/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Award className="w-5 h-5 text-yellow-500" />
                                        Vendor Spotlight
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="w-full h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                                            <span className="text-6xl">🍛</span>
                                        </div>
                                        <h4 className="font-bold">{vendor.name}</h4>
                                        <p className="text-sm text-muted-foreground">Best in {vendor.location} · {vendor.rating}</p>
                                        <Button variant="outline" size="sm" className="w-full" onClick={handleVendorClick}>
                                            View Vendor
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Card className="hover:shadow-lg transition-shadow border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MessageSquare className="w-5 h-5 text-green-500" />
                                    Trending Discussions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {discussions.map((discussion, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleDiscussionClick(discussion)}
                                            className="flex justify-between items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all cursor-pointer active:scale-[0.98]"
                                        >
                                            <p className="font-medium text-sm">{discussion.text}</p>
                                            <span className="text-xs text-muted-foreground">{discussion.replies} replies</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
