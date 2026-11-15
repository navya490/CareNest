import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Pill,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldAlert,
  X,
  Check,
  PackagePlus,
  HelpCircle
} from 'lucide-react';

const PILL_COLORS = [
  { name: 'Pink', hex: '#F472B6' },
  { name: 'White', hex: '#F8FAFC' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Sky Blue', hex: '#60A5FA' },
  { name: 'Sage Green', hex: '#648E70' },
  { name: 'Purple', hex: '#C084FC' },
  { name: 'Coral', hex: '#FB7185' }
];

const PILL_SHAPES = ['Round Tablet', 'Oval Tablet', 'Capsule', 'Softgel Capsule', 'Liquid / Drops', 'Inhaler'];

export default function MedicationManager() {
  const {
    medications,
    currentUser,
    addMedication,
    updateMedication,
    deleteMedication,
    recordRefill,
    requestPasscodeVerification
  } = useCareNest();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once Daily',
    timeSlot: '08:00',
    timingGroup: 'Morning',
    instructions: '',
    foodRelation: 'with_food',
    foodRelationLabel: 'Take with meals 🍽️',
    pillColor: '#F472B6',
    pillColorName: 'Pink',
    pillShape: 'Round Tablet',
    prescribedBy: 'Dr. Evelyn Reed (Cardiology)',
    purpose: '',
    refillRemaining: 30,
    refillTotal: 30,
    refillThreshold: 7,
    pharmacy: 'CVS Pharmacy #4192 (Phone: 505-555-0120)'
  });

  const [formErrors, setFormErrors] = useState({});

  // Filter medications
  const filteredMeds = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.purpose && med.purpose.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.prescribedBy && med.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === 'all') return true;
    if (filterCategory === 'morning') return (med.timingGroup || '').toLowerCase().includes('morning') || (med.timeSlots || []).some(t => parseInt(t, 10) < 12);
    if (filterCategory === 'afternoon') return (med.timingGroup || '').toLowerCase().includes('afternoon') || (med.timeSlots || []).some(t => {
      const h = parseInt(t, 10);
      return h >= 12 && h < 17;
    });
    if (filterCategory === 'evening') return (med.timingGroup || '').toLowerCase().includes('evening') || (med.timingGroup || '').toLowerCase().includes('bedtime') || (med.timeSlots || []).some(t => parseInt(t, 10) >= 17);
    if (filterCategory === 'low_refill') return med.refillRemaining <= (med.refillThreshold || 7);

    return true;
  });

  // Handle opening Add Modal
  const handleOpenAdd = () => {
    if (!currentUser.permissions.canAddMedication) {
      requestPasscodeVerification(() => {
        openModalWithBlank();
      });
    } else {
      openModalWithBlank();
    }
  };

  const openModalWithBlank = () => {
    setEditingMed(null);
    setFormData({
      name: '',
      dosage: '',
      frequency: 'Once Daily',
      timeSlot: '08:00',
      timingGroup: 'Morning',
      instructions: 'Take with a glass of water',
      foodRelation: 'with_food',
      foodRelationLabel: 'Take with food 🍽️',
      pillColor: '#F472B6',
      pillColorName: 'Pink',
      pillShape: 'Round Tablet',
      prescribedBy: 'Dr. Evelyn Reed (Cardiology)',
      purpose: 'Blood Pressure Control',
      refillRemaining: 30,
      refillTotal: 30,
      refillThreshold: 7,
      pharmacy: 'CVS Pharmacy #4192'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle opening Edit Modal
  const handleOpenEdit = (med) => {
    if (!currentUser.permissions.canEditMedication) {
      requestPasscodeVerification(() => {
        populateAndOpenEdit(med);
      });
    } else {
      populateAndOpenEdit(med);
    }
  };

  const populateAndOpenEdit = (med) => {
    setEditingMed(med);
    setFormData({
      name: med.name || '',
      dosage: med.dosage || '',
      frequency: med.frequency || 'Once Daily',
      timeSlot: (med.timeSlots && med.timeSlots[0]) || '08:00',
      timingGroup: med.timingGroup || 'Morning',
      instructions: med.instructions || '',
      foodRelation: med.foodRelation || 'with_food',
      foodRelationLabel: med.foodRelationLabel || 'Take with food 🍽️',
      pillColor: med.pillColor || '#F472B6',
      pillColorName: med.pillColorName || 'Pink',
      pillShape: med.pillShape || 'Round Tablet',
      prescribedBy: med.prescribedBy || '',
      purpose: med.purpose || '',
      refillRemaining: med.refillRemaining ?? 30,
      refillTotal: med.refillTotal ?? 30,
      refillThreshold: med.refillThreshold ?? 7,
      pharmacy: med.pharmacy || 'CVS Pharmacy #4192'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteRequest = (id) => {
    if (!currentUser.permissions.canDeleteMedication) {
      requestPasscodeVerification(() => {
        setDeleteConfirmId(id);
      });
    } else {
      setDeleteConfirmId(id);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteMedication(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Medication name is required';
    if (!formData.dosage.trim()) errors.dosage = 'Dosage is required (e.g., 10 mg)';
    if (!formData.instructions.trim()) errors.instructions = 'Instructions are required';
    if (formData.refillRemaining < 0) errors.refillRemaining = 'Pill count cannot be negative';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Calculate timeSlotLabels and foodRelationLabel
    let foodLabel = 'With or without food 💧';
    if (formData.foodRelation === 'with_food') foodLabel = 'Take with food 🍽️';
    else if (formData.foodRelation === 'before_food') foodLabel = 'Take before food ⏳';
    else if (formData.foodRelation === 'after_food') foodLabel = 'Take after food 🥗';

    const payload = {
      ...formData,
      foodRelationLabel: foodLabel,
      timeSlots: [formData.timeSlot],
      timeSlotLabels: [`${formData.timingGroup} (${formatTime(formData.timeSlot)})`]
    };

    if (editingMed) {
      updateMedication(editingMed.id, payload);
    } else {
      addMedication(payload);
    }

    setIsModalOpen(false);
  };

  function formatTime(time24) {
    if (!time24) return '8:00 AM';
    const [h, m] = time24.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${suffix}`;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sage-100 text-sage-800">
              <Pill className="w-5 h-5 text-sage-700" />
            </span>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Medication Management
            </h1>
          </div>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Manage prescriptions, dosage frequencies, pill visuals, and refill schedules.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-bold shadow-md shadow-sage-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Role permission info banner */}
      {!currentUser.permissions.canAddMedication && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              <strong>Note:</strong> You are browsing as <strong>{currentUser.name}</strong>. Adding, editing, or deleting medications requires Primary Caregiver passcode verification.
            </span>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, doctor, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {[
            { id: 'all', label: 'All Medications' },
            { id: 'morning', label: 'Morning' },
            { id: 'afternoon', label: 'Afternoon' },
            { id: 'evening', label: 'Evening' },
            { id: 'low_refill', label: 'Low Stock ⚠️' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat.id
                  ? 'bg-sage-600 text-white shadow-soft-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeds.map((med) => {
          const isLowStock = med.refillRemaining <= (med.refillThreshold || 7);
          const percentLeft = Math.round(((med.refillRemaining || 0) / (med.refillTotal || 30)) * 100);

          return (
            <div
              key={med.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-soft hover:shadow-soft-lg flex flex-col justify-between ${
                isLowStock ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200/80'
              }`}
            >
              <div className="space-y-4">
                {/* Top Row: Pill visual, name, dosage */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm"
                      style={{ backgroundColor: med.pillColor || '#4D7257' }}
                      title={`Appearance: ${med.pillColorName} ${med.pillShape}`}
                    >
                      <Pill className="w-5 h-5 text-white drop-shadow-sm" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-stone-900 leading-tight">
                        {med.name}
                      </h3>
                      <p className="text-xs font-bold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                    {med.timingGroup || 'Daily'}
                  </span>
                </div>

                {/* Purpose & Doctor */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  {med.purpose && (
                    <p className="font-semibold text-stone-700">
                      <span className="text-stone-400 font-normal">Purpose:</span> {med.purpose}
                    </p>
                  )}
                  <p>
                    <span className="text-stone-400">Prescribed by:</span> {med.prescribedBy}
                  </p>
                  <p className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 font-medium text-stone-700">
                    {med.instructions}
                  </p>
                </div>

                {/* Food Relation & Visual tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-stone-500">
                  <span className="px-2 py-1 bg-ivory-200 text-stone-800 rounded-lg">
                    {med.foodRelationLabel}
                  </span>
                  <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-lg">
                    {med.pillShape}
                  </span>
                </div>

                {/* Stock & Refill Tracker */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-500">Remaining Supply:</span>
                    <span className={isLowStock ? 'text-coral-600 font-extrabold flex items-center gap-1' : 'text-stone-800'}>
                      {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-coral-600" />}
                      {med.refillRemaining} of {med.refillTotal} pills
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowStock ? 'bg-coral-500' : 'bg-sage-600'
                      }`}
                      style={{ width: `${Math.min(100, percentLeft)}%` }}
                    />
                  </div>

                  {isLowStock && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-coral-600">
                        Refill needed (≤ {med.refillThreshold} pills)
                      </span>
                      <button
                        onClick={() => recordRefill(med.id, 30)}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-sage-700 hover:text-sage-900 bg-sage-50 hover:bg-sage-100 px-2 py-1 rounded-lg transition-colors border border-sage-200"
                        title="Record 30 pills prescription refill"
                      >
                        <PackagePlus className="w-3 h-3 text-sage-600" />
                        <span>Record Refill (+30)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Edit, Delete */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(med)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => handleDeleteRequest(med.id)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-coral-50 text-stone-400 hover:text-coral-600 transition-colors"
                  title="Delete Medication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredMeds.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
            <Pill className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-700">No medications found</h3>
            <p className="text-sm text-stone-500 mt-1">Try adjusting your search terms or filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-sage-50 text-sage-700 text-xs font-bold hover:bg-sage-100"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Medication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-soft-xl max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900">
                    {editingMed ? 'Edit Medication' : 'Add New Medication'}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Configure dosage, schedules, instructions, and visuals.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-6 space-y-4">
              {/* Row 1: Name and Dosage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lisinopril, Metformin"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                      formErrors.name ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-coral-600 mt-1 font-semibold">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Dosage & Unit *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 mg, 500 mg, 2 drops"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                      formErrors.dosage ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                    }`}
                  />
                  {formErrors.dosage && (
                    <p className="text-xs text-coral-600 mt-1 font-semibold">{formErrors.dosage}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Frequency and Timing Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Three Times Daily">Three Times Daily</option>
                    <option value="As Needed (PRN)">As Needed (PRN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Timing Group
                  </label>
                  <select
                    value={formData.timingGroup}
                    onChange={(e) => setFormData({ ...formData, timingGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Bedtime">Bedtime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Row 3: Food Relation & Purpose */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Food Relationship
                  </label>
                  <select
                    value={formData.foodRelation}
                    onChange={(e) => setFormData({ ...formData, foodRelation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="with_food">Take with meals 🍽️</option>
                    <option value="before_food">Take before meals (empty stomach) ⏳</option>
                    <option value="after_food">Take after meals 🥗</option>
                    <option value="anytime">With or without food 💧</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Health Purpose / Condition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blood Pressure, Diabetes"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Specific Patient Instructions *
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Take with a full glass of water. Avoid grapefruit juice."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                    formErrors.instructions ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                  }`}
                />
                {formErrors.instructions && (
                  <p className="text-xs text-coral-600 mt-1 font-semibold">{formErrors.instructions}</p>
                )}
              </div>

              {/* Visual Appearance: Color & Shape */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Pill Color: <span className="text-sage-700 font-extrabold">{formData.pillColorName}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PILL_COLORS.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, pillColor: col.hex, pillColorName: col.name })}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          formData.pillColor === col.hex ? 'border-stone-800 scale-110 shadow-sm' : 'border-stone-300'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pill Shape
                  </label>
                  <select
                    value={formData.pillShape}
                    onChange={(e) => setFormData({ ...formData, pillShape: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    {PILL_SHAPES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctor & Refills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Current Pill Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.refillRemaining}
                    onChange={(e) => setFormData({ ...formData, refillRemaining: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Refill Alert Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.refillThreshold}
                    onChange={(e) => setFormData({ ...formData, refillThreshold: parseInt(e.target.value, 10) || 7 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-sm font-bold shadow-md shadow-sage-600/20"
                >
                  {editingMed ? 'Save Changes' : 'Create Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-soft-xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-coral-100 text-coral-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">Delete Medication?</h3>
            <p className="text-sm text-stone-500 mt-2">
              Are you sure you want to remove this medication from Eleanor's active routine? Today's pending doses for this medication will also be removed.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50"
              >
                Keep Medication
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-coral-600 hover:bg-coral-700 text-white text-sm font-bold shadow-md shadow-coral-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
