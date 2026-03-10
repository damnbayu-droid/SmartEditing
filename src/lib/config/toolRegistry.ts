import { 
  Crop, 
  Eraser, 
  Maximize2, 
  Scissors,
  Image as ImageIcon,
  Video
} from 'lucide-react';

export type ToolCategory = 'image' | 'video';

export interface ToolDefinition {
  id: string;
  name: string;
  nameId?: string;
  description: string;
  descriptionId?: string;
  shortDescription: string;
  shortDescriptionId?: string;
  category: ToolCategory;
  route: string;
  icon: any; // Lucide icon component
  features: string[];
  seoTitle: string;
  seoDescription: string;
  acceptedFileTypes: string[];
  maxFileSize: number; // in MB
  processingTime: string;
}

export const toolRegistry: ToolDefinition[] = [
  {
    id: 'image-crop',
    name: 'Crop Image',
    nameId: 'Potong Gambar',
    description: 'Easily crop and resize your images to any dimension. Perfect for social media, websites, and print materials. Free online image cropping tool.',
    descriptionId: 'Potong dan ubah ukuran gambar Anda ke dimensi apa pun dengan mudah. Sempurna untuk media sosial, situs web, dan bahan cetak.',
    shortDescription: 'Crop and resize images to any dimension',
    shortDescriptionId: 'Potong dan ubah ukuran gambar ke dimensi apa pun',
    category: 'image',
    route: '/image/crop',
    icon: Crop,
    features: [
      'Custom aspect ratios',
      'Preset sizes for social media',
      'Real-time preview',
      'High quality output',
      'Free to use'
    ],
    seoTitle: 'Crop Image Online Free - Resize & Crop Photos Instantly',
    seoDescription: 'Free online image crop tool. Easily crop and resize your photos to any dimension. No signup required. Fast, secure, and high quality.',
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFileSize: 50,
    processingTime: 'Instant'
  },
  {
    id: 'image-remove-background',
    name: 'Remove Background',
    nameId: 'Hapus Latar Belakang',
    description: 'Remove background from any image instantly with AI-powered precision. Perfect for product photos, portraits, and graphic design. Free online background remover.',
    descriptionId: 'Hapus latar belakang dari gambar apa pun secara instan dengan presisi bertenaga AI. Sempurna untuk foto produk, potret, dan desain grafis.',
    shortDescription: 'Remove image backgrounds with AI precision',
    shortDescriptionId: 'Hapus latar belakang gambar dengan presisi AI',
    category: 'image',
    route: '/image/remove-background',
    icon: Eraser,
    features: [
      'AI-powered background removal',
      'High precision edges',
      'Transparent PNG output',
      'Batch processing available',
      'No watermark'
    ],
    seoTitle: 'Remove Background From Image Online Free - AI Background Remover',
    seoDescription: 'Remove background from images instantly using our powerful AI background remover. Free online tool with high precision and no watermark.',
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 25,
    processingTime: '~5 seconds'
  },
  {
    id: 'image-upscale',
    name: 'Upscale Image',
    nameId: 'Tingkatkan Resolusi',
    description: 'Enhance and upscale your images up to 4x resolution using AI technology. Perfect for enlarging photos without losing quality. Free online image upscaler.',
    descriptionId: 'Tingkatkan resolusi gambar Anda hingga 4x menggunakan teknologi AI. Sempurna untuk memperbesar foto tanpa kehilangan kualitas.',
    shortDescription: 'Enhance image resolution with AI upscaling',
    shortDescriptionId: 'Tingkatkan resolusi gambar dengan AI upscaling',
    category: 'image',
    route: '/image/upscale',
    icon: Maximize2,
    features: [
      'Up to 4x upscaling',
      'AI-powered enhancement',
      'Preserves image quality',
      'Supports various formats',
      'Fast processing'
    ],
    seoTitle: 'Upscale Image Online Free - AI Image Enlarger & Enhancer',
    seoDescription: 'Free AI image upscaler. Enlarge and enhance your photos up to 4x without losing quality. No signup required. Fast and secure.',
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 25,
    processingTime: '~10 seconds'
  },
  {
    id: 'video-trim',
    name: 'Trim Video',
    nameId: 'Potong Video',
    description: 'Trim and cut your videos with precision. Remove unwanted parts, create clips, and export in high quality. Free online video trimmer.',
    descriptionId: 'Potong video Anda dengan presisi. Hapus bagian yang tidak diinginkan, buat klip, dan ekspor dalam kualitas tinggi.',
    shortDescription: 'Trim and cut videos with precision',
    shortDescriptionId: 'Potong video dengan presisi',
    category: 'video',
    route: '/video/trim',
    icon: Scissors,
    features: [
      'Precise frame selection',
      'Multiple output formats',
      'No quality loss',
      'Preview before export',
      'Fast processing'
    ],
    seoTitle: 'Trim Video Online Free - Cut & Trim Videos Instantly',
    seoDescription: 'Free online video trimmer. Cut and trim your videos with precision. Remove unwanted parts and export in high quality. No signup required.',
    acceptedFileTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
    maxFileSize: 500,
    processingTime: '~15 seconds'
  }
];

export const getToolById = (id: string): ToolDefinition | undefined => {
  return toolRegistry.find(tool => tool.id === id);
};

export const getToolByRoute = (route: string): ToolDefinition | undefined => {
  return toolRegistry.find(tool => tool.route === route);
};

export const getToolsByCategory = (category: ToolCategory): ToolDefinition[] => {
  return toolRegistry.filter(tool => tool.category === category);
};

export const getAllRoutes = (): string[] => {
  return toolRegistry.map(tool => tool.route);
};

export const categoryInfo: Record<ToolCategory, { name: string; icon: typeof ImageIcon; description: string }> = {
  image: {
    name: 'Image Tools',
    icon: ImageIcon,
    description: 'Edit, enhance, and transform your images'
  },
  video: {
    name: 'Video Tools',
    icon: Video,
    description: 'Edit and optimize your videos'
  }
};
