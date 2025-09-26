import { Certificate } from '@/types/certificate';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1KfxWeP21U06emmQjDGQVg9cUcJbxMT29vOz6ZDTfH4I/export?format=csv';

// Cache for certificates data
let certificatesCache: Certificate[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchCertificatesFromGoogleSheet(): Promise<Certificate[]> {
  // Return cached data if still valid
  const now = Date.now();
  if (certificatesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return certificatesCache;
  }

  try {
    const response = await fetch(CSV_URL, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    const certificates = parseCSVToCertificates(csvText);
    
    // Update cache
    certificatesCache = certificates;
    lastFetchTime = now;
    
    return certificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw new Error('Unable to fetch certificate data. Please try again later.');
  }
}

function parseCSVToCertificates(csvText: string): Certificate[] {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('Invalid CSV format: insufficient data');
  }

  // Parse headers and find column indices
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const getColumnIndex = (columnName: string): number => {
    const index = headers.findIndex(h => 
      h.toLowerCase().trim() === columnName.toLowerCase()
    );
    if (index === -1) {
      throw new Error(`Required column "${columnName}" not found in CSV`);
    }
    return index;
  };

  const idIndex = getColumnIndex('ID');
  const nameIndex = getColumnIndex('Name');
  const emailIndex = getColumnIndex('Email');
  const downloadIndex = getColumnIndex('Downlod Link'); // Intentional misspelling as per sheet

  const certificates: Certificate[] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    // Skip empty rows
    if (!values[idIndex]?.trim()) continue;

    certificates.push({
      id: values[idIndex]?.trim() || '',
      name: values[nameIndex]?.trim() || '',
      email: values[emailIndex]?.trim() || '',
      downloadUrl: values[downloadIndex]?.trim() || '',
    });
  }

  return certificates;
}

// Proper CSV line parsing that handles quoted fields and commas within fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  return result;
}

export function clearCache(): void {
  certificatesCache = null;
  lastFetchTime = 0;
}