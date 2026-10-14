"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface AnalyticsScriptProps {
  measurementId?: string;
}

export function AnalyticsScript({ measurementId }: AnalyticsScriptProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem('lyncore_cookie_consent');
        setHasConsent(consent === 'accepted');
      } catch {
        setHasConsent(false);
      }
    };

    checkConsent();
    window.addEventListener('cookie_consent_updated', checkConsent);
    return () => window.removeEventListener('cookie_consent_updated', checkConsent);
  }, []);

  if (!hasConsent || !gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
