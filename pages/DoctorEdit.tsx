import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateDoctor } from '../slices/doctorsSlice';
import { Doctor } from '../types';
import { ArrowLeft, Stethoscope, User, Phone, Mail, Clock, ShieldCheck, Loader2, Plus, X } from 'lucide-react';
import { apiGet, apiPut } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';

interface Slot {
  from: string;
  to: string;
  maxAppointments: number;
}

interface Availability {
  day: string;
  isAvailable: boolean;
  slots: Slot[];
}

const DoctorEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { id } = useParams<{ id: string }>();

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '',
    specialization: '',
    phone: '',
    email: '',
    status: 'Active',
    availability: DAYS.map(day => ({
      day,
      isAvailable: false,
      slots: [],
    })) as Availability[],
  });

  const [loading, setLoading] = useState(false);
  const [activeDayModal, setActiveDayModal] = useState<string | null>(null);
  const [slotErrors, setSlotErrors] = useState<Record<number, string>>({});
  const [allDoc , setAllDoc]=useState(useSelector((state)=> state.doctors.list) || []);

 
  
  // Fetch existing doctor data for autofill
  useEffect(() => {
    console.log('use effect here');
    
    const fetchDoctor = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // const d = await apiGet(`/doctors/${id}`);

        const d = allDoc.find((d)=> d.id == id );
        console.log('d : ',d);
        
        if (d) {
          setFormData({
            name: d.name,
            specialization: d.specialization,
            phone: d.phone,
            email: d.email,
            status: d.status,
            availability: DAYS.map(day => {
              const dayData = d.availability.find((a: any) => a.day === day);
              return dayData
                ? { day, isAvailable: dayData.isAvailable, slots: dayData.slots }
                : { day, isAvailable: false, slots: [] };
            }),
          });
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        showToast({ text: 'Failed to fetch doctor data', type: 'error' });
      }
    };
    fetchDoctor();
  }, [allDoc]);

  // Toggle day availability
  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: (prev.availability as Availability[]).map(a =>
        a.day === day
          ? { ...a, isAvailable: !a.isAvailable, slots: !a.isAvailable ? [{ from: '', to: '', maxAppointments: 1 }] : [] }
          : a
      ),
    }));
  };

  // Slot handlers
  const addSlot = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: (prev.availability as Availability[]).map(a =>
        a.day === day ? { ...a, slots: [...a.slots, { from: '', to: '', maxAppointments: 1 }] } : a
      ),
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: (prev.availability as Availability[]).map(a =>
        a.day === day ? { ...a, slots: a.slots.filter((_, i) => i !== index) } : a
      ),
    }));
  };

  const updateSlot = (day: string, index: number, field: keyof Slot, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      availability: (prev.availability as Availability[]).map(a =>
        a.day === day
          ? { ...a, slots: a.slots.map((s, i) => (i === index ? { ...s, [field]: value } : s)) }
          : a
      ),
    }));
  };

  // Validate slots in real-time
  const validateDaySlots = (day: string) => {
    const dayObj = (formData.availability as Availability[]).find(a => a.day === day);
    if (!dayObj) return;

    const errors: Record<number, string> = {};

    dayObj.slots.forEach((slot, i) => {
      if (!slot.from || !slot.to) {
        errors[i] = 'Please select both start and end time';
        return;
      }

      const fromParts = slot.from.split(/[: ]/);
      const toParts = slot.to.split(/[: ]/);
      const fromDate = new Date();
      const toDate = new Date();
      fromDate.setHours(Number(fromParts[0]) + (fromParts[2] === 'PM' && fromParts[0] !== '12' ? 12 : 0), Number(fromParts[1]));
      toDate.setHours(Number(toParts[0]) + (toParts[2] === 'PM' && toParts[0] !== '12' ? 12 : 0), Number(toParts[1]));

      if (toDate <= fromDate) {
        errors[i] = 'End time must be after start time';
        return;
      }

      // check for conflicts with other slots
      dayObj.slots.forEach((otherSlot, j) => {
        if (i === j || !otherSlot.from || !otherSlot.to) return;
        const oFromParts = otherSlot.from.split(/[: ]/);
        const oToParts = otherSlot.to.split(/[: ]/);
        const oFrom = new Date();
        const oTo = new Date();
        oFrom.setHours(Number(oFromParts[0]) + (oFromParts[2] === 'PM' && oFromParts[0] !== '12' ? 12 : 0), Number(oFromParts[1]));
        oTo.setHours(Number(oToParts[0]) + (oToParts[2] === 'PM' && oToParts[0] !== '12' ? 12 : 0), Number(oToParts[1]));

        if (fromDate < oTo && toDate > oFrom) {
          errors[i] = 'This slot conflicts with another slot';
        }
      });
    });

    setSlotErrors(errors);
  };

  // Submit handler for edit (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData?.name || !formData?.specialization || !formData?.phone || !formData?.email) {
      showToast({ text: 'Empty fields are not allowed', type: 'error' });
      return;
    }

    const availableDays = (formData.availability as Availability[]).filter(a => a.isAvailable);
    if (!availableDays.length) {
      showToast({ text: 'Please select at least one available day', type: 'error' });
      return;
    }

    for (const day of availableDays) {
      for (const slot of day.slots) {
        if (!slot.from || !slot.to) {
          showToast({ text: `Please fill all slots for ${day.day}`, type: 'error' });
          return;
        }
        const fromParts = slot.from.split(/[: ]/);
        const toParts = slot.to.split(/[: ]/);
        const fromDate = new Date();
        const toDate = new Date();
        fromDate.setHours(Number(fromParts[0]) + (fromParts[2] === 'PM' && fromParts[0] !== '12' ? 12 : 0), Number(fromParts[1]));
        toDate.setHours(Number(toParts[0]) + (toParts[2] === 'PM' && toParts[0] !== '12' ? 12 : 0), Number(toParts[1]));
        if (toDate <= fromDate) {
          showToast({ text: `End time must be after start time for ${day.day}`, type: 'error' });
          return;
        }
      }
    }

    // PUT request
    setLoading(true);
    try {
      const payload = {
        ...formData,
        availability: availableDays.map(a => ({ ...a })),
      };

      const d = await apiPut(`/doctors/${id}`, payload);
      showToast({ text: 'Updated successfully', type: 'success' });

      if (d) {
        const data = {
          id: d?._id,
          name: d?.name,
          specialization: d?.specialization,
          phone: d?.phone,
          email: d?.email,
          status: d?.status,
          availability: d?.availability,
        };
        dispatch(updateDoctor(data));
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      showToast({ text: 'Update failed, try again', type: 'error' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Practitioner</h2>
          <p className="text-slate-500">Update specialist details and availability.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={14} /> Full Professional Name
              </label>
              <input
                required
                type="text"
                placeholder="Dr. Sarah Wilson"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Specialization */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShieldCheck size={14} /> Specialization
              </label>
              <input
                required
                type="text"
                placeholder="e.g., Oral Surgery"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.specialization}
                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="sarah@clinic.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Phone size={14} /> Contact Number
              </label>
              <input
                required
                type="tel"
                placeholder="+1 (555) 012-3456"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Availability Days */}
          <div className="space-y-4 pt-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Clock size={14} /> Weekly Shift Availability
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => {
                const dayObj = (formData.availability as Availability[]).find(a => a.day === day);
                const filledSlotsCount = dayObj?.slots.filter(s => s.from && s.to).length || 0;

                return (
                  <div key={day} className="relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDay(day)}
                      title={filledSlotsCount ? `${filledSlotsCount} slot(s) filled` : dayObj?.isAvailable ? 'No slots yet' : 'Click to activate'}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${dayObj?.isAvailable
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                      {day}
                      {filledSlotsCount > 0 && (
                        <span className="flex items-center justify-center w-4 h-4 bg-white rounded-full text-primary-600 text-[10px] font-bold">
                          ✔
                        </span>
                      )}
                    </button>
                    {dayObj?.isAvailable && (
                      <button type="button" className="text-green-500" onClick={() => setActiveDayModal(day)}>
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
          >
            {loading ? <div className="w-full flex items-center justify-center"><Loader2 /></div> : <><Stethoscope size={18} /> Update Practitioner</>}
          </button>
        </div>
      </form>

      {/* Slot Modal */}
      {activeDayModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">{activeDayModal} Slots</h3>

            <div className="flex items-center gap-4 px-1 mb-2 text-xs font-semibold text-slate-500">
              <div className="w-24 text-center">Start</div>
              <div className="w-4"></div>
              <div className="w-24 text-center">End</div>
              <div className="w-16 text-center">Max</div>
              <div className="w-4"></div>
            </div>

            <div className=" pt-2 max-h-[299px] overflow-y-auto">
              {(formData.availability as Availability[]).find(a => a.day === activeDayModal)?.slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2 mb-2 ">
                  <div className="flex flex-col">
                    <div className=" w-full flex justify-center items-center gap-4" >
                      <select
                        value={slot.from}
                        onChange={e => updateSlot(activeDayModal, index, 'from', e.target.value)}
                        className={`w-24 px-2 py-1 rounded-xl border ${!slot.from ? 'border-red-500' : 'border-slate-300'} dark:border-slate-600`}
                      >
                        <option value="">From</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).flatMap(h =>
                          ['AM', 'PM'].map(period => (
                            <option key={`${h}-${period}`} value={`${h.toString().padStart(2, '0')}:00 ${period}`}>
                              {h.toString().padStart(2, '0')}:00 {period}
                            </option>
                          ))
                        )}
                      </select>
                      <span>-</span>
                      <select
                        value={slot.to}
                        onChange={e => updateSlot(activeDayModal, index, 'to', e.target.value)}
                        className={`w-24 px-2 py-1 rounded-xl border ${!slot.to ? 'border-red-500' : 'border-slate-300'} dark:border-slate-600`}
                      >
                        <option value="">To</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).flatMap(h =>
                          ['AM', 'PM'].map(period => (
                            <option key={`${h}-${period}-to`} value={`${h.toString().padStart(2, '0')}:00 ${period}`}>
                              {h.toString().padStart(2, '0')}:00 {period}
                            </option>
                          ))
                        )}
                      </select>
                      <input
                        type="number"
                        min={1}
                        value={slot.maxAppointments}
                        onChange={e => updateSlot(activeDayModal, index, 'maxAppointments', Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-600"
                      />
                      <button type="button" onClick={() => removeSlot(activeDayModal, index)} className="text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                    <div>{slotErrors[index] && <p className="text-red-500 text-sm mt-1">{slotErrors[index]}</p>}</div>
                    <div className="border mt-4 mb-4"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button type="button" onClick={() => addSlot(activeDayModal!)} className="flex items-center gap-1 text-green-500 font-bold">
                <Plus size={16} /> Add Slot
              </button>
              <button type="button" onClick={() => setActiveDayModal(null)} className="px-4 py-2 rounded-xl bg-primary-600 text-white font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorEdit;
