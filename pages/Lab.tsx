import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Building2, Pencil, FlaskConical } from 'lucide-react';
import { apiDelete, apiGet } from '@/utilz/endpoints'; // keep for future
import Loading from '@/components/loading';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { addlab, deletelab, emptylab } from '@/slices/lab';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { showToast } from '@/components/Toast';
import { formatDate } from '@/utilz/formateDate';

const Labs: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

   const AlllabsData = useSelector((state: RootState) => state.lab.list);

   console.log('AlllabsData : ',AlllabsData);
   

  const navi = useNavigate();

  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  // =========================
  // 🔌 FETCH LABS (API READY)
  // =========================
  const fetchLabs = async () => {
    // setLoading(true);
    try {
      let res;
      res = await apiGet(`${baseUrl}/labs`);

      console.log('res :=>',res?.data);
      

      ////

      return res?.data?.map((m: any) => ({
      id: m?.id || m?._id,
      name: m?.name,
      phone:m?.phone,
      owner: m?.owner,
      adress: m?.adress,
      status: m?.status,
      createdAt: m?.createdAt
    }));

      ////

      // const RES = res?.data;

      // setLabs(RES);

      // 🟢 DUMMY DATA (FOR NOW)
      // const dummyData = [
      //   {
      //     id: '1',
      //     labName: 'Al Rahah Lab',
      //     ownerName: 'Dr. Ahmed',
      //     phone: '03001234567',
      //     address: 'Lahore, Pakistan',
      //     status: 'Active',
      //     createdAt: '2026-04-01',
      //   },
      //   {
      //     id: '2',
      //     labName: 'City Diagnostics',
      //     ownerName: 'Dr. Usman',
      //     phone: '03111234567',
      //     address: 'Karachi, Pakistan',
      //     status: 'Inactive',
      //     createdAt: '2026-03-15',
      //   },
      //   {
      //     id: '3',
      //     labName: 'Health Lab',
      //     ownerName: 'Dr. Ali',
      //     phone: '03221234567',
      //     address: 'Islamabad, Pakistan',
      //     status: 'Active',
      //     createdAt: '2026-02-10',
      //   },
      // ];

      // setTimeout(() => {
      //   setLabs(dummyData);
      //   setLoading(false);
      // }, 600);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

 
   useEffect(() => {
     const loadData = async () => {
       dispatch(emptylab());
       try {
         setLoading(true);
         const data = await fetchLabs();
         data?.forEach((m:any) => dispatch(addlab(m)));
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     };
     loadData();
   }, [dispatch]);

  // =========================
  // 🔎 SEARCH (FRONTEND)
  // =========================
  const filteredLabs = AlllabsData?.filter((lab:any) => {
    const search = searchTerm.toLowerCase();
    return (
      lab?.name?.toLowerCase().includes(search) ||
      lab?.owner?.toLowerCase().includes(search) ||
      lab?.adress?.toLowerCase().includes(search)
    );
  });

  // =========================
  // 🗑 DELETE (FRONTEND)
  // =========================
  const handleDelete = async () => {
    // if (!deleteModal.id) return;

    // setLabs((prev) => prev.filter((l) => l.id !== deleteModal.id));
    // setDeleteModal({ isOpen: false, id: null });

     try {
          if (!deleteModal.id) return;
          const d = await apiDelete(`${baseUrl}/labs/${deleteModal.id}`);
          if (d) {
            dispatch(deletelab(deleteModal.id));
            showToast({ text: "Deleted Successfully", type: "success" });
          }
        } catch (error: any) {
          showToast({ text: "Not Deleted, try again", type: "error" });
          console.error(error.message);
          alert(error.message);
        }

  };

  const handleEdit = (id:string) => {

    console.log("id : ",id);
  
    if(!id) return;
    let link = `/lab/edit/${id}`;
    console.log(link,'link');
    
    navi(link);
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      {/* 🔍 HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Labs</h2>

        <div className='flex gap-2' >
          <div className="relative w-[300px]">
            <input
              type="text"
              placeholder="Search labs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 pl-10 rounded-lg border w-full dark:bg-slate-800 dark:text-white"
            />
            <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
          </div>

          <Link
            to="/labs/new"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            {/* <FilePlus size={20} /> */}
            Create Labs
          </Link>
        </div>


      </div>

      {/* 📦 CONTENT */}
      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loading color="#0ea5e9" size="25" />
        </div>
      ) : (
        <>
          {filteredLabs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs?.map((lab:any) => (
                <div
                  key={lab?.id || lab?._id }
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                      <Building2 size={24} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded ${lab?.status === 'Active'
                          ? 'text-emerald-500 bg-emerald-100'
                          : 'text-rose-500 bg-rose-100'
                          }`}
                      >
                        {lab?.status}
                      </span>


                    </div>
                  </div>

                  {/* BODY */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">Lab Name</p>
                      <p className="font-bold text-lg">{lab?.name}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Owner</p>
                      <p className="text-sm font-semibold">{lab?.owner}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="text-sm">{lab?.phone}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Date</p>
                        <p className="text-sm">{formatDate(lab?.createdAt)}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-xs text-slate-400">Address</p>
                      <p className="text-sm">{lab?.adress}</p>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-5 pt-3 border-t flex items-center justify-between ">
                    {/* <button className="p-2 text-slate-400 hover:text-blue-500">
                      <Eye size={18} />
                    </button> */}
                    <div>

                      <Link
                        to={`/products/${lab?.id || lab?._id }`}
                        className="bg-primary-600 text-white px-3 py-1 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                      >
                        <FlaskConical  size={14} />
                        Show All Products
                      </Link>

                    </div>
                    <div>
                      <button onClick={(e)=> handleEdit(lab?.id || lab?._id)} className="p-1.5 text-slate-300 hover:text-amber-500">
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, id: lab.id || lab?._id })
                        }
                        className="p-1.5 text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-20">
              <Building2 size={40} className="text-slate-300" />
              <p className="text-sm text-slate-500 mt-2">
                No Labs Found
              </p>
            </div>
          )}
        </>
      )}

      {/* ❗ DELETE MODAL */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Lab?"
        subtitle="This action will permanently remove the lab and all associated products."
      />
    </div>
  );
};

export default Labs;