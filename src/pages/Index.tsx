import React, { useEffect } from 'react';
import CertificateValidator from '@/components/CertificateValidator';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const [searchParams] = useSearchParams();
  const verifyParam = searchParams.get('verify');

  useEffect(() => {
    // Auto-fill certificate ID if provided via URL parameter
    if (verifyParam) {
      // This could be enhanced to auto-populate the form
      console.log('Auto-verify certificate:', verifyParam);
    }
  }, [verifyParam]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <CertificateValidator />
      </div>
    </div>
  );
};

export default Index;
