export const POPULAR_COMPANIES = [
  // Big Tech
  "Google", "Amazon", "Meta", "Apple", "Microsoft", "Netflix",
  "Nvidia", "OpenAI", "Anthropic", "Salesforce", "Adobe", "Oracle",
  "IBM", "Intel", "Cisco", "VMware", "ServiceNow", "Snowflake",
  "Databricks", "Palantir", "Workday", "SAP",
  // Consumer Tech
  "Uber", "Airbnb", "Spotify", "DoorDash", "Instacart", "Lyft",
  "Pinterest", "Snap", "Reddit", "Discord", "Figma", "Notion",
  "Shopify", "Square", "PayPal", "Robinhood", "Coinbase", "Plaid",
  "Stripe", "Block",
  // Finance & Banking
  "Goldman Sachs", "JPMorgan Chase", "Morgan Stanley", "Bank of America",
  "Citigroup", "Wells Fargo", "Barclays", "Deutsche Bank", "UBS",
  "Credit Suisse", "BlackRock", "Vanguard", "Fidelity", "Charles Schwab",
  "Capital One", "American Express",
  // Consulting
  "McKinsey", "BCG", "Bain", "Deloitte", "PwC", "EY", "KPMG",
  "Accenture", "Booz Allen Hamilton",
  // Healthcare & Pharma
  "Johnson & Johnson", "Pfizer", "UnitedHealth Group", "CVS Health",
  "Abbott", "Merck", "AbbVie", "Eli Lilly", "Amgen", "Moderna",
  "Genentech", "Mayo Clinic", "Kaiser Permanente",
  // Aerospace & Defense
  "Boeing", "Lockheed Martin", "Raytheon", "Northrop Grumman",
  "SpaceX", "Blue Origin", "General Dynamics", "BAE Systems",
  // Automotive & Manufacturing
  "Tesla", "Ford", "General Motors", "Toyota", "BMW",
  "Caterpillar", "3M", "Honeywell", "General Electric", "Siemens",
  // Retail & Consumer
  "Walmart", "Target", "Costco", "Nike", "Procter & Gamble",
  "Unilever", "Coca-Cola", "PepsiCo", "Starbucks", "McDonald's",
  "Home Depot", "Lowe's",
  // Media & Entertainment
  "Disney", "Warner Bros. Discovery", "NBCUniversal", "Sony",
  "Paramount", "The New York Times", "Bloomberg",
  // Telecom & Infrastructure
  "AT&T", "Verizon", "T-Mobile", "Comcast",
  // Energy
  "ExxonMobil", "Chevron", "Shell", "NextEra Energy",
  // Real Estate & Logistics
  "CBRE", "Prologis", "FedEx", "UPS",
];

const COMPANY_TITLES: Record<string, string[]> = {
  // Big Tech
  "Google": ["Software Engineer", "Senior Software Engineer", "Staff Software Engineer", "Product Manager", "UX Designer", "Data Scientist", "Site Reliability Engineer", "Technical Program Manager", "Cloud Engineer", "Research Scientist", "Developer Relations Engineer", "Engineering Manager"],
  "Amazon": ["Software Development Engineer", "Senior SDE", "Product Manager", "Operations Manager", "Data Engineer", "Solutions Architect", "Area Manager", "Business Analyst", "Program Manager", "Applied Scientist", "Supply Chain Manager", "Fulfillment Center Manager"],
  "Meta": ["Software Engineer", "Product Designer", "Data Scientist", "Research Scientist", "Product Manager", "Machine Learning Engineer", "Content Strategist", "Engineering Manager", "Infrastructure Engineer", "Security Engineer", "Reality Labs Engineer"],
  "Apple": ["Software Engineer", "Hardware Engineer", "Product Designer", "Machine Learning Engineer", "Operations Manager", "Technical Program Manager", "Retail Specialist", "Silicon Engineer", "Quality Assurance Engineer", "Supply Chain Manager", "AppleCare Advisor"],
  "Microsoft": ["Software Engineer", "Product Manager", "Data Scientist", "Cloud Solutions Architect", "Technical Program Manager", "UX Designer", "Security Engineer", "Program Manager", "AI Engineer", "DevOps Engineer", "Partner Solutions Architect", "Customer Success Manager"],
  "Netflix": ["Senior Software Engineer", "Product Manager", "Data Engineer", "Content Strategist", "Machine Learning Engineer", "Engineering Manager", "Content Analyst", "Marketing Manager", "Studio Operations Manager"],
  "Nvidia": ["GPU Architect", "Software Engineer", "Deep Learning Engineer", "Hardware Engineer", "Product Manager", "Solutions Architect", "CUDA Engineer", "Systems Engineer", "Research Scientist", "Developer Relations"],
  "OpenAI": ["Research Scientist", "Software Engineer", "Machine Learning Engineer", "Policy Researcher", "Product Manager", "Applied AI Engineer", "Safety Researcher", "Technical Writer", "Solutions Engineer"],
  "Anthropic": ["Research Scientist", "Software Engineer", "Machine Learning Engineer", "Policy Researcher", "Product Manager", "Alignment Researcher", "Safety Engineer", "Technical Program Manager"],
  "Salesforce": ["Account Executive", "Software Engineer", "Solutions Engineer", "Product Manager", "Customer Success Manager", "Technical Architect", "Business Development Representative", "Marketing Cloud Consultant", "Data Analyst"],
  "Adobe": ["Software Engineer", "Product Manager", "UX Designer", "Data Scientist", "Solutions Consultant", "Digital Strategist", "Experience Designer", "Technical Account Manager", "Quality Engineer"],
  "Oracle": ["Software Engineer", "Cloud Architect", "Sales Consultant", "Product Manager", "Database Administrator", "Solutions Engineer", "Technical Account Manager", "ERP Consultant", "Support Engineer"],
  "IBM": ["Software Engineer", "Data Scientist", "Cloud Engineer", "Consultant", "Research Scientist", "Project Manager", "Security Analyst", "AI Engineer", "Systems Administrator"],
  "Intel": ["Hardware Engineer", "Process Engineer", "Software Engineer", "Chip Designer", "Validation Engineer", "Product Marketing Engineer", "Supply Chain Analyst", "Manufacturing Engineer"],
  "Cisco": ["Network Engineer", "Software Engineer", "Solutions Architect", "Account Manager", "Technical Support Engineer", "Product Manager", "Security Engineer", "Sales Engineer"],
  "ServiceNow": ["Software Engineer", "Solutions Consultant", "Product Manager", "Customer Success Manager", "Technical Account Manager", "Platform Developer", "Implementation Specialist"],
  "Snowflake": ["Software Engineer", "Solutions Architect", "Account Executive", "Data Engineer", "Product Manager", "Sales Engineer", "Customer Success Manager"],
  "Databricks": ["Software Engineer", "Solutions Architect", "Data Engineer", "Account Executive", "Product Manager", "Field Engineer", "Developer Advocate"],
  "Palantir": ["Forward Deployed Engineer", "Software Engineer", "Product Designer", "Deployment Strategist", "Business Development", "Data Scientist"],
  "Workday": ["Software Development Engineer", "Product Manager", "Solutions Architect", "Consultant", "Account Executive", "Customer Success Manager"],
  "SAP": ["Software Engineer", "Consultant", "Solutions Architect", "Account Executive", "Product Manager", "Business Analyst", "Support Engineer"],
  "VMware": ["Software Engineer", "Solutions Engineer", "Cloud Architect", "Product Manager", "Sales Engineer", "Technical Account Manager"],
  // Consumer Tech
  "Stripe": ["Software Engineer", "Product Manager", "Solutions Architect", "Account Executive", "Data Scientist", "Financial Partnerships Manager", "Infrastructure Engineer", "Developer Advocate", "Risk Analyst"],
  "Uber": ["Software Engineer", "Product Manager", "Data Scientist", "Operations Manager", "Marketing Manager", "General Manager", "Machine Learning Engineer", "Safety Operations Manager", "Driver Operations Lead"],
  "Airbnb": ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Trust & Safety Analyst", "Host Operations Manager", "Content Strategist", "Marketing Manager"],
  "Spotify": ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Machine Learning Engineer", "Content Editor", "Audio Engineer", "Marketing Manager", "Podcast Producer"],
  "DoorDash": ["Software Engineer", "Product Manager", "Operations Manager", "Data Scientist", "Account Executive", "Marketing Manager", "Strategy & Operations Associate", "Dasher Operations Lead"],
  "Instacart": ["Software Engineer", "Product Manager", "Data Scientist", "Operations Manager", "Shopper Operations Lead", "Marketing Manager", "Category Manager"],
  "Lyft": ["Software Engineer", "Product Manager", "Data Scientist", "Operations Manager", "Marketing Manager", "Driver Operations Manager", "Safety Analyst"],
  "Pinterest": ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Machine Learning Engineer", "Content Strategist", "Ads Product Manager"],
  "Snap": ["Software Engineer", "Product Manager", "Data Scientist", "AR Engineer", "Content Strategist", "Marketing Manager", "Camera Platform Engineer"],
  "Reddit": ["Software Engineer", "Product Manager", "Data Scientist", "Community Manager", "Content Policy Specialist", "Machine Learning Engineer", "Marketing Manager"],
  "Discord": ["Software Engineer", "Product Manager", "Data Scientist", "Trust & Safety", "Community Manager", "Marketing Manager", "Developer Relations"],
  "Figma": ["Software Engineer", "Product Manager", "Product Designer", "Developer Advocate", "Account Executive", "Solutions Engineer", "Marketing Manager"],
  "Notion": ["Software Engineer", "Product Manager", "Product Designer", "Solutions Engineer", "Account Executive", "Customer Success Manager"],
  "Shopify": ["Software Engineer", "Product Manager", "UX Designer", "Data Scientist", "Merchant Success Manager", "Solutions Engineer", "Growth Marketing Manager"],
  "Square": ["Software Engineer", "Product Manager", "Hardware Engineer", "Data Scientist", "Account Manager", "Risk Analyst", "Payments Engineer"],
  "Block": ["Software Engineer", "Product Manager", "Hardware Engineer", "Data Scientist", "Compliance Analyst", "Payments Engineer", "Cash App Operations"],
  "PayPal": ["Software Engineer", "Product Manager", "Data Scientist", "Risk Analyst", "Compliance Officer", "Account Manager", "Fraud Analyst", "Financial Analyst"],
  "Robinhood": ["Software Engineer", "Product Manager", "Data Scientist", "Compliance Analyst", "Financial Analyst", "Customer Operations", "Risk Engineer", "Crypto Engineer"],
  "Coinbase": ["Software Engineer", "Product Manager", "Compliance Analyst", "Data Scientist", "Security Engineer", "Blockchain Engineer", "Risk Analyst", "Customer Support Lead"],
  "Plaid": ["Software Engineer", "Product Manager", "Solutions Engineer", "Account Executive", "Data Engineer", "Compliance Analyst", "Developer Relations"],
  // Finance & Banking
  "Goldman Sachs": ["Investment Banking Analyst", "Investment Banking Associate", "Quantitative Analyst", "Software Engineer", "Vice President", "Associate", "Risk Analyst", "Compliance Analyst", "Equity Research Analyst", "Asset Management Analyst", "Private Wealth Advisor", "Trading Analyst"],
  "JPMorgan Chase": ["Investment Banking Analyst", "Software Engineer", "Financial Advisor", "Risk Manager", "Quantitative Analyst", "Associate", "Compliance Officer", "Credit Analyst", "Wealth Management Advisor", "Trading Analyst", "Operations Analyst", "Commercial Banking Associate"],
  "Morgan Stanley": ["Investment Banking Analyst", "Financial Advisor", "Quantitative Analyst", "Software Engineer", "Equity Research Analyst", "Wealth Management Associate", "Risk Analyst", "Trading Analyst", "Compliance Officer"],
  "Bank of America": ["Financial Advisor", "Investment Banking Analyst", "Software Engineer", "Credit Analyst", "Relationship Manager", "Risk Analyst", "Compliance Officer", "Operations Analyst", "Wealth Management Advisor"],
  "Citigroup": ["Investment Banking Analyst", "Software Engineer", "Risk Analyst", "Compliance Officer", "Trading Analyst", "Operations Manager", "Financial Analyst", "Relationship Manager"],
  "Wells Fargo": ["Financial Advisor", "Software Engineer", "Risk Analyst", "Compliance Officer", "Loan Officer", "Branch Manager", "Credit Analyst", "Operations Analyst"],
  "Barclays": ["Investment Banking Analyst", "Software Engineer", "Quantitative Analyst", "Risk Analyst", "Compliance Officer", "Trading Analyst", "Operations Analyst"],
  "Deutsche Bank": ["Investment Banking Analyst", "Software Engineer", "Risk Analyst", "Trading Analyst", "Compliance Officer", "Quantitative Analyst", "Operations Analyst"],
  "UBS": ["Investment Banking Analyst", "Wealth Management Advisor", "Software Engineer", "Quantitative Analyst", "Risk Analyst", "Compliance Officer", "Financial Advisor"],
  "BlackRock": ["Portfolio Analyst", "Software Engineer", "Risk Analyst", "Product Strategist", "Aladdin Engineer", "Quantitative Analyst", "Client Solutions Manager", "Investment Analyst"],
  "Vanguard": ["Investment Analyst", "Software Engineer", "Financial Advisor", "Data Analyst", "Portfolio Manager", "Client Relationship Manager", "Compliance Analyst"],
  "Fidelity": ["Financial Consultant", "Software Engineer", "Investment Analyst", "Data Scientist", "Wealth Planning Advisor", "Operations Analyst", "Compliance Analyst"],
  "Charles Schwab": ["Financial Consultant", "Software Engineer", "Client Service Specialist", "Investment Analyst", "Branch Manager", "Compliance Analyst"],
  "Capital One": ["Software Engineer", "Data Scientist", "Product Manager", "Business Analyst", "Credit Analyst", "Risk Analyst", "Machine Learning Engineer", "Financial Analyst"],
  "American Express": ["Product Manager", "Software Engineer", "Data Scientist", "Account Executive", "Risk Analyst", "Financial Analyst", "Customer Service Manager", "Marketing Manager"],
  // Consulting
  "McKinsey": ["Associate", "Business Analyst", "Engagement Manager", "Senior Associate", "Implementation Consultant", "Data Scientist", "Digital Specialist", "Research Analyst"],
  "BCG": ["Associate", "Consultant", "Project Leader", "Knowledge Analyst", "Data Scientist", "Digital Ventures Associate"],
  "Bain": ["Associate Consultant", "Consultant", "Case Team Leader", "Senior Associate Consultant", "Data Scientist", "Advanced Analytics Associate"],
  "Deloitte": ["Consultant", "Senior Consultant", "Manager", "Analyst", "Advisory Associate", "Tax Associate", "Audit Associate", "Technology Analyst", "Strategy Analyst", "Cyber Analyst"],
  "PwC": ["Associate", "Senior Associate", "Manager", "Tax Associate", "Audit Associate", "Advisory Consultant", "Technology Consultant", "Data Analyst"],
  "EY": ["Associate", "Senior Associate", "Manager", "Tax Associate", "Audit Associate", "Technology Consultant", "Strategy Consultant", "Data Analyst"],
  "KPMG": ["Associate", "Senior Associate", "Manager", "Audit Associate", "Tax Associate", "Advisory Consultant", "Data Analyst", "Technology Consultant"],
  "Accenture": ["Analyst", "Consultant", "Manager", "Software Engineer", "Strategy Analyst", "Technology Architect", "Operations Consultant", "Digital Marketing Consultant"],
  "Booz Allen Hamilton": ["Consultant", "Data Scientist", "Cybersecurity Analyst", "Software Engineer", "Strategy Analyst", "Systems Engineer", "Defense Analyst"],
  // Healthcare & Pharma
  "Johnson & Johnson": ["Clinical Trial Manager", "Regulatory Affairs Specialist", "Quality Engineer", "Product Manager", "Sales Representative", "Research Scientist", "Supply Chain Manager", "Medical Device Engineer"],
  "Pfizer": ["Regulatory Affairs Specialist", "Clinical Researcher", "Data Scientist", "Quality Assurance Manager", "Medical Science Liaison", "Manufacturing Engineer", "Pharmacovigilance Specialist"],
  "UnitedHealth Group": ["Data Scientist", "Software Engineer", "Clinical Analyst", "Product Manager", "Actuarial Analyst", "Claims Analyst", "Healthcare Consultant", "Pharmacy Director"],
  "CVS Health": ["Pharmacist", "Data Analyst", "Operations Manager", "Clinical Coordinator", "Software Engineer", "Supply Chain Analyst", "Store Manager"],
  "Abbott": ["Quality Engineer", "Regulatory Affairs Specialist", "R&D Engineer", "Manufacturing Engineer", "Clinical Specialist", "Product Manager", "Sales Representative"],
  "Merck": ["Research Scientist", "Clinical Trial Manager", "Regulatory Affairs Specialist", "Manufacturing Engineer", "Data Scientist", "Medical Science Liaison", "Quality Engineer"],
  "AbbVie": ["Research Scientist", "Clinical Operations Manager", "Regulatory Affairs Specialist", "Sales Representative", "Data Scientist", "Quality Engineer"],
  "Eli Lilly": ["Research Scientist", "Clinical Trial Manager", "Data Scientist", "Regulatory Affairs Specialist", "Manufacturing Engineer", "Marketing Manager"],
  "Amgen": ["Research Scientist", "Process Engineer", "Quality Engineer", "Clinical Researcher", "Regulatory Affairs Specialist", "Data Scientist"],
  "Moderna": ["Research Scientist", "mRNA Platform Engineer", "Clinical Operations Manager", "Quality Engineer", "Manufacturing Engineer", "Data Scientist", "Regulatory Affairs Specialist"],
  "Genentech": ["Research Scientist", "Clinical Operations Manager", "Data Scientist", "Software Engineer", "Regulatory Affairs Specialist", "Medical Science Liaison"],
  "Mayo Clinic": ["Clinical Research Coordinator", "Registered Nurse", "Data Analyst", "Lab Technician", "Physician Assistant", "Health Informatics Specialist"],
  "Kaiser Permanente": ["Registered Nurse", "Clinical Analyst", "Software Engineer", "Data Analyst", "Physician", "Health Plan Administrator", "Operations Manager"],
  // Aerospace & Defense
  "Boeing": ["Aerospace Engineer", "Software Engineer", "Manufacturing Engineer", "Systems Engineer", "Structural Engineer", "Program Manager", "Quality Engineer", "Test Engineer", "Avionics Engineer"],
  "Lockheed Martin": ["Systems Engineer", "Software Engineer", "Mechanical Engineer", "Cybersecurity Analyst", "Program Manager", "Electrical Engineer", "Test Engineer"],
  "Raytheon": ["Systems Engineer", "Software Engineer", "Electrical Engineer", "Program Manager", "Cybersecurity Analyst", "Mechanical Engineer", "Test Engineer"],
  "Northrop Grumman": ["Systems Engineer", "Software Engineer", "Cybersecurity Analyst", "Program Manager", "Mechanical Engineer", "Electrical Engineer"],
  "SpaceX": ["Software Engineer", "Mechanical Engineer", "Avionics Engineer", "Propulsion Engineer", "Manufacturing Engineer", "Test Engineer", "Launch Engineer", "Mission Operations Engineer"],
  "Blue Origin": ["Propulsion Engineer", "Software Engineer", "Mechanical Engineer", "Systems Engineer", "Test Engineer", "Manufacturing Engineer", "Avionics Engineer"],
  "General Dynamics": ["Systems Engineer", "Software Engineer", "Program Manager", "Mechanical Engineer", "Cybersecurity Analyst", "Electrical Engineer"],
  // Automotive & Manufacturing
  "Tesla": ["Manufacturing Engineer", "Software Engineer", "Mechanical Engineer", "Production Manager", "Supply Chain Analyst", "Autopilot Engineer", "Energy Advisor", "Battery Engineer", "Quality Engineer", "Service Technician", "Firmware Engineer"],
  "Ford": ["Manufacturing Engineer", "Software Engineer", "Product Designer", "Supply Chain Manager", "Electrical Engineer", "Powertrain Engineer", "Quality Engineer", "Marketing Manager"],
  "General Motors": ["Manufacturing Engineer", "Software Engineer", "Product Manager", "Electrical Engineer", "Supply Chain Analyst", "Quality Engineer", "Autonomous Vehicle Engineer"],
  "Toyota": ["Manufacturing Engineer", "Quality Engineer", "Supply Chain Manager", "Production Manager", "Mechanical Engineer", "Lean Manufacturing Specialist"],
  "Caterpillar": ["Mechanical Engineer", "Manufacturing Engineer", "Product Manager", "Supply Chain Analyst", "Sales Representative", "Quality Engineer", "Service Technician"],
  "3M": ["Research Scientist", "Product Engineer", "Manufacturing Engineer", "Marketing Manager", "Supply Chain Analyst", "Quality Engineer", "Sales Representative"],
  "Honeywell": ["Software Engineer", "Mechanical Engineer", "Systems Engineer", "Product Manager", "Manufacturing Engineer", "Sales Engineer", "Operations Manager"],
  "General Electric": ["Operations Manager", "Manufacturing Engineer", "Software Engineer", "Mechanical Engineer", "Field Service Engineer", "Quality Engineer", "Supply Chain Manager", "Power Systems Engineer"],
  "Siemens": ["Software Engineer", "Electrical Engineer", "Automation Engineer", "Project Manager", "Sales Engineer", "Manufacturing Engineer", "Systems Engineer"],
  // Retail & Consumer
  "Walmart": ["Supply Chain Director", "Software Engineer", "Data Scientist", "Operations Manager", "Store Manager", "Category Manager", "Logistics Analyst", "E-Commerce Manager", "Marketing Manager"],
  "Target": ["Retail Operations Lead", "Software Engineer", "Data Scientist", "Supply Chain Analyst", "Store Director", "Merchandising Manager", "Marketing Manager", "UX Designer"],
  "Costco": ["Operations Manager", "Buyer", "Warehouse Manager", "Logistics Analyst", "Membership Manager", "Store Manager"],
  "Nike": ["Product Designer", "Software Engineer", "Brand Manager", "Supply Chain Manager", "Data Scientist", "Retail Store Manager", "Marketing Manager", "Materials Engineer"],
  "Procter & Gamble": ["Brand Manager", "Supply Chain Manager", "R&D Scientist", "Manufacturing Engineer", "Sales Manager", "Data Analyst", "Marketing Manager", "Quality Engineer"],
  "Unilever": ["Brand Manager", "Supply Chain Manager", "R&D Scientist", "Marketing Manager", "Sales Manager", "Finance Manager", "Data Analyst"],
  "Coca-Cola": ["Brand Manager", "Supply Chain Manager", "Marketing Manager", "Sales Representative", "Data Analyst", "Operations Manager", "Quality Manager"],
  "PepsiCo": ["Brand Manager", "Supply Chain Manager", "Sales Representative", "Marketing Manager", "Data Analyst", "Operations Manager", "R&D Scientist"],
  "Starbucks": ["Store Manager", "District Manager", "Marketing Manager", "Supply Chain Analyst", "Software Engineer", "Barista", "Product Manager"],
  "McDonald's": ["Restaurant Manager", "Operations Manager", "Marketing Manager", "Supply Chain Analyst", "Software Engineer", "Franchise Business Consultant"],
  "Home Depot": ["Store Manager", "Merchandising Manager", "Software Engineer", "Supply Chain Analyst", "Operations Manager", "Marketing Manager"],
  "Lowe's": ["Store Manager", "Operations Manager", "Software Engineer", "Supply Chain Analyst", "Merchandising Manager", "Marketing Manager"],
  // Media & Entertainment
  "Disney": ["Software Engineer", "Product Manager", "Creative Director", "Marketing Manager", "Data Scientist", "Animation Engineer", "Content Strategist", "Park Operations Manager"],
  "Warner Bros. Discovery": ["Content Strategist", "Software Engineer", "Marketing Manager", "Production Manager", "Data Analyst", "Creative Producer"],
  "NBCUniversal": ["Content Strategist", "Software Engineer", "Marketing Manager", "Producer", "Data Analyst", "Ad Sales Manager"],
  "Sony": ["Software Engineer", "Game Designer", "Product Manager", "Hardware Engineer", "Marketing Manager", "Quality Assurance Engineer"],
  "The New York Times": ["Software Engineer", "Data Analyst", "Journalist", "Product Manager", "UX Designer", "Marketing Manager", "Editor"],
  "Bloomberg": ["Software Engineer", "Data Analyst", "Financial Journalist", "Product Manager", "Sales Representative", "Quantitative Analyst"],
  // Telecom
  "AT&T": ["Network Engineer", "Software Engineer", "Account Executive", "Data Analyst", "Operations Manager", "Sales Representative", "Cybersecurity Analyst"],
  "Verizon": ["Network Engineer", "Software Engineer", "Data Analyst", "Account Executive", "Operations Manager", "Sales Representative", "Product Manager"],
  "T-Mobile": ["Network Engineer", "Software Engineer", "Retail Store Manager", "Data Analyst", "Marketing Manager", "Account Executive"],
  // Energy
  "ExxonMobil": ["Chemical Engineer", "Petroleum Engineer", "Software Engineer", "Operations Manager", "Data Scientist", "Geoscientist", "Safety Engineer"],
  "Chevron": ["Petroleum Engineer", "Chemical Engineer", "Software Engineer", "Operations Manager", "Data Scientist", "Geoscientist", "Environmental Engineer"],
  "Shell": ["Process Engineer", "Software Engineer", "Data Scientist", "Operations Manager", "Trading Analyst", "Environmental Engineer", "Petroleum Engineer"],
  "NextEra Energy": ["Electrical Engineer", "Software Engineer", "Operations Manager", "Data Analyst", "Project Manager", "Renewable Energy Engineer"],
  // Logistics
  "FedEx": ["Operations Manager", "Software Engineer", "Data Analyst", "Logistics Analyst", "Package Handler Supervisor", "Route Planner", "Supply Chain Manager"],
  "UPS": ["Operations Manager", "Software Engineer", "Logistics Analyst", "Data Analyst", "Route Planner", "Package Center Manager", "Supply Chain Analyst"],
  "CBRE": ["Real Estate Analyst", "Property Manager", "Data Analyst", "Sales Associate", "Facilities Manager", "Investment Analyst"],
};

const DEFAULT_TITLES = [
  "Software Engineer", "Senior Software Engineer", "Product Manager",
  "Data Scientist", "Data Analyst", "Business Analyst",
  "UX Designer", "Marketing Manager", "Operations Manager",
  "Financial Analyst", "Project Manager", "DevOps Engineer",
  "Machine Learning Engineer", "Account Executive", "Consultant",
  "Mechanical Engineer", "Registered Nurse", "Sales Representative",
  "Human Resources Manager", "Supply Chain Manager",
];

/** Returns job title suggestions based on the selected company. */
export function getTitleSuggestions(company: string): string[] {
  if (!company.trim()) return DEFAULT_TITLES;

  const exact = COMPANY_TITLES[company];
  if (exact) return exact;

  // Fuzzy match — check if input partially matches a known company
  const lower = company.toLowerCase();
  for (const [key, titles] of Object.entries(COMPANY_TITLES)) {
    if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
      return titles;
    }
  }

  return DEFAULT_TITLES;
}
