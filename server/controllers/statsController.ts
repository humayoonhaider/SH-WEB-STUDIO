import { Request, Response } from 'express';
import { Project, Service, TeamMember, ContactInquiry } from '../models/index.js';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalProjects,
      activeProjects,
      activeServices,
      teamMembers,
      newInquiries,
      totalInquiries,
      recentInquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
      TeamMember.countDocuments({ isActive: true }),
      ContactInquiry.countDocuments({ status: 'new' }),
      ContactInquiry.countDocuments(),
      ContactInquiry.find({}, { sort: { createdAt: -1 } }),
    ]);

    res.json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        activeServices,
        teamMembers,
        newInquiries,
        totalInquiries,
        recentInquiries: recentInquiries.slice(0, 6),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
};
