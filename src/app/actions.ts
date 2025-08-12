'use server';

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('image') as File;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!file || file.size === 0) {
    return { success: false, error: 'No image file provided.' };
  }
  
  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary environment variables are not set.');
    return { success: false, error: 'Server configuration error.' };
  }
  
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: uploadFormData,
    });
    
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Cloudinary upload error:', data.error);
      return { success: false, error: data.error?.message || 'Failed to upload image.' };
    }
    
    return { success: true, url: data.secure_url };

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return { success: false, error: 'An unexpected error occurred during upload.' };
  }
}
