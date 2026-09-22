import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Tag, ArrowLeft, Calendar, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { blogPosts } from '../data/blog';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];
  const related = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <span className="badge-orange mb-3 inline-block">{post.category}</span>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/blog" className="flex items-center gap-1 hover:text-brand-blue"><ArrowLeft size={16} /> Blog</Link>
          <span>/</span>
          <span>{post.category}</span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-navy-900">{post.author.name}</div>
              <div className="text-xs text-gray-400">{post.author.bio}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400 ml-auto">
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 font-medium leading-relaxed mb-6">{post.excerpt}</p>
          <div className="text-gray-700 leading-relaxed space-y-4">
            {post.content.split('\n\n').map((para, i) => {
              if (para.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-display font-bold text-navy-900 mt-8 mb-4">{para.replace('## ', '')}</h2>;
              }
              if (para.startsWith('**') && para.endsWith('**')) {
                return <p key={i} className="font-bold text-navy-900">{para.replace(/\*\*/g, '')}</p>;
              }
              return <p key={i} className="text-gray-700 leading-relaxed">{para}</p>;
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 mb-8 pt-8 border-t border-gray-100">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">#{tag}</span>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-4 mb-12">
          <span className="font-semibold text-navy-900">Share:</span>
          {[
            { icon: <Facebook size={18} />, color: 'bg-blue-600', label: 'Facebook' },
            { icon: <Twitter size={18} />, color: 'bg-sky-500', label: 'Twitter' },
            { icon: <MessageCircle size={18} />, color: 'bg-emerald-500', label: 'WhatsApp' },
          ].map(s => (
            <button key={s.label} className={`${s.color} text-white w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity`}>
              {s.icon}
            </button>
          ))}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h3 className="text-2xl font-display font-bold text-navy-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(p => (
                <Link key={p.id} to={`/blog/${p.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all border border-gray-100">
                  <img src={p.thumbnail} alt={p.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-4">
                    <h4 className="font-semibold text-navy-900 text-sm leading-snug group-hover:text-brand-blue transition-colors">{p.title}</h4>
                    <div className="text-xs text-gray-400 mt-2">{p.readTime} min read</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
