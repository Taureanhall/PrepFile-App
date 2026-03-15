/**
 * generate-og-image.js
 * Generates a polished 1200x630 OG image for PrepFile's Product Hunt launch.
 * Shows a brief preview card (Google PM example) on a dark brand background.
 *
 * Usage: node scripts/generate-og-image.js
 * Output: public/og-image.png
 */

import sharp from "sharp";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/og-image.png");

// Brand colors
const BRAND_900 = "#14232c";
const BRAND_700 = "#243d4b";
const BRAND_600 = "#2C4A5A";
const ACCENT_400 = "#B8943E";
const ACCENT_300 = "#cfb374";
const WHITE = "#ffffff";
const ZINC_100 = "#f4f4f5";
const ZINC_300 = "#d4d4d8";
const ZINC_400 = "#a1a1aa";
const ZINC_500 = "#71717a";
const ZINC_600 = "#52525b";
const ZINC_700 = "#3f3f46";
const ZINC_800 = "#27272a";
const GREEN_600 = "#16a34a";
const GREEN_50 = "#f0fdf4";
const GREEN_200 = "#bbf7d0";

const W = 1200;
const H = 630;

// Card geometry
const CARD_X = 576;
const CARD_Y = 40;
const CARD_W = 584;
const CARD_H = 550;
const CARD_R = 18;

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function card() {
  const sections = [
    {
      label: "COMPANY SNAPSHOT",
      lines: [
        "Google is defending its core search monopoly",
        "while expanding aggressively into cloud + AI.",
        "PM interviews probe revenue vs. growth bets.",
      ],
    },
    {
      label: "WHAT THIS ROLE NEEDS",
      bullets: [
        "Structured thinking under ambiguity (STAR + data)",
        "Metrics ownership — AARRR fluency expected",
        "Systems-level product sense, not feature lists",
      ],
    },
    {
      label: "INTERVIEW FORMAT",
      lines: [
        "4–5 rounds: phone screen → 2× product sense",
        "→ 1× analytical → 1× leadership. 50 min each.",
      ],
    },
    {
      label: "SMART QUESTIONS TO ASK",
      bullets: [
        '"How does the team balance search vs. cloud?"',
        '"What does the 90-day ramp look like here?"',
      ],
    },
  ];

  let y = CARD_Y + 30;
  let parts = [];

  // Card shadow (simulate with a slightly larger blurred rect)
  parts.push(`<rect x="${CARD_X - 4}" y="${CARD_Y + 8}" width="${CARD_W + 8}" height="${CARD_H}" rx="${CARD_R}" fill="rgba(0,0,0,0.28)"/>`);
  // Card background
  parts.push(`<rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_H}" rx="${CARD_R}" fill="${WHITE}"/>`);

  y = CARD_Y + 36;

  // Header: company + role
  parts.push(`<text x="${CARD_X + 32}" y="${y}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="17" font-weight="700" fill="${ZINC_800}">Google · Product Manager</text>`);
  y += 22;
  parts.push(`<text x="${CARD_X + 32}" y="${y}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="13" fill="${ZINC_500}">Interview Prep Brief</text>`);

  // Ready badge
  parts.push(`<rect x="${CARD_X + CARD_W - 76}" y="${CARD_Y + 26}" width="56" height="24" rx="12" fill="${GREEN_50}" stroke="${GREEN_200}" stroke-width="1"/>`);
  parts.push(`<text x="${CARD_X + CARD_W - 48}" y="${CARD_Y + 43}" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="${GREEN_600}">Ready</text>`);

  y += 20;
  // Header divider
  parts.push(`<line x1="${CARD_X + 20}" y1="${y}" x2="${CARD_X + CARD_W - 20}" y2="${y}" stroke="${ZINC_100}" stroke-width="1"/>`);
  y += 18;

  for (const section of sections) {
    // Section label
    parts.push(`<text x="${CARD_X + 32}" y="${y}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="9.5" font-weight="700" fill="${ACCENT_400}" letter-spacing="1.2">${esc(section.label)}</text>`);
    y += 18;

    if (section.lines) {
      for (const line of section.lines) {
        parts.push(`<text x="${CARD_X + 32}" y="${y}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="12.5" fill="${ZINC_600}">${esc(line)}</text>`);
        y += 17;
      }
    } else if (section.bullets) {
      for (const bullet of section.bullets) {
        parts.push(`<text x="${CARD_X + 32}" y="${y}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="12" fill="${BRAND_600}" font-weight="700">→</text>`);
        parts.push(`<text x="${CARD_X + 50}" y="${y}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="12.5" fill="${ZINC_600}">${esc(bullet)}</text>`);
        y += 17;
      }
    }
    y += 4;

    // Divider between sections (skip after last)
    if (section !== sections[sections.length - 1]) {
      parts.push(`<line x1="${CARD_X + 20}" y1="${y}" x2="${CARD_X + CARD_W - 20}" y2="${y}" stroke="${ZINC_100}" stroke-width="1"/>`);
      y += 14;
    }
  }

  return parts.join("\n");
}

function leftPanel() {
  const parts = [];
  const LX = 52;

  // PrepFile wordmark
  parts.push(`<text x="${LX}" y="92" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="32" font-weight="700" fill="${WHITE}" letter-spacing="-0.5">PrepFile</text>`);

  // Gold underline accent
  parts.push(`<rect x="${LX}" y="100" width="96" height="3" rx="1.5" fill="${ACCENT_400}"/>`);

  // Headline
  parts.push(`<text x="${LX}" y="148" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="26" font-weight="700" fill="${WHITE}" letter-spacing="-0.3">Know exactly what</text>`);
  parts.push(`<text x="${LX}" y="182" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="26" font-weight="700" fill="${WHITE}" letter-spacing="-0.3">they're looking for.</text>`);

  // Subtext
  parts.push(`<text x="${LX}" y="226" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="15" fill="${ZINC_400}">AI-powered interview prep briefs for</text>`);
  parts.push(`<text x="${LX}" y="248" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="15" fill="${ZINC_400}">your exact company and role.</text>`);

  // Divider
  parts.push(`<line x1="${LX}" y1="272" x2="${LX + 430}" y2="272" stroke="${BRAND_700}" stroke-width="1"/>`);

  // Form mockup — company input
  parts.push(`<rect x="${LX}" y="290" width="456" height="48" rx="12" fill="${ZINC_800}" stroke="${ZINC_700}" stroke-width="1"/>`);
  parts.push(`<text x="${LX + 18}" y="320" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="14" fill="${ZINC_500}">Company</text>`);
  parts.push(`<text x="${LX + 102}" y="320" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="14" fill="${WHITE}" font-weight="500">Google</text>`);

  // Cursor blink
  parts.push(`<rect x="${LX + 154}" y="308" width="2" height="16" rx="1" fill="${ACCENT_400}"/>`);

  // Form mockup — role input
  parts.push(`<rect x="${LX}" y="350" width="456" height="48" rx="12" fill="${ZINC_800}" stroke="${ZINC_700}" stroke-width="1"/>`);
  parts.push(`<text x="${LX + 18}" y="380" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="14" fill="${ZINC_500}">Role</text>`);
  parts.push(`<text x="${LX + 60}" y="380" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="14" fill="${WHITE}" font-weight="500">Product Manager</text>`);

  // Generate button
  parts.push(`<rect x="${LX}" y="410" width="456" height="52" rx="12" fill="${BRAND_600}"/>`);
  parts.push(`<text x="${LX + 228}" y="442" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="15" font-weight="600" fill="${WHITE}">Generate My Brief →</text>`);

  // Social proof row
  parts.push(`<text x="${LX}" y="498" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="13" fill="${ZINC_500}">Free to try · 60 seconds · No card required</text>`);

  // Stats chips
  const chips = [
    { icon: "&lt;60s", text: "per brief" },
    { icon: "Free", text: "to try" },
  ];
  let cx = LX;
  let cy = 524;
  for (const chip of chips) {
    const w = 130;
    parts.push(`<rect x="${cx}" y="${cy}" width="${w}" height="28" rx="14" fill="${BRAND_700}"/>`);
    parts.push(`<text x="${cx + 14}" y="${cy + 19}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" fill="${ACCENT_300}">${chip.icon}</text>`);
    parts.push(`<text x="${cx + 50}" y="${cy + 19}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="500" fill="${ZINC_400}">${chip.text}</text>`);
    cx += w + 10;
  }

  // Product Hunt badge at bottom
  parts.push(`<text x="${LX}" y="590" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="12" fill="${ZINC_500}">prepfile.work</text>`);

  return parts.join("\n");
}

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND_900}"/>
      <stop offset="100%" stop-color="#1c303b"/>
    </linearGradient>
    <linearGradient id="splitFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BRAND_900}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${BRAND_900}" stop-opacity="0.15"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle grid dots (brand texture) -->
  ${Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 6 }, (_, col) =>
      `<circle cx="${50 + col * 80}" cy="${480 + row * 30}" r="1.5" fill="${BRAND_700}" opacity="0.6"/>`
    ).join("")
  ).join("")}

  <!-- Left panel content -->
  ${leftPanel()}

  <!-- Card content -->
  ${card()}
</svg>`;

const svgBuffer = Buffer.from(svg);
const png = await sharp(svgBuffer).png().toBuffer();
writeFileSync(OUT, png);
console.log(`✓ OG image written to ${OUT} (${(png.length / 1024).toFixed(0)} KB)`);
