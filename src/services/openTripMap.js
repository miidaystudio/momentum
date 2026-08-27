// OpenTripMap API Integration Service
// API Key loaded from VITE_OPENTRIPMAP_API_KEY environment variable with public sandbox fallback

const API_KEY =
  import.meta.env.VITE_OPENTRIPMAP_API_KEY ||
  "5ae2e3f221c38a28845f05b68297b415a77f98ebf23058869c9b1f76";
const BASE_URL = "https://api.opentripmap.com/0.1/en/places";

// In-memory cache for fetched locations & POIs
const memoryCache = new Map();

// Curated fixed destinations config array with real XIDs & fallback imagery
export const CURATED_DESTINATIONS_CONFIG = [
  {
    name: "Yosemite National Park",
    query: "Yosemite National Park",
    xid: "W28186121",
    tag: "NATIONAL PARK",
    hook: "Granite monoliths, ancient sequoias & sheer glacial valleys.",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Swiss Alps",
    query: "Zermatt",
    xid: "N304727142",
    tag: "ALPINE RIDGE",
    hook: "The Matterhorn's razor peak rising above eternal glaciers.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Patagonia Steppe",
    query: "Torres del Paine",
    xid: "Q217259",
    tag: "GLACIAL WILDERNESS",
    hook: "Wind-sculpted granite spires and turquoise ice fjords.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Sahara Desert",
    query: "Merzouga",
    xid: "Q1357672",
    tag: "SOLAR DUNES",
    hook: "Endless crimson sand oceans shimmering under celestial night.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Great Barrier Reef",
    query: "Cairns",
    xid: "Q184852",
    tag: "CORAL BASIN",
    hook: "The world's largest living marine labyrinth in sapphire waters.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Amazon Rainforest",
    query: "Manaus",
    xid: "Q41456",
    tag: "CANOPY BASIN",
    hook: "Untamed tropical biodiversity along the earth's greatest river.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop",
  },
];

// Predefined preset quick pills
export const PRESETS = [
  { name: "Chamonix", query: "Chamonix-Mont-Blanc", tag: "ALPINE RIDGE" },
  { name: "Patagonia", query: "Torres del Paine", tag: "GLACIAL STEPPE" },
  { name: "Reykjavik", query: "Reykjavik", tag: "VOLCANIC FJORDS" },
  { name: "Kathmandu", query: "Kathmandu", tag: "HIMALAYAN PASS" },
  { name: "Banff", query: "Banff", tag: "ROCKY MOUNTAINS" },
  { name: "Zermatt", query: "Zermatt", tag: "MATTERHORN CREST" },
  { name: "Kyoto", query: "Kyoto", tag: "ANCIENT SANCTUARY" },
];

export async function fetchGeoname(query) {
  const url = `${BASE_URL}/geoname?name=${encodeURIComponent(query)}&apikey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Geocoding failed for "${query}"`);
  const data = await response.json();
  if (!data || data.status === "NOT_FOUND" || !data.lat || !data.lon) {
    throw new Error(`Location "${query}" could not be found. Please check spelling.`);
  }
  return data;
}

export async function fetchPlacesRadius(lat, lon, radius = 50000, limit = 10) {
  const kinds =
    "natural,mountains,national_parks,beaches,historic,architecture,castles,museums,view_points,nature_reserves";
  const url = `${BASE_URL}/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${kinds}&rate=2&format=json&limit=${limit}&apikey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Radius search failed");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchPlaceDetails(xid) {
  const url = `${BASE_URL}/xid/${xid}?apikey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  return await response.json();
}

/**
 * Fetch and enrich curated featured destinations using OpenTripMap XID
 */
export async function getCuratedFeaturedDestinations() {
  const cacheKey = "curated_destinations_v1";
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  const promises = CURATED_DESTINATIONS_CONFIG.map(async (config) => {
    try {
      const details = await fetchPlaceDetails(config.xid);
      return {
        ...config,
        name: details?.name || config.name,
        image: details?.preview?.source || details?.image || config.image,
        extract:
          details?.wikipedia_extracts?.text ||
          details?.info?.descr ||
          config.hook,
        kinds: details?.kinds || config.tag,
        rate: details?.rate || 7,
      };
    } catch {
      return config;
    }
  });

  const enriched = await Promise.all(promises);
  memoryCache.set(cacheKey, enriched);
  return enriched;
}

/**
 * Fetch expedition POI panels for a given location query
 */
export async function getExpeditionDataForRegion(regionQuery) {
  const normalizedKey = regionQuery.trim().toLowerCase();

  if (memoryCache.has(normalizedKey)) {
    return memoryCache.get(normalizedKey);
  }

  const geoname = await fetchGeoname(regionQuery);
  const poiList = await fetchPlacesRadius(geoname.lat, geoname.lon, 60000, 10);

  if (!poiList || poiList.length === 0) {
    throw new Error(`No expedition points of interest found near "${regionQuery}". Try another region.`);
  }

  const detailPromises = poiList.map((poi) => fetchPlaceDetails(poi.xid));
  const rawDetails = await Promise.all(detailPromises);

  const validDetails = rawDetails.filter(
    (d) => d && d.name && (d.wikipedia_extracts?.text || d.info?.descr || d.name)
  );

  if (validDetails.length === 0) {
    throw new Error(`No detailed entry records found for points near "${regionQuery}".`);
  }

  const panels = validDetails.map((item, index) => {
    const title = item.name.toUpperCase();
    const extract =
      item.wikipedia_extracts?.text ||
      item.info?.descr ||
      `Exploration waypoint located in ${item.address?.country || geoname.country || 'unmapped territory'}.`;

    const image =
      item.preview?.source ||
      item.image ||
      CURATED_DESTINATIONS_CONFIG[index % CURATED_DESTINATIONS_CONFIG.length].image;

    const latVal = item.point?.lat || geoname.lat;
    const lonVal = item.point?.lon || geoname.lon;

    return {
      xid: item.xid || `poi-${index}`,
      id: (index + 1).toString().padStart(2, "0"),
      total: validDetails.length.toString().padStart(2, "0"),
      title: title,
      kindTag: item.kinds ? item.kinds.split(",")[0].replace(/_/g, " ").toUpperCase() : "EXPEDITION SITE",
      subtitle: `${item.address?.state || item.address?.country || geoname.country || "WAYPOINT"}`.toUpperCase(),
      location: `${latVal.toFixed(4)}° N, ${lonVal.toFixed(4)}° E • ${item.address?.country || geoname.country || "EARTH"}`,
      lat: latVal,
      lon: lonVal,
      rate: item.rate || 3,
      image: image,
      description: extract.length > 280 ? extract.slice(0, 280) + "..." : extract,
    };
  });

  const resultData = {
    regionName: geoname.name || regionQuery,
    country: geoname.country || "",
    coords: `${geoname.lat.toFixed(2)}°, ${geoname.lon.toFixed(2)}°`,
    panels: panels,
  };

  memoryCache.set(normalizedKey, resultData);
  return resultData;
}
