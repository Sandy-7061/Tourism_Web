import React, { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  dark?: boolean;
}

export default function GlassCard({ children, className = '', hover = false, onClick, dark = false }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl transition-all duration-300',
        dark ? 'glass-dark' : 'glass',
        hover && 'card-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}>
      {children}
    </div>
  );
}

// Star Rating Component
export function StarRating({ rating, size = 14, showCount, count }: { rating: number; size?: number; showCount?: boolean; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= Math.round(rating) ? '#F97316' : '#e5e7eb'}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span className="font-semibold text-navy-900 text-sm">{rating.toFixed(1)}</span>
      {showCount && count && <span className="text-gray-400 text-xs">({count.toLocaleString()})</span>}
    </div>
  );
}

// Price Tag
export function PriceTag({ price, originalPrice, suffix = '/person', large = false }: { price: number; originalPrice?: number; suffix?: string; large?: boolean }) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      {discount > 0 && <span className="badge-orange self-center">{discount}% OFF</span>}
      <span className={`font-bold text-navy-900 ${large ? 'text-3xl' : 'text-xl'}`}>
        ₹{price.toLocaleString('en-IN')}
      </span>
      <span className="text-gray-400 text-sm">{suffix}</span>
      {originalPrice && (
        <span className="price-strikethrough">₹{originalPrice.toLocaleString('en-IN')}</span>
      )}
    </div>
  );
}

// Section Header
export function SectionHeader({ tag, title, subtitle, center = false }: { tag?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      {tag && <span className="badge-orange mb-3 inline-block">{tag}</span>}
      <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-gray-500 mt-3 max-w-2xl text-lg leading-relaxed">{center ? '' : ''}{subtitle}</p>}
    </div>
  );
}

// Badge
export function Badge({ children, variant = 'blue' }: { children: ReactNode; variant?: 'blue' | 'orange' | 'green' | 'gray' }) {
  const variants = {
    blue: 'badge-blue',
    orange: 'badge-orange',
    green: 'badge-green',
    gray: 'bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full',
  };
  return <span className={variants[variant]}>{children}</span>;
}

// Loading Spinner
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
    </div>
  );
}

// Empty State
export function EmptyState({ icon, title, subtitle, action }: { icon: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-navy-900 mb-2">{title}</h3>
      {subtitle && <p className="text-gray-500 mb-6">{subtitle}</p>}
      {action}
    </div>
  );
}

// Hotel Category Stars
export function HotelStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={12} height={12} viewBox="0 0 24 24" fill="#F97316">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
