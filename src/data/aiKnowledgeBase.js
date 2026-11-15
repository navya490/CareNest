// AI Care Assistant Engine (NestBot) with Safety Guardrails & Live Schedule Awareness

export function generateNestBotResponse(userPrompt, contextData) {
  const query = userPrompt.toLowerCase().trim();
  const { patient, medications, todayDoses, appointments } = contextData;

  // 1. EMERGENCY MEDICAL TRIAGE CHECK
  const emergencyKeywords = ['chest pain', 'hard to breathe', 'can\'t breathe', 'stroke', 'passed out', 'fainted', 'bleeding heavily', 'emergency', 'call ambulance', 'heart attack'];
  if (emergencyKeywords.some(k => query.includes(k))) {
    return {
      text: `⚠️ **IMPORTANT SAFETY ALERT**: If you or Eleanor are experiencing chest pain, difficulty breathing, sudden numbness, or a medical emergency, please call **911** or your local emergency services immediately.\n\nEmergency Contacts:\n• 911 (EMS)\n• Primary Caregiver: ${patient.emergencyContacts[0]?.name} at ${patient.emergencyContacts[0]?.phone}\n\nDo not wait or rely on an app in an emergency.`,
      isEmergency: true,
      audioMessage: "This sounds like an urgent medical situation. Please call 911 or your emergency contact immediately."
    };
  }

  // 2. DOSAGE MODIFICATION OR DIAGNOSIS GUARDRAIL
  const medicalDecisionKeywords = ['should i stop', 'stop taking', 'increase dose', 'double dose', 'change my dosage', 'diagnose', 'what disease', 'prescribe', 'alternative to'];
  if (medicalDecisionKeywords.some(k => query.includes(k))) {
    return {
      text: `🛡️ **Medical Decision Policy**: As your CareNest assistant, I cannot diagnose medical conditions or recommend changing your prescribed medications or dosages.\n\n**What you should do:**\n• Never adjust or skip medications without speaking to your doctor.\n• Please contact your primary physician: **${patient.primaryPhysician.name}** at **${patient.primaryPhysician.phone}**.\n• Or call your pharmacy: **${medications[0]?.pharmacy || 'CVS Pharmacy'}** for questions about side effects.`,
      isEmergency: false,
      audioMessage: "I cannot advise on changing medication doses. Please consult your physician Dr. Reed before making any changes."
    };
  }

  // 3. MISSED DOSE ADVICE
  if (query.includes('missed') || query.includes('forgot') || query.includes('skip')) {
    return {
      text: `⏰ **Handling a Missed Dose**:\n\n1. Check your schedule below to see which dose was missed.\n2. General safety guideline: If it is close to your next scheduled dose, **never take two doses at once**.\n3. Take the missed dose as soon as you remember, unless it is almost time for the next scheduled dose.\n4. You can mark the dose as "Missed" or "Taken" right in the daily timeline.\n5. If unsure, call **${patient.primaryPhysician.name}** at **${patient.primaryPhysician.phone}** or your pharmacist.`,
      isEmergency: false,
      audioMessage: "If you missed a dose, do not take double pills. Check your schedule or call your doctor for guidance."
    };
  }

  // 4. NEXT SCHEDULED MEDICATION
  if (query.includes('next') || query.includes('due') || query.includes('what pill') || query.includes('what do i take next') || query.includes('upcoming pill')) {
    const nextPending = todayDoses.find(d => d.status === 'pending');
    if (nextPending) {
      const resp = `💊 Your next medication is **${nextPending.medicationName}** (${nextPending.dosage}), scheduled for **${nextPending.timeLabel}**.\n\n• **Instructions**: ${nextPending.instructions}\n• **Food rule**: ${nextPending.foodRelationLabel}\n• **Appearance**: ${nextPending.pillColorName} ${nextPending.pillShape}\n\nYou can click the big green **"I Took This"** button on your dashboard once you take it!`;
      return {
        text: resp,
        isEmergency: false,
        audioMessage: `Your next medication is ${nextPending.medicationName} ${nextPending.dosage}, due at ${nextPending.timeLabel}. Remember to ${nextPending.instructions}`
      };
    } else {
      return {
        text: `🎉 Wonderful news! All of your scheduled medications for today have already been marked as taken! Your adherence today is **100%**. Rest well and stay hydrated!`,
        isEmergency: false,
        audioMessage: "All of your scheduled medications for today have been taken! Great job keeping up with your health."
      };
    }
  }

  // 5. TODAY'S COMPLETE SCHEDULE
  if (query.includes('today') || query.includes('schedule') || query.includes('all pills') || query.includes('list')) {
    const listText = todayDoses.map(d => {
      const statusIcon = d.status === 'taken' ? '✅ Taken' : (d.status === 'missed' ? '⚠️ Missed' : '⏳ Pending');
      return `• **${d.timeLabel}**: ${d.medicationName} (${d.dosage}) — *${statusIcon}* (${d.instructions})`;
    }).join('\n');

    const pendingCount = todayDoses.filter(d => d.status === 'pending').length;
    const takenCount = todayDoses.filter(d => d.status === 'taken').length;

    return {
      text: `📋 **Here is your medication schedule for today**:\n\n${listText}\n\n**Summary**: ${takenCount} taken, ${pendingCount} remaining today.`,
      isEmergency: false,
      audioMessage: `Today you have ${todayDoses.length} doses scheduled. ${takenCount} are already taken and ${pendingCount} are pending.`
    };
  }

  // 6. DOCTOR APPOINTMENTS
  if (query.includes('appointment') || query.includes('doctor') || query.includes('visit') || query.includes('dr')) {
    const upcoming = appointments.filter(a => a.status === 'Upcoming');
    if (upcoming.length > 0) {
      const nextApt = upcoming[0];
      const resp = `📅 **Upcoming Doctor Appointment**:\n\n• **Doctor**: ${nextApt.doctorName} (${nextApt.specialty})\n• **Date & Time**: ${nextApt.date} at ${nextApt.time}\n• **Location**: ${nextApt.hospitalOrClinic} (${nextApt.address})\n• **Reason**: ${nextApt.purpose}\n• **Special Instructions**: ${nextApt.prepInstructions}\n• **Accompanied by**: ${nextApt.accompaniedBy || 'Family member'}\n• **Clinic Phone**: ${nextApt.phone}`;
      return {
        text: resp,
        isEmergency: false,
        audioMessage: `Your next appointment is with ${nextApt.doctorName} on ${nextApt.date} at ${nextApt.time}. Please remember: ${nextApt.prepInstructions}`
      };
    } else {
      return {
        text: `You have no upcoming appointments in the immediate calendar. You can view past appointments in the **Appointments** tab!`,
        isEmergency: false,
        audioMessage: "You have no upcoming doctor visits scheduled in the near future."
      };
    }
  }

  // 7. REFILL QUESTIONS
  if (query.includes('refill') || query.includes('low') || query.includes('cvs') || query.includes('pharmacy')) {
    const lowMeds = medications.filter(m => m.refillRemaining <= (m.refillThreshold || 7));
    if (lowMeds.length > 0) {
      const medsList = lowMeds.map(m => `• **${m.name}** (${m.dosage}): Only **${m.refillRemaining} pills left**! (Pharmacy: ${m.pharmacy})`).join('\n');
      return {
        text: `💊 **Medication Refill Alert**:\n\nThe following medications need refilling:\n${medsList}\n\nCaregiver **Sarah Vance** has already been notified and can confirm the refill in the **Medications** module.`,
        isEmergency: false,
        audioMessage: `You have ${lowMeds.length} medication that needs a refill soon: ${lowMeds.map(m => m.name).join(', ')}.`
      };
    } else {
      return {
        text: `✅ All your prescriptions currently have adequate supply! All pill counts are above their refill thresholds.`,
        isEmergency: false,
        audioMessage: "All your medications have sufficient supply. No immediate refills are needed."
      };
    }
  }

  // 8. HOW TO USE CARENEST
  if (query.includes('how to use') || query.includes('help') || query.includes('how do i') || query.includes('features')) {
    return {
      text: `🏠 **Welcome to CareNest Guide**:\n\n1. **Elderly Mode**: Designed with extra large fonts and high-contrast buttons for effortless viewing.\n2. **Marking Pills**: Tap the large green **"I Took This"** button next to your due medication to record it.\n3. **Comfort Mode (Aa+)**: Tap the font toggle in the top bar to make text even larger and easier to read.\n4. **Listen to Schedule**: Click the speaker icon 🔊 anytime to hear your schedule read out loud.\n5. **Caregiver Access**: Family members can switch profiles in the top right to adjust prescriptions, schedule appointments, and write in the family care journal.\n6. **Questions**: You can ask me anytime about your pills, doctors, or routine!`,
      isEmergency: false,
      audioMessage: "CareNest helps you manage your medications easily. Click the large green button when you take your pills, or ask me any question about your schedule."
    };
  }

  // 9. HYDRATION & DAILY WELLNESS ROUTINE
  if (query.includes('water') || query.includes('food') || query.includes('exercise') || query.includes('routine') || query.includes('walk')) {
    return {
      text: `💧 **Daily Wellness Reminder for Eleanor**:\n\n• **Hydration**: Drink a small glass of fresh water with each medication to help digestion and circulation.\n• **Food Pairing**: Remember to take Metformin with meals (breakfast & dinner) to avoid an upset stomach.\n• **Gentle Movement**: A 15-minute garden walk or seated ankle rotations keep your knee joints feeling comfortable.\n• **Rest**: Take your Atorvastatin right before bedtime and rest well!`,
      isEmergency: false,
      audioMessage: "Remember to drink a full glass of water with your medications and take a gentle daily stroll to keep your joints moving smoothly."
    };
  }

  // DEFAULT CONVERSATIONAL RESPONSE
  return {
    text: `Hello! I am **NestBot**, your CareNest daily health companion.\n\nI can help you with:\n• *"What medication do I take next?"*\n• *"Show me today's schedule."*\n• *"When is my next doctor appointment?"*\n• *"Do I have any medications that need refilling?"*\n• *"How do I mark my pill as taken?"*\n\n*(Note: For medical diagnosis or changes to your prescription, please consult Dr. Evelyn Reed at (505) 555-0199 or call 911 in an emergency).*`,
    isEmergency: false,
    audioMessage: "Hello! I am NestBot, your CareNest companion. Ask me anything about your daily medication schedule or doctor appointments."
  };
}

export const SUGGESTED_QUESTIONS = [
  "What is my next due medication?",
  "Show my medication schedule today",
  "When is my next doctor appointment?",
  "Are any of my medications running low?",
  "What should I do if I miss a dose?",
  "How do I mark a medication as taken?"
];
