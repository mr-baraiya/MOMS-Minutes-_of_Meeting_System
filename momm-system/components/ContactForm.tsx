'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'MEETING_ISSUE',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: user.staff?.name || user.username || prev.name,
      email: user.email || prev.email,
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    setSubmitError('');

    const nextErrors: Record<string, string> = {};

    if (!formData.name.trim()) nextErrors.name = 'Full name is required.';
    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    if (!formData.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) nextErrors.message = 'Message is required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category: formData.category,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send message. Please try again later.');
      }

      setSuccessMessage('Your message has been sent. Our team will respond within 24 hours.');
      setFormData((prev) => ({
        ...prev,
        subject: '',
        message: '',
        category: 'MEETING_ISSUE',
      }));
    } catch (err) {
      console.error('Failed to send message:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!!user}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? 'border-red-400' : 'border-gray-300'
            } ${user ? 'bg-gray-50' : ''}`}
            placeholder="John Doe"
            disabled={loading}
          />
          {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!!user}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            } ${user ? 'bg-gray-50' : ''}`}
            placeholder="john@example.com"
            disabled={loading}
          />
          {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={loading}
          >
            <option value="MEETING_ISSUE">Meeting issue</option>
            <option value="ACCESS_LOGIN">Access / Login</option>
            <option value="DOCUMENTS_MOM">Documents / MOM</option>
            <option value="REPORTS">Reports</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.subject ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="How can we help?"
            disabled={loading}
          />
          {errors.subject && <p className="mt-2 text-xs text-red-600">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
              errors.message ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="Tell us more about your inquiry..."
            disabled={loading}
          />
          {errors.message && <p className="mt-2 text-xs text-red-600">{errors.message}</p>}
        </div>

        {submitError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </p>
        )}
        {successMessage && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}
