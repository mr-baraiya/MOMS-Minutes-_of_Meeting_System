'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function StaffProfilePage() {
  const { user: authUser, token, refreshUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['staff'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Staff Member';
  const displayEmail = profile?.email || 'staff@example.com';
  const displayRole = profile?.role || 'staff';
  const department = profile?.staff?.department || 'General';
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

  if (loading) {
    return (
      <DashboardLayout role="staff">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="staff">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Mulish:wght@400;500;600&display=swap');
        .staff-profile {
          font-family: 'Mulish', sans-serif;
        }
        .staff-profile h1,
        .staff-profile h2,
        .staff-profile h3 {
          font-family: 'Montserrat', sans-serif;
        }
        .staff-pop {
          animation: staffPop 650ms ease forwards;
        }
        @keyframes staffPop {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="staff-profile space-y-8">
        <div className="relative overflow-hidden rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-100 via-rose-100 to-sky-100 p-8 text-slate-900 staff-pop">
          <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-rose-200/60 blur-2xl"></div>
          <div className="absolute right-4 -bottom-12 h-32 w-32 rounded-full bg-sky-200/60 blur-2xl"></div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${displayName} profile`}
                  className="h-20 w-20 rounded-2xl border border-white object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border border-white bg-white/70 text-2xl font-semibold flex items-center justify-center">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Staff Profile</p>
                <h1 className="text-3xl font-semibold">{displayName}</h1>
                <p className="text-slate-600 mt-1">{displayEmail}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {displayRole}
              </span>
              <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {department}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4 text-sm">
              <div>
                <label htmlFor="profilePhoto" className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Upload Profile Photo
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                {photoStatus ? (
                  <p
                    className={`mt-3 rounded-xl px-3 py-2 text-xs ${
                      photoStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {photoStatus.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="username" className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              {profile?.staff?.id ? (
                <div>
                  <label htmlFor="staffName" className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                    Full Name
                  </label>
                  <input
                    id="staffName"
                    name="staffName"
                    value={profileForm.staffName}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                  />
                </div>
              ) : null}
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              {profileStatus ? (
                <p
                  className={`rounded-xl px-3 py-2 text-xs ${
                    profileStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {profileStatus.message}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 text-sm">
              <div>
                <label htmlFor="currentPassword" className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
              </div>
              {passwordStatus ? (
                <p
                  className={`rounded-xl px-3 py-2 text-xs ${
                    passwordStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {passwordStatus.message}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Support & Tasks</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Upcoming Meetings</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">0 scheduled</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Attendance</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">All caught up</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Open Help Desk
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
