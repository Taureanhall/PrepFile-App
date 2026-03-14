import { extractBrandAssets } from "openbrand";

export interface BrandAssets {
  logoUrl?: string;
  backdropUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// In-memory cache to avoid re-extracting for the same company during a session
const brandCache = new Map<string, { assets: BrandAssets; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Extract brand assets (logo, colors, backdrop) for a company.
 * Tries the company's website URL. Returns partial results on failure.
 * Never throws — returns empty object if extraction fails entirely.
 */
export async function extractCompanyBrand(companyName: string): Promise<BrandAssets> {
  const key = companyName.toLowerCase().trim();

  // Check cache
  const cached = brandCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.assets;
  }

  // Derive likely URL from company name
  const slug = key
    .replace(/[^a-z0-9]+/g, "")
    .replace(/\s+/g, "");
  const url = `https://${slug}.com`;

  try {
    const result = await extractBrandAssets(url);

    if (!result.ok) {
      return {};
    }

    const data = result.data;
    const assets: BrandAssets = {};

    // Pick the best logo (prefer favicon/icon types, then first available)
    if (data.logos && data.logos.length > 0) {
      const icon = data.logos.find((l: any) => l.type === "favicon" || l.type === "icon");
      const logo = data.logos.find((l: any) => l.type === "logo");
      assets.logoUrl = (icon || logo || data.logos[0]).url;
    }

    // Pick colors
    if (data.colors && data.colors.length > 0) {
      const primary = data.colors.find((c: any) => c.usage === "primary");
      const secondary = data.colors.find((c: any) => c.usage === "secondary");
      const accent = data.colors.find((c: any) => c.usage === "accent");
      if (primary) assets.primaryColor = primary.hex;
      if (secondary) assets.secondaryColor = secondary.hex;
      if (accent) assets.accentColor = accent.hex;
      // Fallback: if no usage labels, just use first 1-3
      if (!assets.primaryColor && data.colors[0]) assets.primaryColor = data.colors[0].hex;
      if (!assets.secondaryColor && data.colors[1]) assets.secondaryColor = data.colors[1].hex;
      if (!assets.accentColor && data.colors[2]) assets.accentColor = data.colors[2].hex;
    }

    // Pick backdrop
    if (data.backdrop_images && data.backdrop_images.length > 0) {
      assets.backdropUrl = data.backdrop_images[0].url;
    }

    // Cache result
    brandCache.set(key, { assets, ts: Date.now() });

    return assets;
  } catch {
    // Never block brief generation for brand extraction failure
    return {};
  }
}
