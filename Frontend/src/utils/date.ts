/**
 * Formats an ISO string, date object, or timestamp into human-friendly relative time.
 * Examples: Just now, 5m ago, 2h ago, Yesterday, Oct 1, Sep 15, 2026
 */
export function formatRelativeTime(input: string | number | Date | undefined): string {
  if (!input) return '';

  const date = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If invalid date or future date by a tiny margin
  if (isNaN(date.getTime()) || diffMs < 0) {
    return 'Just now';
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) {
    return 'Just now';
  }
  if (diffMin < 60) {
    return `${diffMin} min ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Format as e.g. "Sep 28" if current year, or "Sep 15, 2025" if different year
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  if (isCurrentYear) {
    return `${month} ${day}`;
  }

  return `${month} ${day}, ${date.getFullYear()}`;
}

/**
 * Formats time for message bubbles (e.g. "11:45 AM")
 */
export function formatMessageTime(input: string | number | Date | undefined): string {
  if (!input) return '';
  const date = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input;
  if (isNaN(date.getTime())) {
    return String(input);
  }

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats date into standard readable string (e.g. "2 Oct 2026")
 */
export function formatDate(input: string | number | Date | undefined): string {
  if (!input) return '';
  const date = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input;
  if (isNaN(date.getTime())) {
    return String(input);
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

