import { Request, Response } from 'express';
import { PricingPlan } from '../models/index.js';
import { seedInitialData } from '../seed/seedData.js';

export const getPublicPricing = async (_req: Request, res: Response): Promise<void> => {
  try {
    let plans = await PricingPlan.find({ isActive: true }, { sort: { order: 1 } });
    if (!plans || plans.length === 0) {
      await seedInitialData(true);
      plans = await PricingPlan.find({ isActive: true }, { sort: { order: 1 } });
    }
    res.json({ success: true, data: plans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve pricing plans.' });
  }
};

export const getAllPricing = async (_req: Request, res: Response): Promise<void> => {
  try {
    let plans = await PricingPlan.find({}, { sort: { order: 1 } });
    if (!plans || plans.length === 0) {
      await seedInitialData(true);
      plans = await PricingPlan.find({}, { sort: { order: 1 } });
    }
    res.json({ success: true, data: plans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve all pricing plans.' });
  }
};

export const createPricingPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, badge, price, period, description, features, highlighted, order, isActive } = req.body;
    if (!name || !price) {
      res.status(400).json({ success: false, message: 'Name and price are required.' });
      return;
    }

    const newPlan = await PricingPlan.create({
      name: name.trim(),
      badge: badge?.trim() || 'Starter',
      price: price.trim(),
      period: period?.trim() || 'per project',
      description: description?.trim() || '',
      features: Array.isArray(features) ? features : (features ? String(features).split(',').map((f: string) => f.trim()) : []),
      highlighted: Boolean(highlighted),
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, message: 'Pricing plan created successfully.', data: newPlan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create pricing plan.' });
  }
};

export const updatePricingPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const plan = await PricingPlan.findById(id);
    if (!plan) {
      res.status(404).json({ success: false, message: 'Pricing plan not found.' });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.features && !Array.isArray(updateData.features)) {
      updateData.features = String(updateData.features).split(',').map((f: string) => f.trim());
    }

    const updated = await PricingPlan.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, message: 'Pricing plan updated successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update pricing plan.' });
  }
};

export const deletePricingPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const plan = await PricingPlan.findById(id);
    if (!plan) {
      res.status(404).json({ success: false, message: 'Pricing plan not found.' });
      return;
    }

    await PricingPlan.findByIdAndDelete(id);
    res.json({ success: true, message: 'Pricing plan deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete pricing plan.' });
  }
};
