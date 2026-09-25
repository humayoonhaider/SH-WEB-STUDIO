import { Request, Response } from 'express';
import { ContactInquiry } from '../models/index.js';

export const submitInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      business,
      email,
      phone,
      projectType,
      budget,
      message,
      inquiryType,
      portfolioUrl,
      githubUrl,
      experience,
      skills,
    } = req.body;

    const isDevApp = inquiryType === 'developer_application';

    const inquiry = await ContactInquiry.create({
      name: name?.trim() || '',
      business: business?.trim() || '',
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      projectType: isDevApp ? (projectType?.trim() || 'Developer Application') : (projectType?.trim() || 'Web Development'),
      budget: budget?.trim() || '',
      message: message.trim(),
      inquiryType: isDevApp ? 'developer_application' : 'client',
      portfolioUrl: portfolioUrl?.trim() || '',
      githubUrl: githubUrl?.trim() || '',
      experience: experience?.trim() || '',
      skills: skills?.trim() || '',
      status: 'new',
    });

    const successMessage = isDevApp
      ? 'Thank you for your application to join SH Web Studio! Humayoon and our lead engineering team will review your profile and get in touch with you.'
      : 'Thank you for reaching out! We have received your inquiry and will contact you shortly.';

    res.status(201).json({
      success: true,
      message: successMessage,
      data: { id: inquiry._id },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry. Please try again.' });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, type, search } = req.query;
    let filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (type && type !== 'all') {
      filter.inquiryType = type;
    }

    let inquiries = await ContactInquiry.find(filter, { sort: { createdAt: -1 } });

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      inquiries = inquiries.filter(
        (inq: any) =>
          inq.name?.toLowerCase().includes(q) ||
          inq.email?.toLowerCase().includes(q) ||
          inq.business?.toLowerCase().includes(q) ||
          inq.message?.toLowerCase().includes(q) ||
          inq.projectType?.toLowerCase().includes(q) ||
          inq.skills?.toLowerCase().includes(q) ||
          inq.githubUrl?.toLowerCase().includes(q) ||
          inq.portfolioUrl?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve inquiries.' });
  }
};

export const getInquiryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return;
    }

    // Auto mark as read if it was 'new'
    if (inquiry.status === 'new') {
      await ContactInquiry.findByIdAndUpdate(req.params.id, { status: 'read' });
      inquiry.status = 'read';
    }

    res.json({ success: true, data: inquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve inquiry.' });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['new', 'read', 'contacted', 'completed', 'archived'];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value.' });
      return;
    }

    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return;
    }

    const updated = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, message: `Inquiry marked as ${status}.`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry.' });
  }
};

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return;
    }

    await ContactInquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete inquiry.' });
  }
};

export const getInquiryAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Last 30 days aggregation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await ContactInquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Aggregate by project type
    const byType = await ContactInquiry.aggregate([
      {
        $group: {
          _id: "$projectType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        daily: stats,
        byType: byType
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve analytics.' });
  }
};
