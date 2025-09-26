import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  ExternalLink, 
  Copy, 
  Share2,
  Calendar,
  User,
  Mail,
  FileText
} from 'lucide-react';
import { ValidationResult } from '@/types/certificate';
import { generateCertificatePermalink, isValidDownloadUrl } from '@/utils/certificateValidator';
import { useToast } from '@/hooks/use-toast';

interface VerificationResultProps {
  result: ValidationResult;
}

export const VerificationResult: React.FC<VerificationResultProps> = ({ result }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadCertificate = async () => {
    if (!result.certificate?.downloadUrl) return;
    
    if (!isValidDownloadUrl(result.certificate.downloadUrl)) {
      toast({
        variant: "destructive",
        title: "Invalid Download Link",
        description: "The download link appears to be invalid. Please contact support.",
      });
      return;
    }

    setIsDownloading(true);
    
    try {
      // Open download link in new tab
      window.open(result.certificate.downloadUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Download Started",
        description: "Your certificate download has been initiated in a new tab.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Unable to start download. Please try again or contact support.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPermalink = async () => {
    if (!result.certificate) return;
    
    const permalink = generateCertificatePermalink(result.certificate.id);
    
    try {
      await navigator.clipboard.writeText(permalink);
      toast({
        title: "Link Copied",
        description: "Certificate verification link copied to clipboard.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Unable to copy link. Please select and copy manually.",
      });
    }
  };

  const handleShare = async () => {
    if (!result.certificate) return;
    
    const permalink = generateCertificatePermalink(result.certificate.id);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wikiclub Tech UU Certificate Verification',
          text: `Certificate verification for ${result.certificate.name}`,
          url: permalink,
        });
      } catch (error) {
        // User cancelled or sharing not supported, fallback to copy
        handleCopyPermalink();
      }
    } else {
      handleCopyPermalink();
    }
  };

  if (!result.success) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-destructive text-lg">Certificate Not Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.error || 'No certificate found with the provided information.'}
                </p>
              </div>
              
              <Alert className="border-muted bg-muted/50">
                <FileText className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  <strong>Next steps:</strong>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
                    <li>Double-check your Certificate ID and email/name spelling</li>
                    <li>Ensure you're using the exact email or name from registration</li>
                    <li>Contact us at <strong>hello@wikiclubtech.uu</strong> if you need assistance</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { certificate } = result;
  if (!certificate) return null;

  const hasDownloadUrl = certificate.downloadUrl && isValidDownloadUrl(certificate.downloadUrl);

  return (
    <Card className="border-success/20 bg-gradient-to-br from-success/5 to-accent/5 shadow-success animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-success flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success-foreground" />
            </div>
            <div>
              <CardTitle className="text-success text-xl">Certificate Verified!</CardTitle>
              <Badge className="mt-1 bg-success/10 text-success border-success/20 hover:bg-success/20">
                ✅ Verified by Wikiclub Tech UU
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Verified on</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Certificate Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-card border">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificate ID</p>
                <p className="font-semibold text-foreground">{certificate.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-card border">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">{certificate.name}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-card border">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{certificate.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-card border">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verification</p>
                <p className="font-semibold text-foreground">Valid & Current</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {hasDownloadUrl ? (
            <Button
              onClick={handleDownloadCertificate}
              disabled={isDownloading}
              className="flex-1 bg-gradient-success hover:shadow-success transition-all duration-300 transform hover:scale-[1.02] h-12"
            >
              {isDownloading ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-bounce" />
                  Opening Download...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                  <ExternalLink className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Alert className="flex-1">
              <FileText className="w-4 h-4" />
              <AlertDescription>
                Download link not available. Please contact support for assistance.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyPermalink}
              className="flex-shrink-0"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-shrink-0"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center p-4 bg-muted/30 rounded-lg border">
          <p className="text-xs text-muted-foreground">
            🔒 This certificate has been cryptographically verified against our secure database.
            <br />
            Verification performed on {new Date().toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};