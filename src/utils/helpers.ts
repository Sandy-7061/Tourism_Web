export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function clampText(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '...';
}

export function generateBookingRef() {
  return `WAN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
}

export function applyDiscount(amount: number, code: string): { discount: number; valid: boolean } {
  const coupons: Record<string, { discount: number; type: 'flat' | 'pct' }> = {
    'EARLYBIRD60': { discount: 20, type: 'pct' },
    'HONEYMOON15': { discount: 15, type: 'pct' },
    'WEEKEND3000': { discount: 3000, type: 'flat' },
    'FAMILY25': { discount: 25, type: 'pct' },
    'FIRST1500': { discount: 1500, type: 'flat' },
    'DRIVE500': { discount: 500, type: 'flat' },
    'FESTIVE22': { discount: 22, type: 'pct' },
    'MONSOON18': { discount: 18, type: 'pct' },
  };
  const coupon = coupons[code.toUpperCase()];
  if (!coupon) return { discount: 0, valid: false };
  const discAmt = coupon.type === 'flat' ? coupon.discount : Math.round(amount * coupon.discount / 100);
  return { discount: Math.min(discAmt, amount), valid: true };
}
