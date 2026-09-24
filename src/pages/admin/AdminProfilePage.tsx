import React, { useState, useEffect } from 'react';
import { User, Lock, Save, RefreshCw, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminProfilePage: React.FC = () => {
  const { admin, refreshAdmin } = useAuth();

  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name,
        email: admin.email,
      });
    }
  }, [admin]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    try {
      const res = await api.auth.updateProfile(profileData);
      if (res.success) {
        setProfileMsg({ type: 'success', text: 'Admin profile updated successfully.' });
        refreshAdmin();
      } else {
        setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Error updating profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);

    if (passwordData.newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await api.auth.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully updated.' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Error updating password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-[#1C1D24]">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Manage your administrative contact details and authentication credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <div className="bg-[#121318] border border-[#262833] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1C1D24] pb-4">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Personal Information
            </h2>
          </div>

          {profileMsg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md"
              >
                {profileLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{profileLoading ? 'Saving...' : 'Update Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-[#121318] border border-[#262833] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1C1D24] pb-4">
            <Lock className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Security & Credentials
            </h2>
          </div>

          {passwordMsg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Current Password
              </label>
              <div className="relative max-w-md">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="p-1 text-neutral-500 hover:text-white absolute right-3 top-2.5 transition-colors"
                  aria-label={showCurrentPass ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="p-1 text-neutral-500 hover:text-white absolute right-3 top-2.5 transition-colors"
                    aria-label={showNewPass ? 'Hide password' : 'Show password'}
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md"
              >
                {passwordLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>{passwordLoading ? 'Updating...' : 'Change Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
