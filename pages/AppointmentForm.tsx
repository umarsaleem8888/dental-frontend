
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addAppointment } from '../slices/appointmentsSlice';
import { Appointment } from '../types';
import { ArrowLeft, Calendar, Save, User, Stethoscope, Clock, Zap, Loader2 } from 'lucide-react';
import { apiPost, apiGet } from '@/utilz/endpoints';
import Loading from '../components/loading';
import { showToast } from '../components/Toast';
import Select from "react-select";
import Modal from 'react-modal';

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    slotStart: '',
    slotEnd: '',
    type: 'Checkup',
    status: 'Scheduled',
  });

  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalShift, setModalShift] = useState();
  const [customSlotStart, setCustomSlotStart] = useState();
  const [customSlotEnd, setCustomSlotEnd] = useState();


  /* ---------------- PATIENT OPTIONS ---------------- */

  const patientOptions = patients?.map((p) => ({
    value: p.id,
    label: (
      <div style={{ display: "flex", alignItems: "start", flexDirection: "column", }}>
        <span style={{ fontWeight: "600" }} >{p.name}</span>
        <span style={{ color: "#94a3b8", fontSize: "11px" }}>
          ({p.id})
        </span>
      </div>
    ),
  }));

  /* ---------------- DOCTOR OPTIONS ---------------- */

  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: d.status === 'Inactive' ? `${d.name} (Leave)` : d.name,
    isDisabled: d.status === 'Inactive',
  }));

  /* ---------------- FETCH SLOTS ---------------- */

  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.doctorId || !formData.date) return;

      setLoadingSlots(true);

      try {
        const res = await apiGet(
          `/appointment/doctor/${formData.doctorId}/slots?date=${formData.date}`
        );

        console.log('res : ', res);

        /* GROUP SLOTS BY DAY */

        const groupedSlots = res?.map((day) => ({
          label: day.day,
          options: day.slots.map((slot) => ({
            label: `${slot.from} - ${slot.to} ${slot.status === 'FULL' ? '(Full)' : ''
              }`,
            value: `${slot.from}-${slot.to}`,
            // isDisabled: day.disabled || slot.status !== 'AVAILABLE',
            isDisabled:false,
            from: slot.from,
            to: slot.to,
            day: day.day,
          })),
        }));

        setSlots(groupedSlots || []);

        // console.log('slots : ',slots);
        

      } catch (err: any) {
        console.error(err);
        showToast({ text: 'Failed to load slots', type: 'error' });
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.doctorId, formData.date]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.slotStart || !formData.slotEnd) {
      return showToast({
        text: 'Please select a valid time slot',
        type: 'warning',
      });
    }

    try {
      setSubmitting(true);

      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: formData.date,
        slotStart: formData.slotStart,
        slotEnd: formData.slotEnd,
        type: formData.type,
      };

      const res = await apiPost('/appointments', payload);

      dispatch(addAppointment(res));

      showToast({
        text: 'Appointment booked successfully',
        type: 'success',
      });

      navigate('/appointments');

    } catch (err: any) {
      console.error(err);

      showToast({
        text: err.message || 'Booking failed',
        type: 'error',
      });

    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- REACT SELECT STYLES ---------------- */

  const slotSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'transparent',
      border: 'none',
      minHeight: '36px',
      paddingLeft: '6px',
      paddingRight: '6px',
      boxShadow: state.isFocused
        ? '0 0 0 2px rgba(14,165,233,0.2)'
        : 'none',
    }),

    menu: (base: any) => ({
      ...base,
      borderRadius: '0.75rem',
    }),

    menuList: (base: any) => ({
      ...base,
      maxHeight: '180px',
      overflowY: 'auto',
      padding: 0,
    }),

    groupHeading: (base: any) => ({
      ...base,
      fontSize: '12px',
      fontWeight: 700,
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      padding: '6px 12px',
    }),

    option: (base: any, state: any) => ({
      ...base,
      fontSize: '14px',
      padding: '10px 14px',
      backgroundColor: state.isFocused ? '#f1f5f9' : 'white',
      color: '#0f172a',
      cursor: 'pointer',
    }),

    placeholder: (base: any) => ({
      ...base,
      fontSize: '14px',
      color: '#94a3b8',
    }),

    singleValue: (base: any) => ({
      ...base,
      fontSize: '14px',
      fontWeight: 500,
    }),
  };

  const openSlotModal = (shift) => {
    setModalShift(shift);
    setCustomSlotStart(shift.from);
    setCustomSlotEnd(shift.to);
    setModalOpen(true);
  };

  const confirmCustomSlot=()=>{

    console.log('start : ',customSlotStart);
    console.log('end : ',customSlotEnd);
    

    setModalOpen(false);
  }



  return (
    <>


      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">

        {/* HEADER */}

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Book Session
            </h2>

            <p className="text-slate-500">
              Schedule a new clinical visit for a patient.
            </p>
          </div>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
        >

          <div className="p-8 space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* PATIENT SELECT */}

              <div className="space-y-2">

                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <User size={14} /> Select Patient
                </label>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-2 py-1  ">

                  <Select
                    options={patientOptions}
                    styles={slotSelectStyles}
                    placeholder="Search Patient..."
                    isSearchable
                    onChange={(selected: any) =>
                      setFormData({
                        ...formData,
                        patientId: selected.value,
                      })
                    }
                  />

                </div>
              </div>

              {/* DOCTOR SELECT */}

              <div className="space-y-2">

                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Stethoscope size={14} /> Assigned Doctor
                </label>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-2 py-1">

                  <Select
                    options={doctorOptions}
                    styles={slotSelectStyles}
                    placeholder="Select Doctor..."
                    isSearchable
                    onChange={(selected: any) => {
                      // console.log('this is log');

                      setFormData({
                        ...formData,
                        doctorId: selected.value,
                        slotStart: '',
                        slotEnd: '',
                      });
                    }}
                  />

                </div>
              </div>

              {/* DATE */}

              <div className="space-y-2">

                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Calendar size={14} /> Date
                </label>

                <input
                  required
                  type="date"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                      slotStart: '',
                      slotEnd: '',
                    })
                  }
                />

              </div>

              {/* SLOT SELECT */}

              <div className="space-y-2">

                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Clock size={14} /> Time Shift
                </label>

                {loadingSlots ? (

                  <div className='bg-slate-50 dark:bg:slate-800 rounded-xl px-2 py-1 h-[42.9px] flex justify-center items-center' >
                    <Loader2 color="#0ea5e9" size='18px' />
                  </div>

                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-2 py-1">

                    {/* <Select
    
                    options={slots}
                    styles={slotSelectStyles}
                    placeholder="Search or Select Slot..."
                    isSearchable
                    onChange={(selected: any) =>
                      setFormData({
                        ...formData,
                        slotStart: selected.from,
                        slotEnd: selected.to,
                        day: selected.day,
                      })
                    }
                    
                  /> */}

                    <Select
                      options={slots}
                      styles={slotSelectStyles}
                      placeholder="Search or Select Slot..."
                      isSearchable
                      onChange={(selected: any) => {
                        console.log('sel : ', selected);

                        // selected.value, selected.from, selected.to
                        if (selected?.from && selected?.to) {
                          openSlotModal({ from: selected.from, to: selected.to });
                        }
                      }}
                    />

                  </div>
                )}

              </div>

              {/* PROCEDURE */}

              <div className="space-y-2 md:col-span-2">

                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Zap size={14} /> Procedure Type
                </label>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">

                  {[
                    'Checkup',
                    'Cleaning',
                    'Surgery',
                    'Root Canal',
                    'Orthodontics',
                  ].map((type) => (

                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          type,
                        })
                      }
                      className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${formData.type === type
                        ? 'border-primary-500 bg-primary-50/50 text-primary-600 shadow-inner'
                        : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                      {type}
                    </button>

                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* ACTIONS */}

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
              disabled={submitting}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={18} /> {submitting ? 'Booking...' : 'Confirm Appointment'}
            </button>

          </div>

        </form>

      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Select Appointment Slot"
        className="max-w-md mx-auto mt-20 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start z-50"
      >
        <h2 className="text-xl font-bold mb-4">Select Appointment Slot</h2>
        {modalShift && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={customSlotStart}
                min={modalShift.from}
                max={modalShift.to}
                onChange={(e) => setCustomSlotStart(e.target.value)}
                className="w-full border rounded-lg py-2 px-3 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={customSlotEnd}
                min={customSlotStart}
                max={modalShift.to}
                onChange={(e) => setCustomSlotEnd(e.target.value)}
                className="w-full border rounded-lg py-2 px-3 dark:bg-slate-800"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={confirmCustomSlot} className="px-4 py-2 rounded-lg bg-primary-600 text-white">Confirm</button>
            </div>
          </div>
        )}


      </Modal>

    </>
  );
};

export default AppointmentForm;

