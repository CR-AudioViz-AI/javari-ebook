'use client';
// app/page.tsx — Javari eBook Creator landing page — CR AudioViz AI — Created: 2026-03-15

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Sparkles, Wand2, Download, Layout, Palette, Globe, Zap,
  ChevronRight, Check, Star, Users, FileText, Layers } from 'lucide-react';

const FEATURES = [
  { icon: Wand2, title: 'AI Content Generation', description: 'Describe your topic and AI writes complete chapters, introductions, and conclusions with professional structure.' },
  { icon: Layout, title: 'Professional Templates', description: 'Choose from a growing library of templates for business books, novels, how-to guides, cookbooks, and more.' },
  { icon: Palette, title: 'Brand Customization', description: 'Apply your colors, fonts, and style across every page with one click. Upload your logo and brand kit.' },
  { icon: Download, title: 'Multi-Format Export', description: 'Export to PDF, ePub, MOBI, or print-ready files. Publish directly to Amazon KDP, Gumroad, or your own store.' },
  { icon: Globe, title: 'Built-in Publishing', description: 'Get a shareable landing page for your eBook the moment you finish. Collect emails and sell with zero setup.' },
  { icon: Zap, title: 'Credits Never Expire', description: 'Your credits roll over forever on any paid plan. No pressure, no waste — we build tools for creators.' },
];

const BOOK_TYPES = [
  { name: 'Business & Leadership', icon: '💼', color: 'from-blue-500 to-indigo-600' },
  { name: 'How-To & Guides',       icon: '📋', color: 'from-emerald-500 to-teal-600' },
  { name: 'Fiction & Novels',      icon: '📖', color: 'from-purple-500 to-violet-600' },
  { name: 'Health & Wellness',     icon: '🌿', color: 'from-green-400 to-emerald-500' },
  { name: 'Cookbooks & Recipes',   icon: '🍳', color: 'from-orange-400 to-amber-500' },
  { name: 'Children's Books',     icon: '🌈', color: 'from-pink-400 to-rose-500' },
  { name: 'Memoirs & Biography',   icon: '✍️', color: 'from-amber-400 to-orange-500' },
  { name: 'Academic & Research',   icon: '🎓', color: 'from-cyan-500 to-blue-600' },
];

export default function EBookLanding() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Javari <span className="text-purple-600">eBook</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="https://craudiovizai.com" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hidden sm:block">
              Back to Platform
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered eBook Creation
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Write your book.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Let AI do the heavy lifting.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Create professional eBooks in minutes — not months. AI generates content, designs pages, and helps you publish to every major platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25">
                Create Your eBook Free
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="https://craudiovizai.com" className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex items-center justify-center gap-2">
                Explore Full Platform
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">No credit card required · 3 free eBooks to start · Credits never expire</p>
          </motion.div>
        </div>
      </section>

      {/* Book Types */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">Every type of book. One platform.</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12">AI trained on thousands of successful books in every genre.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BOOK_TYPES.map(b => (
              <motion.div key={b.name} whileHover={{ scale: 1.03 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-2xl mb-3`}>
                  {b.icon}
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm leading-tight">{b.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">Everything you need to publish</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            From first draft to published eBook — the complete toolchain, powered by AI.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-violet-700">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="w-14 h-14 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Your story deserves to be told.</h2>
          <p className="text-white/80 text-lg mb-8">Join creators publishing their first eBook every day on the CR AudioViz AI platform.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-xl">
            Start Writing Today
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 CR AudioViz AI, LLC · Roy & Cindy Henderson · Fort Myers, FL
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
            <Link href="https://craudiovizai.com" className="hover:text-gray-700 dark:hover:text-gray-300">Platform</Link>
            <Link href="https://craudiovizai.com/pricing" className="hover:text-gray-700 dark:hover:text-gray-300">Pricing</Link>
            <Link href="https://craudiovizai.com/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
