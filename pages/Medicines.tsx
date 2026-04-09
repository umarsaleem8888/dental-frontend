import React, { useState, Suspense, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2, Pill, Edit2 } from 'lucide-react';
import { addMedicine, deleteMedicine, emptyMedicine } from '../slices/medicinesSlice';
import { apiGet, apiDelete } from '@/utilz/endpoints';
import ConfirmDialog from '@/components/ConfirmDialog';
import Loading from '@/components/loading';
import { showToast } from '@/components/Toast';

interface Medicine {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
}

const fetchMedicines = async (): Promise<Medicine[]> => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const res = await apiGet(`${baseUrl}/medicines`);
  return res?.map((m: any) => ({
    id: m?._id,
    name: m?.name,
    category: m?.category,
    type: m?.type,
    price: m?.price,
  }));
};

const MedicinesComponent: React.FC = () => {
  const dispatch = useDispatch();
  const medicines = useSelector((state: RootState) => state.medicines.list);

  const MEDICINE_PAGE_KEY = 'medicine_current_page';

  const isFirstRender = useRef(true);
  const navigate = useNavigate();



  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  /* ✅ FETCH DATA ON PAGE ENTER */
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        dispatch(emptyMedicine());

        const data = await fetchMedicines();

        // console.log("date : ",data);
        

        data?.forEach((m) => dispatch(addMedicine(m)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, [dispatch]);

  const filteredMedicines = medicines?.filter(
    (m) =>
      m?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      const id = deleteModal.id;
      if (!id) return;

      const m = await apiDelete(`/medicines/${id}`);
      if (m) {

        dispatch(deleteMedicine(id));
        setDeleteModal({ isOpen: false, id: null });

        showToast({
          text: "Medicine Delete successfully",
          type: "success",
        });

      }
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
      showToast({
        text: "Not Deleted , try again",
        type: "error",
      });
      alert(error.message);
    }
  };

  ///////////////////////////

  // pagination
  const ITEMS_PER_PAGE = 2;

  // load page from localStorage (fallback to 1)
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = localStorage.getItem(MEDICINE_PAGE_KEY);
    return savedPage ? Number(savedPage) : 1;
  });
  // save current page to localStorage
  useEffect(() => {
    localStorage.setItem(MEDICINE_PAGE_KEY, String(currentPage));
  }, [currentPage]);




  // total pages based on filtered result
  const totalPages = Math.ceil((filteredMedicines?.length || 0) / ITEMS_PER_PAGE);

  // medicines for current page
  const paginatedMedicines = filteredMedicines?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  // reset to page 1 when search changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setCurrentPage(1);
    localStorage.setItem(MEDICINE_PAGE_KEY, '1');
  }, [searchTerm]);



  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center animate-in fade-in duration-500">
        <Loading color={'#0ea5e9'} size='25' />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Medicine Inventory</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Manage prescription drugs and pricing.
            </p>
          </div>
          <Link
            to="/medicines/new"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} /> New Medicine
          </Link>
        </div>

        <div className="card-surface-transition rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className=" border-b border-slate-200 dark:border-slate-800">
                <tr className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedMedicines && paginatedMedicines.length ? paginatedMedicines?.map((med: any) => (
                  <tr key={med?.id || med?._id} className="hover:bg-primary-500/5 transition-colors">
                    <td className="px-6 py-4 font-bold">{med?.name}</td>
                    <td className="px-6 py-4">{med?.category}</td>
                    <td className="px-6 py-4">{med?.type}</td>
                    <td className="px-6 py-4">${med?.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/medicines/edit/${med?.id || med?._id}`)}
                        className="mr-3"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button onClick={() => setDeleteModal({ isOpen: true, id: med?.id || med?._id })}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : <div className="w-full flex justify-center p-[50px] text-blue-900" >No Medicines Found</div>}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">

                {/* Previous */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
            ${currentPage === page
                          ? 'bg-primary-600 text-white shadow'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next */}
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
      </div>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete"
        subtitle="Delete this medicine from the catalog?"
      />
    </>
  );
};

export default function Medicines() {
  return (
    <Suspense fallback={null}>
      <MedicinesComponent />
    </Suspense>
  );
}
