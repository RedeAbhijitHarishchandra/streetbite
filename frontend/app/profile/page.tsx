'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Upload, Trash2, X } from 'lucide-react'
import { userApi } from '@/lib/api'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081/api';

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Password Reset State
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [userData, setUserData] = useState({
    userId: '',
    email: '',
    displayName: '',
    phoneNumber: '',
    role: '',
    profilePicture: '',
  })

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/signin')
      return
    }

    try {
      const user = JSON.parse(userStr)
      setUserData({
        userId: user.id || user.userId || '',
        email: user.email || '',
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || 'CUSTOMER',
        profilePicture: user.profilePicture || '',
      })
      setResetEmail(user.email || '')
      setLoading(false)
    } catch (e) {
      console.error('Error parsing user data:', e)
      setError('Failed to load user data')
      setLoading(false)
    }
  }, [router])

  const handleSave = async () => {
    if (!userData.userId) {
      setError('User ID not found')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const updateData = {
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        profilePicture: userData.profilePicture,
      }

      const response = await userApi.update(userData.userId, updateData)

      // Update localStorage with new data
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        profilePicture: userData.profilePicture,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Dispatch custom event to update Navbar
      window.dispatchEvent(new Event('user-updated'))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleForgotPassword = async () => {
    setResetStatus('sending')
    try {
      await axios.post(`${BACKEND_URL}/auth/forgot-password`, { email: resetEmail })
      setResetStatus('sent')
    } catch (err) {
      setResetStatus('error')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${BACKEND_URL}/files/upload`, formData)

      const imageUrl = response.data.url
      setUserData({ ...userData, profilePicture: imageUrl })
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveProfilePicture = () => {
    setUserData({ ...userData, profilePicture: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors mb-6 hover:-translate-x-1 duration-200">
          <ArrowLeft size={20} />
          Back to Explore
        </Link>

        {/* Profile Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">My Profile</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your personal information and customize your avatar</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 animate-in fade-in slide-in-from-top-2">
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          {/* Left Column: Avatar Selection */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden h-fit">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-orange-400/20" />
            <CardContent className="-mt-16 flex flex-col items-center pb-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-orange-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white transform transition-transform duration-300 group-hover:scale-105">
                  {userData.profilePicture ? (
                    <img
                      src={(() => {
                        const path = userData.profilePicture;
                        if (path.startsWith('http')) return path;
                        if (path.startsWith('/avatars/')) return path;
                        // For backend images starting with /api
                        const baseUrl = BACKEND_URL.replace(/\/api\/?$/, '');
                        return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
                      })()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = '/avatars/avatar_1.png'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <User size={64} />
                    </div>
                  )}

                  {/* Remove Button Overlay */}
                  {userData.profilePicture && (
                    <button
                      onClick={handleRemoveProfilePicture}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      title="Remove Profile Picture"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">{userData.displayName || 'User'}</h2>
              <p className="text-sm text-gray-500 capitalize font-medium mb-6">{userData.role.toLowerCase()}</p>

              {/* Custom Upload Buttons */}
              <div className="flex gap-2 mb-6 w-full px-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  className="flex-1 border-primary/20 hover:bg-primary/5 hover:text-primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
                {userData.profilePicture && (
                  <Button
                    variant="outline"
                    className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 px-3"
                    onClick={handleRemoveProfilePicture}
                    title="Remove photo"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              <div className="w-full border-t pt-6">
                <Label className="text-center block mb-4 text-gray-700 font-semibold text-lg">Choose an Avatar</Label>
                <div className="grid grid-cols-4 gap-4 p-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setUserData({ ...userData, profilePicture: `/avatars/avatar_${num}.png` })}
                      className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${userData.profilePicture === `/avatars/avatar_${num}.png`
                        ? 'ring-4 ring-primary ring-offset-2 scale-110 shadow-xl z-10'
                        : 'hover:scale-110 hover:shadow-lg opacity-80 hover:opacity-100 hover:z-10'
                        }`}
                    >
                      <img
                        src={`/avatars/avatar_${num}.png`}
                        alt={`Avatar ${num}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Form */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle className="text-2xl">Personal Details</CardTitle>
              <CardDescription>Update your contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email (Read-only) */}
              <div className="group">
                <Label htmlFor="email" className="flex items-center gap-2 text-gray-600 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="mt-2 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                />
              </div>

              {/* Display Name */}
              <div className="group">
                <Label htmlFor="displayName" className="flex items-center gap-2 text-gray-600 group-focus-within:text-primary transition-colors">
                  <User size={18} />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your name"
                  value={userData.displayName}
                  onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                  className="mt-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="group">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-gray-600 group-focus-within:text-primary transition-colors">
                  <Phone size={18} />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={userData.phoneNumber}
                  onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                  className="mt-2 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Role (Read-only) */}
              <div className="group">
                <Label htmlFor="role" className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  Account Type
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={userData.role}
                  disabled
                  className="mt-2 bg-gray-50/50 border-gray-200 capitalize"
                />
              </div>

              {/* Forgot Password Modal */}
              <div className="flex justify-end">
                <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary hover:text-primary/80 px-0">
                      Forgot Password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          placeholder="name@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                      {resetStatus === 'sent' && (
                        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                          Check your email! A reset link has been sent if an account exists.
                        </div>
                      )}
                      {resetStatus === 'error' && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                          Something went wrong. Please try again.
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsResetOpen(false)}>Cancel</Button>
                      <Button onClick={handleForgotPassword} disabled={resetStatus === 'sending' || resetStatus === 'sent'}>
                        {resetStatus === 'sending' ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Save size={20} />
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground bg-white/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
            Note: Email and account type cannot be changed. Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}
