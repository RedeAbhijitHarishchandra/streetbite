'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ZodiacCard } from '@/components/ZodiacCard'
import { DailyPoll } from '@/components/DailyPoll'
import { VendorBattle } from '@/components/VendorBattle'
import { StreakTracker } from '@/components/StreakTracker'
import { FoodBingo } from '@/components/FoodBingo'
import { PhotoWall } from '@/components/PhotoWall'
import { EventsCalendar } from '@/components/EventsCalendar'
import { Leaderboard } from '@/components/Leaderboard'
import { FoodPersonalityQuiz } from '@/components/FoodPersonalityQuiz'
import { UserStats } from '@/components/UserStats'
import { MessageSquare, Award, Gamepad2, Camera, CalendarDays, TrendingUp, Heart, Send, X, ThumbsUp, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const VENDORS = [
    { name: "Raghu's Vada Pav", location: "Mumbai", rating: "4.8★" },
    { name: "Sharma Ji's Chaat", location: "Delhi", rating: "4.9★" },
    { name: "Mohan's Misal", location: "Pune", rating: "4.7★" },
    { name: "Lakshmi's Dosa", location: "Bangalore", rating: "4.6★" },
    { name: "Arjun's Momos", location: "Kolkata", rating: "4.8★" }
];

const DISCUSSIONS = [
    { id: 1, text: "What's your go-to midnight snack?", replies: 142, likes: 89, author: "foodie_raj", time: "2h ago" },
    { id: 2, text: "Best street food in Pune?", replies: 89, likes: 56, author: "pune_explorer", time: "5h ago" },
    { id: 3, text: "Spicy vs. Sweet - what's your vibe?", replies: 67, likes: 112, author: "taste_master", time: "1d ago" },
    { id: 4, text: "Hidden gem near you?", replies: 234, likes: 178, author: "street_hunter", time: "3h ago" },
    { id: 5, text: "Favorite chaat combination?", replies: 156, likes: 134, author: "chaat_lover", time: "12h ago" },
    { id: 6, text: "Rainy day food mood?", replies: 198, likes: 201, author: "monsoon_foodie", time: "6h ago" }
];

const SAMPLE_COMMENTS = [
    { id: 1, author: "vada_pav_fan", text: "Vada pav all the way! Nothing beats it! 🥪", likes: 12, time: "1h ago" },
    { id: 2, author: "samosa_king", text: "Has to be samosas with green chutney 😋", likes: 8, time: "45m ago" },
    { id: 3, author: "chai_addict", text: "Chai and pakoras for sure!", likes: 15, time: "30m ago" }
];

export default function CommunityPage() {
    const [vendor, setVendor] = useState(VENDORS[0]);
    const [discussions, setDiscussions] = useState(DISCUSSIONS.slice(0, 4));
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('games');
    const [selectedDiscussion, setSelectedDiscussion] = useState<typeof DISCUSSIONS[0] | null>(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(SAMPLE_COMMENTS);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const randomVendor = VENDORS[Math.floor(Math.random() * VENDORS.length)];
        setVendor(randomVendor);

        const shuffled = [...DISCUSSIONS].sort(() => Math.random() - 0.5);
        setDiscussions(shuffled.slice(0, 4));
    }, []);

    const handleDiscussionClick = (discussion: typeof DISCUSSIONS[0]) => {
        setSelectedDiscussion(discussion);
        setHasLiked(false);
        setNewComment('');
    };

    const handleLikeDiscussion = () => {
        if (!selectedDiscussion) return;
        setHasLiked(!hasLiked);
        toast.success(hasLiked ? "Like removed" : "Discussion liked! ❤️");
    };

    const handlePostComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: comments.length + 1,
            author: "you",
            text: newComment,
            likes: 0,
            time: "Just now"
        };
        setComments([comment, ...comments]);
        setNewComment('');
        toast.success("Comment posted! 💬");
    };

    const handleVendorClick = () => {
        toast.info(`Viewing ${vendor.name}`, {
            description: "Vendor profiles coming soon! 🏪"
        });
    };

    const tabs = [
        { id: 'games', label: 'Games', icon: Gamepad2 },
        { id: 'photos', label: 'Photos', icon: Camera },
        { id: 'events', label: 'Events', icon: CalendarDays }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Simple Hero */}
            <section className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-black text-gray-900">Community</h1>
                    <p className="text-gray-600 mt-1">Connect, compete, and discover with fellow foodies</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Challenges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <VendorBattle />
                            <StreakTracker />
                        </div>

                        {/* Daily Activity */}
                        <ZodiacCard />

                        {/* Hot Discussions with Search */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between mb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-green-500" />
                                        Hot Topics
                                    </CardTitle>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search discussions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 text-sm"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {discussions
                                        .filter(d => d.text.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .slice(0, 4)
                                        .map((discussion) => (
                                            <button
                                                key={discussion.id}
                                                onClick={() => handleDiscussionClick(discussion)}
                                                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-green-300 transition-all text-left"
                                            >
                                                <p className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">
                                                    {discussion.text}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>{discussion.replies} replies</span>
                                                    <span>•</span>
                                                    <span>{discussion.likes} likes</span>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                                {searchQuery && discussions.filter(d => d.text.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No discussions found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tabs */}
                        <Card>
                            <div className="border-b">
                                <div className="flex">
                                    {tabs.map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
                                                    ? 'border-orange-500 text-orange-600'
                                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <CardContent className="pt-6">
                                {activeTab === 'games' && <FoodBingo />}
                                {activeTab === 'photos' && <PhotoWall />}
                                {activeTab === 'events' && <EventsCalendar />}
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-4">
                        <UserStats />
                        <DailyPoll />
                        <FoodPersonalityQuiz />
                        <Leaderboard />

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Award className="w-4 h-4 text-yellow-500" />
                                    Vendor Spotlight
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="w-full h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                                        <span className="text-5xl">🍛</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{vendor.name}</h4>
                                        <p className="text-xs text-gray-600">{vendor.location} · {vendor.rating}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs"
                                        onClick={handleVendorClick}
                                    >
                                        View Vendor
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>

            {/* Discussion Modal */}
            {
                selectedDiscussion && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDiscussion(null)}>
                        <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10" onClick={() => setSelectedDiscussion(null)}>
                                <X className="w-4 h-4" />
                            </Button>

                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 text-sm">
                                            <span className="font-bold">@{selectedDiscussion.author}</span>
                                            <span className="text-white/70">• {selectedDiscussion.time}</span>
                                        </div>
                                        <h3 className="text-lg font-bold">{selectedDiscussion.text}</h3>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={handleLikeDiscussion} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${hasLiked ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30'}`}>
                                        <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                                        <span className="font-bold">{selectedDiscussion.likes + (hasLiked ? 1 : 0)}</span>
                                    </button>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-sm">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="font-bold">{comments.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 max-h-96 overflow-y-auto space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${comment.author === 'you' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                                                    {comment.author.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs">@{comment.author}</div>
                                                    <div className="text-xs text-gray-500">{comment.time}</div>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-1 text-gray-400 hover:text-red-500">
                                                <ThumbsUp className="w-3 h-3" />
                                                <span className="text-xs">{comment.likes}</span>
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t p-4 bg-gray-50">
                                <div className="flex gap-2">
                                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePostComment()} placeholder="Add a comment..." className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none text-sm" />
                                    <Button onClick={handlePostComment} disabled={!newComment.trim()} className="bg-green-500 hover:bg-green-600">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <Footer />
        </div >
    )
}
