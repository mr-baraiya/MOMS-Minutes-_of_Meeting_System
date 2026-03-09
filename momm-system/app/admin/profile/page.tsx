'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AdminProfilePage() {
  const { user: authUser, token, refreshUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['admin'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Administrator';
  const displayEmail = profile?.email || 'admin@example.com';
  const displayRole = profile?.role || 'admin';
  const department = profile?.staff?.department || 'Head Office';
  const avatar = profile?.profilePicture?.trim() || '';

  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    staffName: '',
    profilePicture: '',
  });
  const [profileStatus, setProfileStatus] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoStatus, setPhotoStatus] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      username: profile.username || '',
      email: profile.email || '',
      staffName: profile.staff?.name || '',
      profilePicture: profile.profilePicture || '',
    });
  }, [profile]);

  const authHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPhotoFile(file);
    setPhotoStatus(null);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileStatus(null);

    const username = profileForm.username.trim();
    const email = profileForm.email.trim();

    if (!username) {
      setProfileStatus({ type: 'error', message: 'Username is required.' });
      return;
    }

    if (!email) {
      setProfileStatus({ type: 'error', message: 'Email is required.' });
      return;
    }

    const payload: Record<string, string | null> = {
      username,
      email,
      profilePicture: profileForm.profilePicture.trim() || null,
    };

    if (profile?.staff?.id) {
      const staffName = profileForm.staffName.trim();
      if (!staffName) {
        setProfileStatus({ type: 'error', message: 'Full name is required.' });
        return;
      }
      payload.staffName = staffName;
    }

    setSavingProfile(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      await refreshUser();
      setProfileStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      setProfileStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Profile update failed.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePhotoUpload = async () => {
    setPhotoStatus(null);

    if (!photoFile) {
      setPhotoStatus({ type: 'error', message: 'Select an image to upload.' });
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);

      const response = await fetch('/api/auth/profile-photo', {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to upload profile photo.');
      }

      setProfileForm((prev) => ({
        ...prev,
        profilePicture: result.data?.profilePicture || prev.profilePicture,
      }));
      await refreshUser();
      setPhotoFile(null);
      setPhotoStatus({ type: 'success', message: 'Profile photo updated.' });
    } catch (error) {
      setPhotoStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Upload failed.',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordStatus(null);

    if (!passwordForm.currentPassword) {
      setPasswordStatus({ type: 'error', message: 'Current password is required.' });
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordStatus({ type: 'error', message: 'New password is required.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to change password.');
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Password update failed.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition';

  const labelCls = 'block mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400';

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

  return (
    <DashboardLayout role="admin">
      <div className="min-h-full bg-gray-50/60 p-6 space-y-6">

        {/* ── Hero banner ───────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-lg">
          {/* decorative circles */}
          <span className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <span className="pointer-events-none absolute -bottom-10 right-24 h-40 w-40 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Avatar + info */}
            <div className="flex items-center gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-20 w-20 rounded-2xl border-2 border-white/30 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 text-3xl font-bold shadow-md">
                  {getInitial(displayName)}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  Administrator Profile
                </p>
                <h1 className="mt-1 text-2xl font-bold">{displayName}</h1>
                <p className="mt-0.5 text-sm text-blue-100">{displayEmail}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border border-white/20">
                {displayRole}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border border-white/15 text-blue-100">
                {department}
              </span>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mt-6 grid grid-cols-3 divide-x divide-white/20 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            {[
              { label: 'Status', value: 'Active' },
              { label: 'Account Role', value: 'Administrator' },
              { label: 'Department', value: department },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 first:pl-0 last:pr-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200">{label}</p>
                <p className="mt-1 text-sm font-semibold truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body grid ─────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">

          {/* Left column */}
          <div className="space-y-6">

            {/* Edit Profile */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Edit Profile</h2>
                  <p className="text-xs text-gray-400">Keep your details current for system records</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Photo upload */}
                <div>
                  <label htmlFor="profilePhoto" className={labelCls}>Profile Photo</label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                    />
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploadingPhoto ? 'Uploading…' : 'Upload'}
                    </button>
                  </div>
                  {photoStatus && (
                    <p className={`mt-2 rounded-lg px-3 py-2 text-xs font-medium ${photoStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {photoStatus.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="username" className={labelCls}>Username</label>
                  <input id="username" name="username" value={profileForm.username} onChange={handleProfileChange} className={inputCls} />
                </div>

                {profile?.staff?.id && (
                  <div>
                    <label htmlFor="staffName" className={labelCls}>Full Name</label>
                    <input id="staffName" name="staffName" value={profileForm.staffName} onChange={handleProfileChange} className={inputCls} />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className={labelCls}>Email</label>
                  <input id="email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} className={inputCls} />
                </div>

                {profileStatus && (
                  <p className={`rounded-lg px-3 py-2 text-xs font-medium ${profileStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {profileStatus.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.99] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-indigo-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
                  <p className="text-xs text-gray-400">Rotate credentials regularly to stay secure</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className={labelCls}>Current Password</label>
                  <input id="currentPassword" name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="newPassword" className={labelCls}>New Password</label>
                  <input id="newPassword" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className={labelCls}>Confirm Password</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} className={inputCls} />
                </div>

                {passwordStatus && (
                  <p className={`rounded-lg px-3 py-2 text-xs font-medium ${passwordStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {passwordStatus.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-[0.99] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPassword ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Access Summary */}
            <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Access Summary</h2>
                  <p className="text-xs text-gray-500">Your system privileges</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'System Control', value: 'Full', color: 'text-blue-700' },
                  { label: 'User Management', value: 'Enabled', color: 'text-green-700' },
                  { label: 'Report Access', value: 'Enabled', color: 'text-green-700' },
                ].map(({ label, value, color }) => (
                  <li key={label} className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-2.5 text-sm border border-white">
                    <span className="text-gray-600">{label}</span>
                    <span className={`font-semibold ${color}`}>{value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-600/10 px-4 py-3 text-xs text-blue-800 leading-relaxed">
                You hold full administrator privileges across all departments and meetings.
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Security</h2>
                  <p className="text-xs text-gray-400">Account security status</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'Last credential check', value: 'Today', color: 'text-gray-900' },
                  { label: 'Session status', value: 'Secure', color: 'text-emerald-600' },
                ].map(({ label, value, color }) => (
                  <li key={label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-semibold ${color}`}>{value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500 leading-relaxed">
                Tip: update your password every 90 days and keep your recovery email current.
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
