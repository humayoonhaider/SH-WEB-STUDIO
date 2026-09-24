import { Request, Response } from 'express';
import { TeamMember } from '../models/index.js';
import { seedInitialData } from '../seed/seedData.js';

export const getPublicTeam = async (_req: Request, res: Response): Promise<void> => {
  try {
    let members = await TeamMember.find({ isActive: true }, { sort: { order: 1 } });
    if (!members || members.length === 0) {
      await seedInitialData(true);
      members = await TeamMember.find({ isActive: true }, { sort: { order: 1 } });
    }
    res.json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve team members.' });
  }
};

export const getAllTeam = async (_req: Request, res: Response): Promise<void> => {
  try {
    let members = await TeamMember.find({}, { sort: { order: 1 } });
    if (!members || members.length === 0) {
      await seedInitialData(true);
      members = await TeamMember.find({}, { sort: { order: 1 } });
    }
    res.json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve all team members.' });
  }
};

export const createTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      role,
      bio,
      imageUrl,
      email,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      isFounder,
      order,
      isActive,
    } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Name is required.' });
      return;
    }

    const newMember = await TeamMember.create({
      name: name.trim(),
      role: role?.trim() || 'Co-Founder & Developer',
      bio: bio?.trim() || '',
      imageUrl: imageUrl?.trim() || '',
      email: email?.trim() || '',
      portfolioUrl: portfolioUrl?.trim() || '',
      githubUrl: githubUrl?.trim() || '',
      linkedinUrl: linkedinUrl?.trim() || '',
      isFounder: isFounder !== undefined ? Boolean(isFounder) : true,
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, message: 'Team member created successfully.', data: newMember });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create team member.' });
  }
};

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found.' });
      return;
    }

    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Team member updated successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update team member.' });
  }
};

export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found.' });
      return;
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete team member.' });
  }
};
