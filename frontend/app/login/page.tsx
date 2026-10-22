"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // Mobile tab switcher state ('credentials' or 'otp')
  const [activeTab, setActiveTab] = useState<'credentials' | 'otp'>('credentials');

  // State for Credentials Login
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State for Mobile OTP Login
  const [mobileNumber, setMobileNumber] = useState('');

  // General UI States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Credentials Submit
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please enter your email/phone and password.');
      return;
    }

    setLoading(true);

    // Simulate Auth Success (Day 4 Task requirement)[cite: 3]
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('token', 'mock-jwt-token-12345');
      alert('Login successful!');
      router.push('/');
    }, 1000);
  };

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mobileNumber) {
      setError('Please enter your mobile number.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert(`OTP sent to ${mobileNumber}!`);
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-6">
        
        {/* Header Icon + Title */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Signin</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Access your account securely</p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* MOBILE TAB SWITCHER (Only visible on small screens to prevent long vertical scrolling) */}
        <div className="flex md:hidden bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'credentials' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Credentials
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('otp')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'otp' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Mobile OTP
          </button>
        </div>

        {/* DESKTOP SIDE-BY-SIDE GRID / MOBILE TABBED VIEW */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Column: Login with Mobile Number */}
          <div className={`bg-gray-50/80 p-5 sm:p-8 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4 ${
            activeTab === 'otp' ? 'block' : 'hidden md:flex'
          }`}>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4">Login With Mobile Number</h2>
              
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="01**********"
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 text-sm disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </div>
          </div>

          {/* Desktop "OR" Center Divider */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
            <div className="w-px h-full bg-gray-200"></div>
            <div className="absolute bg-white border border-gray-200 text-gray-400 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
              OR
            </div>
          </div>

          {/* Right Column: Login with Credentials */}
          <div className={`bg-gray-50/80 p-5 sm:p-8 rounded-2xl border border-gray-100 space-y-4 ${
            activeTab === 'credentials' ? 'block' : 'hidden md:block'
          }`}>
            <h2 className="text-sm sm:text-base font-bold text-gray-800">Login With Credentials</h2>

            <form onSubmit={handleCredentialsLogin} className="space-y-3.5">
              {/* Email / Phone Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or phone number"
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-gray-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link href="#" className="text-orange-500 font-semibold hover:underline">
                  Forgotten password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 text-sm disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>

        </div>

        {/* Footer Social Login + Register Link */}
        <div className="pt-4 border-t border-gray-100 flex flex-col items-center space-y-3">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or signin with</span>
          
          <button
            onClick={() => alert("Google Sign-In clicked")}
            className="p-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </button>

          <p className="text-xs sm:text-sm text-gray-600 font-medium pt-1">
            Dont have any account?{' '}
            <Link href="/register" className="text-orange-500 font-bold hover:underline">
              Register account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}