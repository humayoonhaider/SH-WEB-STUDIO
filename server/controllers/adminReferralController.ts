import { Request, Response } from 'express';
import {
  User,
  Referral,
  Payment,
  Commission,
  ReferralSettings,
} from '../models/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// 1. Overview Statistics for Admin Dashboard
export const getAdminReferralStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [allUsers, allReferrals, allCommissions, allPayments, settings] = await Promise.all([
      User.find({}),
      Referral.find({}),
      Commission.find({}),
      Payment.find({}),
      ReferralSettings.findOne(),
    ]);

    const totalUsers = allUsers.length;
    const totalReferrals = allReferrals.length;
    
    const convertedClients = allReferrals.filter((r: any) =>
      ['CLIENT', 'PAYMENT_PENDING', 'COMMISSION_PENDING', 'COMMISSION_APPROVED', 'COMMISSION_PAID'].includes(r.status)
    ).length;

    let totalRevenue = 0;
    allPayments.forEach((p: any) => {
      totalRevenue += Number(p.amount) || 0;
    });

    let totalCommissions = 0;
    let pendingCommissions = 0;
    let approvedCommissions = 0;
    let paidCommissions = 0;

    allCommissions.forEach((c: any) => {
      const amt = Number(c.commissionAmount) || 0;
      totalCommissions += amt;
      if (c.status === 'pending') pendingCommissions += amt;
      else if (c.status === 'approved') approvedCommissions += amt;
      else if (c.status === 'paid') paidCommissions += amt;
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalReferrals,
        convertedClients,
        totalRevenue,
        totalCommissions,
        pendingCommissions,
        approvedCommissions,
        paidCommissions,
        commissionRate: settings?.commissionRate ?? 10,
        referralProgramEnabled: settings?.referralProgramEnabled ?? true,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin referral stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin referral stats.' });
  }
};

// 2. Get All Referrals with Referrer & Referred User details
export const getAdminReferrals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;

    let referrals = await Referral.find({});
    const [users, commissions, payments] = await Promise.all([
      User.find({}),
      Commission.find({}),
      Payment.find({}),
    ]);

    const userMap = new Map<string, any>();
    users.forEach((u: any) => userMap.set(String(u._id), u));

    let populated = referrals.map((ref: any) => {
      const referrer = userMap.get(String(ref.referrer));
      const referredUser = userMap.get(String(ref.referredUser));
      const refCommissions = commissions.filter(
        (c: any) => String(c.referredUser) === String(ref.referredUser)
      );
      const refPayments = payments.filter(
        (p: any) => String(p.userId) === String(ref.referredUser) || String(p.referralId) === String(ref._id)
      );

      const totalQualifyingPayment = refPayments.reduce(
        (sum: number, p: any) => sum + (Number(p.amount) || 0),
        0
      );

      const totalCommission = refCommissions.reduce(
        (sum: number, c: any) => sum + (Number(c.commissionAmount) || 0),
        0
      );

      return {
        id: ref._id,
        status: ref.status,
        referralCode: ref.referralCode,
        registeredAt: ref.registeredAt || ref.createdAt,
        convertedAt: ref.convertedAt,
        notes: ref.notes || '',
        referrer: referrer
          ? {
              id: referrer._id,
              name: referrer.name,
              email: referrer.email,
              phone: referrer.phone,
              company: referrer.company,
              paymentDetails: referrer.paymentDetails || {},
            }
          : null,
        referredUser: referredUser
          ? {
              id: referredUser._id,
              name: referredUser.name,
              email: referredUser.email,
              phone: referredUser.phone,
              company: referredUser.company,
            }
          : null,
        totalQualifyingPayment,
        totalCommission,
        paymentsCount: refPayments.length,
        commissionsCount: refCommissions.length,
        commissions: refCommissions.map((c: any) => ({
          id: c._id,
          paymentAmount: c.paymentAmount,
          commissionRate: c.commissionRate,
          commissionAmount: c.commissionAmount,
          currency: c.currency || 'USD',
          status: c.status,
          approvedAt: c.approvedAt,
          paidAt: c.paidAt,
          rejectedAt: c.rejectedAt,
          payoutMethod: c.payoutMethod,
          payoutReference: c.payoutReference,
          adminNote: c.adminNote,
          createdAt: c.createdAt,
        })),
      };
    });

    // Filter by status if provided
    if (status && typeof status === 'string' && status !== 'all') {
      populated = populated.filter((item: any) => item.status === status);
    }

    // Filter by search query (name/email/code)
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      populated = populated.filter((item: any) => {
        const refName = item.referrer?.name?.toLowerCase() || '';
        const refEmail = item.referrer?.email?.toLowerCase() || '';
        const usrName = item.referredUser?.name?.toLowerCase() || '';
        const usrEmail = item.referredUser?.email?.toLowerCase() || '';
        const code = item.referralCode?.toLowerCase() || '';
        return (
          refName.includes(q) ||
          refEmail.includes(q) ||
          usrName.includes(q) ||
          usrEmail.includes(q) ||
          code.includes(q)
        );
      });
    }

    // Sort by recent
    populated.sort(
      (a: any, b: any) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );

    res.json({
      success: true,
      count: populated.length,
      data: populated,
    });
  } catch (error: any) {
    console.error('Error fetching admin referrals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch referrals.' });
  }
};

// 3. Get Single Referral Detail
export const getAdminReferralDetail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const referral = await Referral.findById(id);

    if (!referral) {
      res.status(404).json({ success: false, message: 'Referral record not found.' });
      return;
    }

    const [referrer, referredUser, commissions, payments] = await Promise.all([
      User.findById(referral.referrer),
      User.findById(referral.referredUser),
      Commission.find({ referredUser: String(referral.referredUser) }),
      Payment.find({ userId: String(referral.referredUser) }),
    ]);

    res.json({
      success: true,
      data: {
        id: referral._id,
        status: referral.status,
        referralCode: referral.referralCode,
        registeredAt: referral.registeredAt || referral.createdAt,
        convertedAt: referral.convertedAt,
        notes: referral.notes,
        referrer: referrer
          ? {
              id: referrer._id,
              name: referrer.name,
              email: referrer.email,
              phone: referrer.phone,
              company: referrer.company,
              paymentDetails: referrer.paymentDetails || {},
            }
          : null,
        referredUser: referredUser
          ? {
              id: referredUser._id,
              name: referredUser.name,
              email: referredUser.email,
              phone: referredUser.phone,
              company: referredUser.company,
            }
          : null,
        payments: payments || [],
        commissions: commissions || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch referral details.' });
  }
};

// 4. Update Referral Status
export const updateReferralStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = [
      'REGISTERED',
      'CONTACTED',
      'QUALIFIED',
      'CLIENT',
      'PAYMENT_PENDING',
      'COMMISSION_PENDING',
      'COMMISSION_APPROVED',
      'COMMISSION_PAID',
      'REJECTED',
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid referral status provided.' });
      return;
    }

    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;
    if (['CLIENT', 'COMMISSION_PENDING', 'COMMISSION_APPROVED', 'COMMISSION_PAID'].includes(status)) {
      updateData.convertedAt = new Date();
    }

    const updated = await Referral.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Referral record not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Referral status updated to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update referral status.' });
  }
};

// 5. Record a Qualifying Payment & Automatically Generate Commission
export const recordQualifyingPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { referralId, amount, currency, projectTitle, paymentReference, notes } = req.body;

    if (!referralId || !amount || Number(amount) <= 0) {
      res.status(400).json({
        success: false,
        message: 'Valid referral ID and payment amount greater than zero are required.',
      });
      return;
    }

    const referral = await Referral.findById(referralId);
    if (!referral) {
      res.status(404).json({ success: false, message: 'Referral record not found.' });
      return;
    }

    const [referrer, referredUser, settings] = await Promise.all([
      User.findById(referral.referrer),
      User.findById(referral.referredUser),
      ReferralSettings.findOne(),
    ]);

    if (!referrer || !referredUser) {
      res.status(400).json({ success: false, message: 'Referrer or referred user account missing.' });
      return;
    }

    const cleanAmount = Number(amount);
    const cleanCurrency = String(currency || 'USD').toUpperCase();
    const activeRate = Number(settings?.commissionRate ?? 10);
    const calculatedCommission = Number(((cleanAmount * activeRate) / 100).toFixed(2));

    // Create payment record
    const payment = await Payment.create({
      clientName: referredUser.name,
      clientEmail: referredUser.email,
      userId: String(referredUser._id),
      referralId: String(referral._id),
      referrerId: String(referrer._id),
      projectTitle: projectTitle || 'Custom Web Application / Digital Solution',
      amount: cleanAmount,
      currency: cleanCurrency,
      paymentDate: new Date(),
      paymentReference: paymentReference || `PAY-${Date.now()}`,
      status: 'completed',
      notes: notes || '',
    });

    // Create 10% commission record (referencing the payment ID to ensure 1:1 and prevent duplicates)
    const commission = await Commission.create({
      referrer: String(referrer._id),
      referredUser: String(referredUser._id),
      referral: String(referral._id),
      payment: String(payment._id),
      paymentAmount: cleanAmount,
      commissionRate: activeRate,
      commissionAmount: calculatedCommission,
      currency: cleanCurrency,
      status: 'pending',
      adminNote: notes || 'Recorded by admin upon qualifying client payment.',
    });

    // Update referral status to converted client & commission pending
    await Referral.findByIdAndUpdate(String(referral._id), {
      status: 'COMMISSION_PENDING',
      convertedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: `Qualifying payment of ${cleanCurrency} ${cleanAmount} recorded! Commission of ${cleanCurrency} ${calculatedCommission} (${activeRate}%) generated.`,
      data: {
        payment,
        commission,
      },
    });
  } catch (error: any) {
    console.error('Error recording payment:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to record payment.' });
  }
};

// 6. Update Commission Status (Approve, Reject, or Mark as Paid)
export const updateCommissionStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, payoutMethod, payoutReference, adminNote } = req.body;

    if (!['pending', 'approved', 'paid', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid commission status provided.' });
      return;
    }

    const commission = await Commission.findById(id);
    if (!commission) {
      res.status(404).json({ success: false, message: 'Commission record not found.' });
      return;
    }

    const updatePayload: any = {
      status,
      ...(adminNote !== undefined ? { adminNote: String(adminNote).trim() } : {}),
    };

    if (status === 'approved') {
      updatePayload.approvedAt = new Date();
    } else if (status === 'paid') {
      updatePayload.paidAt = new Date();
      if (payoutMethod) updatePayload.payoutMethod = payoutMethod;
      if (payoutReference) updatePayload.payoutReference = payoutReference;
    } else if (status === 'rejected') {
      updatePayload.rejectedAt = new Date();
    }

    const updated = await Commission.findByIdAndUpdate(id, updatePayload, { new: true });

    // Update parent referral status if applicable
    if (commission.referral) {
      if (status === 'paid') {
        await Referral.findByIdAndUpdate(commission.referral, { status: 'COMMISSION_PAID' });
      } else if (status === 'approved') {
        await Referral.findByIdAndUpdate(commission.referral, { status: 'COMMISSION_APPROVED' });
      }
    }

    res.json({
      success: true,
      message: `Commission status updated to ${status.toUpperCase()}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update commission status.' });
  }
};

// 7. Get Referral Program Settings (Admin)
export const getAdminReferralSettings = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let settings = await ReferralSettings.findOne();
    if (!settings) {
      settings = await ReferralSettings.create({
        referralProgramEnabled: true,
        commissionRate: 10,
        minPayoutAmount: 0,
        payoutNotice: 'Commissions are processed and paid via Bank Transfer, Easypaisa, JazzCash, or PayPal within 5-7 business days of client payment verification.',
        termsText: 'Referral commission is 10% on qualifying payments made by clients you refer. Payouts require admin verification of cleared client funds.',
      });
    }

    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch referral settings.' });
  }
};

// 8. Update Referral Program Settings (Admin)
export const updateAdminReferralSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { referralProgramEnabled, commissionRate, minPayoutAmount, payoutNotice, termsText } = req.body;

    let settings = await ReferralSettings.findOne();
    const updateData: any = {
      ...(referralProgramEnabled !== undefined ? { referralProgramEnabled: Boolean(referralProgramEnabled) } : {}),
      ...(commissionRate !== undefined ? { commissionRate: Number(commissionRate) } : {}),
      ...(minPayoutAmount !== undefined ? { minPayoutAmount: Number(minPayoutAmount) } : {}),
      ...(payoutNotice !== undefined ? { payoutNotice: String(payoutNotice).trim() } : {}),
      ...(termsText !== undefined ? { termsText: String(termsText).trim() } : {}),
    };

    if (settings) {
      settings = await ReferralSettings.findByIdAndUpdate(String(settings._id), updateData, { new: true });
    } else {
      settings = await ReferralSettings.create(updateData);
    }

    res.json({
      success: true,
      message: 'Referral program settings updated successfully.',
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update referral settings.' });
  }
};
