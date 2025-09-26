import { Certificate, ValidationResult, ValidationFormData } from '@/types/certificate';

// Normalize strings for comparison (lowercase, trim, remove extra spaces)
export function normalize(str: string): string {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

export function validateCertificate(
  certificates: Certificate[],
  formData: ValidationFormData
): ValidationResult {
  const { certificateId, emailOrName } = formData;
  
  // Validate input
  if (!certificateId.trim()) {
    return {
      success: false,
      error: 'Certificate ID is required'
    };
  }

  if (!emailOrName.trim()) {
    return {
      success: false,
      error: 'Email or Name is required'
    };
  }

  // Normalize search criteria
  const searchId = normalize(certificateId);
  const searchInfo = normalize(emailOrName);

  // Find matching certificate
  const matchingCertificate = certificates.find(cert => {
    const certId = normalize(cert.id);
    const certEmail = normalize(cert.email);
    const certName = normalize(cert.name);
    
    // Exact match on ID AND (email OR name)
    return certId === searchId && (certEmail === searchInfo || certName === searchInfo);
  });

  if (matchingCertificate) {
    return {
      success: true,
      certificate: matchingCertificate
    };
  }

  // Check if ID exists but email/name doesn't match
  const idExists = certificates.some(cert => normalize(cert.id) === searchId);
  
  if (idExists) {
    return {
      success: false,
      error: 'Certificate ID found, but email or name does not match our records'
    };
  }

  return {
    success: false,
    error: 'Certificate not found with the provided information'
  };
}

// Generate a permalink for verified certificates
export function generateCertificatePermalink(certificateId: string): string {
  const baseUrl = window.location.origin;
  const encodedId = encodeURIComponent(certificateId);
  return `${baseUrl}?verify=${encodedId}`;
}

// Validate URL for security (basic check)
export function isValidDownloadUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}