
"use client";

import { useState, useRef, useEffect, type DragEvent, type FormEvent } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Copy, Check, Loader2, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function ImageUploader({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadedUrl(null);
    setUploadProgress(0);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return prev;
            }
            return prev + 5;
        })
    }, 100);

    const result = await uploadImage(formData);
    clearInterval(progressInterval);
    setUploadProgress(100);

    setIsUploading(false);

    if (result.success && result.url) {
      setUploadedUrl(result.url);
      onUploadSuccess(result.url);
      setFile(null);
    } else {
      toast({ variant: "destructive", title: "Upload Failed", description: result.error });
      setUploadProgress(0);
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
    setPreview(null);
    setUploadProgress(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl border-2 border-primary/10 rounded-2xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit}>
          { !file && !isUploading && (
            <div
              className={cn(
                "flex justify-center items-center flex-col w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300",
                isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-accent"
              )}
              onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="mb-2 text-lg font-medium text-foreground">
                <span className="font-bold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">PNG, JPG, or GIF (max. 10MB)</p>
              <input ref={fileInputRef} id="image-upload" name="image" type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
            </div>
          )}

          { file && !isUploading && (
             <div className="space-y-4 text-center">
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed w-full mx-auto">
                    {preview && <Image src={preview} alt="Image preview" fill className="object-contain" />}
                </div>
                <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                    <ImageIcon className="w-5 h-5" />
                    <span>{file.name}</span>
                </div>
                <div className="flex gap-2 justify-center pt-4">
                    <Button type="submit" size="lg">
                        {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Confirm and Upload"}
                    </Button>
                    <Button variant="outline" onClick={removeFile}>Cancel</Button>
                </div>
            </div>
          )}

           { isUploading && (
              <div className="w-full text-center space-y-4 flex flex-col items-center">
                  <p className="font-semibold text-lg">Uploading your file...</p>
                  <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                  <Progress value={uploadProgress} className="w-full max-w-sm" />
                  <p className="text-sm text-muted-foreground">{file?.name}</p>
              </div>
          )}
        </form>

        {uploadedUrl && (
          <div className="mt-6 space-y-3 animate-in fade-in duration-500 text-center">
            <div className="flex justify-center">
              <div className="bg-green-100 text-green-700 p-2 rounded-full">
                <Check className="h-6 w-6" />
              </div>
            </div>
            <p className="text-lg font-medium text-center">Upload successful!</p>
            <div className="flex items-center space-x-2 max-w-md mx-auto">
              <Input value={uploadedUrl} readOnly className="text-sm bg-secondary border-secondary" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {isCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy URL</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
