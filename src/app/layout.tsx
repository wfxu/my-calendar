"use client";

import React, { useEffect } from 'react';
import "@/ui/globals.css";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (...args: GtagFunctionArgs) => void;
  }
}

type GtagFunctionArgs =
  | { event: 'js', date: Date }
  | { event: 'config', id: string, options?: Record<string, unknown> };

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-D8RYGRY0ZR";
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Analytics
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(args: GtagFunctionArgs) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      window.gtag({ event: 'js', date: new Date() });
      window.gtag({ event: 'config', id: 'G-D8RYGRY0ZR' });
    };

    // Cleanup function to remove the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
