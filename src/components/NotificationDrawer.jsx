import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Pill,
  Mail,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function NotificationDrawer() {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    setActiveTab,
    triggerSimulatedMissedDoseEmail,
    todayDoses
  } = useCareNest();

  const [activeFilter, setActiveFilter] = useState('all');

  if (!isNotificationDrawerOpen) return null;

  const filtered = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'refill') return n.type === 'refill';
    if (activeFilter === 'appointment') return n.type === 'appointment';
    if (activeFilter === 'adherence') return n.type === 'adherence';
    return true;
  });

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.actionUrl) {
      const tab = notif.actionUrl.replace('#', '');
      setActiveTab(tab);
      setIsNotificationDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-soft-xl border-l border-stone-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5 text-sage-700" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">Notifications & Alerts</h2>
                <p className="text-xs text-stone-500 font-medium">
                  {notifications.filter(n => !n.read).length} unread alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-stone-400 hover:text-stone-700 font-medium px-2 py-1"
                  title="Clear all notifications"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="px-6 py-2.5 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2 overflow-x-auto">
            {['all', 'refill', 'appointment', 'adherence'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  activeFilter === tab
                    ? 'bg-sage-600 text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {tab === 'all' ? 'All Alerts' : tab}
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.map((notif) => {
              const isRefill = notif.type === 'refill';
              const isApt = notif.type === 'appointment';
              const isAdherence = notif.type === 'adherence';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    notif.read
                      ? 'bg-white border-stone-200 text-stone-600 hover:border-sage-300'
                      : isRefill
                      ? 'bg-coral-50/80 border-coral-200 text-stone-900 shadow-sm'
                      : 'bg-sage-50/70 border-sage-200 text-stone-900 shadow-sm'
                  }`}
                >
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-coral-500 absolute top-4 right-4" />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isRefill
                          ? 'bg-coral-100 text-coral-700'
                          : isApt
                          ? 'bg-mutedblue-100 text-mutedblue-700'
                          : 'bg-sage-200 text-sage-800'
                      }`}
                    >
                      {isRefill && <Pill className="w-4 h-4" />}
                      {isApt && <Calendar className="w-4 h-4" />}
                      {isAdherence && <CheckCircle2 className="w-4 h-4" />}
                      {!isRefill && !isApt && !isAdherence && <Bell className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 pr-4">
                      <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-snug">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-stone-600 font-medium leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-stone-400">
                        <Clock className="w-3 h-3" />
                        <span>{notif.time}</span>
                        {notif.actionUrl && (
                          <span className="text-sage-700 font-bold hover:underline">
                            • View Tab →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-stone-400 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-sm font-bold text-stone-600">No notifications in this filter</p>
                <p className="text-xs text-stone-400">You are completely up to date!</p>
              </div>
            )}
          </div>

          {/* Footer Dispatch Simulator */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2 text-center">
            <button
              onClick={() => {
                const sampleDose = todayDoses.find(d => d.status === 'pending') || todayDoses[0];
                triggerSimulatedMissedDoseEmail(sampleDose);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all shadow-soft-sm"
            >
              <Mail className="w-4 h-4 text-stone-500" />
              <span>Simulate Email Alert to Caregiver</span>
            </button>
            <p className="text-[11px] text-stone-400">
              CareNest automatically triggers alerts to family when medications are missed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
