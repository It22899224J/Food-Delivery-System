import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class ImageUploadService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: "dkvtonzx5",
      api_key:"586176664986663",
      api_secret: "77QJMD_FLvwtWRZFeqO0QaBYH7s",
    });
  }
  // Method to upload Base64 image to Cloudinary
  public async uploadImage(base64Image: string): Promise<string> {
    try {
      const result = await cloudinary.v2.uploader.upload(base64Image, {
        folder: 'menu_items', // Optional: Upload to specific folder
        resource_type: 'image', // Ensuring it is treated as an image
      });

      console.log('Image uploaded successfully:', result);
      return result.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Image upload failed'); // Handle errors appropriately
    }
  }

 public async removeImage(input: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(input);

      console.log('Public ID:', publicId);
      const result = await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: 'image',
         invalidate: true,
      });

      console.log('Image deletion result:', result);
      if (result.result !== 'ok') {
        throw new Error('Image deletion failed');
      }
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      throw new Error('Image deletion failed');
    }
  }

  private extractPublicId(input: string): string {
    if (!input.startsWith('http')) {
      return input;
    }

    try {
      const url = new URL(input);
      const path = url.pathname;
      const parts = path.split('/');
      const uploadIndex = parts.indexOf('upload');
      const relevantParts = parts.slice(uploadIndex + 1);
      let filename = relevantParts.pop()!;
      const basename = filename.substring(0, filename.lastIndexOf('.')) || filename;
      return relevantParts.length ? `${relevantParts.join('/')}/${basename}` : basename;
    } catch {
      throw new Error('Invalid Cloudinary URL');
    }
  }
}



