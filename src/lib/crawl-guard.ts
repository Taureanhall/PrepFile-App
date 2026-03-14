/**
 * Crawl Guard — prompt injection safeguards for Cloudflare Browser Rendering
 *
 * Validates crawled data before it enters any downstream system.
 * Prevents: prompt injection, data poisoning, unexpected schema violations.
 */

/** Domains agents are allowed to crawl. Add new ones explicitly. */
const ALLOWED_DOMAINS = new Set([
  // Apartment sites
  "www.rentable.co",
  "www.zumper.com",
  "www.forrent.com",
  "www.apartments.com",
  "www.zillow.com",
  "www.trulia.com",
  "www.rent.com",
  "www.apartmentlist.com",
  // Competitor / research
  "www.levels.fyi",
  "www.glassdoor.com",
  "www.linkedin.com",
  "www.indeed.com",
  // General
  "en.wikipedia.org",
  "www.bls.gov",
]);

/** Patterns that indicate prompt injection attempts in extracted text */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /system\s*:\s*/i,
  /\bact\s+as\b/i,
  /\brole\s*:\s*/i,
  /do\s+not\s+follow\s+(the\s+)?(previous|above|original)/i,
  /new\s+instructions?\s*:/i,
  /override\s+(all\s+)?instructions/i,
  /forget\s+(all\s+)?(previous|everything)/i,
  /<\/?script/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
];

export interface CrawlValidation {
  valid: boolean;
  warnings: string[];
  sanitizedData: unknown;
}

/** Check if a URL is on the allowlist */
export function isAllowedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_DOMAINS.has(hostname);
  } catch {
    return false;
  }
}

/** Add a domain to the allowlist at runtime */
export function allowDomain(domain: string): void {
  ALLOWED_DOMAINS.add(domain);
}

/** Scan a string for prompt injection patterns */
export function detectInjection(text: string): string[] {
  const found: string[] = [];
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      found.push(`Matched injection pattern: ${pattern.source}`);
    }
  }
  return found;
}

/** Deep-scan an object's string values for injection */
function scanObject(obj: unknown, path = ""): string[] {
  const warnings: string[] = [];
  if (typeof obj === "string") {
    const hits = detectInjection(obj);
    if (hits.length > 0) {
      warnings.push(`Injection detected at ${path || "root"}: ${hits.join(", ")}`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      warnings.push(...scanObject(item, `${path}[${i}]`));
    });
  } else if (obj && typeof obj === "object") {
    for (const [key, val] of Object.entries(obj)) {
      warnings.push(...scanObject(val, `${path}.${key}`));
    }
  }
  return warnings;
}

/** Strip suspicious content from string values */
function sanitizeString(text: string): string {
  // Remove HTML tags
  let clean = text.replace(/<[^>]*>/g, "");
  // Remove javascript: URLs
  clean = clean.replace(/javascript\s*:/gi, "");
  // Truncate excessively long values (likely injection payloads)
  if (clean.length > 2000) {
    clean = clean.slice(0, 2000) + "…[truncated]";
  }
  return clean.trim();
}

/** Deep-sanitize an object */
function sanitizeObject(obj: unknown): unknown {
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      result[sanitizeString(key)] = sanitizeObject(val);
    }
    return result;
  }
  return obj;
}

/**
 * Validate and sanitize crawled data.
 * Returns { valid, warnings, sanitizedData }.
 * - valid=true: data is clean, safe to use
 * - valid=false: injection detected — data is sanitized but should be reviewed
 */
export function validateCrawlData(data: unknown): CrawlValidation {
  const warnings = scanObject(data);
  const sanitizedData = sanitizeObject(data);

  return {
    valid: warnings.length === 0,
    warnings,
    sanitizedData,
  };
}

/**
 * Validate a numeric field is within expected bounds.
 * Use for rent prices, bedroom counts, etc.
 */
export function validateNumber(
  value: unknown,
  min: number,
  max: number,
  fieldName: string
): { valid: boolean; warning?: string } {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (typeof num !== "number" || isNaN(num)) {
    return { valid: false, warning: `${fieldName}: not a valid number` };
  }
  if (num < min || num > max) {
    return { valid: false, warning: `${fieldName}: ${num} outside expected range [${min}-${max}]` };
  }
  return { valid: true };
}

/**
 * Full pipeline: validate URL → scan data → sanitize → bounds check.
 * Returns clean data or throws with details.
 */
export function guardCrawlResult(url: string, data: unknown): CrawlValidation {
  const warnings: string[] = [];

  // 1. Domain check
  if (!isAllowedDomain(url)) {
    warnings.push(`Domain not in allowlist: ${new URL(url).hostname}`);
  }

  // 2. Injection scan + sanitize
  const validation = validateCrawlData(data);
  warnings.push(...validation.warnings);

  // 3. If it's apartment data, validate rent ranges
  if (Array.isArray(validation.sanitizedData)) {
    for (const item of validation.sanitizedData as Record<string, unknown>[]) {
      if (item.rent !== undefined) {
        const rentCheck = validateNumber(item.rent, 0, 10000, "rent");
        if (!rentCheck.valid && rentCheck.warning) warnings.push(rentCheck.warning);
      }
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
    sanitizedData: validation.sanitizedData,
  };
}
