// Unified Storage Service: LocalStorage + Supabase Bridge

import {
  INITIAL_PATIENT,
  INITIAL_MEDICATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_CARE_NOTES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADHERENCE_HISTORY
} from '../data/sampleData.js';

import { getSupabaseClient } from './supabaseClient.js';

const STORAGE_KEYS = {
  PATIENT: 'carenest_patient',
  MEDICATIONS: 'carenest_medications',
  DOSES: 'carenest_doses_today',
  APPOINTMENTS: 'carenest_appointments',
  CARE_NOTES: 'carenest_care_notes',
  NOTIFICATIONS: 'carenest_notifications',
  ADHERENCE: 'carenest_adherence_history',
  PASSCODE: 'carenest_elderly_passcode',
  EMAIL_SETTINGS: 'carenest_email_settings'
};

// Formats a date to YYYY-MM-DD
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate today's initial doses from medications
function generateInitialTodayDoses(medications) {
  const todayStr = getTodayDateString();
  const doses = [];
  const validMeds = Array.isArray(medications) ? medications : INITIAL_MEDICATIONS;

  validMeds.forEach((med) => {
    if (!med || !med.active) return;
    (med.timeSlots || ['08:00']).forEach((timeSlot, index) => {
      // Create dose entry
      // For demonstration: morning doses (08:00) start marked as taken, noon/evening pending
      const hour = parseInt(timeSlot.split(':')[0], 10);
      let status = 'pending';
      let takenAt = null;

      if (hour <= 8) {
        status = 'taken';
        takenAt = `${todayStr}T08:14:00Z`;
      } else if (hour <= 12) {
        status = 'pending'; // Due around noon
      } else {
        status = 'pending'; // Later in day
      }

      doses.push({
        id: `dose-${med.id}-${timeSlot}-${todayStr}`,
        medicationId: med.id,
        medicationName: med.name,
        dosage: med.dosage,
        timeSlot: timeSlot,
        timeLabel: med.timeSlotLabels ? med.timeSlotLabels[index] : `${timeSlot}`,
        timingGroup: med.timingGroup,
        instructions: med.instructions,
        foodRelationLabel: med.foodRelationLabel,
        pillColor: med.pillColor,
        pillColorName: med.pillColorName,
        pillShape: med.pillShape,
        date: todayStr,
        status: status, // 'taken', 'pending', 'skipped', 'missed'
        takenAt: takenAt,
        loggedBy: status === 'taken' ? 'Eleanor Vance' : null
      });
    });
  });

  // Sort doses chronologically
  doses.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  return doses;
}

export class StorageService {
  static _initialized = false;

  // Safe idempotent initializer that NEVER calls any getter methods
  static init() {
    if (typeof window === 'undefined') return;
    StorageService._initialized = true;

    try {
      if (!localStorage.getItem(STORAGE_KEYS.PATIENT)) {
        localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(INITIAL_PATIENT));
      }
      if (!localStorage.getItem(STORAGE_KEYS.MEDICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(INITIAL_MEDICATIONS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CARE_NOTES)) {
        localStorage.setItem(STORAGE_KEYS.CARE_NOTES, JSON.stringify(INITIAL_CARE_NOTES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ADHERENCE)) {
        localStorage.setItem(STORAGE_KEYS.ADHERENCE, JSON.stringify(INITIAL_ADHERENCE_HISTORY));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PASSCODE)) {
        localStorage.setItem(STORAGE_KEYS.PASSCODE, '1234');
      }

      // Initialize today's doses if missing WITHOUT calling getMedications()
      const savedDoses = localStorage.getItem(STORAGE_KEYS.DOSES);
      if (!savedDoses) {
        let baseMeds = INITIAL_MEDICATIONS;
        try {
          const rawMeds = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
          if (rawMeds) {
            const parsed = JSON.parse(rawMeds);
            if (Array.isArray(parsed) && parsed.length > 0) baseMeds = parsed;
          }
        } catch {
          baseMeds = INITIAL_MEDICATIONS;
        }

        const initialDoses = generateInitialTodayDoses(baseMeds);
        localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(initialDoses));
      }
    } catch (e) {
      console.warn('StorageService.init encountered error:', e);
    }
  }

  // Idempotent safeguard: ensures initialization runs at most once
  static ensureInitialized() {
    if (!StorageService._initialized) {
      StorageService.init();
    }
  }

  // --- Patient Profile ---
  static getPatient() {
    StorageService.ensureInitialized();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PATIENT);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse patient profile:', e);
    }
    return INITIAL_PATIENT;
  }

  static updatePatient(patientData) {
    const current = this.getPatient();
    const updated = { ...current, ...patientData };
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save patient profile:', e);
    }
    return updated;
  }

  // --- Passcode Management ---
  static getPasscode() {
    StorageService.ensureInitialized();
    try {
      return localStorage.getItem(STORAGE_KEYS.PASSCODE) || '1234';
    } catch {
      return '1234';
    }
  }

  static setPasscode(newPin) {
    try {
      localStorage.setItem(STORAGE_KEYS.PASSCODE, newPin);
      const patient = this.getPatient();
      patient.passcode = newPin;
      localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patient));
    } catch (e) {
      console.warn('Failed to update passcode:', e);
    }
    return true;
  }

  static verifyPasscode(enteredPin) {
    const actual = this.getPasscode();
    return String(enteredPin).trim() === String(actual).trim();
  }

  // --- Medications (CRUD) ---
  static getMedications() {
    StorageService.ensureInitialized();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse medications:', e);
    }
    return INITIAL_MEDICATIONS;
  }

  static addMedication(medData) {
    const meds = this.getMedications();
    const newMed = {
      ...medData,
      id: `med-${Date.now()}`,
      active: true,
      refillRemaining: medData.refillRemaining ? parseInt(medData.refillRemaining, 10) : 30,
      refillTotal: medData.refillTotal ? parseInt(medData.refillTotal, 10) : 30,
      refillThreshold: medData.refillThreshold ? parseInt(medData.refillThreshold, 10) : 7,
    };
    meds.push(newMed);
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
    } catch (e) {
      console.warn('Failed to save added medication:', e);
    }

    // Re-generate / update today's doses
    this.refreshTodayDoses();
    return newMed;
  }

  static updateMedication(id, updatedFields) {
    const meds = this.getMedications();
    const index = meds.findIndex(m => m.id === id);
    if (index !== -1) {
      meds[index] = { ...meds[index], ...updatedFields };
      try {
        localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
      } catch (e) {
        console.warn('Failed to save updated medication:', e);
      }
      this.refreshTodayDoses();
      return meds[index];
    }
    return null;
  }

  static deleteMedication(id) {
    const meds = this.getMedications().filter(m => m.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
      // Remove pending doses for deleted medication
      const doses = this.getTodayDoses().filter(d => d.medicationId !== id);
      localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
    } catch (e) {
      console.warn('Failed to delete medication:', e);
    }
    return true;
  }

  // Refill medication pills
  static recordRefill(medicationId, addedPills = 30) {
    const meds = this.getMedications();
    const med = meds.find(m => m.id === medicationId);
    if (med) {
      med.refillRemaining = (med.refillRemaining || 0) + addedPills;
      try {
        localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
      } catch (e) {
        console.warn('Failed to record refill:', e);
      }

      // Add a notification celebrating refill
      this.addNotification({
        type: 'refill',
        title: `Prescription Refilled: ${med.name}`,
        message: `Successfully recorded ${addedPills} pills added to ${med.name}. Current stock: ${med.refillRemaining} pills.`,
        urgent: false,
        actionUrl: '#medications'
      });
      return med;
    }
    return null;
  }

  // --- Today's Doses & Adherence Tracking ---
  static getTodayDoses() {
    StorageService.ensureInitialized();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DOSES);
      if (raw) {
        const doses = JSON.parse(raw);
        if (Array.isArray(doses) && doses.length > 0) return doses;
      }
    } catch (e) {
      console.warn('Failed to parse today doses:', e);
    }

    // Direct fallback dose generation
    const meds = this.getMedications();
    const generated = generateInitialTodayDoses(meds);
    try {
      localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(generated));
    } catch (e) {
      console.warn('Failed to save initial today doses:', e);
    }
    return generated;
  }

  static refreshTodayDoses() {
    const existingDoses = this.getTodayDoses();
    const meds = this.getMedications();
    const todayStr = getTodayDateString();

    const updatedDoses = [];
    meds.forEach(med => {
      if (!med.active) return;
      (med.timeSlots || ['08:00']).forEach((timeSlot, idx) => {
        const doseId = `dose-${med.id}-${timeSlot}-${todayStr}`;
        const existing = existingDoses.find(d => d.id === doseId || (d.medicationId === med.id && d.timeSlot === timeSlot));

        if (existing) {
          // Keep existing status (e.g. taken)
          updatedDoses.push({
            ...existing,
            medicationName: med.name,
            dosage: med.dosage,
            instructions: med.instructions,
            pillColor: med.pillColor,
            pillShape: med.pillShape,
            foodRelationLabel: med.foodRelationLabel
          });
        } else {
          // New dose entry
          updatedDoses.push({
            id: doseId,
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            timeSlot: timeSlot,
            timeLabel: med.timeSlotLabels ? med.timeSlotLabels[idx] : timeSlot,
            timingGroup: med.timingGroup,
            instructions: med.instructions,
            foodRelationLabel: med.foodRelationLabel,
            pillColor: med.pillColor,
            pillColorName: med.pillColorName,
            pillShape: med.pillShape,
            date: todayStr,
            status: 'pending',
            takenAt: null,
            loggedBy: null
          });
        }
      });
    });

    updatedDoses.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    try {
      localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(updatedDoses));
    } catch (e) {
      console.warn('Failed to save refreshed doses:', e);
    }
    return updatedDoses;
  }

  static markDose(doseId, newStatus = 'taken', loggedBy = 'Eleanor Vance') {
    const doses = this.getTodayDoses();
    const index = doses.findIndex(d => d.id === doseId);
    if (index !== -1) {
      const dose = doses[index];
      dose.status = newStatus;
      dose.takenAt = newStatus === 'taken' ? new Date().toISOString() : null;
      dose.loggedBy = newStatus === 'taken' ? loggedBy : null;

      try {
        localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
      } catch (e) {
        console.warn('Failed to save marked dose:', e);
      }

      // If marked taken, decrement pill count in medications
      if (newStatus === 'taken') {
        const meds = this.getMedications();
        const med = meds.find(m => m.id === dose.medicationId);
        if (med && med.refillRemaining > 0) {
          med.refillRemaining = Math.max(0, med.refillRemaining - 1);
          try {
            localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
          } catch (e) {
            console.warn('Failed to save decremented medication count:', e);
          }

          // If reached threshold, trigger refill alert
          if (med.refillRemaining <= (med.refillThreshold || 7)) {
            this.addNotification({
              type: 'refill',
              title: `Low Medication Alert: ${med.name}`,
              message: `${med.name} (${med.dosage}) is running low: only ${med.refillRemaining} doses left.`,
              urgent: true,
              actionUrl: '#medications'
            });
          }
        }
      }

      return dose;
    }
    return null;
  }

  // --- Doctor Appointments (CRUD) ---
  static getAppointments() {
    StorageService.ensureInitialized();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse appointments:', e);
    }
    return INITIAL_APPOINTMENTS;
  }

  static addAppointment(aptData) {
    const list = this.getAppointments();
    const newApt = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: aptData.status || 'Upcoming',
      badgeColor: 'sage',
      isTelehealth: Boolean(aptData.isTelehealth)
    };
    list.unshift(newApt);
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save appointment:', e);
    }

    // Add reminder notification
    this.addNotification({
      type: 'appointment',
      title: `New Appointment Scheduled: ${newApt.doctorName}`,
      message: `${newApt.specialty} on ${newApt.date} at ${newApt.time}.`,
      urgent: false,
      actionUrl: '#appointments'
    });

    return newApt;
  }

  static updateAppointment(id, updatedFields) {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      try {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
      } catch (e) {
        console.warn('Failed to update appointment:', e);
      }
      return list[index];
    }
    return null;
  }

  static deleteAppointment(id) {
    const list = this.getAppointments().filter(a => a.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to delete appointment:', e);
    }
    return true;
  }

  // --- Care Notes / Family Journal ---
  static getCareNotes() {
    StorageService.ensureInitialized();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CARE_NOTES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse care notes:', e);
    }
    return INITIAL_CARE_NOTES;
  }

  static addCareNote(noteData) {
    const notes = this.getCareNotes();
    const newNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: 'Just now'
    };
    notes.unshift(newNote);
    try {
      localStorage.setItem(STORAGE_KEYS.CARE_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to save care note:', e);
    }

    // Trigger notification for family
    this.addNotification({
      type: 'care_note',
      title: `Care Note from ${newNote.authorName}`,
      message: newNote.content.slice(0, 90) + (newNote.content.length > 90 ? '...' : ''),
      urgent: false,
      actionUrl: '#portal'
    });

    return newNote;
  }

  // --- In-App Notifications ---
  static getNotifications() {
    StorageService.ensureInitialized();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse notifications:', e);
    }
    return INITIAL_NOTIFICATIONS;
  }

  static addNotification(notifData) {
    const notifs = this.getNotifications();
    const newNotif = {
      ...notifData,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false
    };
    notifs.unshift(newNotif);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.warn('Failed to save notification:', e);
    }
    return newNotif;
  }

  static markNotificationRead(id) {
    const notifs = this.getNotifications();
    const notif = notifs.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      } catch (e) {
        console.warn('Failed to update notification read status:', e);
      }
    }
    return notifs;
  }

  static clearAllNotifications() {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear notifications:', e);
    }
    return [];
  }

  // --- Adherence Statistics Helper ---
  static getAdherenceStats() {
    const doses = this.getTodayDoses();
    const totalDoses = doses.length;
    const takenDoses = doses.filter(d => d.status === 'taken').length;
    const missedDoses = doses.filter(d => d.status === 'missed').length;
    const pendingDoses = doses.filter(d => d.status === 'pending').length;

    const todayPercentage = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

    let history = INITIAL_ADHERENCE_HISTORY;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADHERENCE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) history = parsed;
      }
    } catch {
      history = INITIAL_ADHERENCE_HISTORY;
    }

    // Update today's entry in history
    const updatedHistory = history.map((entry, idx) => {
      if (idx === history.length - 1) {
        return {
          ...entry,
          total: totalDoses,
          taken: takenDoses,
          missed: missedDoses,
          pending: pendingDoses,
          adherence: todayPercentage
        };
      }
      return entry;
    });

    // Compute 7-day average adherence
    const sumAdherence = updatedHistory.reduce((acc, curr) => acc + (curr.adherence || 0), 0);
    const weeklyAverage = Math.round(sumAdherence / updatedHistory.length);

    return {
      today: {
        total: totalDoses,
        taken: takenDoses,
        missed: missedDoses,
        pending: pendingDoses,
        percentage: todayPercentage
      },
      weeklyAverage: weeklyAverage,
      history: updatedHistory
    };
  }

  // Reset to original factory demo data
  static resetToDemoData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.PATIENT);
      localStorage.removeItem(STORAGE_KEYS.MEDICATIONS);
      localStorage.removeItem(STORAGE_KEYS.DOSES);
      localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
      localStorage.removeItem(STORAGE_KEYS.CARE_NOTES);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.ADHERENCE);
      localStorage.removeItem(STORAGE_KEYS.PASSCODE);
    } catch (e) {
      console.warn('Error clearing localStorage for reset:', e);
    }
    StorageService._initialized = false;
    this.init();
  }
}
