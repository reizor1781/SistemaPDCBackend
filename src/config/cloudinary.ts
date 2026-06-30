import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

/**
 * Elimina un recurso de Cloudinary dado su public_id.
 * Acepta resource_type para manejar PDFs (raw) vs imágenes (image).
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'raw' = 'image',
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`Error eliminando recurso de Cloudinary [${publicId}]:`, err);
  }
}

/**
 * Extrae el public_id de una URL de Cloudinary.
 * Retorna null si la URL no es de Cloudinary.
 */
export function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    // URL formato: https://res.cloudinary.com/<cloud>/image/upload/v123/folder/filename.ext
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    // Remover version (v123/) si existe
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Remover extensión
    const lastDot = withoutVersion.lastIndexOf('.');
    return lastDot > 0 ? withoutVersion.substring(0, lastDot) : withoutVersion;
  } catch {
    return null;
  }
}

export { cloudinary };
