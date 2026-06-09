import { locationsSchema, type Location } from '../types/location';

/**
 * Static locations dataset — the MVP source of truth (no database yet).
 *
 * ~28 real-world landmarks spread across multiple cities, plus one deliberate
 * out-of-range coordinate fixture (`loc-invalid`) so the client's edge-case
 * filtering can be exercised end-to-end. The data is validated against the
 * shared contract at load time (`getDataset` below), so a malformed entry fails
 * fast rather than reaching a client.
 *
 * Access goes through the functions at the bottom of this file — a future swap
 * to a database only needs to reimplement those, not the Worker routing.
 */
const RAW_LOCATIONS: Location[] = [
  // — San Francisco —
  {
    id: 'sf-golden-gate',
    name: 'Golden Gate Bridge',
    description: 'Iconic suspension bridge spanning the Golden Gate strait.',
    latitude: 37.8199,
    longitude: -122.4783,
    category: 'landmark',
    address: 'Golden Gate Brg, San Francisco, CA, USA',
    imageUrl: 'https://picsum.photos/seed/sf-golden-gate/800/600',
  },
  {
    id: 'sf-alcatraz',
    name: 'Alcatraz Island',
    description: 'Former federal prison on an island in San Francisco Bay.',
    latitude: 37.827,
    longitude: -122.4233,
    category: 'landmark',
    address: 'San Francisco, CA 94133, USA',
    imageUrl: 'https://picsum.photos/seed/sf-alcatraz/800/600',
  },
  {
    id: 'sf-ferry-building',
    name: 'Ferry Building Marketplace',
    description: 'Historic ferry terminal and gourmet food marketplace.',
    latitude: 37.7955,
    longitude: -122.3937,
    category: 'market',
    address: 'One Ferry Building, San Francisco, CA, USA',
    imageUrl: 'https://picsum.photos/seed/sf-ferry-building/800/600',
  },
  // — New York —
  {
    id: 'ny-statue-liberty',
    name: 'Statue of Liberty',
    description: 'Neoclassical statue on Liberty Island, a symbol of freedom.',
    latitude: 40.6892,
    longitude: -74.0445,
    category: 'landmark',
    address: 'Liberty Island, New York, NY, USA',
    imageUrl: 'https://picsum.photos/seed/ny-statue-liberty/800/600',
  },
  {
    id: 'ny-central-park',
    name: 'Central Park',
    description: 'Sprawling urban park in the heart of Manhattan.',
    latitude: 40.7829,
    longitude: -73.9654,
    category: 'park',
    address: 'New York, NY, USA',
    imageUrl: 'https://picsum.photos/seed/ny-central-park/800/600',
  },
  {
    id: 'ny-empire-state',
    name: 'Empire State Building',
    description: 'Art Deco skyscraper with sweeping views of the city.',
    latitude: 40.7484,
    longitude: -73.9857,
    category: 'landmark',
    address: '20 W 34th St, New York, NY, USA',
    imageUrl: 'https://picsum.photos/seed/ny-empire-state/800/600',
  },
  {
    id: 'ny-moma',
    name: 'Museum of Modern Art',
    description: 'One of the most influential modern art museums in the world.',
    latitude: 40.7614,
    longitude: -73.9776,
    category: 'museum',
    address: '11 W 53rd St, New York, NY, USA',
    imageUrl: 'https://picsum.photos/seed/ny-moma/800/600',
  },
  // — London —
  {
    id: 'ldn-big-ben',
    name: 'Big Ben',
    description: 'The Great Bell of the clock at the Palace of Westminster.',
    latitude: 51.5007,
    longitude: -0.1246,
    category: 'landmark',
    address: 'Westminster, London SW1A 0AA, UK',
    imageUrl: 'https://picsum.photos/seed/ldn-big-ben/800/600',
  },
  {
    id: 'ldn-tower',
    name: 'Tower of London',
    description: 'Historic castle on the north bank of the River Thames.',
    latitude: 51.5081,
    longitude: -0.0759,
    category: 'landmark',
    address: 'London EC3N 4AB, UK',
    imageUrl: 'https://picsum.photos/seed/ldn-tower/800/600',
  },
  {
    id: 'ldn-british-museum',
    name: 'British Museum',
    description: 'Museum of human history, art and culture.',
    latitude: 51.5194,
    longitude: -0.127,
    category: 'museum',
    address: 'Great Russell St, London WC1B 3DG, UK',
    imageUrl: 'https://picsum.photos/seed/ldn-british-museum/800/600',
  },
  {
    id: 'ldn-eye',
    name: 'London Eye',
    description: 'Giant cantilevered observation wheel on the South Bank.',
    latitude: 51.5033,
    longitude: -0.1196,
    category: 'landmark',
    address: 'Riverside Building, County Hall, London SE1 7PB, UK',
    imageUrl: 'https://picsum.photos/seed/ldn-eye/800/600',
  },
  // — Paris —
  {
    id: 'par-eiffel',
    name: 'Eiffel Tower',
    description: 'Wrought-iron lattice tower on the Champ de Mars.',
    latitude: 48.8584,
    longitude: 2.2945,
    category: 'landmark',
    address: 'Champ de Mars, 5 Av. Anatole France, Paris, France',
    imageUrl: 'https://picsum.photos/seed/par-eiffel/800/600',
  },
  {
    id: 'par-louvre',
    name: 'Louvre Museum',
    description: "The world's largest art museum and a historic monument.",
    latitude: 48.8606,
    longitude: 2.3376,
    category: 'museum',
    address: 'Rue de Rivoli, 75001 Paris, France',
    imageUrl: 'https://picsum.photos/seed/par-louvre/800/600',
  },
  {
    id: 'par-notre-dame',
    name: 'Notre-Dame de Paris',
    description: 'Medieval Catholic cathedral on the Île de la Cité.',
    latitude: 48.853,
    longitude: 2.3499,
    category: 'religious_site',
    address: '6 Parvis Notre-Dame, 75004 Paris, France',
    imageUrl: 'https://picsum.photos/seed/par-notre-dame/800/600',
  },
  // — Tokyo —
  {
    id: 'tyo-tower',
    name: 'Tokyo Tower',
    description: 'Communications and observation tower inspired by the Eiffel Tower.',
    latitude: 35.6586,
    longitude: 139.7454,
    category: 'landmark',
    address: '4 Chome-2-8 Shibakoen, Minato City, Tokyo, Japan',
    imageUrl: 'https://picsum.photos/seed/tyo-tower/800/600',
  },
  {
    id: 'tyo-sensoji',
    name: 'Sensō-ji',
    description: "Tokyo's oldest temple, located in Asakusa.",
    latitude: 35.7148,
    longitude: 139.7967,
    category: 'religious_site',
    address: '2 Chome-3-1 Asakusa, Taito City, Tokyo, Japan',
    imageUrl: 'https://picsum.photos/seed/tyo-sensoji/800/600',
  },
  {
    id: 'tyo-shibuya',
    name: 'Shibuya Crossing',
    description: 'The famously busy scramble crossing outside Shibuya Station.',
    latitude: 35.6595,
    longitude: 139.7004,
    category: 'square',
    address: 'Shibuya City, Tokyo, Japan',
    imageUrl: 'https://picsum.photos/seed/tyo-shibuya/800/600',
  },
  // — Sydney —
  {
    id: 'syd-opera-house',
    name: 'Sydney Opera House',
    description: 'Multi-venue performing arts centre on Sydney Harbour.',
    latitude: -33.8568,
    longitude: 151.2153,
    category: 'landmark',
    address: 'Bennelong Point, Sydney NSW 2000, Australia',
    imageUrl: 'https://picsum.photos/seed/syd-opera-house/800/600',
  },
  {
    id: 'syd-harbour-bridge',
    name: 'Sydney Harbour Bridge',
    description: 'Steel through-arch bridge across Sydney Harbour.',
    latitude: -33.8523,
    longitude: 151.2108,
    category: 'bridge',
    address: 'Sydney NSW, Australia',
    imageUrl: 'https://picsum.photos/seed/syd-harbour-bridge/800/600',
  },
  {
    id: 'syd-bondi',
    name: 'Bondi Beach',
    description: 'Popular beach and the surrounding suburb in Sydney.',
    latitude: -33.8908,
    longitude: 151.2743,
    category: 'beach',
    address: 'Bondi Beach NSW 2026, Australia',
    imageUrl: 'https://picsum.photos/seed/syd-bondi/800/600',
  },
  // — Rome —
  {
    id: 'rom-colosseum',
    name: 'Colosseum',
    description: 'Ancient amphitheatre in the centre of Rome.',
    latitude: 41.8902,
    longitude: 12.4922,
    category: 'landmark',
    address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
    imageUrl: 'https://picsum.photos/seed/rom-colosseum/800/600',
  },
  {
    id: 'rom-trevi',
    name: 'Trevi Fountain',
    description: 'Baroque fountain in the Trevi district of Rome.',
    latitude: 41.9009,
    longitude: 12.4833,
    category: 'landmark',
    address: 'Piazza di Trevi, 00187 Roma RM, Italy',
    imageUrl: 'https://picsum.photos/seed/rom-trevi/800/600',
  },
  {
    id: 'rom-pantheon',
    name: 'Pantheon',
    description: 'Former Roman temple, now a church, famed for its dome.',
    latitude: 41.8986,
    longitude: 12.4769,
    category: 'religious_site',
    address: 'Piazza della Rotonda, 00186 Roma RM, Italy',
    imageUrl: 'https://picsum.photos/seed/rom-pantheon/800/600',
  },
  // — Barcelona —
  {
    id: 'bcn-sagrada-familia',
    name: 'Sagrada Família',
    description: "Gaudí's unfinished basilica and a UNESCO World Heritage Site.",
    latitude: 41.4036,
    longitude: 2.1744,
    category: 'religious_site',
    address: 'C/ de Mallorca, 401, 08013 Barcelona, Spain',
    imageUrl: 'https://picsum.photos/seed/bcn-sagrada-familia/800/600',
  },
  {
    id: 'bcn-park-guell',
    name: 'Park Güell',
    description: 'Public park system composed of gardens and architectural elements.',
    latitude: 41.4145,
    longitude: 2.1527,
    category: 'park',
    address: "08024 Barcelona, Spain",
    imageUrl: 'https://picsum.photos/seed/bcn-park-guell/800/600',
  },
  // — Rio de Janeiro —
  {
    id: 'rio-christ-redeemer',
    name: 'Christ the Redeemer',
    description: 'Art Deco statue of Jesus Christ atop Mount Corcovado.',
    latitude: -22.9519,
    longitude: -43.2105,
    category: 'landmark',
    address: 'Parque Nacional da Tijuca, Rio de Janeiro, Brazil',
    imageUrl: 'https://picsum.photos/seed/rio-christ-redeemer/800/600',
  },
  // — Cairo —
  {
    id: 'cai-giza-pyramids',
    name: 'Pyramids of Giza',
    description: 'Ancient pyramid complex on the Giza Plateau.',
    latitude: 29.9792,
    longitude: 31.1342,
    category: 'landmark',
    address: 'Al Haram, Giza Governorate, Egypt',
    imageUrl: 'https://picsum.photos/seed/cai-giza-pyramids/800/600',
  },
  // — Edge-case fixture: intentionally out-of-range coordinates —
  // Parses fine against the contract (numbers), but the client's LocationService
  // filters it out as a non-renderable marker. Used to verify edge-case handling.
  {
    id: 'loc-invalid',
    name: 'Out-of-Range Fixture',
    description: 'Deliberately invalid coordinates for client-side edge-case testing.',
    latitude: 999.123,
    longitude: -512.0,
    category: 'test_fixture',
  },
];

/**
 * Validates and returns the dataset. Parsing here guarantees every served
 * payload conforms to the shared contract. Throws at module load if not.
 */
function getDataset(): Location[] {
  return locationsSchema.parse(RAW_LOCATIONS);
}

const LOCATIONS = getDataset();

/** Returns every location in the pool. */
export function getAllLocations(): Location[] {
  return LOCATIONS;
}

/** Returns a single location by id, or `undefined` if none matches. */
export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((location) => location.id === id);
}
