import { Request, Response } from 'express';
import { Project } from '../models/index.js';
import { seedInitialData } from '../seed/seedData.js';
import { pingSearchEngines } from '../utils/seoPing.js';

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
    const rawParam = decodeURIComponent(req.params.slug || '').trim();
    if (!rawParam) {
      res.status(400).json({ success: false, message: 'Project identifier is required.' });
      return;
    }

    const count = await Project.countDocuments();
    if (count === 0) {
      await seedInitialData(true);
    }

    // 1. Try finding by exact slug
    let project = await Project.findOne({ slug: rawParam, isActive: true });

    // 2. Try finding by slug without active constraint if admin or previewing
    if (!project) {
      project = await Project.findOne({ slug: rawParam });
    }

    // 3. Try finding in all projects by case-insensitive slug, ID, or generated slug
    if (!project) {
      const allProjects = await Project.find({});
      project =
        allProjects.find((p: any) => {
          const pSlug = (p.slug || '').toLowerCase();
          const pId = String(p._id);
          const pTitleSlug = (p.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          const target = rawParam.toLowerCase();

          return pSlug === target || pId === target || pTitleSlug === target;
        }) || null;
    }

    // 4. Try finding by direct ID
    if (!project) {
      try {
        project = await Project.findById(rawParam);
      } catch {}
    }

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
    const rawId = req.params.id;
    let project = null;
    try {
      project = await Project.findById(rawId);
    } catch {}

    if (!project) {
      project = await Project.findOne({ slug: rawId });
    }

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

    // Ping search engines for faster re-indexing
    pingSearchEngines(req.get('host')).catch(err => console.error('SEO Ping Error:', err));
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

    // Ping search engines if the project is active
    if (updated?.isActive) {
      pingSearchEngines(req.get('host')).catch(err => console.error('SEO Ping Error:', err));
    }
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
