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

export const getSearchConsoleData = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'OAuth token is required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const siteUrl = process.env.SITE_URL || 'https://shwebstudio.dev';
  // Canonicalize site URL for Search Console (must end with / if it's a domain)
  const encodedSite = encodeURIComponent(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);

  try {
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
          endDate: new Date().toISOString().split('T')[0],
          dimensions: ['query'],
          rowLimit: 10,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Search Console API Error:', data);
      res.status(response.status).json({ success: false, message: data.error?.message || 'Search Console API Error', details: data });
      return;
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch Search Console data' });
  }
};
