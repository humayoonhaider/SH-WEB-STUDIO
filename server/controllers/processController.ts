import { Request, Response } from 'express';
import { ProcessStep } from '../models/index.js';

export const getProcessSteps = async (_req: Request, res: Response): Promise<void> => {
  try {
    const steps = await ProcessStep.find({ isActive: true }, { sort: { order: 1 } });
    res.json({ success: true, data: steps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve process steps.' });
  }
};

export const getAllProcessSteps = async (_req: Request, res: Response): Promise<void> => {
  try {
    const steps = await ProcessStep.find({}, { sort: { order: 1 } });
    res.json({ success: true, data: steps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve process steps.' });
  }
};

export const createProcessStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stepNumber, title, description, order, isActive } = req.body;
    if (!stepNumber || !title || !description) {
      res.status(400).json({ success: false, message: 'Step number, title, and description are required.' });
      return;
    }

    const step = await ProcessStep.create({
      stepNumber: stepNumber.trim(),
      title: title.trim(),
      description: description.trim(),
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, message: 'Process step created successfully.', data: step });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create process step.' });
  }
};

export const updateProcessStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const step = await ProcessStep.findById(req.params.id);
    if (!step) {
      res.status(404).json({ success: false, message: 'Process step not found.' });
      return;
    }

    const updated = await ProcessStep.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Process step updated successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update process step.' });
  }
};

export const deleteProcessStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const step = await ProcessStep.findById(req.params.id);
    if (!step) {
      res.status(404).json({ success: false, message: 'Process step not found.' });
      return;
    }

    await ProcessStep.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Process step deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete process step.' });
  }
};
