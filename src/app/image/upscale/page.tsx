import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { UpscaleTool } from '@/components/tools/image/UpscaleTool';
import { getToolByRoute } from '@/lib/config/toolRegistry';

const tool = getToolByRoute('/image/upscale')!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  keywords: ['upscale image', 'image enlarger', 'photo enhancer', 'increase image resolution'],
  openGraph: {
    title: tool.seoTitle,
    description: tool.seoDescription,
    type: 'website',
    url: 'https://editing.biz.id/image/upscale',
    siteName: 'Smart Editing',
    images: [
      {
        url: '/api/og?tool=upscale',
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
    images: ['/api/og?tool=upscale'],
  },
  alternates: {
    canonical: 'https://editing.biz.id/image/upscale',
  },
};

export default function UpscaleImagePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ToolLayout tool={tool}>
        <UpscaleTool tool={{ ...tool, icon: undefined as any }} />
      </ToolLayout>
      <Footer />
    </div>
  );
}
