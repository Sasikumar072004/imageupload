"use client";

import { useState, useRef, useEffect, type DragEvent, type FormEvent } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Copy, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUploader({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadedUrl(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadedUrl(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    const result = await uploadImage(formData);
    setIsUploading(false);

    if (result.success && result.url) {
      setUploadedUrl(result.url);
      onUploadSuccess(result.url);
      setFile(null);
    } else {
      toast({ variant: "destructive", title: "Upload Failed", description: result.error });
    }
  };
  
  const handleCopy = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    setIsCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const removeFile = () => {
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-2 border-primary/10">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          {preview ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image src={preview} alt="Image preview" fill className="object-contain" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={removeFile}>
                  <X className="h-4 w-4" />
                   <span className="sr-only">Remove image</span>
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "flex justify-center items-center flex-col w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                isDragging ? "border-primary bg-accent/50" : "border-border hover:border-primary/50"
              )}
              onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
              <input ref={fileInputRef} id="image-upload" name="image" type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
            </div>
          )}
          
          <div className="mt-6">
            <Button type="submit" disabled={isUploading || !file} className="w-full">
              {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Image"}
            </Button>
          </div>
        </form>

        {uploadedUrl && (
          <div className="mt-6 space-y-2 animate-in fade-in duration-500">
            <p className="text-sm font-medium text-center">Upload successful! Here is your URL:</p>
            <div className="flex items-center space-x-2">
              <Input value={uploadedUrl} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy URL</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
