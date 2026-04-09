
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, Calendar, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { addDoctor, deleteDoctor, emptyDoctor } from '../slices/doctorsSlice';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiDelete, apiGet } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';
import Loading from '@/components/loading';

const Doctors: React.FC = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state: RootState) => state.doctors.list);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const [loading, setLoading] = useState(false);

  const fetchDoctz = async (): Promise<any> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const res = await apiGet(`${baseUrl}/doctors`);
    return res?.map((m: any) => ({
      id: m?.id || m?._id,
      name: m?.name,
      specialization: m?.specialization,
      phone: m?.phone,
      email: m?.email,
      status: m?.status,
      availability: m?.availability
    }));
  };

  useEffect(() => {

    const loadData = async () => {

      dispatch(emptyDoctor());

      try {
        setLoading(true);
        const data = await fetchDoctz();

        if (data) {
          data?.forEach((m) => dispatch(addDoctor(m)));
          setLoading(false);
        }


      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();


  }, [dispatch])

  const handleDelete = async () => {
    try {
      if (!deleteModal?.id) return;

      setLoading(true);
      const d = await apiDelete(`/doctors/${deleteModal?.id}`);
      if (d) {
        dispatch(deleteDoctor(deleteModal?.id));
        setLoading(false);
        showToast({
          text: "Deleted Successfully",
          type: "success",
        });
      }

    } catch (error: any) {
      setLoading(false);
      showToast({
        text: "not Deleted, try again",
        type: "error",
      });
    }
  };




  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Practitioner Directory</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage clinic staff and their consultation schedules.</p>
        </div>
        <Link to="/doctors/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
          <Stethoscope size={20} />
          Onboard Doctor
        </Link>
      </div>

      <div className="" >
        {
          !loading ?
            <>
              {
                doctors && doctors?.length ?
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {doctors && doctors?.map(doctor => (
                      <div key={doctor.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row group">
                        <div className="w-full sm:w-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-8">
                          <div className="w-32 h-32 rounded-3xl bg-primary-200 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-400 relative">
                            <Stethoscope size={48} />
                            <span className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-4 border-slate-100 dark:border-slate-800 ${doctor.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          </div>
                        </div>

                        <div className="flex-1 p-8 space-y-6">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-bold">{doctor.name}</h3>
                              <div className="flex items-center gap-1">
                                <Link to={`/doctors/edit/${doctor.id}`} className="p-2 text-slate-400 hover:text-amber-500 transition-all"><Edit2 size={16} /></Link>
                                <button
                                  onClick={() => setDeleteModal({ isOpen: true, id: doctor.id })}
                                  className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-primary-500 font-bold text-sm">{doctor.specialization}</p>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                              <Mail size={16} /> {doctor.email}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                              <Clock size={12} /> Shift Days
                            </p>
                            {/* <div className="flex flex-wrap gap-2">
                              {doctor.availability.map(day => (
                                <span key={day} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                  {day}
                                </span>
                              ))}
                            </div> */}
                          </div>

                          <div className="flex items-center gap-2">
                            <Link to={`/doctors/edit/${doctor.id}`} className="flex-1 text-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs transition-colors">Edit Profile</Link>
                            {/* <button className="flex-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 py-2.5 rounded-xl font-bold text-xs transition-colors">Manage Slots</button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  :
                  <div className=" w-full flex justify-center items-center h-[250px] " > No doctors found </div>
              }
            </>
            : <div className="h-[80vh] flex justify-center items-center">
              <Loading color="#0ea5e9" size="25" />
            </div>

        }


      </div>


      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Staff Member?"
        subtitle="This will remove the doctor from the directory. Active appointments linked to this doctor may need rescheduling."
      />
    </div>
  );
};

export default Doctors;
