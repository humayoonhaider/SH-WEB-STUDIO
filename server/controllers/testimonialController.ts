import { Request, Response } from 'express';
import { Testimonial } from '../models/index.js';

// Public: Get all active testimonials
export const getTestimonials = async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await Testimonial.find({ isActive: true }, { sort: { order: 1 } });
    res.json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonials.',
    });
  }
};

// Admin: Get all testimonials (including inactive)
export const getAllTestimonialsAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await Testimonial.find({}, { sort: { order: 1 } });
    res.json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonials.',
    });
  }
};

// Admin: Create testimonial
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, company, content, avatarUrl, rating, projectTag, order, isActive } = req.body;

    if (!name || !content) {
      res.status(400).json({
        success: false,
        message: 'Name and testimonial content are required.',
      });
      return;
    }

    const newTestimonial = await Testimonial.create({
      name,
      role: role || 'Client',
      company: company || '',
      content,
      avatarUrl: avatarUrl || '',
      rating: typeof rating === 'number' ? rating : 5,
      projectTag: projectTag || '',
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      data: newTestimonial,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial.',
    });
  }
};

// Admin: Update testimonial
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await Testimonial.findById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
      return;
    }

    const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
      success: true,
      message: 'Testimonial updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial.',
    });
  }
};

// Admin: Delete testimonial
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial.',
    });
  }
};

// Public: Submit Client Review / Feedback
export const submitClientReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, company, content, rating, projectTag } = req.body;

    if (!name || !content) {
      res.status(400).json({
        success: false,
        message: 'Name and testimonial feedback are required.',
      });
      return;
    }

    const currentCount = await Testimonial.countDocuments();
    const newDoc = await Testimonial.create({
      name: name.trim(),
      role: role?.trim() || 'Client',
      company: company?.trim() || '',
      content: content.trim(),
      avatarUrl: '',
      rating: typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : 5,
      projectTag: projectTag?.trim() || 'Web Project',
      order: currentCount + 1,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted successfully.',
      data: newDoc,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit review.',
    });
  }
};
