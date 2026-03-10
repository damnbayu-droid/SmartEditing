import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <div className="relative">
          <img 
            src="/SmartEditing.webp" 
            alt="Smart Editing" 
            className="h-12 w-12 rounded-xl object-contain bg-primary/10 p-2 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-foreground">Smart Editing</p>
          <p className="text-xs text-muted-foreground animate-pulse text-center">Loading tools...</p>
        </div>
      </div>
    </div>
  );
}
