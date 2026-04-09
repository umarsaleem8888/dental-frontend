import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Phone,
  ExternalLink,
  Trash2,
  Users,
  Edit2
} from 'lucide-react';
import { addPatient, deletePatient, emptyPatient, filterType } from '../slices/patientsSlice';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiDelete, apiGet, apiPost } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';
import PatientFilter from '@/components/PatientFilters';
import Loading from '@/components/loading';

const Patients: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients.list);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const [filterState, setFilterState] = useState(() => {
    return localStorage.getItem("patient_filter_type") || "today";
  });

  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; 

  const filteredPatients = patients.filter(p =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTypeChange = ({ type, from, to }: any) => {
    dispatch(filterType(type));
    setFilterState(type);
    setCurrentPage(1); 
  };

  const getFilterPatients = async () => {
    const typeForData = localStorage.getItem("patient_filter_type");
    let type = '';
    let res;

    switch (typeForData) {
      case 'week':
        type = 'getThisWeekPatients';
        break;
      case 'month':
        type = 'getThisMonthPatients';
        break;
      case 'year':
        type = 'getThisYearPatients';
        break;
      case 'today':
        type = 'getTodayPatients';
        break;
      case 'date':
        type = 'getPatientsByDateRange';
        break;
      case 'all':
      default:
        type = 'all';
        break;
    }

    if (typeForData === 'date') {
      const from = localStorage.getItem('patient_filter_from');
      const to = localStorage.getItem('patient_filter_to');
      res = await apiPost(`${baseUrl}/patient/${type}`, { fromDate: from, toDate: to });
    } else {
      res = await apiGet(`${baseUrl}/patient/${type}`);
    }

    return res;
  };

  const fetchPatients = async () => {
    const res = await getFilterPatients();
    return res?.patients?.map((m: any) => ({
      id: m?.id || m?._id,
      name: m?.name,
      phone: m?.phone,
      walletBalance: m?.walletBalance,
      bloodGroup: m?.bloodGroup,
      age: m?.age,
      address: m?.address,
      gender: m?.gender,
      email: m?.email,
      balance: m?.balance,
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      dispatch(emptyPatient());
      try {
        setLoading(true);
        const data = await fetchPatients();
        data?.forEach((m) => dispatch(addPatient(m)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch, filterState]);

  const handleDelete = async () => {
    try {
      if (!deleteModal.id) return;
      const d = await apiDelete(`${baseUrl}/patient/${deleteModal.id}`);
      if (d) {
        dispatch(deletePatient(deleteModal.id));
        showToast({ text: "Deleted Successfully", type: "success" });
      }
    } catch (error: any) {
      showToast({ text: "Not Deleted, try again", type: "error" });
      console.error(error.message);
      alert(error.message);
    }
  };

  const jsx = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients Repository</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your patient base and their records.</p>
        </div>
        <Link to="/patients/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
          <UserPlus size={20} /> New Patient
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="card-surface-transition rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <PatientFilter handleTypeChange={handleTypeChange} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wallet Balance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {currentPatients?.map(patient => (
                <tr key={patient?.id} className="hover:bg-primary-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">{patient.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold">{patient?.name}</p>
                        <p className="text-xs text-slate-500 font-medium">ID: {patient?.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm flex items-center gap-2 font-medium"><Phone size={14} className="text-slate-400" /> {patient?.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${patient?.balance >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'}`}>
                      {patient?.balance > 0 ? '+' : patient?.balance < 0 ? '-' : ''}${Math.abs(patient?.balance).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link title="Edit Record" to={`/patients/edit/${patient?.id}`} className="p-2 text-slate-400 hover:text-amber-500 transition-all"><Edit2 size={18} /></Link>
                      <Link title="View Profile" to={`/patients/${patient?.id}`} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"><ExternalLink size={18} /></Link>
                      <button
                        type="button"
                        onClick={() => setDeleteModal({ isOpen: true, id: patient?.id })}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPatients.length === 0 && (
            <div className="py-20 text-center">
              <Users className="mx-auto mb-4 text-slate-300" size={48} />
              <p className="text-slate-500 font-medium">No patients found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
                      ${currentPage === page ? 'bg-primary-600 text-white shadow' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteModal?.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Patient Record?"
        subtitle="This will permanently remove the patient profile and all linked history. This action cannot be undone."
      />
    </div>
  );

  const LoadingComponent = (
    <div className="h-[80vh] flex items-center justify-center animate-in fade-in duration-500">
      <Loading color={'#0ea5e9'} size="25" />
    </div>
  );

  return loading ? LoadingComponent : jsx;
};

export default Patients;
