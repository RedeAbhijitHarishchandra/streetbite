'use client'

import Link from 'next/link'
import { Star, MapPin, TrendingUp } from 'lucide-react'
import { useVendorStatus } from '@/hooks/use-vendor-status'

interface VendorCardProps {
  id: string
  name: string
  cuisine: string
  rating: number
  distance: string
  image: string
  reviews: number
  tags: string[]
}

export function VendorCard({ id, name, cuisine, rating, distance, image, reviews, tags }: VendorCardProps) {
  // Real-time vendor status from Firebase
  const { status } = useVendorStatus(id);

  return (
    <Link href={`/vendors/${id}`} className="block group">
      <div className="overflow-hidden rounded-2xl bg-white border border-border/30 hover:border-primary/40 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-56 bg-muted overflow-hidden flex-shrink-0">
          <img
            src={image || "/placeholder.svg?height=224&width=400&query=street+food+vendor"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Rating badge */}
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
            <Star size={14} fill="currentColor" />
            {rating}
          </div>

          {/* Real-time online status badge (NEW) */}
          {status && (
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg ${status.isOnline
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
              }`}>
              <span className={`w-2 h-2 rounded-full ${status.isOnline ? 'bg-white animate-pulse' : 'bg-gray-300'
                }`}></span>
              {status.isOnline ? (
                status.isAcceptingOrders ? 'Open' : 'Busy'
              ) : 'Offline'}
            </div>
          )}
        </div>

        <div className="p-5 space-y-4 flex flex-col flex-grow">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-primary font-medium text-sm">{cuisine}</p>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin size={16} className="text-primary flex-shrink-0" />
            <span>{distance}</span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {(tags || []).map((tag) => (
              <span key={tag} className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
            <p className="text-xs font-medium text-muted-foreground">{reviews} reviews</p>
            <TrendingUp size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  )
}
