export interface CityLocation {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  popular?: boolean;
  localities: {
    name: string;
    latitude: number;
    longitude: number;
  }[];
}

export const MOCK_CITIES: CityLocation[] = [
  {
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    latitude: 28.3670,
    longitude: 79.4304,
    popular: true,
    localities: [
      { name: 'Civil Lines', latitude: 28.3642, longitude: 79.4185 },
      { name: 'Rajendra Nagar', latitude: 28.3824, longitude: 79.4291 },
      { name: 'Model Town', latitude: 28.3580, longitude: 79.4120 },
      { name: 'Pilibhit Bypass', latitude: 28.3905, longitude: 79.4550 },
      { name: 'Suresh Sharma Nagar', latitude: 28.3750, longitude: 79.4420 },
      { name: 'Bara Bazar', latitude: 28.3600, longitude: 79.4100 },
    ],
  },
  {
    city: 'Delhi',
    state: 'Delhi NCR',
    latitude: 28.6139,
    longitude: 77.2090,
    popular: true,
    localities: [
      { name: 'Dwarka', latitude: 28.5921, longitude: 77.0460 },
      { name: 'Saket', latitude: 28.5244, longitude: 77.2177 },
      { name: 'Vasant Kunj', latitude: 28.5300, longitude: 77.1560 },
      { name: 'Greater Kailash II', latitude: 28.5390, longitude: 77.2410 },
      { name: 'Connaught Place', latitude: 28.6315, longitude: 77.2167 },
      { name: 'Defence Colony', latitude: 28.5720, longitude: 77.2340 },
    ],
  },
  {
    city: 'Noida',
    state: 'Uttar Pradesh (NCR)',
    latitude: 28.5355,
    longitude: 77.3910,
    popular: true,
    localities: [
      { name: 'Sector 128, Expressway', latitude: 28.5150, longitude: 77.3750 },
      { name: 'Sector 150, Expressway', latitude: 28.4480, longitude: 77.4720 },
      { name: 'Sector 62', latitude: 28.6250, longitude: 77.3650 },
      { name: 'Sector 78', latitude: 28.5700, longitude: 77.3850 },
      { name: 'Sector 18', latitude: 28.5705, longitude: 77.3245 },
    ],
  },
  {
    city: 'Gurugram',
    state: 'Haryana (NCR)',
    latitude: 28.4595,
    longitude: 77.0266,
    popular: true,
    localities: [
      { name: 'Golf Course Road', latitude: 28.4600, longitude: 77.0980 },
      { name: 'Sector 65, Golf Course Ext Road', latitude: 28.4110, longitude: 77.0780 },
      { name: 'DLF Cyber City', latitude: 28.4950, longitude: 77.0890 },
      { name: 'DLF Phase 1', latitude: 28.4800, longitude: 77.0900 },
      { name: 'Sohna Road', latitude: 28.4200, longitude: 77.0350 },
    ],
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    popular: true,
    localities: [
      { name: 'Bandra West, Carter Road', latitude: 19.0596, longitude: 72.8295 },
      { name: 'Andheri West', latitude: 19.1363, longitude: 72.8277 },
      { name: 'Powai, Hiranandani Gardens', latitude: 19.1176, longitude: 72.9060 },
      { name: 'Juhu', latitude: 19.1075, longitude: 72.8263 },
      { name: 'Thane West', latitude: 19.2183, longitude: 72.9781 },
      { name: 'Worli', latitude: 19.0178, longitude: 72.8158 },
    ],
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    popular: true,
    localities: [
      { name: 'Whitefield, ITPL Main Road', latitude: 12.9698, longitude: 77.7499 },
      { name: 'Koramangala 4th Block', latitude: 12.9352, longitude: 77.6245 },
      { name: 'Indiranagar', latitude: 12.9784, longitude: 77.6408 },
      { name: 'Bannerghatta Road, Hulimavu', latitude: 12.8790, longitude: 77.5980 },
      { name: 'Devanahalli, Airport Corridor', latitude: 13.2484, longitude: 77.7126 },
      { name: 'HSR Layout', latitude: 12.9121, longitude: 77.6446 },
    ],
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.3850,
    longitude: 78.4867,
    popular: true,
    localities: [
      { name: 'Gachibowli, Financial District', latitude: 17.4401, longitude: 78.3489 },
      { name: 'Jubilee Hills, Road No. 36', latitude: 17.4319, longitude: 78.4075 },
      { name: 'Madhapur, Hitec City', latitude: 17.4483, longitude: 78.3748 },
      { name: 'Banjara Hills', latitude: 17.4156, longitude: 78.4350 },
      { name: 'Kondapur', latitude: 17.4622, longitude: 78.3568 },
    ],
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    popular: true,
    localities: [
      { name: 'Baner Hills, Pashan Link Road', latitude: 18.5590, longitude: 73.7790 },
      { name: 'Koregaon Park', latitude: 18.5362, longitude: 73.8940 },
      { name: 'Kalyani Nagar', latitude: 18.5463, longitude: 73.9024 },
      { name: 'Hinjewadi IT Park', latitude: 18.5913, longitude: 73.7389 },
      { name: 'Viman Nagar', latitude: 18.5679, longitude: 73.9143 },
    ],
  },
  {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.8467,
    longitude: 80.9462,
    popular: true,
    localities: [
      { name: 'Gomti Nagar Extension', latitude: 26.8280, longitude: 81.0150 },
      { name: 'Indira Nagar', latitude: 26.8820, longitude: 80.9850 },
      { name: 'Hazratganj', latitude: 26.8500, longitude: 80.9460 },
      { name: 'Aliganj', latitude: 26.8900, longitude: 80.9380 },
      { name: 'Vibhuti Khand', latitude: 26.8610, longitude: 81.0020 },
    ],
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    popular: true,
    localities: [
      { name: 'C-Scheme', latitude: 26.9050, longitude: 75.8010 },
      { name: 'Malviya Nagar', latitude: 26.8540, longitude: 75.8190 },
      { name: 'Vaishali Nagar', latitude: 26.9110, longitude: 75.7430 },
      { name: 'Mansarovar', latitude: 26.8620, longitude: 75.7660 },
      { name: 'Jagatpura', latitude: 26.8150, longitude: 75.8650 },
    ],
  },
];

export const POPULAR_LOCATIONS = [
  'Bareilly',
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Lucknow',
  'Noida',
  'Gurugram',
  'Jaipur',
];

/**
 * Searches for city and locality suggestions matching a query string.
 */
export function getSearchSuggestions(query: string) {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: {
    id: string;
    name: string;
    subtext: string;
    city: string;
    locality?: string;
    type: 'city' | 'locality';
    latitude: number;
    longitude: number;
  }[] = [];

  for (const item of MOCK_CITIES) {
    const isDelhiAlias = clean === 'delhi' && item.city.toLowerCase().includes('delhi');
    const cityMatch = item.city.toLowerCase().includes(clean) || isDelhiAlias;

    if (cityMatch) {
      results.push({
        id: `city-${item.city}`,
        name: item.city,
        subtext: `${item.state} • Metropolitan Area`,
        city: item.city,
        type: 'city',
        latitude: item.latitude,
        longitude: item.longitude,
      });
    }

    for (const loc of item.localities) {
      if (loc.name.toLowerCase().includes(clean)) {
        results.push({
          id: `loc-${item.city}-${loc.name}`,
          name: `${loc.name}, ${item.city}`,
          subtext: `${item.state} • Locality`,
          city: item.city,
          locality: loc.name,
          type: 'locality',
          latitude: loc.latitude,
          longitude: loc.longitude,
        });
      }
    }
  }

  return results.slice(0, 8);
}

/**
 * Resolves a given city or location name to center coordinates.
 */
export function resolveLocationCoordinates(
  query: string
): { lat: number; lng: number; city?: string; locality?: string } | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // Direct city match (handle Delhi / New Delhi)
  for (const c of MOCK_CITIES) {
    if (
      c.city.toLowerCase() === clean ||
      (clean === 'delhi' && c.city.toLowerCase().includes('delhi'))
    ) {
      return { lat: c.latitude, lng: c.longitude, city: c.city };
    }
  }

  // Locality match
  for (const c of MOCK_CITIES) {
    for (const loc of c.localities) {
      if (
        clean.includes(loc.name.toLowerCase()) ||
        loc.name.toLowerCase().includes(clean)
      ) {
        return { lat: loc.latitude, lng: loc.longitude, city: c.city, locality: loc.name };
      }
    }
  }

  // Partial city match
  for (const c of MOCK_CITIES) {
    if (clean.includes(c.city.toLowerCase()) || c.city.toLowerCase().includes(clean)) {
      return { lat: c.latitude, lng: c.longitude, city: c.city };
    }
  }

  return null;
}
