'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff, Lock, User, Mail, Building2, Users, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STAFF' as 'ADMIN' | 'CONVENER' | 'STAFF',
    staffName: '',
    departmentId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      const result = await response.json();
      if (result.success) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validations
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in username, email, password, and confirm password.',
        confirmButtonColor: '#1d4ed8',
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        confirmButtonColor: '#1d4ed8',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords Do Not Match',
        text: 'Please ensure both password fields match.',
        confirmButtonColor: '#1d4ed8',
      });
      return;
    }

    if (!termsAccepted) {
      Swal.fire({
        icon: 'warning',
        title: 'Terms Required',
        text: 'Please agree to the Terms of Service and Privacy Policy to continue.',
        confirmButtonColor: '#1d4ed8',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role.toLowerCase() as 'admin' | 'convener' | 'staff',
        staffName: formData.staffName || undefined,
        departmentId: formData.departmentId ? parseInt(formData.departmentId, 10) : undefined,
      });
      Swal.fire({
        icon: 'success',
        title: 'Account Created',
        text: 'Your account has been created successfully. Please login to continue.',
        confirmButtonColor: '#1d4ed8',
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err?.message || 'Registration failed. Please try again.',
        confirmButtonColor: '#1d4ed8',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white border-2 border-gray-300 p-8">
          {/* Back to Home */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-700 text-white mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ACCOUNT REGISTRATION</h1>
            <p className="text-gray-600">Minutes of Meeting Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                    placeholder="Choose username"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role - Hidden, all users register as staff */}
            {/* Admin can change roles later through user management */}

            {/* Staff Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Staff Name */}
              <div>
                <label htmlFor="staffName" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="staffName"
                    name="staffName"
                    type="text"
                    autoComplete="name"
                    value={formData.staffName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors appearance-none"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start p-4 bg-blue-50 border-2 border-blue-200">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-700 focus:ring-blue-700 border-gray-300 mt-0.5 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-700 cursor-pointer select-none">
                I agree to the{' '}
                <Link 
                  href="/terms" 
                  target="_blank"
                  className="text-blue-700 hover:text-blue-800 font-medium underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link 
                  href="/privacy" 
                  target="_blank"
                  className="text-blue-700 hover:text-blue-800 font-medium underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border-2 border-blue-700 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center py-3 px-4 border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-medium transition-colors uppercase tracking-wide"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
