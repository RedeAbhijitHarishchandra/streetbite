'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Star, Phone, Share2, Navigation, ChevronLeft, Utensils } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DirectionsMap } from '@/components/directions-map'
import { vendorApi, menuApi } from '@/lib/api'

interface Vendor {
    id: string
    name: string
    description: string
    cuisine: string
    address: string
    latitude: number
    longitude: number
    rating: number
    imageUrl?: string
    phone?: string
    hours?: string
    galleryImages?: string[]
}

interface MenuItem {
    itemId: string
    name: string
    description: string
    price: number
    imageUrl?: string
    category: string
    isAvailable: boolean
    rating?: number
}

export default function VendorDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const vendorId = params?.id as string

    const [vendor, setVendor] = useState<Vendor | null>(null)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('menu')

    // Directions State
    const [showDirections, setShowDirections] = useState(false)
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

    useEffect(() => {
        if (!vendorId) return

        const fetchData = async () => {
            try {
                // Fetch vendor details
                const vendorData = await vendorApi.getById(vendorId)
                setVendor(vendorData)

                // Fetch menu items
                const menuData = await menuApi.getByVendor(vendorId)
                setMenuItems(menuData)
            } catch (error) {
                console.error('Error fetching vendor data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [vendorId])

    const handleGetDirections = () => {
        if (!vendor) return

        // Try to get user location first
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    setShowDirections(true)
                },
                (error) => {
                    console.error('Error getting location:', error)
                    // Fallback to Google Maps in new tab if location fails
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`
                    window.open(url, '_blank')
                }
            )
        } else {
            // Fallback if geolocation not supported
            const url = `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`
            window.open(url, '_blank')
        }
    }

    const handleShare = async () => {
        if (!vendor) return
        const shareData = {
            title: `Check out ${vendor.name} on StreetBite!`,
            text: `I found this amazing street food vendor: ${vendor.name}. Check them out!`,
            url: window.location.href,
        }

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
            }
        } catch (err) {
            console.error('Error sharing:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
                    <Link href="/explore">
                        <Button>Back to Explore</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            {/* Directions Modal */}
            <Dialog open={showDirections} onOpenChange={setShowDirections}>
                <DialogContent className="sm:max-w-[600px] h-[80vh] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="p-4 pb-2">
                        <DialogTitle>Directions to {vendor.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full relative">
                        {userLocation && (
                            <DirectionsMap
                                origin={userLocation}
                                destination={{ lat: vendor.latitude, lng: vendor.longitude }}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] w-full bg-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <img
                    src={vendor.imageUrl || "/placeholder-vendor.jpg"}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop'
                    }}
                />

                <div className="absolute top-6 left-6 z-20">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border-none"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={24} />
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                        {vendor.cuisine || 'Street Food'}
                                    </span>
                                    {vendor.rating > 0 && (
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
                                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold">{vendor.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black mb-2">{vendor.name}</h1>
                                <div className="flex items-center gap-4 text-sm md:text-base text-white/90">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} />
                                        <span className="truncate max-w-[200px] md:max-w-md">{vendor.address || 'Location available on map'}</span>
                                    </div>
                                    {vendor.hours && (
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} />
                                            <span>{vendor.hours}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleGetDirections}
                                    className="bg-white text-black hover:bg-white/90 font-semibold gap-2"
                                >
                                    <Navigation size={18} />
                                    Get Directions
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleShare}
                                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
                                >
                                    <Share2 size={18} />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {['Menu', 'About', 'Reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase()
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'menu' && (
                    <div className="space-y-8">
                        {menuItems.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Menu Items Yet</h3>
                                <p className="text-gray-500">This vendor hasn't added their menu yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems.map((item) => (
                                    <div key={item.itemId} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex">
                                        <div className="w-32 h-32 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                            <img
                                                src={item.imageUrl || "/placeholder-food.jpg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop'
                                                }}
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                                    <span className="font-black text-primary text-sm">₹{item.price}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wide">
                                                    {item.category}
                                                </span>
                                                <Button size="sm" variant="ghost" className="h-8 text-xs font-semibold hover:text-primary hover:bg-primary/5">
                                                    Add +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-4">About {vendor.name}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {vendor.description || 'No description available.'}
                                </p>
                            </div>

                            {/* Gallery Section */}
                            {vendor.galleryImages && vendor.galleryImages.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Gallery</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {vendor.galleryImages.map((imgUrl, i) => (
                                            <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Gallery ${i + 1}`}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/placeholder-food.jpg'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="font-bold mb-4">Contact & Hours</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-primary mt-1" size={18} />
                                        <div>
                                            <p className="font-semibold text-sm">Address</p>
                                            <p className="text-sm text-gray-600">{vendor.address || 'Location on map'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="text-primary mt-1" size={18} />
                                        <div>
                                            <p className="font-semibold text-sm">Opening Hours</p>
                                            <p className="text-sm text-gray-600">{vendor.hours || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    {vendor.phone && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="text-primary mt-1" size={18} />
                                            <div>
                                                <p className="font-semibold text-sm">Phone</p>
                                                <p className="text-sm text-gray-600">{vendor.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500">Be the first to review this vendor!</p>
                        <Button className="mt-4" variant="outline">Write a Review</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
