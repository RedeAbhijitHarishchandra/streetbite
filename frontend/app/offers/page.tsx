'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Flame, Tag, Calendar, MapPin, Copy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { promotionApi } from '@/lib/api'
import { Footer } from '@/components/footer'

interface Promotion {
  promotionId: string
  vendorId: string
  title: string
  description: string
  discountType: string
  discountValue: number
  promoCode: string
  startDate?: string
  endDate: string
  isActive: boolean
  maxUses: number
  currentUses?: number
}

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<number | null>(null)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await promotionApi.getAll()
        // Filter only active promotions
        const activePromotions = (data.promotions || data || []).filter((p: Promotion) => p.isActive)
        setPromotions(activePromotions)
      } catch (error) {
        console.error('Error fetching promotions:', error)
        setPromotions([])
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  const getDiscountText = (promo: Promotion) => {
    if (promo.discountType === 'PERCENTAGE') {
      return `${promo.discountValue}% OFF`
    } else if (promo.discountType === 'FIXED_AMOUNT') {
      return `₹${promo.discountValue} OFF`
    } else {
      return 'SPECIAL OFFER'
    }
  }

  const daysUntilExpiry = (date: string) => {
    const today = new Date()
    const expiry = new Date(date)
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 'Expired'
  }

  const copyToClipboard = (code: string, id: number) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* CHANGE: improved hero section with consistent spacing and clean design */}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <Flame size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Hot Deals This Week</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-4 text-balance">
            Exclusive Offers from <span className="text-shine-amber">Street Vendors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Save big on your favorite street food with limited-time deals from our community vendors</p>
        </div>
      </section>

      {/* CHANGE: improved offers grid with better card design and spacing */}
      {/* Offers Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-foreground mb-12">Available Offers</h2>

          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading offers...</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Offers</h3>
              <p className="text-muted-foreground">Check back later for new deals from our vendors!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {promotions.map((promo) => (
                <div key={promo.promotionId} className="group rounded-2xl overflow-hidden border border-border/30 hover:border-primary/40 shadow-md hover:shadow-lg transition-all duration-300 bg-white flex flex-col h-full">
                  {/* Image Placeholder - In real app, fetch vendor image */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Flame className="h-12 w-12 text-primary/20" />
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-sm shadow-lg">
                      {getDiscountText(promo)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">Limited Time</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">{promo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">{promo.description}</p>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-5 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} className="flex-shrink-0" />
                        <span>{daysUntilExpiry(promo.endDate) === 'Expired' ? 'Expired' : `${daysUntilExpiry(promo.endDate)} days left`}</span>
                      </div>
                    </div>

                    {/* Code & Button */}
                    <div className="space-y-3 border-t border-border/30 pt-4">
                      <button
                        onClick={() => copyToClipboard(promo.promoCode, parseInt(promo.promotionId) || 0)}
                        className="w-full bg-primary/10 hover:bg-primary/15 p-3 rounded-lg transition-colors text-center"
                      >
                        <p className="text-xs text-muted-foreground mb-1">Use Code</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="font-black text-primary text-sm">{promo.promoCode}</p>
                          <Copy size={14} className="text-primary" />
                        </div>
                        {copiedCode === (parseInt(promo.promotionId) || 0) && (
                          <p className="text-xs text-primary mt-1 font-semibold">Copied!</p>
                        )}
                      </button>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm">
                        Claim Offer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
