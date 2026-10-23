import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/common/BrandLogo';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn, FiArrowLeft, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * Admin Login Page
 * Styled in Earthy Forest & Outdoor Green theme
 */
const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: 'admin', password: 'Admin@2024' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    try {
      await login({ username: 'admin', password: 'Admin@2024' });
      toast.success('Welcome back, Admin (Direct Access)!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Login error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(form);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 selection:bg-emerald-500 selection:text-white overflow-hidden">
      {/* Admin Portal Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/admin-portal-bg.webp"
          alt="Admin Portal Background"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        />
        {/* Modern Light Green & Frosted Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/75 to-teal-950/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-emerald-950/80" />
      </div>

      {/* Ambient Light Green Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-green-300/15 blur-3xl pointer-events-none z-0" />

      {/* Top Bar */}
      <div className="relative z-10 max-w-md w-full mx-auto pt-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100 hover:text-white bg-black/30 hover:bg-black/50 px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-sm transition-all"
        >
          <FiArrowLeft className="w-4 h-4 text-emerald-300" />
          <span>Back to TripEasy</span>
        </Link>
        <span className="text-xs text-emerald-200 font-mono flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <FiShield className="w-3.5 h-3.5 text-emerald-400" /> Secure Admin Portal
        </span>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-200/90 ring-1 ring-emerald-500/20">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 px-8 py-8 text-center text-white relative overflow-hidden">
            {/* Header Ambient Texture */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-2">
                <BrandLogo size="lg" variant="light" showTagline={false} to={null} />
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
                Admin Management Portal
              </h1>
              <p className="text-xs text-emerald-200/90 mt-1 max-w-xs font-medium">
                Manage attractions, update categories, and curate day-trip tourism
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white/60">
            {errors.general && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            <div>
              <label className="label">Admin Username</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4" />
                <input
                  type="text"
                  placeholder="e.g. admin"
                  value={form.username}
                  onChange={(e) => {
                    setForm({ ...form, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: null });
                  }}
                  className={`input pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 ${errors.username ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  className={`input pl-10 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-700 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-sm mt-2 shadow-lg shadow-emerald-600/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FiLogIn className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </div>
              )}
            </button>

            {/* Default credentials tip & 1-click bypass */}
            <div className="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-center space-y-2">
              <p className="text-[12px] text-emerald-950">
                Hardcoded Admin: <strong className="text-emerald-900 font-mono font-bold">admin</strong> /{' '}
                <strong className="text-emerald-900 font-mono font-bold">Admin@2024</strong>
              </p>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5"
              >
                <span>⚡ Instant Access (No DB Required)</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-6 text-xs text-emerald-100/70">
        <p>© {new Date().getFullYear()} TripEasy — Gampaha District Tourism Management</p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
