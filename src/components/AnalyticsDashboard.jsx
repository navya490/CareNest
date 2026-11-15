import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Printer,
  Download,
  Share2,
  FileCheck,
  Heart,
  Pill,
  Sun,
  Coffee,
  Moon
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const {
    patient,
    medications,
    appointments,
    adherenceStats,
    todayDoses,
    careNotes
  } = useCareNest();

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const history = adherenceStats.history || [];
  const takenTotal = history.reduce((acc, h) => acc + (h.taken || 0), 0);
  const missedTotal = history.reduce((acc, h) => acc + (h.missed || 0), 0);
  const totalDosesLogged = takenTotal + missedTotal;
  const overallAdherence = totalDosesLogged > 0 ? Math.round((takenTotal / totalDosesLogged) * 100) : 94;

  const upcomingApts = appointments.filter(a => a.status === 'Upcoming');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sage-100 text-sage-800">
              <BarChart3 className="w-5 h-5 text-sage-700" />
            </span>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Adherence & Health Analytics
            </h1>
          </div>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Weekly medication compliance trends, time-of-day consistency, and exportable physician reports.
          </p>
        </div>

        <button
          onClick={() => setIsPrintModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 font-bold text-sm shadow-soft-sm transition-all"
        >
          <Printer className="w-4 h-4 text-stone-600" />
          <span>Doctor Visit Health Summary</span>
        </button>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">7-Day Adherence</span>
            <span className="p-1.5 rounded-xl bg-sage-100 text-sage-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">{overallAdherence}%</span>
            <span className="text-xs font-bold text-emerald-600">+4% vs last week</span>
          </div>
          <p className="text-xs text-stone-500 font-medium">High adherence benchmark maintained</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Doses Taken</span>
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{takenTotal}</span>
            <span className="text-xs font-medium text-stone-400">doses confirmed</span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Across all scheduled morning, midday & evening</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Missed Doses</span>
            <span className="p-1.5 rounded-xl bg-coral-100 text-coral-700">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">{missedTotal}</span>
            <span className="text-xs font-bold text-coral-600">Past 7 days</span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Auto-notified to primary caregiver Sarah</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Upcoming Visits</span>
            <span className="p-1.5 rounded-xl bg-mutedblue-100 text-mutedblue-700">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">{upcomingApts.length}</span>
            <span className="text-xs font-medium text-stone-400">scheduled</span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Next: Dr. Evelyn Reed (Cardiology)</p>
        </div>
      </div>

      {/* Main Visual Section: 7-Day Adherence Chart + Time of Day Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 7-Day SVG Bar Chart (Col 1 & 2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">7-Day Medication Adherence History</h2>
              <p className="text-xs text-stone-500 font-medium">Daily compliance percentage across the week</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-sage-600" />
                <span className="text-stone-700">Taken</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-coral-400" />
                <span className="text-stone-700">Missed</span>
              </div>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-2 pt-6 px-2">
            {history.map((dayItem, idx) => {
              const heightPercent = Math.max(15, Math.round(dayItem.adherence));
              const isToday = idx === history.length - 1;

              return (
                <div key={dayItem.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold bg-stone-900 text-white px-2 py-1 rounded-lg pointer-events-none mb-1 whitespace-nowrap shadow-md">
                    {dayItem.taken} of {dayItem.total} taken ({Math.round(dayItem.adherence)}%)
                  </div>

                  {/* Percentage label */}
                  <span className={`text-xs font-extrabold ${isToday ? 'text-sage-700' : 'text-stone-600'}`}>
                    {Math.round(dayItem.adherence)}%
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-stone-100 rounded-2xl flex flex-col justify-end overflow-hidden h-44 p-1">
                    <div
                      className={`w-full rounded-xl transition-all duration-700 ${
                        dayItem.adherence === 100
                          ? 'bg-sage-600'
                          : dayItem.missed > 0
                          ? 'bg-gradient-to-t from-coral-400 to-sage-500'
                          : 'bg-sage-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day label */}
                  <div className="text-center pt-1">
                    <span className={`text-xs block font-bold ${isToday ? 'text-sage-800 font-extrabold' : 'text-stone-700'}`}>
                      {dayItem.day}
                    </span>
                    <span className="text-[10px] text-stone-400 block">{dayItem.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 flex items-center justify-between text-xs text-sage-900">
            <span>
              🌟 <strong>Consistency Insight:</strong> Morning medications have the highest adherence (98%). Consider setting an evening alarm for Atorvastatin.
            </span>
          </div>
        </div>

        {/* Time of Day Breakdown & Ratio */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900">Time-of-Day Adherence</h3>
            <p className="text-xs text-stone-500 font-medium">Compliance by time slot category</p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Sun className="w-4 h-4" />
                    <span>Morning (8:00 AM)</span>
                  </div>
                  <span className="text-stone-900 font-extrabold">98% Adherence</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div className="bg-sage-600 h-2 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-sky-700">
                    <Coffee className="w-4 h-4" />
                    <span>Afternoon (1:00 PM)</span>
                  </div>
                  <span className="text-stone-900 font-extrabold">88% Adherence</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div className="bg-sage-600 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Moon className="w-4 h-4" />
                    <span>Evening & Bedtime (7-10 PM)</span>
                  </div>
                  <span className="text-stone-900 font-extrabold">92% Adherence</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div className="bg-sage-600 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Prescriptions Summary */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-3">
            <h3 className="font-extrabold text-base text-stone-900">Active Prescriptions ({medications.length})</h3>
            <div className="space-y-2">
              {medications.map(med => (
                <div key={med.id} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: med.pillColor }} />
                    <span className="font-bold text-stone-800">{med.name}</span>
                    <span className="text-stone-500 font-medium">({med.dosage})</span>
                  </div>
                  <span className="font-semibold text-stone-600">{med.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Doctor Visit Health Summary Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-soft-xl max-h-[90vh] overflow-y-auto border border-stone-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                  <FileCheck className="w-6 h-6 text-sage-700" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900">Physician Healthcare Report</h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Generated by CareNest for Dr. Evelyn Reed's upcoming appointment
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Report Document Body */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-stone-800 space-y-6 text-xs sm:text-sm font-sans">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-stone-900 font-display">CareNest Health Report</h1>
                  <p className="text-xs text-stone-500 font-semibold">Patient: {patient.name} (Age: {patient.age}, Blood: {patient.bloodGroup})</p>
                </div>
                <div className="text-right text-xs text-stone-500">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Primary Physician: {patient.primaryPhysician.name}</p>
                </div>
              </div>

              {/* Adherence Overview */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-stone-900 uppercase tracking-wider text-xs">
                  Medication Adherence Compliance (Past 7 Days)
                </h3>
                <p className="text-stone-700 font-semibold">
                  Overall Adherence: <strong className="text-emerald-700 text-base">{overallAdherence}%</strong> ({takenTotal} doses confirmed taken, {missedTotal} missed).
                </p>
              </div>

              {/* Active Prescriptions Table */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-stone-900 uppercase tracking-wider text-xs">
                  Current Prescribed Medications
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 font-bold text-stone-700">
                      <tr>
                        <th className="p-2.5">Medication</th>
                        <th className="p-2.5">Dosage</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Instructions</th>
                        <th className="p-2.5">Remaining Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {medications.map(m => (
                        <tr key={m.id}>
                          <td className="p-2.5 font-bold text-stone-900">{m.name}</td>
                          <td className="p-2.5 font-semibold text-stone-700">{m.dosage}</td>
                          <td className="p-2.5">{m.frequency}</td>
                          <td className="p-2.5 text-stone-600">{m.instructions}</td>
                          <td className="p-2.5 font-bold">{m.refillRemaining} pills</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Diagnosed Conditions & Allergies */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                  <p className="font-bold text-stone-800 text-xs uppercase">Diagnosed Conditions</p>
                  {patient.conditions.map((c, i) => (
                    <p key={i} className="text-xs text-stone-600">• {c.name} ({c.severity})</p>
                  ))}
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                  <p className="font-bold text-coral-800 text-xs uppercase">Allergies</p>
                  {patient.allergies.map((a, i) => (
                    <p key={i} className="text-xs text-coral-700">• {a.name} — {a.reaction}</p>
                  ))}
                </div>
              </div>

              {/* Caregiver Signoff */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <p>Caregiver: {patient.emergencyContacts[0]?.name} ({patient.emergencyContacts[0]?.phone})</p>
                <p>CareNest Platform • Confidential Medical Record</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
