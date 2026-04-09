import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
    Search,
    FileText,
    Trash2,
    ExternalLink,
    Edit2,
    Receipt,
    ArrowLeft,
    View,
    Eye
} from 'lucide-react';
import {
    addInvoice,
    deleteInvoice,
    emptyInvoices,
    InvoicefilterType,
    InvoiceFrom,
    InvoiceTo
} from '../slices/invoice';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiDelete, apiGet, apiPost } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';
import Loading from '@/components/loading';
import InvoiceFilter from '@/components/InvoiceFilters';
import InvoiceForm from './InvoiceForm';

const Invoices: React.FC = () => {

    // const navigate = useNavigate();

    const [filterState, setFilterState] = useState(() => {
        return localStorage.getItem("patient_filter_type") || "today";
    });

    const baseUrl = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();
    const invoices = useSelector((state: any) => state?.invoices?.list);
    const patients = useSelector((state: any) => state?.patients?.list);
    const doctors = useSelector((state: any) => state?.doctors?.list);

    // console.log(invoices);


    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [filterTrigger, setFilterTrigger] = useState('');

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
    }>({ isOpen: false, id: null });



    const getFilterdInvoice = async () => {
        const typeForData = localStorage.getItem("invoice_filter_type");
        let type = '';
        let res;

        switch (typeForData) {
            case 'week':
                type = 'week';
                break;
            case 'month':
                type = 'month';
                break;
            case 'year':
                type = 'year';
                break;
            case 'today':
                type = 'today';
                break;
            case 'date':
                type = 'by-date';
                break;
            case 'all':
            default:
                type = 'all';
                break;
        }

        if (typeForData === 'date') {
            const from = localStorage.getItem('invoice_filter_from');
            const to = localStorage.getItem('invoice_filter_to');
            res = await apiPost(`${baseUrl}/invoice/${type}`, { fromDate: from, toDate: to });
        } else {
            res = await apiGet(`${baseUrl}/invoice/${type}`);
        }

        return res;
    };

    /* ---------------- FETCH ---------------- */
    const fetchInvoices = async () => {

        const res = await getFilterdInvoice();

        // const res = await apiGet(`${baseUrl}/invoice/all/`);

        return res?.map((i: any) => {
            const p = patients?.find(p => p?.id === i?.patientId);
            const d = doctors.find(d => d?.id === i.doctorId);

            return {
                id: i?._id,
                patientId: i?.patientId,
                patient: p,
                doctor: d,
                doctorId: i?.doctorId,
                totalAmount: i?.totalAmount,
                paidAmount: i?.paidAmount,
                status: i?.status,
                type: i?.type,
                paymentMethod: i?.paymentMethod,
                walletBalance: i?.walletBalance,
                walletStatus: i?.walletStatus,
                notes: i?.notes,
                items: i?.items,
                checkupFee: i?.checkupFee,
                date: i?.createdAt
                    ? new Date(i.createdAt).toISOString().split('T')[0] 
                    : null,
            };
        });
        ;
    };

    const handleTypeChange = ({ type, from, to }: any) => {

        // const From = localStorage.getItem('invoice_filter_from');
        // const To = localStorage.getItem('invoice_filter_to');

        dispatch(InvoicefilterType(type));
        setFilterState(type);
        setCurrentPage(1);
        dispatch(InvoiceFrom(from));
        dispatch(InvoiceTo(to))

        setFilterTrigger(`${from}-${to}`);

    };

    useEffect(() => {
        const loadData = async () => {
            dispatch(emptyInvoices());
            try {
                setLoading(true);
                const data = await fetchInvoices();
                console.log(data, 'data');

                data?.forEach((i: any) => dispatch(addInvoice(i)));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [dispatch, filterState, filterTrigger]);

    ////

    /* ---------------- FILTER + SEARCH ---------------- */
    const filteredInvoices = (invoices || []).filter((inv: any) =>
        inv?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv?.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv?.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const currentInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /* ---------------- DELETE ---------------- */
    const handleDelete = async () => {
        try {
            if (!deleteModal.id) return;
            const res = await apiDelete(`${baseUrl}/invoice/${deleteModal.id}`);
            if (res) {
                dispatch(deleteInvoice(deleteModal.id));
                showToast({ text: 'Invoice Deleted', type: 'success' });
            }
        } catch (err) {
            showToast({ text: 'Delete failed', type: 'error' });
        }
    };

    ////


    /* ---------------- UI ---------------- */
    const jsx = (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
                    <p className="text-slate-500">Billing & financial records</p>
                </div>

                <Link
                    to="/invoices/new"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95"
                >
                    <Receipt size={20} /> New Invoice
                </Link>
            </div>

            {/* SEARCH */}
            <div className="bg-white rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search invoice, patient or status..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                    </div>
                    <div>
                        <InvoiceFilter handleTypeChange={handleTypeChange} />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800">
                                {/* <th className="px-6 py-4 text-xs font-bold uppercase">Invoice</th> */}
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#727c8d]">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#727c8d]">Paid</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#727c8d]">Total</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#727c8d]">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-right text-[#727c8d]">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {currentInvoices?.map((inv: any) => (
                                <tr key={inv?.id} className="hover:bg-primary-500/5">
                                    {/* <td className="px-6 py-4 font-bold flex items-center gap-2">
                                        <FileText size={16} />
                                        {inv?.id}
                                    </td> */}

                                    <td className="px-6 py-4">{inv?.patient?.name}</td>



                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        ${inv?.paidAmount}
                                    </td>

                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        ${inv?.totalAmount}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold
                                                    ${inv?.status === 'Paid'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {inv?.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/invoices/edit/${inv?.id}`} className="p-2 hover:text-amber-500">
                                                <Edit2 color='#a5b1c3' size={18} />
                                            </Link>
                                            <Link to={`/invoices/edit/${inv?.id}`} className="p-2 hover:text-primary-500">
                                                <ExternalLink color='#a5b1c3' size={18} />
                                            </Link>
                                            <Link to={`/invoices/view/${inv?.id}`} className="p-2 hover:text-primary-500">
                                                <Eye color='#a5b1c3' size={18} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, id: inv.id })}
                                                className="p-2 hover:text-rose-500"
                                            >
                                                <Trash2 color='#a5b1c3' size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredInvoices.length === 0 && (
                        <div className="py-20 text-center text-slate-500">
                            No invoices found.
                        </div>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-between px-6 py-4 border-t">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`px-3 py-1 rounded-lg ${p === currentPage
                                            ? 'bg-primary-600 text-white'
                                            : 'hover:bg-slate-100'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete Invoice?"
                subtitle="This action cannot be undone."
            />
        </div>
    );

    return loading ? (
        <div className="h-[80vh] flex justify-center items-center">
            <Loading color="#0ea5e9" size="25" />
        </div>
    ) : (
        jsx
    );
};

export default Invoices;
