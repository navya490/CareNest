import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Heart,
  CheckCircle2,
  Clock,
  AlertCircle,
  Volume2,
  Calendar,
  Phone,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Smile,
  Meh,
  Frown,
  Pill,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Check
} from 'lucide-react';

export default function ElderlyDashboard() {
  const {
    patient,
    todayDoses,
    appointments,
    adherenceStats,
    markDoseTaken,
    undoDoseTaken,
    speakText,
    setActiveTab,
    addCareNote,
    currentUser
  } = useCareNest();

  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  // Group today's doses by timing group or hour
  const morningDoses = todayDoses.filter(d => parseInt(d.timeSlot.split(':')[0], 10) < 12);
  const afternoonDoses = todayDoses.filter(d => {
    const h = parseInt(d.timeSlot.split(':')[0], 10);
    return h >= 12 && h < 17;
  });
  const eveningDoses = todayDoses.filter(d => {
    const h = parseInt(d.timeSlot.split(':')[0], 10);
    return h >= 17;
  });

  // Next due dose (first pending dose)
  const nextDueDose = todayDoses.find(d => d.status === 'pending');
  const upcomingAppointment = appointments.find(a => a.status === 'Upcoming');

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  // Greeting based on time of day
  const currentHour = new Date().getHours();
  let greetingTime = 'Good Morning';
  if (currentHour >= 12 && currentHour < 17) greetingTime = 'Good Afternoon';
  else if (currentHour >= 17) greetingTime = 'Good Evening';

  // Read schedule aloud
  const handleReadSchedule = () => {
    const pendingCount = todayDoses.filter(d => d.status === 'pending').length;
    const takenCount = todayDoses.filter(d => d.status === 'taken').length;
    let speech = `${greetingTime}, ${patient.preferredName || patient.name}. Today is ${todayFormatted}. `;
    if (nextDueDose) {
      speech += `Your next scheduled medication is ${nextDueDose.medicationName} ${nextDueDose.dosage}, due at ${nextDueDose.timeLabel}. `;
      speech += `Instructions: ${nextDueDose.instructions}. `;
    } else {
      speech += `All of your medications for today have been taken! `;
    }
    speech += `You have taken ${takenCount} of ${todayDoses.length} doses today. `;
    if (upcomingAppointment) {
      speech += `Your next doctor visit is with ${upcomingAppointment.doctorName} on ${upcomingAppointment.date}. `;
    }
    speakText(speech);
  };

  // Submit daily feeling check-in
  const handleMoodSelect = (mood, label) => {
    setSelectedMood(mood);
    setMoodSubmitted(true);
    addCareNote(`Daily Health Check-in: Eleanor recorded feeling "${label}" today.`, 'Health Check');
    speakText(`Thank you for checking in, Eleanor. We noted that you are feeling ${label} today.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sage-700 via-sage-600 to-sage-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                Today's Overview
              </span>
              <span className="text-sage-200 text-sm font-medium">{todayFormatted}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {greetingTime}, {patient.preferredName || patient.name} 🌸
            </h1>
            <p className="mt-2 text-sage-100 text-base sm:text-lg max-w-2xl leading-relaxed">
              Welcome back to CareNest. Here is your daily medication plan and care schedule. Everything is organized to help you feel your best.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReadSchedule}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white text-sage-800 hover:bg-ivory-100 font-bold shadow-md transition-all active:scale-95"
              title="Listen to today's schedule read aloud"
            >
              <Volume2 className="w-5 h-5 text-sage-600 animate-bounce" />
              <span>Listen to Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-sage-800/80 hover:bg-sage-900 text-white font-semibold border border-sage-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask NestBot AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Card: Next Due Medication */}
      {nextDueDose ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sage-500 shadow-soft-lg relative overflow-hidden pulse-urgent">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                  NEXT DUE MEDICATION
                </span>
                <span className="text-sm font-bold text-stone-500">{nextDueDose.timeLabel}</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center gap-3">
                  <span>{nextDueDose.medicationName}</span>
                  <span className="text-lg font-bold text-sage-600 bg-sage-50 px-3 py-1 rounded-xl border border-sage-200">
                    {nextDueDose.dosage}
                  </span>
                </h2>
                <p className="text-base text-stone-600 mt-1 font-medium">
                  {nextDueDose.instructions}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-stone-600 pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-inner"
                    style={{ backgroundColor: nextDueDose.pillColor || '#4D7257' }}
                  />
                  <span>Appearance: {nextDueDose.pillColorName} {nextDueDose.pillShape}</span>
                </div>
                <span>•</span>
                <div className="text-stone-700 font-bold">
                  {nextDueDose.foodRelationLabel}
                </div>
              </div>
            </div>

            {/* Giant Elder-Friendly Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => markDoseTaken(nextDueDose.id)}
                className="w-full sm:w-auto min-w-[220px] px-8 py-5 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-sage-600/30 flex items-center justify-center gap-3 transition-all transform active:scale-95"
              >
                <Check className="w-7 h-7 stroke-[3]" />
                <span>I Took This!</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-sage-50 rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-sage-200 flex items-center justify-center text-sage-700">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-800">
                All Done For Now! 🎉
              </h2>
              <p className="text-base text-stone-600 mt-1">
                You have taken all scheduled medications up to this moment. Great job maintaining your health!
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('medications')}
            className="px-5 py-3 rounded-xl bg-white border border-sage-300 text-sage-800 font-bold hover:bg-sage-100 transition-colors"
          >
            Review All Prescriptions
          </button>
        </div>
      )}

      {/* Main Grid: Daily Medication Timeline + Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Medication Timeline (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-stone-800">Today's Medication Schedule</h2>
              <p className="text-sm text-stone-500 font-medium">Click on any pill to update its status</p>
            </div>
            <button
              onClick={() => setActiveTab('medications')}
              className="text-sm font-bold text-sage-700 hover:text-sage-900 flex items-center gap-1"
            >
              <span>Manage List</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Morning Doses */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-800">Morning Schedule</h3>
                  <p className="text-xs text-stone-500 font-medium">Breakfast & early morning doses</p>
                </div>
              </div>
              <span className="text-xs font-bold text-stone-400">8:00 AM</span>
            </div>

            <div className="space-y-3">
              {morningDoses.map((dose) => (
                <DoseTimelineRow
                  key={dose.id}
                  dose={dose}
                  onMarkTaken={() => markDoseTaken(dose.id)}
                  onUndo={() => undoDoseTaken(dose.id)}
                />
              ))}
              {morningDoses.length === 0 && (
                <p className="text-stone-400 text-sm italic py-2">No morning medications scheduled.</p>
              )}
            </div>
          </div>

          {/* Afternoon Doses */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-800">Afternoon Schedule</h3>
                  <p className="text-xs text-stone-500 font-medium">Lunch & midday supplements</p>
                </div>
              </div>
              <span className="text-xs font-bold text-stone-400">1:00 PM</span>
            </div>

            <div className="space-y-3">
              {afternoonDoses.map((dose) => (
                <DoseTimelineRow
                  key={dose.id}
                  dose={dose}
                  onMarkTaken={() => markDoseTaken(dose.id)}
                  onUndo={() => undoDoseTaken(dose.id)}
                />
              ))}
              {afternoonDoses.length === 0 && (
                <p className="text-stone-400 text-sm italic py-2">No afternoon medications scheduled.</p>
              )}
            </div>
          </div>

          {/* Evening & Bedtime Doses */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-800">Evening & Bedtime Schedule</h3>
                  <p className="text-xs text-stone-500 font-medium">Dinner & before-sleep medications</p>
                </div>
              </div>
              <span className="text-xs font-bold text-stone-400">7:00 PM – 10:00 PM</span>
            </div>

            <div className="space-y-3">
              {eveningDoses.map((dose) => (
                <DoseTimelineRow
                  key={dose.id}
                  dose={dose}
                  onMarkTaken={() => markDoseTaken(dose.id)}
                  onUndo={() => undoDoseTaken(dose.id)}
                />
              ))}
              {eveningDoses.length === 0 && (
                <p className="text-stone-400 text-sm italic py-2">No evening medications scheduled.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Adherence Circle, Upcoming Doctor Visit, Emergency SOS */}
        <div className="space-y-6">
          {/* Adherence Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft">
            <h3 className="font-extrabold text-lg text-stone-800 mb-1">Today's Adherence</h3>
            <p className="text-xs text-stone-500 font-medium mb-4">Medication compliance progress</p>

            <div className="flex items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-stone-200"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-sage-600 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (adherenceStats.today.percentage || 0)) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-stone-800">
                    {adherenceStats.today.percentage}%
                  </span>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    {adherenceStats.today.taken} of {adherenceStats.today.total} taken
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
              <div className="bg-stone-50 rounded-2xl p-2.5">
                <span className="text-xs font-semibold text-stone-500 block">7-Day Average</span>
                <span className="text-lg font-extrabold text-sage-700">{adherenceStats.weeklyAverage}%</span>
              </div>
              <div className="bg-stone-50 rounded-2xl p-2.5">
                <span className="text-xs font-semibold text-stone-500 block">Pending Doses</span>
                <span className="text-lg font-extrabold text-amber-700">{adherenceStats.today.pending}</span>
              </div>
            </div>
          </div>

          {/* Next Doctor Appointment Card */}
          {upcomingAppointment ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sage-600" />
                  <h3 className="font-extrabold text-lg text-stone-800">Upcoming Visit</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sage-100 text-sage-800">
                  {upcomingAppointment.date}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-stone-900">{upcomingAppointment.doctorName}</h4>
                <p className="text-xs font-bold text-sage-700">{upcomingAppointment.specialty}</p>
                <p className="text-xs text-stone-600 flex items-start gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <span>{upcomingAppointment.hospitalOrClinic}</span>
                </p>
                <p className="text-xs text-stone-500 pt-1 font-medium bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="font-bold text-stone-700">Prep: </span>
                  {upcomingAppointment.prepInstructions}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${upcomingAppointment.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call Office</span>
                </a>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="px-3 py-2.5 rounded-xl bg-sage-50 text-sage-800 hover:bg-sage-100 text-xs font-bold transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ) : null}

          {/* Daily Feeling Check-in */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft">
            <h3 className="font-extrabold text-base text-stone-800 mb-1">How Are You Feeling Today?</h3>
            <p className="text-xs text-stone-500 font-medium mb-3">Your family sees this check-in</p>

            {moodSubmitted ? (
              <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-center">
                <p className="text-sm font-bold text-sage-800">Check-in recorded! 💚</p>
                <p className="text-xs text-sage-600 mt-1">Thank you for letting your family know.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleMoodSelect('great', 'Energized & Feeling Great')}
                  className="flex flex-col items-center p-3 rounded-2xl bg-stone-50 hover:bg-sage-100 border border-stone-200 text-stone-700 hover:text-sage-900 transition-all"
                >
                  <Smile className="w-7 h-7 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold">Good</span>
                </button>
                <button
                  onClick={() => handleMoodSelect('okay', 'Okay / Managing Well')}
                  className="flex flex-col items-center p-3 rounded-2xl bg-stone-50 hover:bg-amber-100 border border-stone-200 text-stone-700 hover:text-amber-900 transition-all"
                >
                  <Meh className="w-7 h-7 text-amber-600 mb-1" />
                  <span className="text-xs font-bold">Okay</span>
                </button>
                <button
                  onClick={() => handleMoodSelect('unwell', 'A Bit Tired / Unwell')}
                  className="flex flex-col items-center p-3 rounded-2xl bg-stone-50 hover:bg-coral-100 border border-stone-200 text-stone-700 hover:text-coral-900 transition-all"
                >
                  <Frown className="w-7 h-7 text-coral-600 mb-1" />
                  <span className="text-xs font-bold">Tired</span>
                </button>
              </div>
            )}
          </div>

          {/* Emergency SOS & Family Quick Call */}
          <div className="bg-coral-50/70 rounded-3xl p-6 border border-coral-200/80 shadow-soft">
            <div className="flex items-center gap-2 mb-2 text-coral-800">
              <ShieldAlert className="w-5 h-5 text-coral-600" />
              <h3 className="font-extrabold text-base">Emergency Contacts</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              If you feel unwell or need help right now, tap to call your family caregiver or emergency services.
            </p>

            <div className="space-y-2">
              <a
                href={`tel:${patient.emergencyContacts[0]?.phone}`}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-coral-200 text-stone-900 font-bold text-sm shadow-sm hover:bg-coral-100/50 transition-colors"
              >
                <div>
                  <p className="text-xs text-coral-600 font-extrabold uppercase">Primary Caregiver</p>
                  <p>{patient.emergencyContacts[0]?.name} ({patient.emergencyContacts[0]?.relation})</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-coral-100 text-coral-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </a>

              <a
                href="tel:911"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-coral-600 text-white font-extrabold text-sm shadow-md hover:bg-coral-700 transition-colors"
              >
                <span>Call Emergency (911)</span>
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual timeline row component
function DoseTimelineRow({ dose, onMarkTaken, onUndo }) {
  const isTaken = dose.status === 'taken';
  const isMissed = dose.status === 'missed';

  return (
    <div
      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
        isTaken
          ? 'bg-sage-50/60 border-sage-200 text-stone-800'
          : isMissed
          ? 'bg-coral-50/60 border-coral-200 text-stone-800'
          : 'bg-stone-50 border-stone-200 text-stone-900 hover:border-sage-300'
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div
          className="w-4 h-4 rounded-full border border-stone-300 shadow-sm flex-shrink-0"
          style={{ backgroundColor: dose.pillColor || '#4D7257' }}
          title={dose.pillColorName}
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-extrabold text-sm sm:text-base ${isTaken ? 'line-through text-stone-500' : 'text-stone-900'}`}>
              {dose.medicationName}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
              {dose.dosage}
            </span>
          </div>
          <p className="text-xs text-stone-500 truncate mt-0.5">
            {dose.foodRelationLabel} • {dose.instructions}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {isTaken ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-sage-800 bg-sage-200/80 px-2.5 py-1.5 rounded-xl border border-sage-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-sage-700" />
              <span>Taken</span>
            </span>
            <button
              onClick={onUndo}
              className="text-xs text-stone-400 hover:text-stone-600 underline font-medium px-1"
              title="Undo mark as taken"
            >
              Undo
            </button>
          </div>
        ) : (
          <button
            onClick={onMarkTaken}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Take Pill</span>
          </button>
        )}
      </div>
    </div>
  );
}
