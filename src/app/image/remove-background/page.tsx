import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { RemoveBgTool } from '@/components/tools/image/RemoveBgTool';
import { getToolByRoute } from '@/lib/config/toolRegistry';

const tool = getToolByRoute('/image/remove-background')!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  keywords: ['remove background', 'background remover', 'transparent background', 'image background removal'],
  openGraph: {
    title: tool.seoTitle,
    description: tool.seoDescription,
    type: 'website',
    url: 'https://editing.biz.id/image/remove-background',
    siteName: 'Smart Editing',
    images: [
      {
        url: '/api/og?tool=remove-background',
        width: 1200,
        height: 630,
        alt: tool.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: tool.seoTitle,
    description: tool.seoDescription,
    images: ['/api/og?tool=remove-background'],
  },
  alternates: {
    canonical: 'https://editing.biz.id/image/remove-background',
  },
};

export default function RemoveBackgroundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ToolLayout tool={{ ...tool, icon: undefined }} icon={<tool.icon className="h-8 w-8 text-primary" aria-hidden="true" />}>
        <RemoveBgTool tool={{ ...tool, icon: undefined }} />
      </ToolLayout>
      <Footer />
    </div>
  );
}
