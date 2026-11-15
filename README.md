# CareNest 🌿

> **Better Care. Greater Independence.**

CareNest is a modern, interconnected elderly care and medication management platform designed to bridge the communication gap between elderly individuals, family members, and caregivers. It transforms routine healthcare management into a calming, collaborative, and dignified experience.

---

## 🌟 Why CareNest?

Managing multi-drug regimens, conflicting doctor appointment schedules, and daily wellness can be overwhelming for seniors and stressful for adult children living across town or across the globe.

CareNest provides a unified platform where:
1. **Seniors (e.g. Eleanor Vance, 78)** enjoy independence through an ultra-accessible, non-clinical interface with large tactile controls, voice-read schedules, visual pill identification, and a friendly AI companion.
2. **Primary Caregivers (e.g. Sarah Vance)** have peace of mind through real-time adherence tracking, instant missed-dose alerts, pill refill meters, and doctor visit coordinators.
3. **Family Members (e.g. Marcus Vance)** can stay in the loop and leave heartwarming notes and updates in the shared Family Care Journal.

---

## 🎨 Design Philosophy & Calming Aesthetic

- **Palette**: Calming sage green (`#4D7257`, `#648E70`), warm ivory/linen (`#FAF8F5`, `#F5F0EA`), pure white, and muted slate blue (`#45667E`), avoiding the cold, intimidating feel of generic hospital dashboards.
- **Elderly Comfort Mode (Aa+)**: One-click toggle in the header that elevates font sizes to 18px base, enhances contrast, and enlarges all button tap targets to 52px+ for tremor-friendly interaction.
- **Voice Readout (Web Speech API)**: Tap *"Listen to Schedule"* 🔊 to hear today's pills and appointments read aloud in a warm, patient voice.
- **Visual Pill Identification**: Pills are rendered with physical shape (round tablet, oval, capsule, softgel) and vibrant color swatches so seniors identify pills by sight rather than confusing generic names.
- **Celebration Feedback**: Marking a dose taken triggers harmonic audio chimes and subtle celebration confetti to positively reinforce daily adherence routines.

---

## 🚀 Core Modules

### 1. 🔐 Authentication, Access & Demo Persona Switcher
- **3 Distinct Personas**:
  - `Eleanor Vance`: Elderly user with simplified, big-button view.
  - `Sarah Vance`: Primary Caregiver (Daughter) with full administrative CRUD permissions.
  - `Marcus Vance`: Family Member (Son) with observational & journal rights.
- **Passcode Protection**: 4-digit PIN system (default: `1234`) to switch between roles or modify prescriptions.
- **Role-based Permissions**: Sensitive operations (add/edit/delete medications and appointments) are restricted to authorized caregivers.

### 2. 👵 Elderly Daily Routine Dashboard
- **Warm Contextual Welcome**: Personalized greeting adjusting to time of day (*Good morning, Eleanor 🌸*).
- **"Next Due Medication" Hero Card**: High-contrast card with immediate countdown, food relation rules (*"Take with food 🍽️"*), and a giant **"I Took This!"** button.
- **Daily Medication Timeline**: Morning, Afternoon, and Evening pill groupings with color-coded status chips (*Taken ✅, Pending ⏳, Missed ⚠️*).
- **Daily Wellness Check-in**: Quick one-tap mood selection (*Good, Okay, Tired*) automatically shared with family.
- **Emergency SOS & Family Quick Call**: Immediate one-tap dialing for Primary Caregiver, Family, and 911.

### 3. 💊 Comprehensive Medication Management (Full CRUD)
- **Add / Edit / Delete Prescriptions**: Manage dosage, unit, frequency, timing slots, prescribing physician, and pharmacy.
- **Visual Pill Customizer**: Select pill color and shape.
- **Refill Stock Tracker**: Visual progress bar indicating remaining doses with automatic warnings when supply drops below the threshold (≤ 7 days).
- **One-Click Refill**: Record pharmacy refills (+30 pills) directly from the dashboard.
- **Search & Category Filters**: Search by medicine name, doctor, or condition; filter by time of day or low stock.

### 4. 📅 Doctor Appointment Management (Full CRUD)
- **Schedule & Track Visits**: Doctor name, specialty, clinic address, date, and time.
- **Telehealth & In-Person Badges**: Visual indicators for video consultations vs clinic visits.
- **Pre-Appointment Checklists**: Fasting instructions, home blood pressure logs, and required documents.
- **Relative Countdown Badges**: *Tomorrow*, *In 2 days*, *In 9 days*.
- **Quick Actions**: One-tap phone dialing to medical clinics and calendar export.

### 5. 👨‍👩‍👧 Family & Caregiver Portal
- **Live Patient Health Status**: Overview of chronic conditions, known allergies, blood group, and primary physician.
- **Real-Time Missed Dose Warning**: Prominent alert banner if a scheduled dose passes without confirmation, with instant *"Call Eleanor"* or *"View Email Dispatch"* actions.
- **Interactive Family Care Journal**: Chronological feed where family members post observations, grocery drop-offs, and check-in notes.
- **Shared Access Passcode Settings**: View, update, or copy shareable invitations to other family members.

### 6. 🔔 Smart Notification System & Email Dispatcher
- **In-App Notification Center**: Unread count badge, filterable by Refill Alerts, Appointments, and Adherence Streaks.
- **Audio Chime System**: Harmonic Web Audio API synthesizers for medication confirmation and gentle alerts.
- **Transactional Email Simulator**: Live preview modal displaying the exact HTML notification sent to caregiver email addresses when medications are missed.

### 7. 🤖 NestBot AI Care Assistant
- **Context-Aware Healthcare Companion**: Intelligently inspects Eleanor's live medication schedule, pending doses, and upcoming doctor appointments to answer questions conversationally.
- **Strict Safety Guardrails**:
  - Refuses to diagnose illnesses or change prescribed dosages.
  - Urges emergency triage (911) if keywords like *chest pain* or *difficulty breathing* are mentioned.
  - Reminds users to consult Dr. Evelyn Reed for clinical decisions.
- **Speech Synthesis (TTS)**: Listen to any AI response read out loud.
- **Quick Question Chips**: Instant answers for common questions seniors ask.

### 8. 📊 Adherence Analytics & Clinical Reports
- **7-Day Compliance Bar Chart**: SVG visualization of daily doses taken vs missed.
- **Time-of-Day Adherence**: Breakdown across Morning (98%), Afternoon (88%), and Evening (92%).
- **Doctor Visit Summary Report**: Printable, doctor-ready health summary modal complete with active prescriptions, conditions, allergies, and weekly adherence rates.

### 9. ☁️ Dual-Layer Persistence (LocalStorage + Supabase)
- **100% Turnkey Demo Mode**: Works completely offline out of the box with zero external setup using browser `localStorage`.
- **Supabase Cloud Sync Ready**: Built-in modal to connect Supabase URL and Public Anon Key.
- **Built-in SQL Schema Generator**: One-click copy of the complete PostgreSQL schema (tables, foreign keys, RLS policies) to paste directly into the Supabase SQL Editor.

---

## 💻 Tech Stack

- **Frontend Framework**: React 18 (Component-based architecture)
- **Styling**: Tailwind CSS with custom Sage/Ivory/Muted Blue color system
- **Icons**: Lucide React
- **Animations**: Canvas Confetti, CSS keyframe pulses
- **Speech & Audio**: Web Speech API (Synthesis) & Web Audio API (Chimes)
- **Persistence**: Hybrid Browser `localStorage` + `@supabase/supabase-js`
- **Build Tool**: Vite 5

---

## ⚡ Quick Start Guide

### Option 1: Double-Click (Windows)
Simply double-click `start.bat` in the project root folder. It sets up the environment and opens `http://localhost:3000` in your browser.

### Option 2: Command Line
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🔑 Demo Personas & Passcode

- **Default Passcode**: `1234`
- **Elderly Profile**: *Eleanor Vance* (78 years old)
- **Caregiver Profile**: *Sarah Vance* (Daughter & Primary Caregiver)
- **Family Profile**: *Marcus Vance* (Son)

To switch personas, click on the user avatar in the top-right corner of the navigation bar.

---

## 📄 License
MIT License. Created for the CareNest Elderly Care Innovation Platform.
