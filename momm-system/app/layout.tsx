import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MOMM System - Minutes of Meeting Management",
  description: "Streamline your meeting documentation, attendance tracking, and reporting in one comprehensive platform.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Client-side permissions policy for better browser extension compatibility */}
        <meta httpEquiv="Permissions-Policy" content="unload=(), accelerometer=(self), camera=(self), geolocation=(self)" />
        {/* Updated CSP to reduce frame violations */}
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.emailjs.com https://fonts.googleapis.com https://meet.jit.si; frame-src 'self' https: https://meet.jit.si; connect-src 'self' https://api.emailjs.com https://meet.jit.si wss://meet.jit.si https://*.jitsi.net wss://*.jitsi.net; object-src 'none';" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Security: Block unload events for policy compliance */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              'use strict';
              
              // More aggressive extension blocking
              const blockedEvents = ['unload', 'beforeunload', 'pagehide', 'pageshow'];
              
              // Block unload event registration
              const originalAddEventListener = window.addEventListener;
              const originalRemoveEventListener = window.removeEventListener;
              
              window.addEventListener = function(type, listener, options) {
                if (blockedEvents.includes(type)) {
                  return; // Silently block without logging
                }
                return originalAddEventListener.call(this, type, listener, options);
              };
              
              // Also override for document
              if (document.addEventListener) {
                const originalDocAddEventListener = document.addEventListener;
                document.addEventListener = function(type, listener, options) {
                  if (blockedEvents.includes(type)) {
                    return; // Silently block without logging
                  }
                  return originalDocAddEventListener.call(this, type, listener, options);
                };
              }
              
              // Block property assignments
              blockedEvents.forEach(eventType => {
                const propName = 'on' + eventType;
                try {
                  Object.defineProperty(window, propName, {
                    set: function() { /* Silently block */ },
                    get: function() { return null; },
                    configurable: false
                  });
                  
                  Object.defineProperty(document, propName, {
                    set: function() { /* Silently block */ },
                    get: function() { return null; },
                    configurable: false
                  });
                } catch(e) {
                  // Some properties might already be defined
                }
              });
              
              // Override the original addEventListener to ensure complete blocking
              const blockedEventCheck = function(type) {
                return blockedEvents.includes(type.toLowerCase());
              };
              
              // Store originals for internal use
              window._originalAddEventListener = originalAddEventListener;
              document._originalAddEventListener = document.addEventListener;
            })();
          `
        }} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
