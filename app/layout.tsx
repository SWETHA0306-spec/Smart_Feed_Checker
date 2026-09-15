import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartFeed AI - Rapid Feed & Silage Quality Testing System',
  description: 'AI-Enabled NIR Spectral Analysis & Silage Quality Testing Web App for Dairy Farmers (Problem Statement ID 26111)',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col antialiased selection:bg-agri-500 selection:text-white pb-20 md:pb-6">
        {children}
      </body>
    </html>
  );
}
