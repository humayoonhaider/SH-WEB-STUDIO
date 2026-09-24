import { Request, Response } from 'express';
import { Project } from '../models/index.js';
import { seedInitialData } from '../seed/seedData.js';

export const getPublicProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    let projects = await Project.find({ isActive: true }, { sort: { order: 1 } });
    if (!projects || projects.length === 0) {
      await seedInitialData(true);
      projects = await Project.find({ isActive: true }, { sort: { order: 1 } });
    }
    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve projects.' });
  }
};

export const getAllProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    let projects = await Project.find({}, { sort: { order: 1 } });
    if (!projects || projects.length === 0) {
      await seedInitialData(true);
      projects = await Project.find({}, { sort: { order: 1 } });
    }
    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve all projects.' });
  }
};

export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve project.' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve project.' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, description, imageUrl, liveUrl, githubUrl, featured, order, isActive, technologies } = req.body;
    if (!title || !category || !description) {
      res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
      return;
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const techArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    const newProject = await Project.create({
      title: title.trim(),
      slug,
      category: category.trim(),
      description: description.trim(),
      imageUrl: imageUrl?.trim() || '',
      liveUrl: liveUrl?.trim() || '',
      githubUrl: githubUrl?.trim() || '',
      featured: Boolean(featured),
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      technologies: techArray,
    });

    res.status(201).json({ success: true, message: 'Project created successfully.', data: newProject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Project updated successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};
