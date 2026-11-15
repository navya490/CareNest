import React from 'react';
import { CareNestProvider, useCareNest } from './context/CareNestContext';
import Navbar from './components/Navbar';
import ElderlyDashboard from './components/ElderlyDashboard';
import MedicationManager from './components/MedicationManager';
import AppointmentManager from './components/AppointmentManager';
import CaregiverPortal from './components/CaregiverPortal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AICareAssistant from './components/AICareAssistant';
import PasscodeModal from './components/PasscodeModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import EmailSimulationModal from './components/EmailSimulationModal';
import NotificationDrawer from './components/NotificationDrawer';
import { Bot, Heart, Sparkles, Phone, ShieldCheck, ChevronUp } from 'lucide-react';

function MainContent() {
  const { activeTab, setActiveTab, patient, currentUser } = useCareNest();

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 text-stone-800 transition-colors">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && <ElderlyDashboard />}
        {activeTab === 'medications' && <MedicationManager />}
        {activeTab === 'appointments' && <AppointmentManager />}
        {activeTab === 'portal' && <CaregiverPortal />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'assistant' && <AICareAssistant />}
      </main>

      {/* Floating NestBot AI quick launcher (when not on assistant tab) */}
      {activeTab !== 'assistant' && (
        <aside aria-label="Care assistant quick action" className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-sage-700 to-sage-600 hover:from-sage-800 hover:to-sage-700 text-white font-bold shadow-soft-xl border border-sage-500/40 transition-all hover:scale-105 active:scale-95 group"
            title="Chat with NestBot AI Care Assistant"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:rotate-12 transition-transform">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-extrabold leading-tight">Ask NestBot</p>
              <p className="text-[10px] text-sage-200 font-medium">Daily AI Assistant</p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </button>
        </aside>
      )}

      {/* Global Modals and Drawers */}
      <PasscodeModal />
      <SupabaseConfigModal />
      <EmailSimulationModal />
      <NotificationDrawer />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sage-600 flex items-center justify-center text-white">
              <Heart className="w-3.5 h-3.5 fill-white/30 stroke-white" />
            </div>
            <span className="font-extrabold text-stone-800 font-display">CareNest</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-600 font-medium italic">Better Care. Greater Independence.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-stone-900 transition-colors"
            >
              Today's Routine
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              className="hover:text-stone-900 transition-colors"
            >
              Family Portal
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-stone-900 transition-colors"
            >
              Physician Report
            </button>
            <a
              href={`tel:${patient.emergencyContacts[0]?.phone}`}
              className="text-coral-600 hover:text-coral-700 flex items-center gap-1 font-bold"
            >
              <Phone className="w-3 h-3" />
              <span>Call Primary Caregiver</span>
            </a>
          </div>

          <p className="text-stone-400 text-center sm:text-right">
            Designed for elderly accessibility, family peace of mind, and clinical consistency.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CareNestProvider>
      <MainContent />
    </CareNestProvider>
  );
}
