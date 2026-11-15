import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Heart,
  Pill,
  Calendar,
  Users,
  BarChart3,
  Bot,
  Bell,
  Volume2,
  VolumeX,
  Type,
  Database,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { INITIAL_USERS } from '../data/sampleData';

export default function Navbar() {
  const {
    currentUser,
    switchUser,
    activeTab,
    setActiveTab,
    comfortMode,
    setComfortMode,
    soundEnabled,
    setSoundEnabled,
    notifications,
    setIsNotificationDrawerOpen,
    setIsSupabaseModalOpen,
    resetDemo,
    requestPasscodeVerification
  } = useCareNest();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Today\'s Routine', icon: Heart, badge: null },
    { id: 'medications', label: 'Medications', icon: Pill, badge: null },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: null },
    { id: 'portal', label: 'Family & Caregiver', icon: Users, badge: null },
    { id: 'analytics', label: 'Adherence & Insights', icon: BarChart3, badge: null },
    { id: 'assistant', label: 'NestBot AI', icon: Bot, badge: 'Smart' },
  ];

  const handleRoleSelect = (role) => {
    // If switching to caregiver or family from elderly, or vice versa, offer smooth switch
    if (role === 'caregiver' && currentUser.role === 'elderly') {
      // Require passcode for caregiver privileges
      requestPasscodeVerification(() => {
        switchUser(role);
        setIsUserMenuOpen(false);
      });
    } else {
      switchUser(role);
      setIsUserMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-soft-sm transition-all">
      {/* Top Banner: Role & Quick Demo Access */}
      <div className="bg-sage-50 border-b border-sage-100/70 px-4 py-1.5 text-xs text-sage-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage-200 text-sage-900 border border-sage-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
              Active Persona: {currentUser.name} ({currentUser.roleLabel})
            </span>
            <span className="hidden sm:inline text-stone-500">|</span>
            <span className="hidden sm:inline text-stone-600 font-medium">
              Passcode protected • Demo mode active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetDemo}
              className="text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
              title="Reset application to initial demo seed data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="flex items-center gap-1 font-medium text-sage-700 hover:text-sage-900 transition-colors"
            >
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Cloud DB / Supabase</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sage-600 to-sage-500 flex items-center justify-center shadow-md shadow-sage-600/20 text-white">
              <Heart className="w-6 h-6 fill-white/20 stroke-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-stone-800 font-display">
                  Care<span className="text-sage-600">Nest</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-semibold bg-sage-100 text-sage-800 rounded-md">
                  Elderly Care
                </span>
              </div>
              <p className="text-xs font-medium text-stone-500 tracking-wide hidden sm:block">
                Better Care. Greater Independence.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-sage-700 shadow-soft-sm font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sage-600' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Accessibility & Persona Switcher Controls */}
          <div className="flex items-center gap-2">
            {/* Elderly Comfort Mode (Large text toggle) */}
            <button
              onClick={() => setComfortMode(!comfortMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                comfortMode
                  ? 'bg-sage-600 text-white border-sage-700 shadow-soft-sm'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200/70'
              }`}
              title="Toggle Large Display & High Contrast Comfort Mode for Elderly"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Comfort View</span>
              <span className="font-extrabold text-[11px] bg-black/10 px-1 rounded">Aa+</span>
            </button>

            {/* Sound Chimes Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-stone-600 hover:text-stone-900 transition-all ${
                soundEnabled
                  ? 'bg-stone-100 border-stone-200'
                  : 'bg-coral-50 border-coral-200 text-coral-600'
              }`}
              title={soundEnabled ? 'Sound alerts enabled' : 'Sound alerts muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-sage-700" /> : <VolumeX className="w-4 h-4 text-coral-600" />}
            </button>

            {/* In-App Notification Center Bell */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900 transition-all"
              title="View Notifications & Reminders"
            >
              <Bell className="w-4 h-4 text-stone-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl bg-ivory-200 hover:bg-ivory-300 border border-stone-300/80 transition-all shadow-soft-sm"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-sage-500/40"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-stone-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-stone-500 font-medium capitalize">{currentUser.roleLabel}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-soft-lg border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Switch Persona</p>
                    <p className="text-xs text-stone-600 mt-0.5">Toggle view to test role-based permissions</p>
                  </div>

                  <div className="p-1 space-y-1">
                    {INITIAL_USERS.map((user) => {
                      const isSelected = user.role === currentUser.role;
                      return (
                        <button
                          key={user.id}
                          onClick={() => handleRoleSelect(user.role)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-sage-50 text-sage-900 border border-sage-200'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover mt-0.5 ring-1 ring-stone-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-stone-800">{user.name}</span>
                              {isSelected && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sage-200 text-sage-800">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500">{user.roleLabel}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 hover:bg-stone-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-sage-600 text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-200 text-amber-900 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
