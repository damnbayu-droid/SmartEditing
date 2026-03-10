'use client';

import { Image as ImageIcon, Video, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolCard } from '@/components/tools/ToolCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getToolsByCategory, categoryInfo } from '@/lib/config/toolRegistry';
import { faqData } from '@/lib/config/seoConfig';

export default function HomePage() {
  const { t } = useLanguage();
  const imageTools = getToolsByCategory('image');
  const videoTools = getToolsByCategory('video');

  const features = [
    {
      icon: Zap,
      title: t.home.features.fast.title,
      description: t.home.features.fast.description,
    },
    {
      icon: Shield,
      title: t.home.features.secure.title,
      description: t.home.features.secure.description,
    },
    {
      icon: Globe,
      title: t.home.features.everywhere.title,
      description: t.home.features.everywhere.description,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container px-4 py-16 md:py-24 mx-auto relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t.common.tagline}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {t.home.heroTitle}{' '}
                <span className="text-primary">{t.home.heroTitleHighlight}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t.home.heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#image-tools"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  <ImageIcon className="h-5 w-5" aria-hidden="true" />
                  {t.common.imageTools}
                </a>
                <a
                  href="#video-tools"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-input bg-background font-medium hover:bg-accent transition-colors"
                >
                  <Video className="h-5 w-5" aria-hidden="true" />
                  {t.common.videoTools}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y bg-muted/30">
          <div className="container px-4 py-12 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Tools */}
        <section id="image-tools" className="scroll-mt-16">
          <div className="container px-4 py-16 mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ImageIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t.tools.image.name}</h2>
                <p className="text-muted-foreground">{t.tools.image.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        {/* Video Tools */}
        <section id="video-tools" className="scroll-mt-16 bg-muted/30">
          <div className="container px-4 py-16 mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Video className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t.tools.video.name}</h2>
                <p className="text-muted-foreground">{t.tools.video.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16">
          <div className="container px-4 py-16 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">{t.home.faqTitle}</h2>
              <p className="text-muted-foreground">
                {t.home.faqSubtitle}
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {t.lang === 'id' ? faq.questionId || faq.question : faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {t.lang === 'id' ? faq.answerId || faq.answer : faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t">
          <div className="container px-4 py-16 mx-auto">
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t.home.ctaTitle}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                {t.home.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/image/crop"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  {t.common.startEditing}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
