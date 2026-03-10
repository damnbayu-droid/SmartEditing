import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { CropTool } from '@/components/tools/image/CropTool';
import { getToolByRoute } from '@/lib/config/toolRegistry';

const tool = getToolByRoute('/image/crop')!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  keywords: ['crop image', 'resize image', 'image cropper', 'photo crop', 'online crop tool'],
  openGraph: {
    title: tool.seoTitle,
    description: tool.seoDescription,
    type: 'website',
    url: 'https://editing.biz.id/image/crop',
    siteName: 'Smart Editing',
    images: [
      {
        url: '/api/og?tool=crop',
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
    images: ['/api/og?tool=crop'],
  },
  alternates: {
    canonical: 'https://editing.biz.id/image/crop',
  },
};

export default function CropImagePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ToolLayout tool={{ ...tool, icon: undefined }} icon={<tool.icon className="h-8 w-8 text-primary" aria-hidden="true" />}>
        <CropTool tool={{ ...tool, icon: undefined }} />
      </ToolLayout>
      <Footer />
    </div>
  );
}
