'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Toast from '@/components/common/Toast';
import { useState, useEffect } from 'react';
import { User, Lock, Shield, Mail, Settings as SettingsIcon } from 'lucide-react';

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
      console.error('Failed to save settings:', error);
      setToast({ message: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settingsData) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'system', label: 'System Settings', icon: SettingsIcon },
  ];

  return (
    <DashboardLayout role="admin">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-amber-900 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-200 mt-2">Manage your preferences and system configuration</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'profile' && <ProfileSection data={settingsData.profile} onSave={saveSettings} />}
          {activeTab === 'security' && <SecuritySection data={settingsData.securitySettings} onSave={saveSettings} />}
          {activeTab === 'email' && <EmailSection data={settingsData.emailSettings} onSave={saveSettings} />}
          {activeTab === 'system' && <SystemSection data={settingsData.systemSettings} onSave={saveSettings} />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfileSection({ data, onSave }: any) {
  const [formData, setFormData] = useState({ name: '', mobile: '', profilePicture: '' });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Profile Settings</h2>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input type="text" value={data.username} disabled className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100" />
          <p className="text-xs text-slate-500 mt-1">Username cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" value={data.email} disabled className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={data.staff?.staffName || 'Enter your name'}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder={data.staff?.mobileNo || 'Enter mobile number'}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
      </div>

      <button
        onClick={() => onSave('profile', formData)}
        className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
      >
        Save Profile
      </button>

      <hr className="my-6" />

      <PasswordChangeSection onSave={onSave} />
    </div>
  );
}

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
    <div className="space-y-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h3 className="text-xl font-semibold">Change Password</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
        <input
          type="password"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
        <input
          type="password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
        <input
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md"
        />
      </div>

      <button
        onClick={handlePasswordChange}
        className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
      >
        Change Password
      </button>
    </div>
  );
}

function SecuritySection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Security Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">Require Strong Passwords</h3>
            <p className="text-sm text-slate-600">Enforce password complexity requirements for all users</p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireStrongPasswords}
            onChange={(e) => setSettings({ ...settings, requireStrongPasswords: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">Auto Logout on Inactivity</h3>
            <p className="text-sm text-slate-600">Automatically log out users after period of inactivity</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoLogoutInactivity}
            onChange={(e) => setSettings({ ...settings, autoLogoutInactivity: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
      </div>

      <button
        onClick={() => onSave('security', settings)}
        className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
      >
        Save Security Settings
      </button>
    </div>
  );
}

function EmailSection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Email / Notification Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Sender Name</label>
          <input
            type="text"
            value={settings.smtpSenderName}
            onChange={(e) => setSettings({ ...settings, smtpSenderName: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">Enable Email Notifications</h3>
            <p className="text-sm text-slate-600">System-wide email notifications</p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableEmailNotifications}
            onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">Meeting Reminder Emails</h3>
            <p className="text-sm text-slate-600">Send reminders before meetings</p>
          </div>
          <input
            type="checkbox"
            checked={settings.meetingReminderEmails}
            onChange={(e) => setSettings({ ...settings, meetingReminderEmails: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">MOM Upload Notifications</h3>
            <p className="text-sm text-slate-600">Notify when minutes are uploaded</p>
          </div>
          <input
            type="checkbox"
            checked={settings.momUploadNotifications}
            onChange={(e) => setSettings({ ...settings, momUploadNotifications: e.target.checked })}
            className="w-5 h-5"
          />
        </div>
      </div>

      <button
        onClick={() => onSave('email', settings)}
        className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
      >
        Save Email Settings
      </button>
    </div>
  );
}

function SystemSection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">System Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Meeting Duration (minutes)</label>
          <input
            type="number"
            value={settings.defaultMeetingDuration}
            onChange={(e) => setSettings({ ...settings, defaultMeetingDuration: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Meeting Type</label>
          <input
            type="text"
            value={settings.defaultMeetingType}
            onChange={(e) => setSettings({ ...settings, defaultMeetingType: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">File Upload Size Limit (MB)</label>
          <input
            type="number"
            value={settings.fileUploadSizeLimit}
            onChange={(e) => setSettings({ ...settings, fileUploadSizeLimit: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Allowed File Formats</label>
          <div className="text-sm text-slate-600 p-3 bg-slate-50 border border-slate-200 rounded-md">
            {settings.allowedFileFormats.join(', ')}
          </div>
        </div>
      </div>

      <button
        onClick={() => onSave('system', settings)}
        className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
      >
        Save System Settings
      </button>
    </div>
  );
}
