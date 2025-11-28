'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Camera, Save, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { vendorApi } from '@/lib/api'
import { toast } from 'sonner'

// Vendor interface for type safety
interface Vendor {
    id: string | number
    name: string
    description?: string
    cuisine?: string
    address?: string
    phone?: string
    hours?: string
    bannerImageUrl?: string
    displayImageUrl?: string
    imageUrl?: string
    email?: string
    createdAt?: string
    updatedAt?: string
}

export default function VendorDashboardPage() {
    const router = useRouter()
    const [vendor, setVendor] = useState<Vendor | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [cuisine, setCuisine] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [hours, setHours] = useState('')

    // Image previews
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [displayPreview, setDisplayPreview] = useState<string | null>(null)

    // New images (base64)
    const [newBannerImage, setNewBannerImage] = useState<string | null>(null)
    const [newDisplayImage, setNewDisplayImage] = useState<string | null>(null)

    useEffect(() => {
        // Check if user is logged in and is a vendor
        const userStr = localStorage.getItem('user')
        if (!userStr) {
            router.push('/signin')
            return
        }

        try {
            const user = JSON.parse(userStr)
            if (user.role !== 'VENDOR') {
                toast.error('Access denied. Only vendors can access this page.')
                router.push('/')
                return
            }

            // Validate vendorId exists
            if (!user.vendorId) {
                toast.error('No vendor account linked. Please contact support.')
                router.push('/')
                return
            }

            // Validate vendorId format (should be a number or numeric string)
            const vendorId = String(user.vendorId)
            if (!vendorId || vendorId === 'undefined' || vendorId === 'null') {
                toast.error('Invalid vendor ID. Please contact support.')
                router.push('/')
                return
            }

            // Fetch vendor data
            const fetchVendor = async () => {
                try {
                    const vendorData: Vendor = await vendorApi.getById(vendorId)
                    setVendor(vendorData)

                    // Populate form
                    setName(vendorData.name || '')
                    setDescription(vendorData.description || '')
                    setCuisine(vendorData.cuisine || '')
                    setAddress(vendorData.address || '')
                    setPhone(vendorData.phone || '')
                    setHours(vendorData.hours || '')
                    setBannerPreview(vendorData.bannerImageUrl || vendorData.imageUrl || null)
                    setDisplayPreview(vendorData.displayImageUrl || vendorData.imageUrl || null)
                } catch (error) {
                    console.error('Error fetching vendor:', error)
                    toast.error('Failed to load vendor data. Please try again.')
                    // Don't redirect immediately, let user retry
                } finally {
                    setLoading(false)
                }
            }

            fetchVendor()
        } catch (error) {
            console.error('Error parsing user data:', error)
            toast.error('Invalid user session')
            router.push('/signin')
        }
    }, [router])

    const handleImageUpload = (file: File, type: 'banner' | 'display') => {
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB')
            return
        }

        // Convert to base64 with error handling
        const reader = new FileReader()

        reader.onloadend = () => {
            const base64 = reader.result as string
            if (type === 'banner') {
                setBannerPreview(base64)
                setNewBannerImage(base64)
            } else {
                setDisplayPreview(base64)
                setNewDisplayImage(base64)
            }
            // Show preview message, not success (not saved yet)
            toast.success(`${type === 'banner' ? 'Banner' : 'Display'} image loaded to preview — click Save Changes to persist`)
        }

        reader.onerror = () => {
            console.error('FileReader error:', reader.error)
            toast.error(`Failed to read ${type === 'banner' ? 'banner' : 'display'} image file`)
        }

        reader.onabort = () => {
            toast.error('Image upload was cancelled')
        }

        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        if (!vendor) return

        setSaving(true)
        try {
            const updateData = {
                name,
                description,
                cuisine,
                address,
                phone,
                hours,
                bannerImageUrl: newBannerImage || vendor.bannerImageUrl,
                displayImageUrl: newDisplayImage || vendor.displayImageUrl,
            }

            await vendorApi.update(String(vendor.id), updateData)
            toast.success('Vendor information updated successfully!')

            // Refresh vendor data
            const updatedVendor: Vendor = await vendorApi.getById(String(vendor.id))
            setVendor(updatedVendor)
            setNewBannerImage(null)
            setNewDisplayImage(null)
        } catch (error) {
            console.error('Error updating vendor:', error)
            toast.error('Failed to update vendor information')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2">Vendor Dashboard</h1>
                <p className="text-gray-600">Manage your vendor profile and images</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></span>
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Vendor Name</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter vendor name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Description</label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your food and specialties"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Cuisine Type</label>
                                    <Input
                                        value={cuisine}
                                        onChange={(e) => setCuisine(e.target.value)}
                                        placeholder="e.g., Indian, Mexican"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Phone</label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Contact number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Address</label>
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Full address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Operating Hours</label>
                                <Input
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    placeholder="e.g., 10 AM - 10 PM"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></span>
                            Banner Image
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">This large image appears as the background on your vendor details page</p>

                        <div className="space-y-4">
                            {bannerPreview && (
                                <div className="relative h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <label className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleImageUpload(file, 'banner')
                                        }}
                                    />
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all hover:scale-105">
                                        <Camera size={20} />
                                        <span className="font-semibold">Change Banner Image</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Display Image */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></span>
                            Display Image
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">This thumbnail appears in vendor cards and search results</p>

                        <div className="space-y-4">
                            {displayPreview && (
                                <div className="relative w-64 h-64 rounded-xl overflow-hidden border-2 border-gray-200 mx-auto">
                                    <img
                                        src={displayPreview}
                                        alt="Display preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <label className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleImageUpload(file, 'display')
                                        }}
                                    />
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all hover:scale-105">
                                        <ImageIcon size={20} />
                                        <span className="font-semibold">Change Display Image</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 sticky top-24">
                        <h3 className="font-bold text-lg mb-4">Quick Tips</h3>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Use high-quality images (recommended: 1920x1080 for banner)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Display image should be square (recommended: 800x800)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Maximum file size: 5MB per image</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Supported formats: JPG, PNG, WebP</span>
                            </li>
                        </ul>

                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold gap-2 shadow-lg hover:scale-105 transition-all"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
