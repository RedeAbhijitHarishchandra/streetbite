'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container px-4 md:px-6 mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">StreetBite</h3>
                        <p className="text-sm leading-relaxed">
                            Discover authentic street food from local vendors. Your ultimate companion for finding the best flavors.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="#"
                                aria-label="Visit our Facebook page"
                                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white transition-all"
                            >
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link
                                href="#"
                                aria-label="Follow us on Instagram"
                                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white transition-all"
                            >
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link
                                href="#"
                                aria-label="Follow us on Twitter"
                                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white transition-all"
                            >
                                <Twitter className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/explore" className="hover:text-orange-500 transition-colors">
                                    Explore Food
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-orange-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup?type=vendor" className="hover:text-orange-500 transition-colors">
                                    Become a Vendor
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-orange-500 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="hover:text-orange-500 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-orange-500 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="hover:text-orange-500 transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund" className="hover:text-orange-500 transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                <span>123 Seaface Road, Daman, DD 396210</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                                <span>hello@streetbite.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <p className="text-slate-400">
                            © {currentYear} StreetBite. All rights reserved. Made with{' '}
                            <Heart className="w-3 h-3 inline fill-orange-500 text-orange-500" /> for food lovers.
                        </p>
                        <div className="flex gap-6 text-slate-400">
                            <Link href="/sitemap" className="hover:text-orange-500 transition-colors">
                                Sitemap
                            </Link>
                            <Link href="/accessibility" className="hover:text-orange-500 transition-colors">
                                Accessibility
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
