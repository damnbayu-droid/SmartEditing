import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { TrimVideoTool } from '@/components/tools/video/TrimVideoTool';
import { getToolByRoute } from '@/lib/config/toolRegistry';

const tool = getToolByRoute('/video/trim')!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  keywords: ['trim video', 'cut video', 'video trimmer', 'video cutter', 'online video editor'],
  openGraph: {
    title: tool.seoTitle,
    description: tool.seoDescription,
    type: 'website',
    url: 'https://editing.biz.id/video/trim',
    siteName: 'Smart Editing',
    images: [
      {
        url: '/api/og?tool=trim',
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
    images: ['/api/og?tool=trim'],
  },
  alternates: {
    canonical: 'https://editing.biz.id/video/trim',
  },
};

export default function TrimVideoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ToolLayout tool={tool}>
        <TrimVideoTool tool={{ ...tool, icon: undefined as any }} />
      </ToolLayout>
      <Footer />
    </div>
  );
}
