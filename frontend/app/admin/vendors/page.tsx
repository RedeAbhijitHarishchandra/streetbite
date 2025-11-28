'use client'

import { useState, useEffect } from 'react'
import { vendorApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from '@/components/ui/select'
import { Eye, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react'

interface Vendor {
  id: number
  name: string
  owner: string
  city: string
  email: string
  phone: string
  status: 'Approved' | 'Pending' | 'Suspended'
  joined: string
  rating: number
  revenue: string
  orders: number
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const data = await vendorApi.getAll()
      // Map API response to UI model
      const mappedVendors = data.map((v: any) => ({
        id: v.vendorId,
        name: v.businessName,
        owner: v.ownerName || 'Unknown', // Backend might need to return owner name
        city: 'Unknown', // Backend doesn't have city in Vendor entity yet
        email: v.email || 'unknown@example.com',
        phone: v.phoneNumber || 'Unknown',
        status: v.isActive ? 'Approved' : 'Pending', // Simplified status mapping
        joined: new Date(v.createdAt).toLocaleDateString(),
        rating: 0, // Placeholder
        revenue: '₹0', // Placeholder
        orders: 0, // Placeholder
      }))
      setVendors(mappedVendors)
    } catch (err) {
      console.error('Failed to fetch vendors', err)
      setError('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredVendors = vendors.filter(vendor => {
    const matchesStatus = filterStatus === 'All' || vendor.status === filterStatus
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Suspended':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all vendors on the platform</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by vendor name or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-input rounded-md text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>{filteredVendors.length} vendors on platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">{vendor.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.owner}</TableCell>
                    <TableCell>{vendor.city}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {vendor.rating > 0 ? (
                        <span className="font-medium text-amber-600">{vendor.rating}/5</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{vendor.revenue}</TableCell>
                    <TableCell>{vendor.orders}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{vendor.name}</DialogTitle>
                              <DialogDescription>Vendor details and management</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-muted-foreground">Owner Name</Label>
                                <p className="font-medium">{vendor.owner}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Email</Label>
                                <p className="font-medium">{vendor.email}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Phone</Label>
                                <p className="font-medium">{vendor.phone}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">City</Label>
                                <p className="font-medium">{vendor.city}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Joined</Label>
                                <p className="font-medium">{vendor.joined}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Status</Label>
                                <p className="font-medium">{vendor.status}</p>
                              </div>
                            </div>
                            {vendor.status === 'Pending' && (
                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                                  onClick={async () => {
                                    await vendorApi.update(vendor.id.toString(), { isActive: true })
                                    fetchVendors()
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1 gap-2"
                                  onClick={async () => {
                                    // For now just deactivate/keep inactive
                                    await vendorApi.update(vendor.id.toString(), { isActive: false })
                                    fetchVendors()
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {vendor.status === 'Approved' && (
                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  variant="destructive"
                                  className="flex-1 gap-2"
                                  onClick={async () => {
                                    await vendorApi.update(vendor.id.toString(), { isActive: false })
                                    fetchVendors()
                                  }}
                                >
                                  Suspend Vendor
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
