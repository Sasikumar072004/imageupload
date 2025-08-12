"use client";

import { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { Gallery } from '@/components/gallery';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUploadSuccess = (url: string) => {
    setImageUrls((prevUrls) => [url, ...prevUrls]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-2 rounded-full mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-foreground">
            CloudiShare
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            A simple, fast, and reliable way to upload your images and get a shareable link instantly.
          </p>
        </header>

        <ImageUploader onUploadSuccess={handleUploadSuccess} />
        
        <Gallery urls={imageUrls} />
      </main>
      <footer className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground">Built with Next.js and Firebase Studio</p>
      </footer>
    </div>
  );
}
