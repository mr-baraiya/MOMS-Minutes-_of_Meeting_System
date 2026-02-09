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

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Sora:wght@400;500;600&display=swap');
        .admin-profile {
          --ink: #0f172a;
          --muted: #6b7280;
          --paper: #ffffff;
          --line: #e5e7eb;
          --gold: #c08b2d;
          --gold-soft: #f7efe2;
          --shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
          --shadow-soft: 0 18px 40px rgba(15, 23, 42, 0.08);
          position: relative;
          font-family: 'Sora', sans-serif;
          color: var(--ink);
          padding: 8px;
        }
        .admin-profile::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(900px 420px at 6% -10%, #f6efe3 0%, rgba(246, 239, 227, 0) 60%),
            radial-gradient(700px 420px at 100% 0%, #ede7dc 0%, rgba(237, 231, 220, 0) 55%),
            #f6f7f9;
          border-radius: 28px;
          z-index: 0;
        }
        .admin-shell {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero-card {
          position: relative;
          overflow: hidden;
          border-radius: 26px;
          padding: 28px;
          background: linear-gradient(120deg, #0b1324 0%, #131b2a 50%, #2c2a23 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: var(--shadow);
          color: #f8fafc;
        }
        .hero-card::after {
          content: '';
          position: absolute;
          right: -120px;
          top: -160px;
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(192, 139, 45, 0.45), rgba(192, 139, 45, 0));
          opacity: 0.7;
        }
        .hero-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .hero-identity {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .hero-avatar {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          color: #f8fafc;
        }
        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 3vw, 36px);
          letter-spacing: 0.02em;
        }
        .hero-eyebrow {
          font-size: 11px;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: rgba(248, 250, 252, 0.7);
        }
        .hero-email {
          font-size: 14px;
          color: rgba(248, 250, 252, 0.75);
        }
        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .hero-pill {
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(248, 250, 252, 0.85);
          background: rgba(255, 255, 255, 0.05);
        }
        .hero-pill--solid {
          border-color: rgba(192, 139, 45, 0.65);
          background: rgba(192, 139, 45, 0.25);
          color: #fef6e7;
        }
        .hero-strip {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 12px 16px;
        }
        .strip-label {
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(248, 250, 252, 0.6);
        }
        .strip-value {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 600;
        }
        .admin-grid {
          display: grid;
          gap: 24px;
        }
        .admin-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .admin-aside {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .panel {
          border-radius: 22px;
          background: var(--paper);
          border: 1px solid var(--line);
          padding: 22px;
          box-shadow: var(--shadow-soft);
        }
        .panel-accent {
          background: var(--gold-soft);
          border-color: #f0dfc2;
        }
        .panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          letter-spacing: 0.02em;
        }
        .panel-subtitle {
          margin-top: 6px;
          font-size: 13px;
          color: var(--muted);
        }
        .form-label {
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #94a3b8;
        }
        .form-input {
          margin-top: 8px;
          width: 100%;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          padding: 10px 12px;
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .form-input:focus {
          outline: none;
          border-color: rgba(192, 139, 45, 0.7);
          box-shadow: 0 0 0 3px rgba(192, 139, 45, 0.15);
        }
        .btn-outline {
          border-radius: 999px;
          border: 1px solid #cbd5f5;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          transition: border-color 200ms ease, background 200ms ease;
        }
        .btn-outline:hover {
          border-color: #0f172a;
          background: #f8fafc;
        }
        .btn-primary {
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #f8fafc;
          background: #0f172a;
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.2);
        }
        .alert {
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
        }
        .alert-success {
          background: #ecfdf3;
          color: #0f7a46;
        }
        .alert-error {
          background: #fff1f2;
          color: #b42318;
        }
        .fade-rise {
          opacity: 0;
          animation: riseIn 650ms ease forwards;
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 1024px) {
          .admin-grid {
            grid-template-columns: 2.1fr 1fr;
            align-items: start;
          }
        }
      `}</style>

      <div className="admin-profile">
        <div className="admin-shell">
          <header className="hero-card fade-rise">
            <div className="hero-top">
              <div className="hero-identity">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={`${displayName} profile`}
                    className="hero-avatar"
                  />
                ) : (
                  <div className="hero-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
                )}
                <div>
                  <p className="hero-eyebrow">Administrator Profile</p>
                  <h1 className="hero-name">{displayName}</h1>
                  <p className="hero-email">{displayEmail}</p>
                </div>
              </div>
              <div className="hero-tags">
                <span className="hero-pill hero-pill--solid">{displayRole}</span>
                <span className="hero-pill">{department}</span>
              </div>
            </div>
            <div className="hero-strip">
              <div>
                <p className="strip-label">Status</p>
                <p className="strip-value">Active</p>
              </div>
              <div>
                <p className="strip-label">Account Role</p>
                <p className="strip-value">Administrator</p>
              </div>
              <div>
                <p className="strip-label">Department</p>
                <p className="strip-value">{department}</p>
              </div>
            </div>
          </header>

          <div className="admin-grid">
            <div className="admin-main">
              <section className="panel fade-rise">
                <h2 className="panel-title">Edit Profile</h2>
                <p className="panel-subtitle">Keep your identity details current for system records.</p>
                <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4 text-sm">
                  <div>
                    <label htmlFor="profilePhoto" className="form-label">
                      Upload Profile Photo
                    </label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="btn-outline disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {uploadingPhoto ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                    {photoStatus ? (
                      <p
                        className={`alert mt-3 ${
                          photoStatus.type === 'success' ? 'alert-success' : 'alert-error'
                        }`}
                      >
                        {photoStatus.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                  {profile?.staff?.id ? (
                    <div>
                      <label htmlFor="staffName" className="form-label">
                        Full Name
                      </label>
                      <input
                        id="staffName"
                        name="staffName"
                        value={profileForm.staffName}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                    </div>
                  ) : null}
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                  {profileStatus ? (
                    <p
                      className={`alert ${
                        profileStatus.type === 'success' ? 'alert-success' : 'alert-error'
                      }`}
                    >
                      {profileStatus.message}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-outline w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </section>

              <section className="panel fade-rise">
                <h2 className="panel-title">Change Password</h2>
                <p className="panel-subtitle">Rotate credentials regularly to stay compliant.</p>
                <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4 text-sm">
                  <div>
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                    />
                  </div>
                  {passwordStatus ? (
                    <p
                      className={`alert ${
                        passwordStatus.type === 'success' ? 'alert-success' : 'alert-error'
                      }`}
                    >
                      {passwordStatus.message}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </section>
            </div>

            <aside className="admin-aside">
              <section className="panel panel-accent fade-rise">
                <h2 className="panel-title">Access Summary</h2>
                <p className="panel-subtitle">Your authority footprint across the system.</p>
                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center justify-between">
                    <span>System Control</span>
                    <span className="text-amber-700 font-semibold">Full</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>User Management</span>
                    <span className="text-emerald-700 font-semibold">Enabled</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Report Access</span>
                    <span className="text-emerald-700 font-semibold">Enabled</span>
                  </li>
                </ul>
                <div className="mt-5 rounded-2xl border border-amber-200 bg-white/70 p-4 text-sm text-amber-900">
                  You hold administrator privileges across all departments and meetings.
                </div>
              </section>

              <section className="panel fade-rise">
                <h2 className="panel-title">Security Notes</h2>
                <p className="panel-subtitle">Recommended actions for administrators.</p>
                <div className="mt-5 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Last credential check</span>
                    <span className="font-semibold text-slate-900">Today</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session status</span>
                    <span className="font-semibold text-emerald-700">Secure</span>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Tip: update your password every 90 days and keep recovery email current.
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
