/**
 * Formats a number to Indian Rupee (INR) currency format
 * e.g., 18500000 -> ₹1.85 Cr, 65000 -> ₹65,000 / mo (if rent)
 */
export function formatPrice(price: number, listingType?: 'sale' | 'rent'): string {
  if (listingType === 'rent') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price) + '/mo';
  }

  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, '')} Cr`;
  }

  if (price >= 100000) {
    const lac = (price / 100000).toFixed(2);
    return `₹${lac.replace(/\.00$/, '')} Lac`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats area in square feet
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString('en-IN')} sq.ft`;
}
