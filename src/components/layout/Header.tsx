/**
 * App header — the console's top plate.
 *
 * Carries the model designation, the business currently patched in, the four
 * destinations, and the operator. The tab bar is a row of panel keys with a
 * lit edge under the one in use, not pills with a tinted background.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Plus,
  LogOut,
  Settings,
  LayoutDashboard,
  Phone,
  Globe,
  Check,
  ListTree,
} from 'lucide-react';
import { useAuthStore, useProfile } from '../../stores/authStore';
import { useBusinessStore, useActiveBusiness, useBusinesses } from '../../stores/businessStore';
import { useConfigStore } from '../../stores/configStore';
import { cn } from '../../utils/cn';
import { Legend, Lamp } from '../system/primitives';

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

  // Escape closes whichever menu is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowBusinessMenu(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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

  // Check if active business has a website (not agent_only)
  const hasWebsite = activeBusiness?.product_type !== 'agent_only';

  const navItems = [
    // Only show Website link if business has a website
    ...(hasWebsite ? [{ path: '/site', label: 'Site', icon: Globe }] : []),
    { path: '/call', label: 'Agent', icon: Phone },
    { path: '/dashboard', label: 'Calls', icon: LayoutDashboard },
    { path: '/settings/agent', label: 'Settings', icon: Settings },
  ];

  const initial = profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-edge-soft bg-ink/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[92rem] items-center gap-3 px-4 sm:px-6">
        {/* Model plate */}
        <Link to="/businesses" className="flex shrink-0 items-baseline gap-2 outline-offset-4">
          <span className="display-lite text-[14px] text-bone">Voice Agent</span>
          <span className="readout text-[14px] text-amber">One</span>
        </Link>

        <span aria-hidden className="hidden h-4 w-px bg-edge sm:block" />

        {/* Which business is patched in */}
        {activeBusiness && (
          <div className="relative min-w-0" ref={businessMenuRef}>
            <button
              onClick={() => setShowBusinessMenu(!showBusinessMenu)}
              aria-expanded={showBusinessMenu}
              aria-haspopup="menu"
              className="flex max-w-[13rem] items-center gap-2 border border-edge bg-steel px-2.5 py-1.5 shadow-bevel transition-colors hover:border-edge-bright"
            >
              <Lamp state="live" />
              <span className="truncate text-[13px] text-bone">{activeBusiness.name}</span>
              <ChevronDown
                size={13}
                className={cn(
                  'shrink-0 text-bone-faint transition-transform',
                  showBusinessMenu && 'rotate-180'
                )}
              />
            </button>

            {showBusinessMenu && (
              <div
                role="menu"
                className="panel-lift absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden"
              >
                <div className="border-b border-edge-soft px-3 py-2">
                  <Legend>Your businesses</Legend>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {businesses.map((business) => {
                    const on = business.id === activeBusiness.id;
                    return (
                      <button
                        key={business.id}
                        role="menuitem"
                        onClick={() => handleBusinessSwitch(business.id)}
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                          on ? 'bg-amber-shadow' : 'hover:bg-steel-high'
                        )}
                      >
                        <Lamp state={on ? 'live' : 'off'} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] text-bone">
                            {business.name}
                          </span>
                          <span className="legend mt-0.5 block">{business.industry}</span>
                        </span>
                        {on && <Check size={13} className="shrink-0 text-amber" />}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-edge-soft">
                  <Link
                    to="/setup"
                    onClick={() => setShowBusinessMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-bone-dim transition-colors hover:bg-steel-high hover:text-bone"
                  >
                    <Plus size={14} /> Add a business
                  </Link>
                  <Link
                    to="/businesses"
                    onClick={() => setShowBusinessMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-bone-dim transition-colors hover:bg-steel-high hover:text-bone"
                  >
                    <ListTree size={14} /> Manage all
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <span aria-hidden className="hidden h-px flex-1 bg-edge-soft md:block" />

        {/* Destinations. The lit edge marks where you are. */}
        <nav className="hidden items-stretch self-stretch md:flex">
          {navItems.map((item) => {
            const on = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                  on ? 'text-amber' : 'text-bone-dim hover:text-bone'
                )}
              >
                <item.icon size={13} strokeWidth={1.75} />
                {item.label}
                {on && (
                  <span aria-hidden className="absolute inset-x-2 bottom-0 h-px bg-amber" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Operator */}
        <div className="relative ml-auto md:ml-2" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
            aria-label="Account"
            className="flex items-center gap-1.5 p-1 transition-colors hover:bg-steel-lift"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-edge-bright bg-steel-high font-mono text-[11px] uppercase text-bone shadow-bevel">
              {initial}
            </span>
            <ChevronDown
              size={13}
              className={cn(
                'hidden text-bone-faint transition-transform sm:block',
                showUserMenu && 'rotate-180'
              )}
            />
          </button>

          {showUserMenu && (
            <div
              role="menu"
              className="panel-lift absolute right-0 top-full z-50 mt-1.5 w-60 overflow-hidden"
            >
              <div className="border-b border-edge-soft px-3 py-3">
                <p className="truncate text-[13px] text-bone">{profile?.full_name || 'Operator'}</p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-bone-faint">
                  {user?.email}
                </p>
              </div>
              <Link
                to="/businesses"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-bone-dim transition-colors hover:bg-steel-high hover:text-bone"
              >
                <ListTree size={14} /> My businesses
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 border-t border-edge-soft px-3 py-2.5 text-left text-[13px] text-clip transition-colors hover:bg-clip/10"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Destinations on small screens sit on their own rail. */}
      <nav className="flex items-stretch overflow-x-auto border-t border-edge-soft md:hidden">
        {navItems.map((item) => {
          const on = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={on ? 'page' : undefined}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-3 py-2.5',
                'font-mono text-[10px] uppercase tracking-[0.16em]',
                on ? 'text-amber' : 'text-bone-dim'
              )}
            >
              <item.icon size={12} strokeWidth={1.75} />
              {item.label}
              {on && <span aria-hidden className="absolute inset-x-2 bottom-0 h-px bg-amber" />}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
