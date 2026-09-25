import { Request, Response } from 'express';
import sharp from 'sharp';
import axios from 'axios';

export const optimizeImage = async (req: Request, res: Response): Promise<void> => {
  const { url, w, q } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).send('Image URL is required');
    return;
  }

  const width = w ? parseInt(w as string) : null;
  const quality = q ? parseInt(q as string) : 80;

  try {
    // Fetch the original image
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Initialize sharp instance
    let pipeline = sharp(buffer);

    // Resize if width is provided
    if (width) {
      pipeline = pipeline.resize(width, null, { withoutEnlargement: true });
    }

    // Convert to WebP with specified quality
    const optimizedBuffer = await pipeline
      .webp({ quality })
      .toBuffer();

    // Cache headers for 30 days
    res.set('Cache-Control', 'public, max-age=2592000');
    res.set('Content-Type', 'image/webp');
    res.send(optimizedBuffer);
  } catch (error) {
    console.error('Image optimization error:', error);
    // Fallback: redirect to original image if optimization fails
    res.redirect(url);
  }
};
