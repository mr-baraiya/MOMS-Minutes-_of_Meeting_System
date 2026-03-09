'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with error handling
if (typeof window !== 'undefined') {
  try {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID!);
  } catch (error) {
    console.warn('EmailJS initialization failed:', error);
  }
}

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    phone: '',
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
      from_name: user.staff?.name || user.username || prev.from_name,
      from_email: user.email || prev.from_email,
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

    if (!formData.from_name.trim()) nextErrors.from_name = 'Full name is required.';
    if (!formData.from_email.trim()) nextErrors.from_email = 'Email is required.';
    if (!formData.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) nextErrors.message = 'Message is required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.from_email && !emailRegex.test(formData.from_email)) {
      nextErrors.from_email = 'Enter a valid email address.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    try {
      // Send email via EmailJS with better error handling
      console.log('Sending email via EmailJS...');
      
      // Ensure EmailJS is properly initialized
      if (typeof window === 'undefined') {
        throw new Error('EmailJS can only be used in browser environment');
      }

      const emailjsResult = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.from_name,
          from_email: formData.from_email,
          phone: formData.phone || 'Not provided',
          subject: `[${formData.category}] ${formData.subject}`,
          message: formData.message,
          email: formData.from_email, // Additional mapping for template compatibility
        },
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_USER_ID!,
          // Disable any unload event handling
          limitRate: {
            id: 'contact_form',
            throttle: 10000, // Once per 10 seconds
          }
        }
      );
      
      console.log('EmailJS Response:', emailjsResult);
      
      if (emailjsResult.status !== 200) {
        throw new Error('Failed to send email');
      }

      // Also log to our API for record keeping (optional)
      try {
        await fetch('/api/support-tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            from_name: formData.from_name,
            from_email: formData.from_email,
            phone: formData.phone,
            category: formData.category,
            subject: `[${formData.category}] ${formData.subject}`,
            message: formData.message,
          }),
        });
        console.log('Message logged to API successfully');
      } catch (apiError) {
        console.warn('Failed to log to API, but email was sent:', apiError);
      }

      setSuccessMessage('Your message has been sent successfully! Our team will respond within 24 hours.');
      setFormData((prev) => ({
        ...prev,
        subject: '',
        message: '',
        phone: '',
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
          <label htmlFor="from_name" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="from_name"
            name="from_name"
            value={formData.from_name}
            onChange={handleChange}
            readOnly={!!user}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.from_name ? 'border-red-400' : 'border-gray-300'
            } ${user ? 'bg-gray-50' : ''}`}
            placeholder="John Doe"
            disabled={loading}
          />
          {errors.from_name && <p className="mt-2 text-xs text-red-600">{errors.from_name}</p>}
        </div>

        <div>
          <label htmlFor="from_email" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="from_email"
            name="from_email"
            value={formData.from_email}
            onChange={handleChange}
            readOnly={!!user}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.from_email ? 'border-red-400' : 'border-gray-300'
            } ${user ? 'bg-gray-50' : ''}`}
            placeholder="john@example.com"
            disabled={loading}
          />
          {errors.from_email && <p className="mt-2 text-xs text-red-600">{errors.from_email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Phone Number <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="+1 (555) 123-4567"
            disabled={loading}
          />
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
            <option value="MEETING_ISSUE">Meeting Issues</option>
            <option value="ACCESS_LOGIN">Access / Login Problems</option>
            <option value="DOCUMENTS_MOM">Documents / Minutes</option>
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
