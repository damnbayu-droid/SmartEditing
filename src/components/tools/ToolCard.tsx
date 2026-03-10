import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ToolDefinition } from '@/lib/config/toolRegistry';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.route} className="group block">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <tool.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
            </div>
            <ArrowRight 
              className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" 
              aria-hidden="true" 
            />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {tool.shortDescription}
          </CardDescription>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{tool.processingTime}</span>
            <span>•</span>
            <span>Max {tool.maxFileSize} MB</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
