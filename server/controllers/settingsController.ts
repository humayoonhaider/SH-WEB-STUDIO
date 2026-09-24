import { Request, Response } from 'express';
import { SiteSettings } from '../models/index.js';

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve site settings.' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await SiteSettings.findOne();
    let updated;
    if (existing) {
      updated = await SiteSettings.findByIdAndUpdate(String(existing._id), req.body, { new: true });
    } else {
      updated = await SiteSettings.create(req.body);
    }
    res.json({ success: true, message: 'Website settings saved successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update site settings.' });
  }
};
