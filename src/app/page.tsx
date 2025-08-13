"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ImageUploader } from '@/components/image-uploader';
import { Gallery } from '@/components/gallery';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleUploadSuccess = (url: string) => {
    setImageUrls((prevUrls) => [url, ...prevUrls]);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
       <header className="absolute top-0 right-0 p-4">
          <Button onClick={logout} variant="outline">Logout</Button>
       </header>
      <main className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-2 rounded-full mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground">
            Asset Storage
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground">
            A simple, fast, and reliable way to upload your images and get a shareable link instantly.
          </p>
        </header>

        <ImageUploader onUploadSuccess={handleUploadSuccess} />
        
        <Gallery urls={imageUrls} />
      </main>
      <footer className="text-center py-6 border-t">
      </footer>
    </div>
  );
}
