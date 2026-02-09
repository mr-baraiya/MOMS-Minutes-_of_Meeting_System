'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ConvenerProfilePage() {
  const { user: authUser, token, refreshUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['convener'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Convener';
  const displayEmail = profile?.email || 'convener@example.com';
  const displayRole = profile?.role || 'convener';
  const department = profile?.staff?.department || 'Operations';
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
          'Content-Type': 'application/json',
          ...authHeaders,
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
      <DashboardLayout role="convener">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="convener">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        .convener-profile {
          font-family: 'DM Sans', sans-serif;
        }
        .convener-profile h1,
        .convener-profile h2,
        .convener-profile h3 {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.08em;
        }
        .convener-rise {
          animation: convenerRise 700ms ease forwards;
        }
        @keyframes convenerRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="convener-profile space-y-8">
        <div className="relative overflow-hidden rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-8 text-white convener-rise">
          <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-teal-400/30 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl"></div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${displayName} profile`}
                  className="h-20 w-20 rounded-3xl border border-white/30 object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-3xl border border-white/30 bg-white/10 text-3xl font-semibold flex items-center justify-center">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-100">Meeting Convener</p>
                <h1 className="text-4xl">{displayName}</h1>
                <p className="text-emerald-100/80 mt-1">{displayEmail}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {displayRole}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {department}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="grid grid-cols-1 gap-6">
            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl text-emerald-900">Your Mission</h2>
              <p className="mt-3 text-sm text-slate-600">
                Lead meeting planning, document capture, and participant alignment with a focus on momentum.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Active Meetings', value: '0' },
                  { label: 'Pending Docs', value: '0' },
                  { label: 'Participants', value: '0' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl text-emerald-900">Edit Profile</h2>
              <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4 text-sm">
                <div>
                  <label htmlFor="profilePhoto" className="block text-xs uppercase tracking-[0.2em] text-emerald-700">
                    Upload Profile Photo
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="rounded-full border border-emerald-900 px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
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
                  <label htmlFor="username" className="block text-xs uppercase tracking-[0.2em] text-emerald-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                {profile?.staff?.id ? (
                  <div>
                    <label htmlFor="staffName" className="block text-xs uppercase tracking-[0.2em] text-emerald-700">
                      Full Name
                    </label>
                    <input
                      id="staffName"
                      name="staffName"
                      value={profileForm.staffName}
                      onChange={handleProfileChange}
                      className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                ) : null}
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-emerald-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none"
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
                  className="w-full rounded-full border border-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl text-emerald-900">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 text-sm">
                <div>
                  <label htmlFor="currentPassword" className="block text-xs uppercase tracking-[0.2em] text-emerald-700">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-xs uppercase tracking-[0.2em] text-emerald-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-[0.2em] text-emerald-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none"
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
                  className="w-full rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </section>
          </div>

          <aside className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-white p-6 shadow-sm">
            <h2 className="text-2xl text-emerald-900">Meeting Pulse</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Next Agenda Review', value: 'Schedule a review' },
                { label: 'Document Uploads', value: 'Keep MOMs updated' },
                { label: 'Team Touchpoints', value: 'Reach out to participants' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-emerald-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              Start Planning
            </button>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
