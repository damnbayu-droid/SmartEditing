import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const footerLinks = {
  tools: [
    { name: 'Crop Image', href: '/image/crop' },
    { name: 'Remove Background', href: '/image/remove-background' },
    { name: 'Upscale Image', href: '/image/upscale' },
    { name: 'Trim Video', href: '/video/trim' },
  ],
  ecosystem: [
    { name: 'Smart Notes', href: 'https://notes.biz.id' },
    { name: 'Smart Convert', href: 'https://convert.biz.id' },
    { name: 'Smart Editing', href: 'https://editing.biz.id' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <img src="/SmartEditing.webp" alt="Smart Editing" className="h-5 w-5 rounded-[4px] object-contain bg-primary/10 p-[2px]" />
              <span>Smart Editing</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Fast, free online image and video editing tools. Part of the SmartSystem ecosystem.
            </p>
          </div>
          
          {/* Tools */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Ecosystem */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Ecosystem</h3>
            <ul className="space-y-2">
              {footerLinks.ecosystem.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} SmartSystem. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
