import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolDefinition } from '@/lib/config/toolRegistry';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all tools
          </Link>
          
          {/* Tool header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <tool.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              <h1 className="text-3xl font-bold">{tool.name}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {tool.description}
            </p>
          </div>
          
          {/* Tool content */}
          {children}
          
          {/* Features section */}
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tool.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tool info */}
          <div className="mt-8 pt-8 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Processing Time</h3>
                <p className="font-semibold">{tool.processingTime}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Max File Size</h3>
                <p className="font-semibold">{tool.maxFileSize} MB</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Supported Formats</h3>
                <p className="font-semibold">
                  {tool.acceptedFileTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
