import { Request, Response } from 'express';
import { User, Referral, Commission, Payment, ReferralSettings, WithdrawalRequest } from '../models/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Public endpoint to validate referral code on register page
export const validateReferralCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawCode = req.params.code || req.query.code;
    if (!rawCode || typeof rawCode !== 'string') {
      res.status(400).json({ success: false, message: 'Referral code is required.' });
      return;
    }

    const cleanCode = rawCode.trim().toUpperCase();
    const referrer = await User.findOne({ referralCode: cleanCode, isActive: true });

    if (!referrer) {
      res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid or expired referral code.',
      });
      return;
    }

    // Mask referrer name for privacy
    const names = (referrer.name || 'User').split(' ');
    const maskedName = names.length > 1
      ? `${names[0]} ${names[names.length - 1][0]}.`
      : names[0];

    res.json({
      success: true,
      valid: true,
      data: {
        code: referrer.referralCode,
        referrerName: maskedName,
        discountReward: '10% Referral Partner Attribution',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error validating referral code.' });
  }
};

// Public endpoint for referral program settings (commission rate, terms)
export const getPublicReferralSettings = async (_req: Request, res: Response): Promise<void> => {
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

    res.json({
      success: true,
      data: {
        referralProgramEnabled: settings.referralProgramEnabled,
        commissionRate: settings.commissionRate,
        minPayoutAmount: settings.minPayoutAmount,
        payoutNotice: settings.payoutNotice,
        termsText: settings.termsText,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      data: {
        referralProgramEnabled: true,
        commissionRate: 10,
        minPayoutAmount: 0,
        payoutNotice: 'Commissions are paid via Bank Transfer, Easypaisa, or JazzCash upon client payment verification.',
        termsText: '10% referral commission on all qualifying client projects.',
      },
    });
  }
};

// User Dashboard: Get my referrals list
export const getMyReferrals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.user.id);

    const referrals = await Referral.find({ referrer: userId });
    const commissions = await Commission.find({ referrer: userId });

    const results = await Promise.all(
      referrals.map(async (ref: any) => {
        const referredUser = await User.findById(ref.referredUser);
        
        // Find any commissions linked to this referred user
        const userCommissions = commissions.filter(
          (c: any) => String(c.referredUser) === String(ref.referredUser)
        );

        const totalQualifyingPayment = userCommissions.reduce(
          (sum: number, c: any) => sum + (c.paymentAmount || 0),
          0
        );

        const totalCommission = userCommissions.reduce(
          (sum: number, c: any) => sum + (c.commissionAmount || 0),
          0
        );

        // Mask name for privacy e.g. "Muhammad H."
        const rawName = referredUser?.name || 'Referred User';
        const nameParts = rawName.split(' ');
        const maskedName = nameParts.length > 1
          ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
          : rawName;

        return {
          id: ref._id,
          referredUserName: maskedName,
          referredUserCompany: referredUser?.company || '',
          registeredAt: ref.registeredAt || ref.createdAt,
          status: ref.status,
          qualifyingPayment: totalQualifyingPayment,
          commission: totalCommission,
          commissionsCount: userCommissions.length,
          commissions: userCommissions.map((c: any) => ({
            id: c._id,
            amount: c.commissionAmount,
            rate: c.commissionRate,
            paymentAmount: c.paymentAmount,
            currency: c.currency || 'USD',
            status: c.status,
            createdAt: c.createdAt,
            approvedAt: c.approvedAt,
            paidAt: c.paidAt,
          })),
        };
      })
    );

    // Sort by most recent
    results.sort(
      (a: any, b: any) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch referrals list.' });
  }
};

// User Dashboard: Get statistics summary
export const getMyStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.user.id);

    const referrals = await Referral.find({ referrer: userId });
    const commissions = await Commission.find({ referrer: userId });

    const totalReferrals = referrals.length;
    const registeredReferrals = referrals.filter((r: any) => r.status === 'REGISTERED').length;
    const qualifiedReferrals = referrals.filter((r: any) =>
      ['QUALIFIED', 'CLIENT', 'PAYMENT_PENDING', 'COMMISSION_PENDING', 'COMMISSION_APPROVED', 'COMMISSION_PAID'].includes(r.status)
    ).length;
    const convertedClients = referrals.filter((r: any) =>
      ['CLIENT', 'PAYMENT_PENDING', 'COMMISSION_PENDING', 'COMMISSION_APPROVED', 'COMMISSION_PAID'].includes(r.status)
    ).length;

    let totalEarnedCommission = 0;
    let pendingCommission = 0;
    let approvedCommission = 0;
    let paidCommission = 0;
    let totalQualifyingPayments = 0;

    commissions.forEach((c: any) => {
      const amount = Number(c.commissionAmount) || 0;
      totalQualifyingPayments += Number(c.paymentAmount) || 0;

      if (c.status === 'pending') {
        pendingCommission += amount;
      } else if (c.status === 'approved') {
        approvedCommission += amount;
        totalEarnedCommission += amount;
      } else if (c.status === 'paid') {
        paidCommission += amount;
        totalEarnedCommission += amount;
      }
    });

    // Get all pending / approved withdrawal requests for this user
    const withdrawalRequests = await WithdrawalRequest.find({
      user: userId,
      status: { $in: ['pending', 'approved', 'paid'] },
    });

    const pendingWithdrawals = withdrawalRequests
      .filter((w: any) => w.status === 'pending' || w.status === 'approved')
      .reduce((sum: number, w: any) => sum + (Number(w.amount) || 0), 0);

    const paidWithdrawals = withdrawalRequests
      .filter((w: any) => w.status === 'paid')
      .reduce((sum: number, w: any) => sum + (Number(w.amount) || 0), 0);

    const availableBalance = Math.max(0, (approvedCommission + pendingCommission) - pendingWithdrawals);

    res.json({
      success: true,
      data: {
        totalReferrals,
        registeredReferrals,
        qualifiedReferrals,
        convertedClients,
        totalQualifyingPayments,
        totalEarnedCommission,
        pendingCommission,
        approvedCommission,
        paidCommission: Math.max(paidCommission, paidWithdrawals),
        availableBalance,
        pendingWithdrawals,
        currency: 'USD',
      },
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch referral statistics.' });
  }
};

// User Dashboard: Submit Withdrawal Request for Admin Approval
export const createWithdrawalRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.user.id);
    const { amount, payoutMethod, accountNumber, accountHolderName, bankName, notes } = req.body;

    const withdrawAmount = Number(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      res.status(400).json({ success: false, message: 'Please enter a valid withdrawal amount.' });
      return;
    }

    if (!accountNumber || !accountHolderName) {
      res.status(400).json({ success: false, message: 'Account number and account holder name are required.' });
      return;
    }

    // Calculate user's currently available balance
    const availableCommissions = await Commission.find({
      referrer: userId,
      status: { $in: ['approved', 'pending'] },
    });

    const totalUnpaidCommissions = availableCommissions.reduce(
      (sum: number, c: any) => sum + (Number(c.commissionAmount) || 0),
      0
    );

    const existingPendingRequests = await WithdrawalRequest.find({
      user: userId,
      status: { $in: ['pending', 'approved'] },
    });

    const totalPendingRequested = existingPendingRequests.reduce(
      (sum: number, w: any) => sum + (Number(w.amount) || 0),
      0
    );

    const availableBalance = totalUnpaidCommissions - totalPendingRequested;

    if (withdrawAmount > availableBalance) {
      res.status(400).json({
        success: false,
        message: `Requested amount ($${withdrawAmount}) exceeds your available balance ($${availableBalance.toFixed(2)}).`,
      });
      return;
    }

    const newRequest = await WithdrawalRequest.create({
      user: userId,
      userName: req.user.name || '',
      userEmail: req.user.email || '',
      amount: withdrawAmount,
      currency: 'USD',
      payoutMethod: payoutMethod || 'JazzCash',
      accountNumber,
      accountHolderName,
      bankName: bankName || '',
      notes: notes || '',
      status: 'pending',
      requestedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully! Admin will review and process your payout.',
      data: newRequest,
    });
  } catch (error: any) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({ success: false, message: 'Failed to submit withdrawal request.' });
  }
};

// User Dashboard: Get My Withdrawal Requests
export const getMyWithdrawalRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.user.id);
    const requests = await WithdrawalRequest.find({ user: userId });
    
    // Sort descending by requestedAt
    requests.sort((a: any, b: any) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    res.json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal requests.' });
  }
};

// User Dashboard: Cancel a Pending Withdrawal Request
export const cancelWithdrawalRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.user.id);
    const requestId = req.params.id;

    const requestItem = await WithdrawalRequest.findOne({ _id: requestId, user: userId });
    if (!requestItem) {
      res.status(404).json({ success: false, message: 'Withdrawal request not found.' });
      return;
    }

    if (requestItem.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already ${requestItem.status}.`,
      });
      return;
    }

    await WithdrawalRequest.findByIdAndUpdate(requestId, {
      status: 'rejected',
      adminNote: 'Cancelled by user',
      rejectedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Withdrawal request cancelled successfully.',
    });
  } catch (error: any) {
    console.error('Error cancelling withdrawal request:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel withdrawal request.' });
  }
};

// Backward-compatible direct self-withdrawal endpoint
export const requestUserWithdrawal = createWithdrawalRequest;


