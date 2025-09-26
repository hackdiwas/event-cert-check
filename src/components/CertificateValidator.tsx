import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Download, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { fetchCertificatesFromGoogleSheet } from '@/utils/csvLoader';
import { validateCertificate, generateCertificatePermalink, isValidDownloadUrl } from '@/utils/certificateValidator';
import { ValidationFormData, ValidationResult } from '@/types/certificate';
import { useToast } from '@/hooks/use-toast';
import { VerificationResult } from './VerificationResult';

const CertificateValidator: React.FC = () => {
  const [formData, setFormData] = useState<ValidationFormData>({
    certificateId: '',
    emailOrName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ValidationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear previous results when user types
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.certificateId.trim() || !formData.emailOrName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in both Certificate ID and Email/Name fields.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const certificates = await fetchCertificatesFromGoogleSheet();
      const result = validateCertificate(certificates, formData);
      setValidationResult(result);
      
      if (result.success) {
        toast({
          title: "Certificate Verified! ✅",
          description: "Your certificate has been successfully validated.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: errorMessage,
      });
      setValidationResult({
        success: false,
        error: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Validation Form */}
      <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-card/80">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-glow">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Wikiclub Tech UU
          </CardTitle>
          <CardTitle className="text-xl font-semibold text-foreground">
            Certificate Validator
          </CardTitle>
          <CardDescription className="text-muted-foreground max-w-md mx-auto">
            Verify your event certificate instantly. Enter your Certificate ID and the email or name used for registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificateId" className="text-sm font-medium text-foreground">
                  Certificate ID *
                </Label>
                <Input
                  id="certificateId"
                  type="text"
                  placeholder="e.g., CERT-2024-001"
                  value={formData.certificateId}
                  onChange={(e) => handleInputChange('certificateId', e.target.value)}
                  disabled={isLoading}
                  className="h-12 text-base transition-smooth focus:shadow-glow"
                  aria-describedby="certificateId-hint"
                />
                <p id="certificateId-hint" className="text-xs text-muted-foreground">
                  Enter the exact Certificate ID shown on your certificate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailOrName" className="text-sm font-medium text-foreground">
                  Email or Name *
                </Label>
                <Input
                  id="emailOrName"
                  type="text"
                  placeholder="Your email address or full name"
                  value={formData.emailOrName}
                  onChange={(e) => handleInputChange('emailOrName', e.target.value)}
                  disabled={isLoading}
                  className="h-12 text-base transition-smooth focus:shadow-glow"
                  aria-describedby="emailOrName-hint"
                />
                <p id="emailOrName-hint" className="text-xs text-muted-foreground">
                  Use the email or name you registered with for the event
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating Certificate...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Validate Certificate
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Validation Result */}
      {validationResult && (
        <VerificationResult result={validationResult} />
      )}

      {/* Help Section */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-foreground">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you're having trouble finding your certificate or the validation fails, please contact us at{' '}
              <a 
                href="mailto:hello@wikiclubtech.uu" 
                className="text-primary hover:underline font-medium"
              >
                hello@wikiclubtech.uu
              </a>
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span>✓ Free verification</span>
              <span>•</span>
              <span>✓ Instant results</span>
              <span>•</span>
              <span>✓ Secure validation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateValidator;