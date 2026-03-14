/**
 * Simple heuristic extraction of company name and job title from a job description.
 * Not a parser — just a convenience so users don't have to type them manually.
 */

interface ExtractResult {
  company: string | null;
  title: string | null;
}

export function extractFromJD(text: string): ExtractResult {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { company: null, title: null };

  let company: string | null = null;
  let title: string | null = null;

  // --- Company extraction ---

  // Generic words that aren't company names
  const notCompany = /^(the job|the company|the role|the position|the team|the organization|us|them|our company|this role)$/i;

  // Pattern: "About [Company]" section header — but filter "About the job", "About the role" etc.
  for (const line of lines.slice(0, 20)) {
    const aboutMatch = line.match(/^about\s+(.+?)(?:\s*[-–—:|]|$)/i);
    if (aboutMatch && aboutMatch[1].length > 1 && aboutMatch[1].length < 60 && !notCompany.test(aboutMatch[1].trim())) {
      company = aboutMatch[1].trim();
      break;
    }
  }

  // Pattern: "at [Company]" in the first few lines
  if (!company) {
    for (const line of lines.slice(0, 5)) {
      const atMatch = line.match(/\bat\s+([A-Z][A-Za-z0-9&'. -]{1,40}?)(?:\s*[.,;!]|\s+(?:is|in|we|to|as|for|are|and|the|this|will|you|our)\b|$)/);
      if (atMatch && !notCompany.test(atMatch[1].trim())) {
        company = atMatch[1].trim();
        break;
      }
    }
  }

  // Pattern: "Company:" or "Company Name:" field
  if (!company) {
    for (const line of lines.slice(0, 10)) {
      const fieldMatch = line.match(/^(?:company|employer|organization|firm)\s*(?:name)?\s*[:–-]\s*(.+)/i);
      if (fieldMatch && fieldMatch[1].length > 1 && fieldMatch[1].length < 60) {
        company = fieldMatch[1].trim();
        break;
      }
    }
  }

  // Pattern: "[Company] is hiring" / "[Company] is looking"
  if (!company) {
    for (const line of lines.slice(0, 5)) {
      const hiringMatch = line.match(/^([A-Z][A-Za-z0-9&'. -]{1,40}?)\s+is\s+(?:hiring|looking|seeking|searching)/i);
      if (hiringMatch) {
        company = hiringMatch[1].trim();
        break;
      }
    }
  }

  // Pattern: "[Company]'s" possessive — look for capitalized proper noun with 's in first 10 lines
  // e.g., "member of Investure's Investment Team", "join Google's engineering team"
  if (!company) {
    for (const line of lines.slice(0, 10)) {
      const possessiveMatch = line.match(/(?:of|join|at|for)\s+([A-Z][A-Za-z0-9&'. -]{1,35}?)'s\s/);
      if (possessiveMatch && !notCompany.test(possessiveMatch[1].trim())) {
        company = possessiveMatch[1].trim();
        break;
      }
    }
  }

  // Pattern: "The Company" section header followed by company name
  // e.g., "The Company\nBased in..., [Company] was founded..."
  if (!company) {
    for (let i = 0; i < lines.length - 1 && i < 30; i++) {
      if (/^the\s+company$/i.test(lines[i])) {
        // Next line likely starts with "Based in..." or "[Company] was founded..."
        const nextLine = lines[i + 1];
        const foundedMatch = nextLine.match(/([A-Z][A-Za-z0-9&'. -]{1,40}?)\s+(?:was|is|has been)\s+(?:founded|established|created|incorporated|started)/);
        if (foundedMatch) {
          company = foundedMatch[1].trim();
          break;
        }
        // Also try: "Based in [City], [Company] ..."
        const basedMatch = nextLine.match(/based\s+in\s+.{1,50}?,\s+([A-Z][A-Za-z0-9&'. -]{1,35}?)\s+(?:was|is|has)/i);
        if (basedMatch) {
          company = basedMatch[1].trim();
          break;
        }
      }
    }
  }

  // --- Title extraction ---

  // Role keywords to look for
  const roleKeywords = /\b(?:engineer|developer|manager|analyst|designer|director|lead|architect|scientist|coordinator|specialist|consultant|associate|administrator|officer|vice president|vp|head of|chief|intern|trainee|counsel|attorney|recruiter|partner|strategist|planner|advisor|researcher)\b/i;

  // Pattern: "Title:" or "Role:" or "Position:" field
  for (const line of lines.slice(0, 10)) {
    const titleField = line.match(/^(?:job\s+)?(?:title|role|position)\s*[:–-]\s*(.+)/i);
    if (titleField && titleField[1].length > 2 && titleField[1].length < 80) {
      title = titleField[1].trim();
      break;
    }
  }

  // Pattern: first line or second line is the job title (contains role keyword, short enough)
  if (!title) {
    for (const line of lines.slice(0, 3)) {
      if (line.length > 3 && line.length < 80 && roleKeywords.test(line)) {
        // Clean out company name if it appears as "Title at Company" or "Title - Company"
        const cleaned = line.replace(/\s+[-–—|@]\s+.+$/, "").replace(/\s+at\s+.+$/i, "").trim();
        if (cleaned.length > 3) {
          title = cleaned;
          break;
        }
      }
    }
  }

  // Pattern: first line is short and looks like a title (even without keyword)
  // Be conservative — require at least 2 words and a capitalized word to avoid garbage like "the job"
  if (!title && lines[0] && lines[0].length < 60 && lines[0].length > 5) {
    const words = lines[0].split(/\s+/);
    const hasCapWord = words.some((w) => /^[A-Z]/.test(w) && w.length > 1);
    if (
      words.length >= 2 &&
      hasCapWord &&
      !/[.!?]$/.test(lines[0]) &&
      !/^(we|the|our|about|join|are|is|this|a|an|in|on|at|for|to|and|or|if|it|as|do|no|so|up|by|of)\b/i.test(lines[0])
    ) {
      title = lines[0].replace(/\s+[-–—|@]\s+.+$/, "").replace(/\s+at\s+.+$/i, "").trim();
    }
  }

  // Clean up: remove trailing punctuation
  if (company) company = company.replace(/[.,;:!]+$/, "").trim();
  if (title) title = title.replace(/[.,;:!]+$/, "").trim();

  // Sanity: don't return single-char or very long results, and filter common false positives
  if (company && (company.length < 2 || company.length > 50)) company = null;
  if (title && (title.length < 4 || title.length > 80)) title = null;
  // Filter out generic non-titles
  const badTitles = /^(the job|job description|description|overview|summary|responsibilities|qualifications|requirements|about|position|apply|location)$/i;
  if (title && badTitles.test(title)) title = null;

  return { company, title };
}
