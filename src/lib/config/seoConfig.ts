export const siteConfig = {
  name: 'Smart Editing',
  description: 'Fast, free online image and video editing tools. Crop, remove backgrounds, upscale images, and trim videos instantly.',
  url: 'https://editing.biz.id',
  ogImage: '/og/default.png',
  links: {
    notes: 'https://notes.biz.id',
    convert: 'https://convert.biz.id',
  },
  creator: 'SmartSystem',
};

export const seoConfig = {
  default: {
    title: 'Smart Editing - Free Online Image & Video Editing Tools',
    description: 'Fast, free online image and video editing tools. Crop images, remove backgrounds, upscale photos, and trim videos instantly. No signup required.',
    keywords: ['image editor', 'video editor', 'crop image', 'remove background', 'upscale image', 'trim video', 'online tools', 'free editor'],
  },
  tools: {
    'image-crop': {
      title: 'Crop Image Online Free - Resize & Crop Photos Instantly',
      description: 'Free online image crop tool. Easily crop and resize your photos to any dimension. No signup required. Fast, secure, and high quality.',
      keywords: ['crop image', 'resize image', 'image cropper', 'photo crop', 'online crop tool'],
    },
    'image-remove-background': {
      title: 'Remove Background From Image Online Free - AI Background Remover',
      description: 'Remove background from images instantly using our powerful AI background remover. Free online tool with high precision and no watermark.',
      keywords: ['remove background', 'background remover', 'transparent background', 'image background removal'],
    },
    'image-upscale': {
      title: 'Upscale Image Online Free - AI Image Enlarger & Enhancer',
      description: 'Free AI image upscaler. Enlarge and enhance your photos up to 4x without losing quality. No signup required. Fast and secure.',
      keywords: ['upscale image', 'image enlarger', 'photo enhancer', 'increase image resolution'],
    },
    'video-trim': {
      title: 'Trim Video Online Free - Cut & Trim Videos Instantly',
      description: 'Free online video trimmer. Cut and trim your videos with precision. Remove unwanted parts and export in high quality. No signup required.',
      keywords: ['trim video', 'cut video', 'video trimmer', 'video cutter', 'online video editor'],
    },
  },
};

export const faqData = [
  {
    question: 'Is Smart Editing completely free to use?',
    answer: 'Yes! All our image and video editing tools are completely free to use. There are no hidden fees, no watermarks, and no signup required.',
  },
  {
    question: 'What file formats are supported?',
    answer: 'For images, we support JPEG, PNG, WebP, and GIF formats. For videos, we support MP4, WebM, MOV, and AVI formats.',
  },
  {
    question: 'Are my files secure and private?',
    answer: 'Absolutely. All files are processed securely and automatically deleted after processing. We never store or share your files.',
  },
  {
    question: 'How fast is the processing?',
    answer: 'Most image operations are instant or take just a few seconds. Video processing time depends on file size but typically completes within 15-30 seconds.',
  },
  {
    question: 'Can I use these tools on mobile devices?',
    answer: 'Yes! Smart Editing is fully responsive and works great on smartphones, tablets, and desktop computers.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account needed! Just upload your file and start editing immediately. We believe in making tools accessible to everyone.',
  },
];

export const generateSeoMetadata = (toolId?: string) => {
  if (toolId && seoConfig.tools[toolId as keyof typeof seoConfig.tools]) {
    const toolSeo = seoConfig.tools[toolId as keyof typeof seoConfig.tools];
    return {
      title: toolSeo.title,
      description: toolSeo.description,
      keywords: toolSeo.keywords,
    };
  }
  return {
    title: seoConfig.default.title,
    description: seoConfig.default.description,
    keywords: seoConfig.default.keywords,
  };
};
