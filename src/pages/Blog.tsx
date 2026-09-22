import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blog';

const CATEGORIES = ['All', 'Destinations', 'Travel Tips', 'Itineraries', 'Budget Travel', 'Adventure', 'Photography', 'Wildlife', 'Food & Culture', 'Wellness'];

export default function Blog() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogPosts.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = blogPosts.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-hero text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Travel Blog</h1>
          <p className="text-white/70 text-lg">Stories, guides, and inspiration from India's finest travel writers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featured.slice(0, 3).map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/blog/${post.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className="relative h-52 overflow-hidden">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge-orange">{post.category}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg leading-snug line-clamp-2">{post.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-medium text-navy-900">{post.author.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {post.readTime} min read</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Search + Categories */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 bg-white" />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
                ${category === c ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-600 border-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/blog/${post.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className="relative h-44 overflow-hidden">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3"><span className="badge-orange">{post.category}</span></div>
                </div>
                <div className="p-5">
                  <div className="flex gap-1 mb-2">
                    {post.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-navy-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">{post.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs text-gray-500">{post.author.name} · {post.readTime}m</span>
                    </div>
                    <span className="text-brand-blue text-sm font-semibold flex items-center gap-1">Read <ArrowRight size={14} /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
