import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isClicking, setIsClicking] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isVisible, setIsVisible] = useState(false);

  // Position trackers
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing character
  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  const prevX = useRef(0);

  useEffect(() => {
    // Only run on non-touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const deltaX = e.clientX - prevX.current;
      if (Math.abs(deltaX) > 2) {
        setDirection(deltaX > 0 ? 'right' : 'left');
      }
      prevX.current = e.clientX;

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [role="button"], .interactive-hover');
      if (interactive) {
        setIsHovering(true);
        const text = interactive.getAttribute('data-cursor-text') || 
                     (interactive.tagName.toLowerCase() === 'button' ? 'Click!' : 
                      interactive.tagName.toLowerCase() === 'a' ? 'Explore ✈️' : 'Type ✍️');
        setHoverText(text);
      } else {
        setIsHovering(false);
        setHoverText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Precise Center Cursor Target */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-brand-orange shadow-[0_0_12px_rgba(255,107,53,0.9)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          scale: isClicking ? 0.6 : isHovering ? 1.4 : 1,
        }}
      />

      {/* 2. Trailing Follower: Traveler Man with Backpack & Travel Bag */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center gap-2"
        style={{
          x: followerX,
          y: followerY,
          translateX: direction === 'right' ? 24 : -48,
          translateY: 18,
        }}
      >
        {/* Animated Traveler Character */}
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: isClicking ? (direction === 'right' ? 12 : -12) : [0, direction === 'right' ? 3 : -3, 0],
            scale: isHovering ? 1.15 : 1,
          }}
          transition={{
            y: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
            scale: { duration: 0.2 },
          }}
          className={`relative filter drop-shadow-[0_8px_16px_rgba(15,23,42,0.35)] ${
            direction === 'left' ? 'scale-x-[-1]' : ''
          }`}
        >
          {/* Custom SVG Traveler with Travel Bag, Backpack, Cap and Scarf */}
          <svg width="44" height="48" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shadow beneath traveler */}
            <ellipse cx="22" cy="45" rx="12" ry="2.5" fill="rgba(15, 23, 42, 0.25)" />
            
            {/* Backpack on back */}
            <rect x="7" y="15" width="8" height="15" rx="3.5" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />
            <path d="M7 19H15M7 25H15" stroke="#FED7AA" strokeWidth="1" strokeLinecap="round" />
            <circle cx="11" cy="17" r="1.2" fill="#FEF08A" />

            {/* Traveler Body / Jacket */}
            <path d="M14 18C14 15.5 16 14 19 14H25C28 14 30 15.5 30 18V31C30 32 29 33 28 33H16C15 33 14 32 14 31V18Z" fill="#1E40AF" />
            
            {/* Warm Scarf / Collar */}
            <path d="M16 14C16 13 18 12.5 22 12.5C26 12.5 28 13 28 14C28 15.5 26 16.5 22 16.5C18 16.5 16 15.5 16 14Z" fill="#F97316" />
            <rect x="23" y="15" width="3.5" height="7" rx="1.5" fill="#EA580C" />

            {/* Head & Cap */}
            <circle cx="22" cy="8.5" r="5.5" fill="#FBCFE8" /> {/* Skin */}
            <path d="M16.5 7C16.5 4.5 18.5 2.5 22 2.5C25.5 2.5 27.5 4.5 27.5 7V8H16.5V7Z" fill="#0F172A" /> {/* Cap */}
            <path d="M21 4.5H29C30 4.5 30.5 5 30 6L27 7H21V4.5Z" fill="#0F172A" /> {/* Visor */}
            
            {/* Sunglasses / Eyes */}
            <rect x="21.5" y="7" width="5.5" height="2.5" rx="1" fill="#0284C7" />

            {/* Legs & Walking Shoes */}
            {/* Left Leg */}
            <line x1="18" y1="33" x2="16.5" y2="42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M15 42H18.5C19 42 19.5 42.5 19.5 43V44H13.5V43C13.5 42.5 14.5 42 15 42Z" fill="#EA580C" />

            {/* Right Leg (Forward) */}
            <line x1="25" y1="33" x2="27.5" y2="42" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M26 42H29.5C30 42 30.5 42.5 30.5 43V44H24.5V43C24.5 42.5 25.5 42 26 42Z" fill="#EA580C" />

            {/* Arm holding rolling suitcase / travel bag */}
            <path d="M26 19L31 26" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Travel Bag / Suitcase */}
            <g transform="translate(30, 24)">
              {/* Handle */}
              <path d="M3 0V-5H8V0" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
              {/* Suitcase Body */}
              <rect x="0" y="0" width="11" height="16" rx="2.5" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
              {/* Straps/Details */}
              <line x1="0" y1="5" x2="11" y2="5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
              <line x1="0" y1="11" x2="11" y2="11" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
              {/* Travel badge / sticker */}
              <circle cx="5.5" cy="8" r="2" fill="#38BDF8" />
              {/* Wheels */}
              <circle cx="2.5" cy="17" r="1.2" fill="#1E293B" />
              <circle cx="8.5" cy="17" r="1.2" fill="#1E293B" />
            </g>
          </svg>
        </motion.div>

        {/* Dynamic Bubble / Interaction badge */}
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-navy-900/90 backdrop-blur-md border border-brand-orange/40 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
            <span>{hoverText || 'Explore!'}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
