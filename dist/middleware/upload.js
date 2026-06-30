import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';
/**
 * Storage para PDFs — se suben como recurso "raw" (no imagen).
 */
const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'planimetria/pdfs',
        resource_type: 'raw',
        allowed_formats: ['pdf'],
    },
});
/**
 * Storage para imágenes (atracciones, avatares, etc.).
 */
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'planimetria/images',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
});
export const pdfUpload = multer({
    storage: pdfStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
export const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
