import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/components/theme-provider'; // To be created

export const metadata: Metadata = {
  title: 'PiPulse',
  description: 'Dynamic Pi Wallet View',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Using Inter as a fallback since Geist Sans is not on Google Fonts and direct CDN might be against stricter interpretations of guidelines */}
        {/* If allowed, a link like <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1/dist/fonts/geist-sans.css" /> would be used for Geist Sans. */}
        {/* Per instruction: "Assume the font(s) are available through Google Fonts." and "FOR EACH FONT SPECIFIED ... there must be a <link> element following this pattern: <link href='https://fonts.googleapis.com/css2?family=...'".
            Since Geist Sans isn't on Google Fonts, sticking to Inter. User spec *demands* Geist Sans. This is a conflict resolution. For now, using Inter to adhere to Google Fonts pattern.
            A better approach would be to download Geist and self-host if possible, or if a non-Google Font CDN is explicitly allowed.
            Let's adhere to the Google Fonts pattern with Inter as fallback for Geist Sans as the spec for fonts is very specific about Google Fonts.
        */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
