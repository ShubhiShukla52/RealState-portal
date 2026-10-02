import { Property } from '../types/property';
import { mockProperties } from '../data/mockProperties';
import { mockReviews } from '../data/mockReviews';

export interface RecommendationParams {
  currentPropertyId?: string;
  viewedIds?: string[];
  favoriteIds?: string[];
  allProperties?: Property[];
  limit?: number;
}

/**
 * Calculates a similarity score between a target property and a reference property.
 * Weighted Scoring:
 * - Same city: +5
 * - Same property type: +4
 * - Same listing type: +3
 * - Similar price (within 30%): +3
 * - Similar bedrooms (within 1): +2
 * - Similar area (within 30%): +2
 * - Shared amenities: +1 each (max 4)
 */
export function calculatePropertySimilarity(target: Property, reference: Property): number {
  if (target.id === reference.id) return -100;

  let score = 0;

  // 1. Same city (+5)
  if (target.city && reference.city && target.city.toLowerCase() === reference.city.toLowerCase()) {
    score += 5;
  }

  // 2. Same property type (+4)
  if (
    target.propertyType &&
    reference.propertyType &&
    target.propertyType.toLowerCase() === reference.propertyType.toLowerCase()
  ) {
    score += 4;
  }

  // 3. Same listing type (+3)
  if (target.listingType === reference.listingType) {
    score += 3;
  }

  // 4. Similar price (+3)
  if (reference.price > 0 && target.price > 0) {
    const priceRatio = Math.abs(target.price - reference.price) / reference.price;
    if (priceRatio <= 0.3) {
      score += 3;
    } else if (priceRatio <= 0.6) {
      score += 1.5;
    }
  }

  // 5. Similar bedrooms (+2)
  if (reference.bedrooms && target.bedrooms) {
    const bedDiff = Math.abs(target.bedrooms - reference.bedrooms);
    if (bedDiff === 0) {
      score += 2;
    } else if (bedDiff === 1) {
      score += 1;
    }
  }

  // 6. Similar area (+2)
  if (reference.area > 0 && target.area > 0) {
    const areaRatio = Math.abs(target.area - reference.area) / reference.area;
    if (areaRatio <= 0.3) {
      score += 2;
    } else if (areaRatio <= 0.6) {
      score += 1;
    }
  }

  // 7. Shared amenities (+1 each up to 4)
  if (target.amenities && reference.amenities && reference.amenities.length > 0) {
    const sharedAmenities = target.amenities.filter((amenity) =>
      reference.amenities?.includes(amenity)
    );
    score += Math.min(4, sharedAmenities.length);
  }

  return score;
}

/**
 * Returns similar properties for a single property (used in Property Details page).
 * Priority: same city, same property type, similar price, similar bedrooms.
 * Current property is strictly excluded.
 */
export function getSimilarProperties(
  currentProperty: Property,
  allProperties: Property[] = mockProperties,
  limit: number = 4
): Property[] {
  const candidates = allProperties.filter((p) => p.id !== currentProperty.id);

  const scored = candidates.map((p) => ({
    property: p,
    score: calculatePropertySimilarity(p, currentProperty),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.property);
}

/**
 * Computes personalized recommendations based on:
 * 1. Recently viewed properties (highest weight)
 * 2. Favorited properties
 * 3. General featured/popular fallback
 */
export function getRecommendedProperties({
  currentPropertyId,
  viewedIds = [],
  favoriteIds = [],
  allProperties = mockProperties,
  limit = 4,
}: RecommendationParams): Property[] {
  // Candidate pool excluding current property if specified
  const pool = allProperties.filter((p) => p.id !== currentPropertyId);

  // If no user activity at all, return featured/popular fallback
  const referenceIds = [...new Set([...viewedIds, ...favoriteIds])];

  if (referenceIds.length === 0) {
    // Featured first, then any remaining
    const fallback = [...pool].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    return fallback.slice(0, limit);
  }

  // Fetch reference property objects
  const referenceProperties = referenceIds
    .map((id) => allProperties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p));

  // Compute aggregate score for each candidate against reference properties
  const scoredCandidates = pool.map((candidate) => {
    let totalScore = 0;

    referenceProperties.forEach((refProp, idx) => {
      // More recent references have higher multiplier
      const recencyMultiplier = Math.max(0.6, 1.2 - idx * 0.15);
      const similarity = calculatePropertySimilarity(candidate, refProp);
      totalScore += similarity * recencyMultiplier;
    });

    // Slight boost for featured listings
    if (candidate.featured) {
      totalScore += 1.5;
    }

    // Gentle review signal: Rating >= 4.5 gives small boost (+1.0), review count confidence (+0.2 each, capped at 1.0)
    const propReviews = mockReviews.filter((r) => r.propertyId === candidate.id && r.status === 'published');
    if (propReviews.length > 0) {
      const avg = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
      if (avg >= 4.5) {
        totalScore += 1.0;
      } else if (avg >= 4.0) {
        totalScore += 0.5;
      }
      totalScore += Math.min(1.0, propReviews.length * 0.2);
    }

    // Do not heavily favor properties already viewed/favorited, but don't strictly forbid if pool is small
    if (favoriteIds.includes(candidate.id)) {
      totalScore -= 2;
    }
    if (viewedIds.includes(candidate.id)) {
      totalScore -= 1;
    }

    return { property: candidate, score: totalScore };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);

  const results = scoredCandidates.slice(0, limit).map((s) => s.property);

  // If still fewer than limit, pad with remaining pool
  if (results.length < limit) {
    const existingIds = new Set(results.map((r) => r.id));
    for (const p of pool) {
      if (!existingIds.has(p.id)) {
        results.push(p);
        if (results.length >= limit) break;
      }
    }
  }

  return results;
}
