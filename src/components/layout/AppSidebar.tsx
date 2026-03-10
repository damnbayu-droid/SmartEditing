'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image as ImageIcon, Video, HelpCircle, ExternalLink } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

const mainNav = [
  { name: 'Image Tools', href: '/#image-tools', icon: ImageIcon },
  { name: 'Video Tools', href: '/#video-tools', icon: Video },
  { name: 'FAQ', href: '/#faq', icon: HelpCircle },
];

const ecosystemNav = [
  { name: 'Smart Notes', href: 'https://notes.biz.id' },
  { name: 'Smart Convert', href: 'https://convert.biz.id' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <img 
            src="/SmartEditing.webp" 
            alt="Smart Editing" 
            className="h-8 w-8 rounded-md object-contain bg-primary/10 p-1" 
          />
          <span>Smart Editing</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Ecosystem</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ecosystemNav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4 text-xs text-muted-foreground text-center">
         &copy; {new Date().getFullYear()} SmartSystem
      </SidebarFooter>
    </Sidebar>
  );
}
