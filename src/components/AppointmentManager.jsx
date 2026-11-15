import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Phone,
  Video,
  Edit2,
  Trash2,
  CheckCircle2,
  FileText,
  UserCheck,
  X,
  ChevronRight,
  ShieldAlert,
  Share2
} from 'lucide-react';

export default function AppointmentManager() {
  const {
    appointments,
    currentUser,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    requestPasscodeVerification
  } = useCareNest();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: 'Cardiovascular Medicine',
    hospitalOrClinic: '',
    address: '',
    date: '',
    time: '10:00 AM',
    phone: '',
    purpose: '',
    prepInstructions: '',
    accompaniedBy: 'Sarah Vance (Daughter)',
    isTelehealth: false,
    status: 'Upcoming'
  });

  const [formErrors, setFormErrors] = useState({});

  // Filter Upcoming vs Completed
  const upcomingApts = appointments.filter(a => a.status === 'Upcoming');
  const pastApts = appointments.filter(a => a.status !== 'Upcoming');

  const displayedApts = activeTab === 'upcoming' ? upcomingApts : pastApts;

  // Open Add Modal
  const handleOpenAdd = () => {
    if (!currentUser.permissions.canAddAppointment) {
      requestPasscodeVerification(() => {
        openModalWithBlank();
      });
    } else {
      openModalWithBlank();
    }
  };

  const openModalWithBlank = () => {
    setEditingApt(null);
    setFormData({
      doctorName: '',
      specialty: 'Internal Medicine (Primary Care)',
      hospitalOrClinic: 'Oakwood Family Health Care',
      address: '840 Elmwood Terrace, Building B',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days in future
      time: '10:30 AM',
      phone: '(505) 555-0155',
      purpose: 'Routine checkup and prescription refill review',
      prepInstructions: 'Bring current medication bottles and reading glasses.',
      accompaniedBy: 'Sarah Vance (Daughter)',
      isTelehealth: false,
      status: 'Upcoming'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (apt) => {
    if (!currentUser.permissions.canEditAppointment) {
      requestPasscodeVerification(() => {
        populateAndOpenEdit(apt);
      });
    } else {
      populateAndOpenEdit(apt);
    }
  };

  const populateAndOpenEdit = (apt) => {
    setEditingApt(apt);
    setFormData({
      doctorName: apt.doctorName || '',
      specialty: apt.specialty || '',
      hospitalOrClinic: apt.hospitalOrClinic || '',
      address: apt.address || '',
      date: apt.date || '',
      time: apt.time || '',
      phone: apt.phone || '',
      purpose: apt.purpose || '',
      prepInstructions: apt.prepInstructions || '',
      accompaniedBy: apt.accompaniedBy || '',
      isTelehealth: Boolean(apt.isTelehealth),
      status: apt.status || 'Upcoming'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Delete appointment
  const handleDeleteRequest = (id) => {
    if (!currentUser.permissions.canEditAppointment) {
      requestPasscodeVerification(() => {
        setDeleteConfirmId(id);
      });
    } else {
      setDeleteConfirmId(id);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteAppointment(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Mark Completed
  const handleMarkCompleted = (apt) => {
    updateAppointment(apt.id, { status: 'Completed' });
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.doctorName.trim()) errors.doctorName = 'Doctor name is required';
    if (!formData.date.trim()) errors.date = 'Date is required';
    if (!formData.time.trim()) errors.time = 'Time is required';
    if (!formData.hospitalOrClinic.trim()) errors.hospitalOrClinic = 'Clinic or hospital is required';
    if (!formData.purpose.trim()) errors.purpose = 'Appointment reason / purpose is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingApt) {
      updateAppointment(editingApt.id, formData);
    } else {
      addAppointment(formData);
    }

    setIsModalOpen(false);
  };

  // Helper to format countdown tag
  const getRelativeDateLabel = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays > 7) return `In ${diffDays} days`;
    return 'Past date';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-mutedblue-100 text-mutedblue-700">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Doctor Appointments
            </h1>
          </div>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Schedule visits, track medical consultations, preparation checklists, and clinic contacts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-bold shadow-md shadow-sage-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Tabs: Upcoming vs Completed */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'upcoming'
              ? 'bg-sage-600 text-white shadow-soft-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Upcoming Appointments</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
            {upcomingApts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'past'
              ? 'bg-sage-600 text-white shadow-soft-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Past Visits</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-stone-200 text-stone-700">
            {pastApts.length}
          </span>
        </button>
      </div>

      {/* Appointment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedApts.map((apt) => {
          const isUpcoming = apt.status === 'Upcoming';
          const countdown = isUpcoming ? getRelativeDateLabel(apt.date) : 'Completed';

          return (
            <div
              key={apt.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header: Date Badge & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-800 flex flex-col items-center justify-center font-bold">
                      <CalendarIcon className="w-5 h-5 text-sage-600" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-sage-700 uppercase tracking-wider">
                        {apt.specialty}
                      </span>
                      <h3 className="font-extrabold text-xl text-stone-900 leading-tight">
                        {apt.doctorName}
                      </h3>
                    </div>
                  </div>

                  {isUpcoming ? (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      {countdown}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-stone-100 text-stone-600">
                      Completed
                    </span>
                  )}
                </div>

                {/* Date & Time pill */}
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span>{apt.date} at {apt.time}</span>
                  </div>
                  {apt.isTelehealth && (
                    <span className="flex items-center gap-1 text-xs font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-lg">
                      <Video className="w-3.5 h-3.5" />
                      Telehealth Video Call
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="text-xs text-stone-600 space-y-1">
                  <p className="flex items-start gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-stone-800">{apt.hospitalOrClinic}</strong>
                      {apt.address && ` — ${apt.address}`}
                    </span>
                  </p>
                </div>

                {/* Purpose & Prep */}
                <div className="space-y-2 text-xs">
                  <div className="bg-ivory-100 p-3 rounded-xl border border-ivory-300/60">
                    <p className="font-bold text-stone-800 mb-0.5">Reason for Visit:</p>
                    <p className="text-stone-600 font-medium">{apt.purpose}</p>
                  </div>

                  {apt.prepInstructions && (
                    <div className="bg-sage-50/70 p-3 rounded-xl border border-sage-200/60">
                      <p className="font-bold text-sage-900 mb-0.5 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-sage-600" />
                        <span>Preparation Instructions:</span>
                      </p>
                      <p className="text-sage-800 font-medium">{apt.prepInstructions}</p>
                    </div>
                  )}
                </div>

                {/* Accompanied By */}
                {apt.accompaniedBy && (
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold pt-1">
                    <UserCheck className="w-4 h-4 text-stone-400" />
                    <span>Accompanied by: <strong className="text-stone-700">{apt.accompaniedBy}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {apt.phone && (
                    <a
                      href={`tel:${apt.phone}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                      title="Call clinic phone"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-600" />
                      <span>Call ({apt.phone})</span>
                    </a>
                  )}

                  {isUpcoming && (
                    <button
                      onClick={() => handleMarkCompleted(apt)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-sage-50 text-sage-800 hover:bg-sage-100 text-xs font-bold transition-colors border border-sage-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
                      <span>Mark Done</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(apt)}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                    title="Edit Appointment"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(apt.id)}
                    className="p-2 rounded-xl hover:bg-coral-50 text-stone-400 hover:text-coral-600"
                    title="Delete Appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {displayedApts.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
            <CalendarIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-700">No {activeTab} appointments</h3>
            <p className="text-sm text-stone-500 mt-1">
              {activeTab === 'upcoming'
                ? 'No doctor visits currently scheduled.'
                : 'No past appointment history found.'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={handleOpenAdd}
                className="mt-4 px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-bold hover:bg-sage-700"
              >
                Schedule New Appointment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-soft-xl max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900">
                    {editingApt ? 'Edit Appointment' : 'Schedule Doctor Visit'}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Enter doctor details, clinic address, date, time, and prep rules.
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Row 1: Doctor Name and Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Doctor / Specialist Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Evelyn Reed, MD"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                      formErrors.doctorName ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                    }`}
                  />
                  {formErrors.doctorName && (
                    <p className="text-xs text-coral-600 mt-1 font-semibold">{formErrors.doctorName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Medical Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology, Primary Care, Ophthalmology"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Row 2: Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                      formErrors.date ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-xs text-coral-600 mt-1 font-semibold">{formErrors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 AM or 02:15 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                      formErrors.time ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: Clinic / Hospital & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Clinic / Hospital Facility *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. St. Jude Health Center"
                    value={formData.hospitalOrClinic}
                    onChange={(e) => setFormData({ ...formData, hospitalOrClinic: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                      formErrors.hospitalOrClinic ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                    }`}
                  />
                  {formErrors.hospitalOrClinic && (
                    <p className="text-xs text-coral-600 mt-1 font-semibold">{formErrors.hospitalOrClinic}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Street Address / Suite
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1200 Health Blvd, Suite 402"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Row 4: Phone & Accompanied By */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Clinic Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(505) 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Accompanied By
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Vance (Daughter)"
                    value={formData.accompaniedBy}
                    onChange={(e) => setFormData({ ...formData, accompaniedBy: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Row 5: Reason for visit */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Reason for Visit / Purpose *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quarterly blood pressure check and echocardiogram review"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                    formErrors.purpose ? 'border-coral-400 bg-coral-50/50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                  }`}
                />
                {formErrors.purpose && (
                  <p className="text-xs text-coral-600 mt-1 font-semibold">{formErrors.purpose}</p>
                )}
              </div>

              {/* Preparation instructions */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Preparation Instructions (Fasting, bring BP log, etc.)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Fasting 8 hours prior. Bring home blood pressure log."
                  value={formData.prepInstructions}
                  onChange={(e) => setFormData({ ...formData, prepInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              {/* Telehealth toggle */}
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <input
                  type="checkbox"
                  id="telehealthCheck"
                  checked={formData.isTelehealth}
                  onChange={(e) => setFormData({ ...formData, isTelehealth: e.target.checked })}
                  className="w-4 h-4 rounded text-sage-600 focus:ring-sage-500"
                />
                <label htmlFor="telehealthCheck" className="text-xs font-bold text-stone-700 cursor-pointer">
                  This is a Telehealth Video Call appointment (no physical travel required)
                </label>
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
                  {editingApt ? 'Save Changes' : 'Schedule Appointment'}
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
            <h3 className="text-xl font-extrabold text-stone-900">Cancel Appointment?</h3>
            <p className="text-sm text-stone-500 mt-2">
              Are you sure you want to cancel this scheduled appointment?
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-coral-600 hover:bg-coral-700 text-white text-sm font-bold shadow-md shadow-coral-600/20"
              >
                Yes, Cancel Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
