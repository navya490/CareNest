import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Users,
  Shield,
  KeyRound,
  Heart,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Phone,
  Mail,
  UserCheck,
  FileText,
  Lock,
  Unlock,
  Copy,
  Check,
  BellRing,
  Sparkles,
  Home
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function CaregiverPortal() {
  const {
    patient,
    currentUser,
    todayDoses,
    appointments,
    adherenceStats,
    careNotes,
    addCareNote,
    triggerSimulatedMissedDoseEmail,
    markDoseMissed,
    markDoseTaken
  } = useCareNest();

  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Observation');
  const [currentPin, setCurrentPin] = useState(() => StorageService.getPasscode());
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check missed doses
  const missedDoses = todayDoses.filter(d => d.status === 'missed');
  const pendingDoses = todayDoses.filter(d => d.status === 'pending');
  const takenDoses = todayDoses.filter(d => d.status === 'taken');

  // Next appointment
  const nextApt = appointments.find(a => a.status === 'Upcoming');

  // Submit Care Note
  const handlePostNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addCareNote(newNoteText.trim(), newNoteTag);
    setNewNoteText('');
  };

  // Change PIN
  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (newPinInput.length !== 4 || isNaN(newPinInput)) {
      alert('Please enter a 4-digit numeric PIN.');
      return;
    }
    StorageService.setPasscode(newPinInput);
    setCurrentPin(newPinInput);
    setNewPinInput('');
    setPinChangeSuccess(true);
    setTimeout(() => setPinChangeSuccess(false), 3000);
  };

  // Copy share invite link
  const handleCopyLink = () => {
    const inviteText = `CareNest Shared Access: Use passcode "${currentPin}" to securely access Eleanor Vance's care profile.`;
    navigator.clipboard.writeText(inviteText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sage-100 text-sage-800">
              <Users className="w-5 h-5 text-sage-700" />
            </span>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Family & Caregiver Portal
            </h1>
          </div>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Real-time health monitoring, shared access passcode, missed dose alerts, and family journal.
          </p>
        </div>

        {/* Share profile passcode pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold shadow-soft-sm transition-all"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
            <span>{copiedLink ? 'Invite Copied!' : 'Share Access Passcode'}</span>
          </button>
        </div>
      </div>

      {/* Missed Dose Real-Time Alert Banner (if any) */}
      {missedDoses.length > 0 ? (
        <div className="p-6 rounded-3xl bg-coral-50 border-2 border-coral-400 shadow-soft-md space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-coral-100 text-coral-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-coral-900">
                  Real-Time Alert: Missed Dose Recorded for Eleanor
                </h3>
                <p className="text-xs text-coral-700 font-medium">
                  The following scheduled medication was not confirmed during the scheduled window:
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-coral-200 text-coral-900">
              Action Required
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {missedDoses.map(dose => (
              <div key={dose.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white border border-coral-200 gap-3">
                <div>
                  <span className="font-extrabold text-sm text-stone-900">{dose.medicationName} ({dose.dosage})</span>
                  <p className="text-xs text-stone-500">{dose.timeLabel} • {dose.instructions}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerSimulatedMissedDoseEmail(dose)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral-100 text-coral-800 hover:bg-coral-200 text-xs font-bold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>View Email Dispatch</span>
                  </button>
                  <a
                    href={`tel:${patient.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral-600 text-white hover:bg-coral-700 text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Eleanor</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-sage-50/80 border border-sage-200 flex items-center justify-between text-xs sm:text-sm text-sage-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>All clear:</strong> No missed doses recorded today. Eleanor's current adherence is <strong>{adherenceStats.today.percentage}%</strong>.
            </span>
          </div>
          <span className="text-xs text-sage-700 font-semibold hidden md:inline">
            Live synchronization active
          </span>
        </div>
      )}

      {/* Grid: Patient Health Profile + Adherence Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Profile Card (Col 1) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sage-500/30 shadow-md"
            />
            <div>
              <span className="text-xs font-bold text-sage-700 uppercase tracking-wider">
                Elderly Profile
              </span>
              <h2 className="text-xl font-extrabold text-stone-900">{patient.name}</h2>
              <p className="text-xs text-stone-500 font-medium">Age: {patient.age} • Blood Group: {patient.bloodGroup}</p>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
              Diagnosed Conditions
            </h3>
            <div className="space-y-1.5">
              {patient.conditions.map((cond, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-xs">
                  <span className="font-bold text-stone-800">{cond.name}</span>
                  <span className="text-stone-500 font-medium">{cond.severity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Known Allergies */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
              Known Allergies (Crucial)
            </h3>
            <div className="space-y-1.5">
              {patient.allergies.map((allergy, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-coral-50/70 border border-coral-200 text-xs">
                  <span className="font-extrabold text-coral-800">{allergy.name}</span>
                  <span className="text-coral-600 font-medium">{allergy.reaction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Doctor */}
          <div className="pt-2 border-t border-stone-100 space-y-1 text-xs">
            <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-1.5">
              Primary Care Physician
            </h3>
            <p className="font-bold text-stone-800">{patient.primaryPhysician.name}</p>
            <p className="text-stone-500">{patient.primaryPhysician.specialty}</p>
            <p className="text-sage-700 font-semibold">{patient.primaryPhysician.hospital}</p>
            <p className="text-stone-600 pt-1 font-medium">{patient.primaryPhysician.phone}</p>
          </div>

          {/* Passcode Security & Management */}
          <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-stone-700" />
                <span className="text-xs font-bold text-stone-800">Shared Access PIN</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-800 text-white font-mono font-bold text-sm tracking-widest">
                {currentPin}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Caregivers and family use this 4-digit passcode to unlock editing privileges.
            </p>

            <form onSubmit={handleUpdatePin} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                maxLength="4"
                placeholder="New 4-digit PIN"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-bold whitespace-nowrap shadow-sm"
              >
                Change PIN
              </button>
            </form>
            {pinChangeSuccess && (
              <p className="text-[11px] text-emerald-600 font-bold">Passcode updated successfully!</p>
            )}
          </div>
        </div>

        {/* Live Adherence & Today's Doses Table (Col 2 & 3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Adherence & Next Action Banner */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-extrabold text-xl text-stone-900">Today's Live Adherence Monitor</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Status of all {todayDoses.length} prescribed doses for {patient.name}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-sage-700">
                    {adherenceStats.today.percentage}%
                  </span>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">
                    Compliance Rate
                  </span>
                </div>
              </div>
            </div>

            {/* Dose Grid / List for Caregiver */}
            <div className="space-y-2.5">
              {todayDoses.map((dose) => (
                <div
                  key={dose.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-300"
                      style={{ backgroundColor: dose.pillColor || '#4D7257' }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-stone-900">{dose.medicationName}</span>
                        <span className="text-xs text-stone-600 font-bold">({dose.dosage})</span>
                        <span className="text-xs text-stone-400">• {dose.timeLabel}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{dose.instructions}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {dose.status === 'taken' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-sage-200 text-sage-900 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage-700" />
                        <span>Taken {dose.takenAt ? new Date(dose.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </span>
                    ) : dose.status === 'missed' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-coral-100 text-coral-800 text-xs font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-coral-600" />
                        <span>Missed Dose</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Pending</span>
                        </span>
                        {/* Caregiver quick actions */}
                        <button
                          onClick={() => markDoseTaken(dose.id)}
                          className="text-xs font-bold text-sage-700 hover:text-sage-900 bg-white border border-sage-200 px-2 py-1 rounded-lg"
                        >
                          Mark Taken
                        </button>
                        <button
                          onClick={() => markDoseMissed(dose.id)}
                          className="text-xs font-bold text-coral-600 hover:text-coral-800 bg-white border border-coral-200 px-2 py-1 rounded-lg"
                        >
                          Mark Missed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Care Journal & Notes Feed */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sage-600" />
                <h3 className="font-extrabold text-xl text-stone-900">Family Care Journal</h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {careNotes.length} notes recorded
              </span>
            </div>

            {/* Add New Note Form */}
            <form onSubmit={handlePostNote} className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-stone-700">
                  Posting as: <strong className="text-sage-700">{currentUser.name}</strong> ({currentUser.roleLabel})
                </span>

                <select
                  value={newNoteTag}
                  onChange={(e) => setNewNoteTag(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-xs font-bold text-stone-700 focus:outline-none"
                >
                  <option value="Observation">Observation</option>
                  <option value="Groceries & Home">Groceries & Home</option>
                  <option value="Health Check">Health Check</option>
                  <option value="Doctor Followup">Doctor Followup</option>
                </select>
              </div>

              <textarea
                rows="2"
                placeholder="Share a care update with the family (e.g. visited mom, filled pill box, noticed slight fatigue, took a walk)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post to Family Feed</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {careNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-2xl bg-ivory-50 border border-ivory-300 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={note.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
                        alt={note.authorName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-300"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-stone-900">{note.authorName}</span>
                        <span className="text-[11px] text-stone-500 ml-1">({note.authorRole})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-100 text-sage-800">
                        {note.tag}
                      </span>
                      <span className="text-[11px] text-stone-400 font-medium">{note.date}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
