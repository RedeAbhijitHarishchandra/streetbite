'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Maximize2 } from 'lucide-react'
import { GOOGLE_MAPS_API_KEY } from '@/lib/maps-config'

interface DirectionsMapProps {
    origin: { lat: number; lng: number }
    destination: { lat: number; lng: number }
}

export function DirectionsMap({ origin, destination }: DirectionsMapProps) {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const mapInstance = useRef<any>(null)
    const directionsRenderer = useRef<any>(null)
    const directionsService = useRef<any>(null)
    const originMarker = useRef<any>(null)
    const destinationMarker = useRef<any>(null)

    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)

    useEffect(() => {
        const key = GOOGLE_MAPS_API_KEY

        if (!key) {
            setError('Google Maps API key not configured')
            return
        }

        if ((window as any).google && (window as any).google.maps) {
            setLoaded(true)
            return
        }

        const id = 'gmaps-sdk'
        if (!document.getElementById(id)) {
            const script = document.createElement('script')
            script.id = id
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`
            script.async = true
            script.defer = true
            script.onload = () => setLoaded(true)
            script.onerror = () => setError('Failed to load Google Maps')
            document.head.appendChild(script)
        } else {
            setLoaded(true)
        }
    }, [])

    useEffect(() => {
        if (!loaded || !mapRef.current) return

        const gm = (window as any).google?.maps
        if (!gm) return

        if (!mapInstance.current) {
            mapInstance.current = new gm.Map(mapRef.current, {
                center: origin,
                zoom: 14,
                // Enable full interactivity
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: gm.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: gm.ControlPosition.TOP_RIGHT,
                },
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: gm.ControlPosition.RIGHT_CENTER,
                },
                gestureHandling: 'greedy', // Enable all gestures
                draggable: true, // Enable dragging
                scrollwheel: true, // Enable scroll to zoom
                disableDoubleClickZoom: false, // Enable double-click zoom
                keyboardShortcuts: true, // Enable keyboard controls
                // Modern map styling
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#757575' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#e5e5e5' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#ffffff' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#e0e0e0' }]
                    }
                ]
            })

            directionsService.current = new gm.DirectionsService()
            directionsRenderer.current = new gm.DirectionsRenderer({
                map: mapInstance.current,
                suppressMarkers: true, // We'll add custom markers
                polylineOptions: {
                    strokeColor: '#F97316', // Orange color
                    strokeWeight: 5,
                    strokeOpacity: 0.8,
                }
            })
        }

        // Create custom origin marker (user location) - Animated Pulsing Design
        if (!originMarker.current) {
            originMarker.current = new gm.Marker({
                position: origin,
                map: mapInstance.current,
                title: 'Your Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
                            <defs>
                                <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" style="stop-color:#4285F4;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#4285F4;stop-opacity:0" />
                                </radialGradient>
                            </defs>
                            
                            <!-- Outer pulse ring (animated effect) -->
                            <circle cx="30" cy="30" r="25" fill="url(#pulse)" opacity="0.3"/>
                            
                            <!-- Middle ring -->
                            <circle cx="30" cy="30" r="15" fill="#4285F4" opacity="0.3"/>
                            
                            <!-- Center dot with glow -->
                            <circle cx="30" cy="30" r="8" fill="#4285F4" stroke="#fff" stroke-width="3"/>
                            
                            <!-- Crosshair -->
                            <line x1="30" y1="18" x2="30" y2="8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                            <line x1="30" y1="42" x2="30" y2="52" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                            <line x1="18" y1="30" x2="8" y2="30" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                            <line x1="42" y1="30" x2="52" y2="30" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    `),
                    scaledSize: new gm.Size(60, 60),
                    anchor: new gm.Point(30, 30),
                },
                animation: gm.Animation.DROP,
            })
        } else {
            originMarker.current.setPosition(origin)
        }

        // Create custom destination marker (vendor location) - 3D Pin with Shadow
        if (!destinationMarker.current) {
            destinationMarker.current = new gm.Marker({
                position: destination,
                map: mapInstance.current,
                title: 'Vendor Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="70" viewBox="0 0 50 70">
                            <defs>
                                <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
                                </linearGradient>
                                <filter id="shadow3d" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                                    <feOffset dx="2" dy="4" result="offsetblur"/>
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.5"/>
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            <g filter="url(#shadow3d)">
                                <!-- 3D Pin shape with gradient -->
                                <path d="M25 5 C15 5 7 13 7 23 C7 35 25 50 25 50 S43 35 43 23 C43 13 35 5 25 5 Z" 
                                      fill="url(#pinGradient)" 
                                      stroke="#fff" 
                                      stroke-width="2.5"/>
                                
                                <!-- Inner white circle -->
                                <circle cx="25" cy="23" r="10" fill="#fff"/>
                                
                                <!-- Food truck icon -->
                                <g transform="translate(25, 23)">
                                    <rect x="-6" y="-4" width="12" height="6" fill="#FF6B35" rx="1"/>
                                    <rect x="-5" y="-2" width="3" height="3" fill="#fff" opacity="0.7"/>
                                    <rect x="2" y="-2" width="3" height="3" fill="#fff" opacity="0.7"/>
                                    <circle cx="-3" cy="3" r="1.5" fill="#333"/>
                                    <circle cx="3" cy="3" r="1.5" fill="#333"/>
                                </g>
                                
                                <!-- Highlight shine effect -->
                                <ellipse cx="19" cy="15" rx="4" ry="6" fill="#fff" opacity="0.3"/>
                            </g>
                        </svg>
                    `),
                    scaledSize: new gm.Size(50, 70),
                    anchor: new gm.Point(25, 70),
                },
                animation: gm.Animation.BOUNCE,
            })

            // Stop bouncing after 2 seconds
            setTimeout(() => {
                if (destinationMarker.current) {
                    destinationMarker.current.setAnimation(null)
                }
            }, 2000)
        } else {
            destinationMarker.current.setPosition(destination)
        }

        // Calculate Route
        if (directionsService.current && directionsRenderer.current) {
            // Check if we already requested directions for these coordinates
            const last = (mapInstance.current as any).lastRequest
            if (last &&
                last.origin.lat === origin.lat && last.origin.lng === origin.lng &&
                last.destination.lat === destination.lat && last.destination.lng === destination.lng) {
                return
            }

            directionsService.current.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: gm.TravelMode.DRIVING,
                },
                (result: any, status: any) => {
                    if (status === gm.DirectionsStatus.OK) {
                        directionsRenderer.current.setDirections(result)

                            // Store last request to prevent loops
                            ; (mapInstance.current as any).lastRequest = { origin, destination }

                        // Extract distance and duration
                        const leg = result.routes[0].legs[0]
                        setRouteInfo({
                            distance: leg.distance.text,
                            duration: leg.duration.text,
                        })
                    } else if (status === gm.DirectionsStatus.OVER_QUERY_LIMIT) {
                        setError('Too many requests. Please try again later.')
                    } else {
                        console.error('Directions request failed due to ' + status)
                        setError(`Could not calculate directions: ${status}`)
                    }
                }
            )
        }

    }, [loaded, origin.lat, origin.lng, destination.lat, destination.lng])

    const openInGoogleMaps = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`,
            '_blank'
        )
    }

    return (
        <div className="relative w-full h-full">
            {error ? (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-500 p-4 text-center">
                    <MapPin className="h-8 w-8 mb-2 opacity-50" />
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={openInGoogleMaps}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Maximize2 size={16} />
                        Open in Google Maps
                    </button>
                </div>
            ) : (
                <>
                    <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-lg" />

                    {/* Legend */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 z-10">
                        <div className="flex flex-col gap-2 text-xs">
                            <div className="flex items-center gap-2 font-medium">
                                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                <span>Your Location</span>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>
                                <span>Vendor</span>
                            </div>
                        </div>
                    </div>

                    {routeInfo && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Estimated Travel</p>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{routeInfo.duration}</span>
                                        <span className="text-sm font-semibold text-gray-600">({routeInfo.distance})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                        <span>Driving route</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={openInGoogleMaps}
                                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                        title="Open in Google Maps"
                                    >
                                        <Maximize2 className="h-5 w-5" />
                                    </button>
                                    <div className="bg-orange-100 p-3 rounded-xl">
                                        <Navigation className="text-orange-600 h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Interactive hint */}
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg animate-bounce">
                        👆 Drag to explore!
                    </div>
                </>
            )}
        </div>
    )
}
