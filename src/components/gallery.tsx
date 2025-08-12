"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function Gallery({ urls }: { urls: string[] }) {
  if (urls.length === 0) {
    return (
        <div className="text-center mt-12 text-muted-foreground">
            <p>Your uploaded images will appear here.</p>
        </div>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Your Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {urls.map((url, index) => (
          <Card key={`${url}-${index}`} className="overflow-hidden group animate-in fade-in-0 zoom-in-95 duration-500">
            <CardContent className="p-0">
              <div className="aspect-video relative">
                 <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="uploaded image"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
