"use client";

import { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { Gallery } from '@/components/gallery';

export default function Home() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUploadSuccess = (url: string) => {
    setImageUrls((prevUrls) => [url, ...prevUrls]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CloudiShare
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Effortless image hosting. Drag, drop, and share.
          </p>
        </header>

        <ImageUploader onUploadSuccess={handleUploadSuccess} />
        
        <Gallery urls={imageUrls} />
      </main>
    </div>
  );
}
