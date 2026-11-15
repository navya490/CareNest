// CareNest Global Application Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storageService.js';
import { soundService } from '../services/speechService.js';
import { INITIAL_USERS } from '../data/sampleData.js';
import confetti from 'canvas-confetti';

const CareNestContext = createContext(null);

export function CareNestProvider({ children }) {
  // Ensure storage is initialized safely once before state setup
  StorageService.ensureInitialized();

  // State initialization
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('carenest_active_user') : null;
      return savedUser ? JSON.parse(savedUser) : INITIAL_USERS[0]; // Eleanor by default
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [patient, setPatient] = useState(() => StorageService.getPatient());
  const [medications, setMedications] = useState(() => StorageService.getMedications());
  const [todayDoses, setTodayDoses] = useState(() => StorageService.getTodayDoses());
  const [appointments, setAppointments] = useState(() => StorageService.getAppointments());
  const [careNotes, setCareNotes] = useState(() => StorageService.getCareNotes());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [adherenceStats, setAdherenceStats] = useState(() => StorageService.getAdherenceStats());

  // UI Settings
  const [comfortMode, setComfortMode] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('carenest_comfort_mode') === 'true' : false;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('carenest_sound_enabled') !== 'false' : true;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeSuccessCallback, setPasscodeSuccessCallback] = useState(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalContent, setEmailModalContent] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Sync Comfort Mode class to document body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (comfortMode) {
        document.body.classList.add('elderly-comfort-mode');
      } else {
        document.body.classList.remove('elderly-comfort-mode');
      }
      localStorage.setItem('carenest_comfort_mode', comfortMode);
    }
  }, [comfortMode]);

  // Sync Sound preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('carenest_sound_enabled', soundEnabled);
    }
  }, [soundEnabled]);

  // Sync Active User to localStorage
  const switchUser = (userRole) => {
    const target = INITIAL_USERS.find(u => u.role === userRole) || INITIAL_USERS[0];
    setCurrentUser(target);
    localStorage.setItem('carenest_active_user', JSON.stringify(target));

    if (soundEnabled) {
      soundService.playAlertChime();
    }
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4D7257', '#ADC6B3', '#DDA638', '#5A7F9A']
      });
    } catch {
      // Ignore if confetti unavailable
    }
  };

  // --- Actions ---

  // Mark dose taken
  const markDoseTaken = (doseId) => {
    const updated = StorageService.markDose(doseId, 'taken', currentUser.name);
    if (updated) {
      setTodayDoses(StorageService.getTodayDoses());
      setMedications(StorageService.getMedications());
      setAdherenceStats(StorageService.getAdherenceStats());
      setNotifications(StorageService.getNotifications());

      if (soundEnabled) {
        soundService.playSuccessChime();
      }
      triggerCelebration();

      return true;
    }
    return false;
  };

  // Undo dose taken
  const undoDoseTaken = (doseId) => {
    const updated = StorageService.markDose(doseId, 'pending', null);
    if (updated) {
      setTodayDoses(StorageService.getTodayDoses());
      setAdherenceStats(StorageService.getAdherenceStats());
      return true;
    }
    return false;
  };

  // Mark dose as missed
  const markDoseMissed = (doseId) => {
    const updated = StorageService.markDose(doseId, 'missed', currentUser.name);
    if (updated) {
      setTodayDoses(StorageService.getTodayDoses());
      setAdherenceStats(StorageService.getAdherenceStats());

      // Trigger email alert simulation
      triggerSimulatedMissedDoseEmail(updated);
      return true;
    }
    return false;
  };

  // Add Medication
  const addMedication = (medData) => {
    const newMed = StorageService.addMedication(medData);
    setMedications(StorageService.getMedications());
    setTodayDoses(StorageService.getTodayDoses());
    setAdherenceStats(StorageService.getAdherenceStats());
    if (soundEnabled) soundService.playSuccessChime();
    return newMed;
  };

  // Edit Medication
  const updateMedication = (id, medData) => {
    const updated = StorageService.updateMedication(id, medData);
    setMedications(StorageService.getMedications());
    setTodayDoses(StorageService.getTodayDoses());
    if (soundEnabled) soundService.playSuccessChime();
    return updated;
  };

  // Delete Medication
  const deleteMedication = (id) => {
    StorageService.deleteMedication(id);
    setMedications(StorageService.getMedications());
    setTodayDoses(StorageService.getTodayDoses());
    setAdherenceStats(StorageService.getAdherenceStats());
    return true;
  };

  // Refill medication
  const recordRefill = (id, count = 30) => {
    const refilled = StorageService.recordRefill(id, count);
    setMedications(StorageService.getMedications());
    setNotifications(StorageService.getNotifications());
    if (soundEnabled) soundService.playSuccessChime();
    triggerCelebration();
    return refilled;
  };

  // Add Appointment
  const addAppointment = (aptData) => {
    const newApt = StorageService.addAppointment(aptData);
    setAppointments(StorageService.getAppointments());
    setNotifications(StorageService.getNotifications());
    if (soundEnabled) soundService.playSuccessChime();
    return newApt;
  };

  // Update Appointment
  const updateAppointment = (id, aptData) => {
    const updated = StorageService.updateAppointment(id, aptData);
    setAppointments(StorageService.getAppointments());
    return updated;
  };

  // Delete Appointment
  const deleteAppointment = (id) => {
    StorageService.deleteAppointment(id);
    setAppointments(StorageService.getAppointments());
    return true;
  };

  // Add Care Note
  const addCareNote = (content, tag = 'Update') => {
    const newNote = StorageService.addCareNote({
      authorName: currentUser.name,
      authorRole: currentUser.roleLabel,
      avatar: currentUser.avatar,
      tag: tag,
      content: content
    });
    setCareNotes(StorageService.getCareNotes());
    setNotifications(StorageService.getNotifications());
    if (soundEnabled) soundService.playSuccessChime();
    return newNote;
  };

  // Notification actions
  const markNotificationRead = (id) => {
    const updated = StorageService.markNotificationRead(id);
    setNotifications([...updated]);
  };

  const clearAllNotifications = () => {
    StorageService.clearAllNotifications();
    setNotifications([]);
  };

  // Passcode verification modal workflow
  const requestPasscodeVerification = (onSuccess) => {
    setPasscodeSuccessCallback(() => onSuccess);
    setIsPasscodeModalOpen(true);
  };

  // Simulated Email Notification
  const triggerSimulatedMissedDoseEmail = (dose) => {
    const caregiver = patient.emergencyContacts[0] || { name: 'Sarah Vance', email: 'sarah.vance@example.com' };
    const emailData = {
      to: caregiver.email,
      toName: caregiver.name,
      patientName: patient.name,
      subject: `⚠️ CareNest Alert: Missed Dose for ${patient.name}`,
      medicationName: dose.medicationName,
      dosage: dose.dosage,
      timeSlot: dose.timeLabel,
      timestamp: new Date().toLocaleTimeString(),
      doctorPhone: patient.primaryPhysician.phone
    };
    setEmailModalContent(emailData);
    setIsEmailModalOpen(true);
    if (soundEnabled) soundService.playAlertChime();
  };

  // Text to speech readout
  const speakText = (text) => {
    if (!soundEnabled) return;
    soundService.speak(text);
  };

  // Stop speech
  const stopSpeech = () => {
    soundService.stopSpeaking();
  };

  // Reset demo
  const resetDemo = () => {
    StorageService.resetToDemoData();
    setPatient(StorageService.getPatient());
    setMedications(StorageService.getMedications());
    setTodayDoses(StorageService.getTodayDoses());
    setAppointments(StorageService.getAppointments());
    setCareNotes(StorageService.getCareNotes());
    setNotifications(StorageService.getNotifications());
    setAdherenceStats(StorageService.getAdherenceStats());
    setCurrentUser(INITIAL_USERS[0]);
    setActiveTab('dashboard');
    if (soundEnabled) soundService.playSuccessChime();
  };

  return (
    <CareNestContext.Provider
      value={{
        currentUser,
        switchUser,
        patient,
        setPatient,
        medications,
        todayDoses,
        appointments,
        careNotes,
        notifications,
        adherenceStats,
        comfortMode,
        setComfortMode,
        soundEnabled,
        setSoundEnabled,
        activeTab,
        setActiveTab,
        // CRUD
        markDoseTaken,
        undoDoseTaken,
        markDoseMissed,
        addMedication,
        updateMedication,
        deleteMedication,
        recordRefill,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addCareNote,
        markNotificationRead,
        clearAllNotifications,
        // Passcode modal
        isPasscodeModalOpen,
        setIsPasscodeModalOpen,
        passcodeSuccessCallback,
        requestPasscodeVerification,
        // Modals & Drawers
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isEmailModalOpen,
        setIsEmailModalOpen,
        emailModalContent,
        setEmailModalContent,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        // Speech & Audio
        speakText,
        stopSpeech,
        triggerSimulatedMissedDoseEmail,
        resetDemo
      }}
    >
      {children}
    </CareNestContext.Provider>
  );
}

export function useCareNest() {
  const context = useContext(CareNestContext);
  if (!context) {
    throw new Error('useCareNest must be used within a CareNestProvider');
  }
  return context;
}
