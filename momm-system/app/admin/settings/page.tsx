'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Toast from '@/components/common/Toast';
import { useState, useEffect } from 'react';
import { User, Lock, Shield, Mail, Settings as SettingsIcon, Bell, Monitor, Key } from 'lucide-react';

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed';
const labelCls = 'block mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500';
const saveBtnCls =
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition active:scale-95';

export default function AdminSettingsPage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [activeTab, setActiveTab] = useState('profile');
  const [settingsData, setSettingsData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const profile = authUser || user;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettingsData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const saveSettings = async (section: string, data: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
      if (response.ok) {
        setToast({ message: 'Settings saved successfully!', type: 'success' });
        fetchSettings();
      } else {
        setToast({ message: 'Failed to save settings', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settingsData) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'profile',  label: 'Profile',  icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email',    label: 'Email',    icon: Mail },
    { id: 'system',   label: 'System',   icon: SettingsIcon },
  ];

  return (
    <DashboardLayout role="admin">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="space-y-6 pb-8">
        {/* â”€â”€ Hero Header â”€â”€ */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-10 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-6 w-40 h-40 rounded-full bg-black/10 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
              <SettingsIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
              <p className="text-blue-100 mt-1 text-sm">Manage your preferences and system configuration</p>
            </div>
          </div>
        </div>

        {/* â”€â”€ Tab Navigation â”€â”€ */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* â”€â”€ Content Panel â”€â”€ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {activeTab === 'profile'  && <ProfileSection  data={settingsData.profile}         onSave={saveSettings} />}
          {activeTab === 'security' && <SecuritySection data={settingsData.securitySettings} onSave={saveSettings} />}
          {activeTab === 'email'    && <EmailSection    data={settingsData.emailSettings}    onSave={saveSettings} />}
          {activeTab === 'system'   && <SystemSection   data={settingsData.systemSettings}   onSave={saveSettings} />}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Profile Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ProfileSection({ data, onSave }: any) {
  const [formData, setFormData] = useState({ name: '', mobile: '', profilePicture: '' });

  return (
    <div className="space-y-8">
      {/* Section title */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-lg">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
          <p className="text-xs text-gray-500">Update your display name and contact info</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Username</label>
          <input type="text" value={data.username} disabled className={inputCls} />
          <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input type="email" value={data.email} disabled className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={data.staff?.staffName || 'Enter your name'}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Mobile Number</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder={data.staff?.mobileNo || 'Enter mobile number'}
            className={inputCls}
          />
        </div>
      </div>

      <button onClick={() => onSave('profile', formData)} className={saveBtnCls}>
        <User className="w-4 h-4" /> Save Profile
      </button>

      <div className="border-t border-gray-100 pt-8">
        <PasswordChangeSection onSave={onSave} />
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Password Sub-section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function PasswordChangeSection({ onSave }: any) {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const handlePasswordChange = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    onSave('password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Key className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
          <p className="text-xs text-gray-500">Keep your account secure with a strong password</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelCls}>Current Password</label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>New Password</label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>

      <button onClick={handlePasswordChange} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition active:scale-95">
        <Lock className="w-4 h-4" /> Update Password
      </button>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Toggle Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function SettingRow({ title, desc, checked, onChange }: { title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Security Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SecuritySection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
          <p className="text-xs text-gray-500">Configure authentication and session policies</p>
        </div>
      </div>

      <div className="space-y-3">
        <SettingRow
          title="Require Strong Passwords"
          desc="Enforce password complexity requirements for all users"
          checked={settings.requireStrongPasswords}
          onChange={(v) => setSettings({ ...settings, requireStrongPasswords: v })}
        />
        <SettingRow
          title="Auto Logout on Inactivity"
          desc="Automatically log out users after a period of inactivity"
          checked={settings.autoLogoutInactivity}
          onChange={(v) => setSettings({ ...settings, autoLogoutInactivity: v })}
        />
      </div>

      <div className="max-w-xs">
        <label className={labelCls}>Session Timeout (minutes)</label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
          className={inputCls}
        />
      </div>

      <button onClick={() => onSave('security', settings)} className={saveBtnCls}>
        <Shield className="w-4 h-4" /> Save Security Settings
      </button>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Email Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function EmailSection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-sky-50 rounded-lg">
          <Mail className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Email / Notification Settings</h2>
          <p className="text-xs text-gray-500">Control how and when emails are sent from the system</p>
        </div>
      </div>

      <div className="max-w-sm">
        <label className={labelCls}>SMTP Sender Name</label>
        <input
          type="text"
          value={settings.smtpSenderName}
          onChange={(e) => setSettings({ ...settings, smtpSenderName: e.target.value })}
          className={inputCls}
        />
      </div>

      <div className="space-y-3">
        <SettingRow
          title="Enable Email Notifications"
          desc="System-wide email notifications for all users"
          checked={settings.enableEmailNotifications}
          onChange={(v) => setSettings({ ...settings, enableEmailNotifications: v })}
        />
        <SettingRow
          title="Meeting Reminder Emails"
          desc="Send automatic reminders before scheduled meetings"
          checked={settings.meetingReminderEmails}
          onChange={(v) => setSettings({ ...settings, meetingReminderEmails: v })}
        />
        <SettingRow
          title="MOM Upload Notifications"
          desc="Notify members when minutes of meeting are uploaded"
          checked={settings.momUploadNotifications}
          onChange={(v) => setSettings({ ...settings, momUploadNotifications: v })}
        />
      </div>

      <button onClick={() => onSave('email', settings)} className={saveBtnCls}>
        <Bell className="w-4 h-4" /> Save Email Settings
      </button>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ System Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SystemSection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-violet-50 rounded-lg">
          <Monitor className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">System Settings</h2>
          <p className="text-xs text-gray-500">Global defaults for meetings and file handling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Default Meeting Duration (minutes)</label>
          <input
            type="number"
            value={settings.defaultMeetingDuration}
            onChange={(e) => setSettings({ ...settings, defaultMeetingDuration: parseInt(e.target.value) })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Default Meeting Type</label>
          <input
            type="text"
            value={settings.defaultMeetingType}
            onChange={(e) => setSettings({ ...settings, defaultMeetingType: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>File Upload Size Limit (MB)</label>
          <input
            type="number"
            value={settings.fileUploadSizeLimit}
            onChange={(e) => setSettings({ ...settings, fileUploadSizeLimit: parseInt(e.target.value) })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Allowed File Formats</label>
          <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-10">
            {settings.allowedFileFormats.map((fmt: string) => (
              <span key={fmt} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => onSave('system', settings)} className={saveBtnCls}>
        <Monitor className="w-4 h-4" /> Save System Settings
      </button>
    </div>
  );
}

