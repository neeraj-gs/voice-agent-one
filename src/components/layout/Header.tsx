/**
 * Header Component
 * App header with business switcher and user menu
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Zap,
  ChevronDown,
  Plus,
  Building2,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  Phone,
  Globe,
  Check,
} from 'lucide-react';
import { useAuthStore, useProfile } from '../../stores/authStore';
import { useBusinessStore, useActiveBusiness, useBusinesses } from '../../stores/businessStore';
import { useConfigStore } from '../../stores/configStore';
import { cn } from '../../utils/cn';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuthStore();
  const profile = useProfile();
  const activeBusiness = useActiveBusiness();
  const businesses = useBusinesses();
  const { setActiveBusiness, getActiveBusinessConfig } = useBusinessStore();
  const { setBusinessConfig } = useConfigStore();

  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const businessMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (businessMenuRef.current && !businessMenuRef.current.contains(event.target as Node)) {
        setShowBusinessMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBusinessSwitch = async (businessId: string) => {
    if (user) {
      await setActiveBusiness(user.id, businessId);
      // Sync to localStorage for LandingPage compatibility
      const config = getActiveBusinessConfig();
      if (config) {
        setBusinessConfig(config);
      }
      setShowBusinessMenu(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/site', label: 'Website', icon: Globe },
    { path: '/call', label: 'Voice Agent', icon: Phone },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/settings/agent', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/businesses" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">Voice Agent One</span>
          </Link>

          {/* Business Switcher */}
          {activeBusiness && (
            <div className="relative" ref={businessMenuRef}>
              <button
                onClick={() => setShowBusinessMenu(!showBusinessMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <Building2 size={16} className="text-blue-400" />
                <span className="text-white text-sm font-medium max-w-[150px] truncate">
                  {activeBusiness.name}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-slate-400 transition-transform',
                    showBusinessMenu && 'rotate-180'
                  )}
                />
              </button>

              {/* Business Dropdown */}
              {showBusinessMenu && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs text-slate-500 uppercase tracking-wider">
                      Your Businesses
                    </p>
                    {businesses.map((business) => (
                      <button
                        key={business.id}
                        onClick={() => handleBusinessSwitch(business.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                          business.id === activeBusiness.id
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-white hover:bg-slate-700'
                        )}
                      >
                        <Building2 size={18} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{business.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{business.industry}</p>
                        </div>
                        {business.id === activeBusiness.id && (
                          <Check size={16} className="text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-700 p-2">
                    <Link
                      to="/setup"
                      onClick={() => setShowBusinessMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Plus size={18} />
                      <span>Add New Business</span>
                    </Link>
                    <Link
                      to="/businesses"
                      onClick={() => setShowBusinessMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <LayoutDashboard size={18} />
                      <span>Manage All Businesses</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  'text-slate-400 transition-transform hidden sm:block',
                  showUserMenu && 'rotate-180'
                )}
              />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-white font-medium truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-sm text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/businesses"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Building2 size={18} />
                    <span>My Businesses</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
