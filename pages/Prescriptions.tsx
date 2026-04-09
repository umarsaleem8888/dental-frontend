import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { FilePlus, FileText, ExternalLink, Eye, Trash2, Search, Dock } from 'lucide-react';
import Select from 'react-select';
import { addPrescription, deletePrescription, emptyPrescription } from '../slices/prescriptionsSlice';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiDelete, apiGet, apiPost } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';
import Loading from '@/components/loading';

const DateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fromDate: string, toDate: string) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-[360px] shadow-lg animate-in fade-in scale-in-110">
        <h3 className="text-xl font-bold mb-4">Select Date Range</h3>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 rounded border dark:bg-slate-800 dark:text-white"
          />
          <label className="text-sm font-semibold">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 rounded border dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(fromDate, toDate)}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const Prescriptions: React.FC = () => {
  const dispatch = useDispatch();
  const prescriptions = useSelector((state: RootState) => state.prescriptions.list);
  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);
  const baseUrl = import.meta.env.VITE_API_URL;

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState(localStorage.getItem('prescription_filter') || 'all');
  const [filterPatient, setFilterPatient] = useState(localStorage.getItem('prescription_patient') || '');
  const [filterDoctor, setFilterDoctor] = useState(localStorage.getItem('prescription_doctor') || '');
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: localStorage.getItem('prescription_from') || '',
    to: localStorage.getItem('prescription_to') || '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(1);


  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    setLoading(true);
    dispatch(emptyPrescription());
    try {
      let res;
      if (filterType === 'getPrescriptionsByDateRange') {
        res = await apiPost(`${baseUrl}/prescription/getPrescriptionsByDateRange`, dateRange);
        // } else if (filterType === 'byPatient') {
        //   res = await apiGet(`${baseUrl}/prescription/getByPatient/${filterPatient}`);
        // } else if (filterType === 'byDoctor') {
        //   res = await apiGet(`${baseUrl}/prescription/getByDoctor/${filterDoctor}`);
      } else {
        res = await apiGet(`${baseUrl}/prescription/${filterType}`);
      }

      const RES = res?.data;

      RES?.forEach((rx: any) => dispatch(addPrescription(rx)));


      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [filterType, dateRange]);

  useEffect(() => {
    localStorage.setItem('prescription_filter', filterType);
    localStorage.setItem('prescription_patient', filterPatient);
    localStorage.setItem('prescription_doctor', filterDoctor);
  }, [filterType, filterPatient, filterDoctor]);

  const searchedPrescriptions = prescriptions?.filter((rx) => {
    const patientName = rx.patient?.name || '';
    const doctorName = rx.doctor?.name || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      rx.diagnosis?.toLowerCase().includes(search) ||
      patientName.toLowerCase().includes(search) ||
      doctorName.toLowerCase().includes(search);

    // console.log(rx,'pppS');


    const matchesPatient =
      !filterPatient || rx.patientId === filterPatient;

    const matchesDoctor =
      !filterDoctor || rx.doctorId === filterDoctor;

    return matchesSearch && matchesPatient && matchesDoctor;
  });


  const filteredPrescriptions = searchedPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  useEffect(() => {
    setTotalPages(Math.ceil(searchedPrescriptions.length / itemsPerPage));
  }, [searchedPrescriptions.length, itemsPerPage]);


  const handleDelete = async () => {
    console.log(deleteModal, 'dele mmmmmm');

    try {
      if (!deleteModal?.id) return;
      const d = await apiDelete(`${baseUrl}/prescription/${deleteModal.id}`);
      if (d) {
        dispatch(deletePrescription(deleteModal.id));
        showToast({ text: 'Deleted Successfully', type: 'success' });
      }
    } catch (err: any) {
      showToast({ text: 'Not Deleted, try again', type: 'error' });
      console.error(err.message);
    }
  };

  const handleDateApply = (from: string, to: string) => {
    setDateRange({ from, to });
    localStorage.setItem('prescription_from', from);
    localStorage.setItem('prescription_to', to);
    setShowDateModal(false);
    setFilterType('getPrescriptionsByDateRange');
  };

  useEffect(() => {
    localStorage.setItem('prescription_from', dateRange.from);
    localStorage.setItem('prescription_to', dateRange.to);
  }, [dateRange]);


  // Map patients/doctors for react-select
  const patientOptions = patients.map((p) => ({ value: p.id, label: p.name }));
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: d.name }));

  return (
    <div className="flex gap-6 animate-in fade-in duration-500">
      {/* Sidebar Filters */}
      <div className="w-64 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg flex flex-col gap-5">
        <h3 className="text-lg font-bold mb-2">Filters</h3>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Period</label>
          <select
            value={filterType}
            onChange={(e) => {
              if (e.target.value === 'getPrescriptionsByDateRange') setShowDateModal(true);
              else setFilterType(e.target.value);
            }}
            className="p-2 rounded-lg border dark:bg-slate-800 dark:text-white shadow-sm"
          >
            <option value="all">All</option>
            <option value="getTodayPrescriptions">Today</option>
            <option value="getThisWeekPrescriptions">This Week</option>
            <option value="getThisMonthPrescriptions">This Month</option>
            <option value="getThisYearPrescriptions">This Year</option>
            <option value="getPrescriptionsByDateRange">By Date</option>
          </select>



        </div>



        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 rounded-lg border dark:bg-slate-800 dark:text-white shadow-sm w-full"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">By Patient</label>
          <Select
            options={patientOptions}
            value={patientOptions.find((o) => o.value === filterPatient)}
            onChange={(selected: any) => setFilterPatient(selected?.value || '')}
            isClearable
            className="text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">By Doctor</label>
          <Select
            options={doctorOptions}
            value={doctorOptions.find((o) => o.value === filterDoctor)}
            onChange={(selected: any) => setFilterDoctor(selected?.value || '')}
            isClearable
            className="text-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Prescriptions</h2>
          <Link
            to="/prescriptions/new"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <FilePlus size={20} />
            Create Prescription
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <Loading color="#0ea5e9" size="25" />
          </div>
        ) : (
          <>
            {
              filteredPrescriptions?.length >= 1 ?
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrescriptions && filteredPrescriptions?.map((rx) => {
                    // console.log('rex', rx);

                    const patient = rx?.patient;
                    const doctor = rx?.doctor
                    return (
                      <div
                        key={rx?.id || rx?._id}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600">
                            <FileText size={24} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 ${rx.status === 'Final' ? 'text-emerald-500' : 'text-amber-500'
                                }`}
                            >
                              {rx?.status}
                            </span>
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, id: (rx.id || rx?._id) })}
                              className="p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</p>
                            <p className="font-bold text-lg">{patient?.name || 'Unknown Patient'}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</p>
                              <p className="text-sm font-semibold">{doctor?.name.replace('Dr. ', '')}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                              <p className="text-sm font-semibold">{rx.date}</p>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
                            <p className="text-sm font-medium line-clamp-2">{rx.diagnosis}</p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {rx.selectedTeeth?.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold"
                              >
                                {t}
                              </span>
                            ))}
                            {rx.selectedTeeth?.length > 3 && (
                              <span className="text-xs text-slate-400 ml-1">+{rx.selectedTeeth.length - 3}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/prescriptions/${rx?.id || rx?._id}`}
                              className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
                              title="View & Print"
                            >
                              <Eye size={18} />
                            </Link>
                            <Link
                              to={`/patients/${rx.patientId}`}
                              className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
                            >
                              <ExternalLink size={18} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                : <div className=' flex flex-col justify-center items-center gap-1 pt-20' >
                  <Dock color='#cbd5e1' size={40} />
                  <p className='text-[#667792] text-[14px] font-semibold' >
                    No Prescription Found
                  </p>
                </div>
            }

            {/* Pagination */}
            {totalPages > 1 && (
              <div className=" border  flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-primary-600 text-white shadow' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Confirm delete modal */}
        <ConfirmDialog
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Prescription?"
          subtitle="This will permanently remove the medical instructions and diagnosis from the record. Historical charts will be lost."
        />

        {/* Date modal */}
        <DateModal isOpen={showDateModal} onClose={() => setShowDateModal(false)} onConfirm={handleDateApply} />
      </div>
    </div>
  );
};

export default Prescriptions;
