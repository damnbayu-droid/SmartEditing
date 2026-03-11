import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://editing.biz.id'),
  title: {
    default: 'Smart Editing - Free Online Image & Video Editing Tools',
    template: '%s | Smart Editing',
  },
  description: 'Fast, free online image and video editing tools. Crop images, remove backgrounds, upscale photos, and trim videos instantly. No signup required.',
  keywords: ['image editor', 'video editor', 'crop image', 'remove background', 'upscale image', 'trim video', 'online tools', 'free editor'],
  authors: [{ name: 'SmartSystem' }],
  icons: {
    icon: '/SmartEditing.webp',
    shortcut: '/SmartEditing.webp',
    apple: '/SmartEditing.webp',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Smart Editing - Free Online Image & Video Editing Tools',
    description: 'Fast, free online image and video editing tools. Crop images, remove backgrounds, upscale photos, and trim videos instantly.',
    url: 'https://editing.biz.id',
    siteName: 'Smart Editing',
    type: 'website',
    images: [{ url: '/og-image.webp', width: 1200, height: 630, alt: 'Smart Editing Og Image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Editing - Free Online Image & Video Editing Tools',
    description: 'Fast, free online image and video editing tools. No signup required.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <LanguageProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <div className="flex-1 flex flex-col min-h-screen">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
