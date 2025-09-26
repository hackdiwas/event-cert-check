export interface Certificate {
  id: string;
  name: string;
  email: string;
  downloadUrl: string;
}

export interface ValidationResult {
  success: boolean;
  certificate?: Certificate;
  error?: string;
}

export interface ValidationFormData {
  certificateId: string;
  emailOrName: string;
}