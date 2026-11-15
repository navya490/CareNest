// Comprehensive Seed Data for CareNest

export const INITIAL_PATIENT = {
  id: 'eleanor-vance-78',
  name: 'Eleanor Vance',
  preferredName: 'Eleanor',
  age: 78,
  dateOfBirth: '1948-04-12',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  address: '428 Whispering Pines Way, Apt 3B, Portland, OR',
  bloodGroup: 'O+',
  phone: '(505) 555-0143',
  passcode: '1234',
  primaryPhysician: {
    name: 'Dr. Evelyn Reed, MD',
    specialty: 'Cardiovascular Medicine',
    phone: '(505) 555-0199',
    hospital: 'St. Jude Health & Heart Institute'
  },
  conditions: [
    { name: 'Hypertension (High Blood Pressure)', diagnosed: '2018', severity: 'Managed' },
    { name: 'Type 2 Diabetes', diagnosed: '2015', severity: 'Managed with oral meds' },
    { name: 'Mild Knee Osteoarthritis', diagnosed: '2021', severity: 'Mild' }
  ],
  allergies: [
    { name: 'Penicillin', reaction: 'Skin rash, hives', severity: 'Severe' },
    { name: 'Sulfa Drugs', reaction: 'Nausea, swelling', severity: 'Moderate' }
  ],
  emergencyContacts: [
    {
      name: 'Sarah Vance',
      relation: 'Daughter & Primary Caregiver',
      phone: '(505) 555-0182',
      email: 'sarah.vance@example.com',
      priority: 1,
      hasKey: true
    },
    {
      name: 'Marcus Vance',
      relation: 'Son',
      phone: '(505) 555-0138',
      email: 'marcus.vance@example.com',
      priority: 2,
      hasKey: false
    },
    {
      name: 'Emergency Medical Services (EMS)',
      relation: 'Local Dispatch',
      phone: '911',
      email: '',
      priority: 0,
      hasKey: false
    }
  ]
};

export const INITIAL_USERS = [
  {
    id: 'user-eleanor',
    name: 'Eleanor Vance',
    role: 'elderly',
    roleLabel: 'Elderly Individual',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    description: 'Viewing personal daily healthcare schedule and medications.',
    permissions: {
      canMarkTaken: true,
      canAddMedication: false,
      canEditMedication: false,
      canDeleteMedication: false,
      canAddAppointment: false,
      canEditAppointment: false,
      canAddCareNote: true,
      isCaregiver: false
    }
  },
  {
    id: 'user-sarah',
    name: 'Sarah Vance',
    role: 'caregiver',
    roleLabel: 'Primary Caregiver (Daughter)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    description: 'Full administrative access to manage medications, appointments, and care plans.',
    permissions: {
      canMarkTaken: true,
      canAddMedication: true,
      canEditMedication: true,
      canDeleteMedication: true,
      canAddAppointment: true,
      canEditAppointment: true,
      canAddCareNote: true,
      isCaregiver: true
    }
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    role: 'family',
    roleLabel: 'Family Member (Son)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    description: 'Shared family view to monitor health adherence and leave support notes.',
    permissions: {
      canMarkTaken: true,
      canAddMedication: false,
      canEditMedication: false,
      canDeleteMedication: false,
      canAddAppointment: true,
      canEditAppointment: false,
      canAddCareNote: true,
      isCaregiver: false
    }
  }
];

export const INITIAL_MEDICATIONS = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    genericName: 'Lisinopril (Prinivil)',
    dosage: '10 mg',
    form: 'Tablet',
    frequency: 'Once Daily',
    timeSlots: ['08:00'],
    timeSlotLabels: ['Morning (8:00 AM)'],
    timingGroup: 'Morning',
    instructions: 'Take in the morning with a full glass of water. Can be taken with or without food.',
    foodRelation: 'anytime', // 'with_food', 'before_food', 'after_food', 'anytime'
    foodRelationLabel: 'With or without food 💧',
    pillColor: '#F472B6', // Pink
    pillColorName: 'Pink',
    pillShape: 'Round Tablet',
    prescribedBy: 'Dr. Evelyn Reed (Cardiology)',
    purpose: 'Blood Pressure Control',
    refillRemaining: 24,
    refillTotal: 30,
    refillThreshold: 7,
    pharmacy: 'CVS Pharmacy #4192 (Phone: 505-555-0120)',
    startDate: '2023-01-10',
    active: true
  },
  {
    id: 'med-2',
    name: 'Metformin HCl',
    genericName: 'Glucophage',
    dosage: '500 mg',
    form: 'Oval Tablet',
    frequency: 'Twice Daily',
    timeSlots: ['08:00', '19:00'],
    timeSlotLabels: ['Morning (8:00 AM)', 'Evening (7:00 PM)'],
    timingGroup: 'Morning & Evening',
    instructions: 'Take strictly with breakfast and dinner to minimize stomach upset.',
    foodRelation: 'with_food',
    foodRelationLabel: 'Take with food 🍽️',
    pillColor: '#F8FAFC', // White
    pillColorName: 'White',
    pillShape: 'Oval Tablet',
    prescribedBy: 'Dr. Michael Patel (PCP)',
    purpose: 'Type 2 Diabetes / Blood Glucose',
    refillRemaining: 42,
    refillTotal: 60,
    refillThreshold: 10,
    pharmacy: 'CVS Pharmacy #4192 (Phone: 505-555-0120)',
    startDate: '2022-06-15',
    active: true
  },
  {
    id: 'med-3',
    name: 'Atorvastatin',
    genericName: 'Lipitor',
    dosage: '20 mg',
    form: 'Oval Tablet',
    frequency: 'Once Daily (Bedtime)',
    timeSlots: ['22:00'],
    timeSlotLabels: ['Bedtime (10:00 PM)'],
    timingGroup: 'Bedtime',
    instructions: 'Take every night at bedtime. Avoid grapefruit juice while taking this medication.',
    foodRelation: 'anytime',
    foodRelationLabel: 'At bedtime with water 🌙',
    pillColor: '#FBBF24', // Yellow
    pillColorName: 'Yellow',
    pillShape: 'Oval Tablet',
    prescribedBy: 'Dr. Evelyn Reed (Cardiology)',
    purpose: 'Cholesterol & Heart Health',
    refillRemaining: 4, // Intentionally low to demonstrate Refill Alert!
    refillTotal: 30,
    refillThreshold: 7,
    pharmacy: 'CVS Pharmacy #4192 (Phone: 505-555-0120)',
    startDate: '2023-03-01',
    active: true
  },
  {
    id: 'med-4',
    name: 'Vitamin D3 & Calcium Citrate',
    genericName: 'Cholecalciferol + Calcium',
    dosage: '1000 IU / 500 mg',
    form: 'Softgel Capsule',
    frequency: 'Once Daily (Afternoon)',
    timeSlots: ['13:00'],
    timeSlotLabels: ['Afternoon (1:00 PM)'],
    timingGroup: 'Afternoon',
    instructions: 'Take after midday lunch for optimal bone absorption.',
    foodRelation: 'after_food',
    foodRelationLabel: 'After lunch 🥗',
    pillColor: '#F59E0B', // Amber
    pillColorName: 'Amber',
    pillShape: 'Softgel Capsule',
    prescribedBy: 'Dr. Michael Patel (PCP)',
    purpose: 'Bone Density & Osteoarthritis Support',
    refillRemaining: 55,
    refillTotal: 60,
    refillThreshold: 10,
    pharmacy: 'Walgreens #108 (Phone: 505-555-0177)',
    startDate: '2021-11-20',
    active: true
  },
  {
    id: 'med-5',
    name: 'Glucosamine Chondroitin Complex',
    genericName: 'Joint Health Support',
    dosage: '1500 mg',
    form: 'Large Capsule',
    frequency: 'Once Daily (Morning)',
    timeSlots: ['08:00'],
    timeSlotLabels: ['Morning (8:00 AM)'],
    timingGroup: 'Morning',
    instructions: 'Take with morning meal to alleviate knee joint discomfort.',
    foodRelation: 'with_food',
    foodRelationLabel: 'With breakfast 🍳',
    pillColor: '#60A5FA', // Light Blue
    pillColorName: 'Sky Blue',
    pillShape: 'Capsule',
    prescribedBy: 'Dr. Michael Patel (PCP)',
    purpose: 'Knee Joint Comfort & Mobility',
    refillRemaining: 19,
    refillTotal: 30,
    refillThreshold: 7,
    pharmacy: 'Walgreens #108 (Phone: 505-555-0177)',
    startDate: '2023-08-01',
    active: true
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Evelyn Reed',
    specialty: 'Cardiovascular Medicine',
    hospitalOrClinic: 'St. Jude Health & Heart Center',
    address: '1200 Health Blvd, Suite 402, Portland, OR',
    date: '2026-11-17', // in 2 days
    time: '10:30 AM',
    phone: '(505) 555-0199',
    purpose: 'Quarterly blood pressure review and echocardiogram followup',
    prepInstructions: 'Please bring your 7-day home blood pressure log and current pill bottles.',
    accompaniedBy: 'Sarah Vance (Daughter)',
    status: 'Upcoming',
    badgeColor: 'sage',
    isTelehealth: false
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. Michael Patel',
    specialty: 'Internal Medicine (Primary Care)',
    hospitalOrClinic: 'Oakwood Family Health Care',
    address: '840 Elmwood Terrace, Building B, Portland, OR',
    date: '2026-11-24', // in 9 days
    time: '02:15 PM',
    phone: '(505) 555-0155',
    purpose: 'Routine 6-month diabetic HbA1c review and general physical exam',
    prepInstructions: 'Requires fasting blood draw starting midnight prior to appointment.',
    accompaniedBy: 'Marcus Vance (Son)',
    status: 'Upcoming',
    badgeColor: 'mutedblue',
    isTelehealth: false
  },
  {
    id: 'apt-3',
    doctorName: 'Dr. Sarah Jenkins, OD',
    specialty: 'Optometry & Vision Care',
    hospitalOrClinic: 'ClearVision Senior Eye Clinic',
    address: '310 Sunburst Ave, Portland, OR',
    date: '2026-12-05',
    time: '11:00 AM',
    phone: '(505) 555-0144',
    purpose: 'Annual glaucoma screen and bifocal prescription check',
    prepInstructions: 'Eyes may be dilated. Arrange for a driver home.',
    accompaniedBy: 'Sarah Vance (Daughter)',
    status: 'Upcoming',
    badgeColor: 'mutedblue',
    isTelehealth: false
  },
  {
    id: 'apt-4',
    doctorName: 'Dr. Evelyn Reed',
    specialty: 'Cardiovascular Medicine',
    hospitalOrClinic: 'St. Jude Telehealth Video Link',
    address: 'Telehealth Secure Video Link',
    date: '2026-08-15',
    time: '09:30 AM',
    phone: '(505) 555-0199',
    purpose: 'Medication adjustment check after starting Lisinopril 10mg',
    prepInstructions: 'Completed successfully. Blood pressure stabilized at 128/82.',
    accompaniedBy: 'Sarah Vance',
    status: 'Completed',
    badgeColor: 'gray',
    isTelehealth: true
  }
];

export const INITIAL_CARE_NOTES = [
  {
    id: 'note-1',
    authorName: 'Sarah Vance',
    authorRole: 'Daughter / Primary Caregiver',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    date: 'Yesterday at 5:30 PM',
    timestamp: '2026-11-14T17:30:00Z',
    tag: 'Observation',
    content: 'Visited mom this afternoon. She felt energetic and took a gentle 20-minute stroll in the courtyard. Noticed she was almost out of Atorvastatin, so I submitted a refill request to CVS.'
  },
  {
    id: 'note-2',
    authorName: 'Marcus Vance',
    authorRole: 'Son',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    date: '3 days ago at 1:15 PM',
    timestamp: '2026-11-12T13:15:00Z',
    tag: 'Groceries & Home',
    content: 'Stocked the pantry with low-sodium soups, oatmeal, and fresh berries. Cleaned out expired food in fridge and refilled the bathroom water cup.'
  },
  {
    id: 'note-3',
    authorName: 'Eleanor Vance',
    authorRole: 'Self Check-in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    date: '4 days ago at 9:00 AM',
    timestamp: '2026-11-11T09:00:00Z',
    tag: 'Health Check',
    content: 'Woke up feeling well. Knee pain was very mild today after doing my gentle morning chair stretches.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'refill',
    title: 'Medication Refill Needed',
    message: 'Atorvastatin (20 mg) has only 4 pills remaining. Refill requested at CVS Pharmacy.',
    time: '2 hours ago',
    read: false,
    urgent: true,
    actionUrl: '#medications'
  },
  {
    id: 'notif-2',
    type: 'appointment',
    title: 'Cardiology Appointment in 2 Days',
    message: 'Dr. Evelyn Reed at St. Jude Heart Center on Tuesday, Nov 17 at 10:30 AM. Don\'t forget BP log!',
    time: '4 hours ago',
    read: false,
    urgent: false,
    actionUrl: '#appointments'
  },
  {
    id: 'notif-3',
    type: 'adherence',
    title: 'High Adherence Streak! 🌟',
    message: 'Eleanor took 100% of prescribed doses over the past 48 hours. Excellent consistency.',
    time: 'Yesterday',
    read: true,
    urgent: false,
    actionUrl: '#analytics'
  },
  {
    id: 'notif-4',
    type: 'care_note',
    title: 'New Caregiver Note from Sarah',
    message: 'Sarah posted an update: Refill submitted to CVS, mom enjoyed courtyard walk.',
    time: 'Yesterday at 5:30 PM',
    read: true,
    urgent: false,
    actionUrl: '#portal'
  }
];

// 7-day adherence history for analytics
export const INITIAL_ADHERENCE_HISTORY = [
  { day: 'Mon', date: 'Nov 9', total: 6, taken: 6, missed: 0, adherence: 100 },
  { day: 'Tue', date: 'Nov 10', total: 6, taken: 5, missed: 1, adherence: 83.3 },
  { day: 'Wed', date: 'Nov 11', total: 6, taken: 6, missed: 0, adherence: 100 },
  { day: 'Thu', date: 'Nov 12', total: 6, taken: 6, missed: 0, adherence: 100 },
  { day: 'Fri', date: 'Nov 13', total: 6, taken: 5, missed: 1, adherence: 83.3 },
  { day: 'Sat', date: 'Nov 14', total: 6, taken: 6, missed: 0, adherence: 100 },
  { day: 'Sun (Today)', date: 'Nov 15', total: 6, taken: 3, missed: 0, pending: 3, adherence: 100 }
];
