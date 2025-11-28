'use client'

import { useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [cuisine, setCuisine] = useState('')
  const [location, setLocation] = useState('')
  const [cuisineFocused, setCuisineFocused] = useState(false)
  const [locationFocused, setLocationFocused] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search logic here
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-2 shadow-xl border-2 border-orange-100 hover:border-orange-200 transition-all duration-300">
        {/* Cuisine Input */}
        <div className={`flex-1 flex items-center gap-3 px-5 py-2 rounded-xl transition-all duration-200 ${cuisineFocused ? 'bg-orange-50 ring-2 ring-orange-200' : ''
          }`}>
          <Search size={20} className={`flex-shrink-0 transition-colors duration-200 ${cuisineFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
          <input
            type="text"
            placeholder="What are you craving?"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            onFocus={() => setCuisineFocused(true)}
            onBlur={() => setCuisineFocused(false)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-medium"
          />
          {cuisine && (
            <button
              type="button"
              onClick={() => setCuisine('')}
              className="p-1 hover:bg-orange-100 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Location Input */}
        <div className={`flex-1 flex items-center gap-3 px-5 py-2 rounded-xl border-t sm:border-t-0 sm:border-l border-orange-100 transition-all duration-200 ${locationFocused ? 'bg-orange-50 ring-2 ring-orange-200' : ''
          }`}>
          <MapPin size={20} className={`flex-shrink-0 transition-colors duration-200 ${locationFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setLocationFocused(true)}
            onBlur={() => setLocationFocused(false)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-medium"
          />
          {location && (
            <button
              type="button"
              onClick={() => setLocation('')}
              className="p-1 hover:bg-orange-100 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-8 sm:px-8 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
