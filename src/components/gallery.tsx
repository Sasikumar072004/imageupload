"use client";

import Image from "next/image";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Gallery({ urls }: { urls: string[] }) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (urls.length === 0) {
    return (
        <div className="text-center mt-20 text-muted-foreground border-2 border-dashed rounded-lg p-12">
            <p className="font-medium">Your uploaded images will appear here.</p>
            <p className="text-sm">Start by uploading an image above.</p>
        </div>
    );
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold text-center mb-8">Your Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {urls.map((url, index) => (
          <Card key={`${url}-${index}`} className="overflow-hidden group relative animate-in fade-in-0 zoom-in-95 duration-500">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                 <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="uploaded image"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <Button variant="secondary" size="icon" onClick={() => handleCopy(url)}>
                        {copiedUrl === url ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                        <span className="sr-only">Copy URL</span>
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
