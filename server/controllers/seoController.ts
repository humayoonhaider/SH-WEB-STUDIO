import { Request, Response } from 'express';
import { SEOSettings } from '../models/index.js';

export const getSEO = async (_req: Request, res: Response): Promise<void> => {
  try {
    let seo = await SEOSettings.findOne();
    if (!seo) {
      seo = await SEOSettings.create({});
    }
    res.json({ success: true, data: seo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve SEO settings.' });
  }
};

export const updateSEO = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await SEOSettings.findOne();
    let updated;
    if (existing) {
      updated = await SEOSettings.findByIdAndUpdate(String(existing._id), req.body, { new: true });
    } else {
      updated = await SEOSettings.create(req.body);
    }
    res.json({ success: true, message: 'SEO settings saved successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update SEO settings.' });
  }
};
