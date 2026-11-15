import React from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Mail,
  X,
  AlertTriangle,
  Heart,
  Phone,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function EmailSimulationModal() {
  const { isEmailModalOpen, setIsEmailModalOpen, emailModalContent } = useCareNest();

  if (!isEmailModalOpen || !emailModalContent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-soft-xl border border-stone-200 space-y-4">
        {/* Modal Chrome Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral-700 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Caregiver Email Notification Dispatch</h2>
              <p className="text-[11px] text-stone-500 font-medium">
                Simulated transactional email sent via CareNest Notification Engine
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmailModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Envelope Meta */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1 font-mono">
          <p><span className="text-stone-400 font-bold">From:</span> alerts@carenest.health &lt;CareNest Health Monitoring&gt;</p>
          <p><span className="text-stone-400 font-bold">To:</span> {emailModalContent.toName} &lt;{emailModalContent.to}&gt;</p>
          <p><span className="text-stone-400 font-bold">Subject:</span> <strong className="text-stone-900 font-sans">{emailModalContent.subject}</strong></p>
          <p><span className="text-stone-400 font-bold">Timestamp:</span> {emailModalContent.timestamp}</p>
        </div>

        {/* Formatted HTML Email Body Preview */}
        <div className="border border-stone-200 rounded-2xl p-6 bg-ivory-50 space-y-4 text-stone-800 text-sm">
          {/* Email Branding */}
          <div className="flex items-center gap-2 pb-3 border-b border-stone-200/80">
            <div className="w-8 h-8 rounded-xl bg-sage-600 text-white flex items-center justify-center font-bold">
              <Heart className="w-4 h-4 fill-white/20 stroke-white" />
            </div>
            <div>
              <span className="font-extrabold text-stone-800 tracking-tight">CareNest Alert</span>
              <p className="text-[10px] text-stone-500">Better Care. Greater Independence.</p>
            </div>
          </div>

          <p className="font-bold text-stone-800">
            Hello {emailModalContent.toName},
          </p>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            This is an automated safety alert regarding your family member, <strong>{emailModalContent.patientName}</strong>. A scheduled medication dose has passed its scheduled window without confirmation:
          </p>

          {/* Pill Card */}
          <div className="p-4 rounded-xl bg-white border border-coral-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base text-stone-900">
                {emailModalContent.medicationName}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-coral-100 text-coral-800">
                Missed Window
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Dosage: <strong>{emailModalContent.dosage}</strong> • Scheduled Slot: <strong>{emailModalContent.timeSlot}</strong>
            </p>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Please give {emailModalContent.patientName} a gentle call to ensure she is doing well and to remind her about this dose.
          </p>

          {/* Action Button inside Email */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sage-600 text-white text-xs font-bold hover:bg-sage-700 transition-colors shadow-sm text-center"
            >
              Open CareNest Patient Dashboard
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200/80 text-[11px] text-stone-400">
            CareNest Automated Patient Safety System • St. Jude Health Partner Network
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsEmailModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
