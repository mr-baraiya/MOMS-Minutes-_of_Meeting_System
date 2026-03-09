'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Toast from '@/components/common/Toast';
import { useState, useEffect } from 'react';
import { User, Bell, Calendar } from 'lucide-react';

export default function ConvenerSettingsPage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['convener'] });
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
      <DashboardLayout role="convener">
        <div className="flex items-center justify-center h-full">
          <div
            style={{ animation: 'spin 1s linear infinite' }}
            className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
          />
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'meeting-preferences', label: 'Meeting Preferences', icon: Calendar },
  ];

  return (
    <DashboardLayout role="convener">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-blue-700 text-white p-6 border-2 border-blue-800">
          <h1 className="text-3xl font-bold uppercase tracking-wide">Settings</h1>
          <p className="text-blue-100 mt-2">Manage your preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-700 text-blue-700 bg-blue-50 font-semibold uppercase tracking-wide'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="bg-white p-6 border-2 border-gray-300">
          {activeTab === 'profile' && <ProfileSection data={settingsData.profile} onSave={saveSettings} />}
          {activeTab === 'notifications' && <NotificationsSection data={settingsData.notificationPreferences} onSave={saveSettings} />}
          {activeTab === 'meeting-preferences' && <MeetingPreferencesSection data={settingsData.meetingPreferences} onSave={saveSettings} />}
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
        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
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
        className="px-6 py-2 bg-emerald-900 text-white rounded-md hover:bg-emerald-800"
      >
        Change Password
      </button>
    </div>
  );
}

function NotificationsSection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Notification Preferences</h2>
      <p className="text-sm text-slate-600">Control how you get notified about meetings and events</p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">Email Reminders</h3>
            <p className="text-sm text-slate-600">Receive email reminders for upcoming meetings</p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailReminders}
            onChange={(e) => setSettings({ ...settings, emailReminders: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">SMS Notifications</h3>
            <p className="text-sm text-slate-600">Get SMS alerts for critical updates</p>
          </div>
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">Participant Confirmation</h3>
            <p className="text-sm text-slate-600">Notify when participants confirm attendance</p>
          </div>
          <input
            type="checkbox"
            checked={settings.participantConfirmation}
            onChange={(e) => setSettings({ ...settings, participantConfirmation: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">Attendance Submission Reminders</h3>
            <p className="text-sm text-slate-600">Remind to submit attendance after meetings</p>
          </div>
          <input
            type="checkbox"
            checked={settings.attendanceSubmissionReminders}
            onChange={(e) => setSettings({ ...settings, attendanceSubmissionReminders: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md">
          <div>
            <h3 className="font-medium">MOM Upload Confirmation</h3>
            <p className="text-sm text-slate-600">Confirm when minutes of meeting are uploaded</p>
          </div>
          <input
            type="checkbox"
            checked={settings.momUploadConfirmation}
            onChange={(e) => setSettings({ ...settings, momUploadConfirmation: e.target.checked })}
            className="w-5 h-5"
          />
        </div>
      </div>

      <button
        onClick={() => onSave('notifications', settings)}
        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
      >
        Save Notification Preferences
      </button>
    </div>
  );
}

function MeetingPreferencesSection({ data, onSave }: any) {
  const [settings, setSettings] = useState(data);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Meeting Preferences</h2>
      <p className="text-sm text-slate-600">Set default values for creating new meetings</p>
      
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Meeting Type</label>
          <select
            value={settings.preferredMeetingType}
            onChange={(e) => setSettings({ ...settings, preferredMeetingType: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          >
            <option value="Team Meeting">Team Meeting</option>
            <option value="General Meeting">General Meeting</option>
            <option value="Board Meeting">Board Meeting</option>
            <option value="Review Meeting">Review Meeting</option>
            <option value="Planning Meeting">Planning Meeting</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Venue Type</label>
          <select
            value={settings.defaultVenueType}
            onChange={(e) => setSettings({ ...settings, defaultVenueType: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          >
            <option value="Physical">Physical</option>
            <option value="Virtual">Virtual</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => onSave('meeting-preferences', settings)}
        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
      >
        Save Meeting Preferences
      </button>
    </div>
  );
}
