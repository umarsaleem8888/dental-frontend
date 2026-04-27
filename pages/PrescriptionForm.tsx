
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addPrescription } from '../slices/prescriptionsSlice';
import { Prescription, PrescribedMedicine } from '../types';
import DentalChart from '../components/DentalChart';
import { ArrowLeft, PlusCircle, Trash2, FilePlus, Pill, Plus, Calendar, Clock, Loader2 } from 'lucide-react';
import { apiPost } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';

const PrescriptionForm: React.FC = () => {

  const baseUrl = import.meta.env.VITE_API_URL;

  const { patientId: initialPatientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);
  const medicines = useSelector((state: RootState) => state.medicines.list);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Prescription>>({
    patientId: initialPatientId || '',
    doctorId: doctors[0]?.id || '',
    diagnosis: '',
    notes: '',
    selectedTeeth: [],
    medicines: [],
    status: 'Draft',
    date: new Date().toISOString().split('T')[0],
  });

  const [selectedMedId, setSelectedMedId] = useState('');

  const handleToggleTooth = (toothId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedTeeth: prev.selectedTeeth?.includes(toothId)
        ? prev.selectedTeeth.filter(id => id !== toothId)
        : [...(prev.selectedTeeth || []), toothId],
    }));
  };

  const addMedication = () => {
    console.log(selectedMedId,'selected Med Id');
    
    if (!selectedMedId) return;
    const med = medicines?.find(m => m?.id === selectedMedId);
    if (!med) return;

    const newItem: PrescribedMedicine = {
      medicineId: med.id,
      name: med.name,
      dosage: '1-0-1',
      duration: 5,
      quantity: 10,
      unitPrice: med.price,
    };

    setFormData(prev => ({
      ...prev,
      medicines: [...(prev.medicines || []), newItem],
    }));
    setSelectedMedId('');
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines?.filter((_, i) => i !== index),
    }));
  };

  const updateMedication = (index: number, field: keyof PrescribedMedicine, value: any) => {
    setFormData(prev => {
      const newList = [...(prev.medicines || [])];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, medicines: newList };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newPrescription: Prescription = {
        ...(formData as Prescription),
        // id: `RX${Date.now()}`,
        status: 'Final',
      };

      setLoading(true);

      const d = await apiPost(`${baseUrl}/prescription/`, formData);

      if (d) {
        dispatch(addPrescription(newPrescription));
        setLoading(false);
        showToast({
          text: "Created Successfully",
          type: "success",
        });
      }

      // navigate('/prescriptions');
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
      showToast({
        text: "not Created , try again",
        type: "error",
      });
    }
  };


  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create Prescription </h2>
            <p className="text-slate-500">Formulate treatment plan, medications and procedures.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
            {/* Step 1: Dental Chart */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">1</div>
                Interactive Dental Chart
              </h3>
              <DentalChart
                selectedTeeth={formData.selectedTeeth || []}
                onToggleTooth={handleToggleTooth}
              />
            </section>

            {/* Step 2: Medication */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">2</div>
                Prescribed Medications
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl space-y-6">
                <div className="flex gap-3">
                  <select
                    value={selectedMedId}
                    onChange={(e) => setSelectedMedId(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">Select Medicine from Catalog...</option>
                    {medicines?.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (${m.price.toFixed(2)})</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.medicines?.map((med, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in zoom-in-95">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-lg">{med.name}</p>
                          <p className="text-xs text-slate-400 font-black uppercase tracking-widest">${med.unitPrice.toFixed(2)} / unit</p>
                        </div>
                        <button onClick={() => removeMedication(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dosage (D-N-N)</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-sm font-bold border-none outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration (Days)</label>
                          <input
                            type="number"
                            value={med.duration}
                            onChange={(e) => updateMedication(idx, 'duration', parseInt(e.target.value))}
                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-sm font-bold border-none outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Quantity</label>
                          <input
                            type="number"
                            value={med.quantity}
                            onChange={(e) => updateMedication(idx, 'quantity', parseInt(e.target.value))}
                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-sm font-bold border-none outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Step 3: Assessment */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">3</div>
                Diagnosis & Assessment
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="e.g., Acute Pulpitis"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Clinical Notes</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Instructions for the patient..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold mb-4">Meta Data</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Select Patient</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                >
                  <option value="">Choose Patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Consulting Doctor</label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Prescription Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {
                  loading ?
                    <div className="w-full flex items-center justify-center animate-in fade-in duration-500">
                      <Loader2 color={'#0ea5e9'} size={25} />
                    </div>
                    :
                    <>
                      <FilePlus size={20} /> Finalize Prescription
                    </>
                }
              </button>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Cost Estimation</p>
            <div className="flex justify-between items-end">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Total Medicines:</p>
              <p className="text-2xl font-black text-emerald-600">
                ${formData?.medicines?.reduce((sum, med) => sum + (med.unitPrice * med.quantity), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
