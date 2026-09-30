import { Request, Response } from 'express';
import { Service } from '../models/index.js';

export const getPublicServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isActive: true }, { sort: { order: 1 } });
    res.json({ success: true, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve services.' });
  }
};

export const getAllServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({}, { sort: { order: 1 } });
    res.json({ success: true, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve all services.' });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve service.' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, icon, order, isActive } = req.body;
    if (!title || !description) {
      res.status(400).json({ success: false, message: 'Title and description are required.' });
      return;
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newService = await Service.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      icon: icon || 'Code',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, message: 'Service created successfully.', data: newService });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Service updated successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
};
