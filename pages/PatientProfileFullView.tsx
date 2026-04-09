
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import {
    User,
    MapPin,
    Droplet,
    Calendar,
    FileText,
    CreditCard,
    History,
    Plus,
    ArrowLeft,
    Phone,
    Mail,
    MoreHorizontal,
    ExternalLink,
    Eye,
    Clock,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    Trash2,
    ReceiptText,
    Loader2,
    Link2Icon,
    Link2,
    Calendar1,
    X,
    Expand,
    Minimize,
    MoveUpRight

} from 'lucide-react';
import { recordPayment, deleteInvoice } from '../slices/billingSlice';
import { updateWallet } from '../slices/patientsSlice';
import { deletePrescription } from '../slices/prescriptionsSlice';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiGet } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';
import { formatDate, formatTime } from '@/utilz/formateDate';


const PatientProfileFullView: React.FC = () => {

    const baseUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [balance, setBalance] = useState({
        balance: 0,
        history: [],
    });
    const [BalanceLoading, setBalanceLoading] = useState(false);
    const [masterTimeline, setMasterTimeline] = useState([]);
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<'timeline' | 'prescriptions' | 'invoices' | 'billing'>('timeline');

    const [dateFilters, setDateFilters] = useState({
        prescriptions: { from: '', to: '' },
        invoices: { from: '', to: '' },
        billing: { from: '', to: '' }
    });

    useEffect(() => {
        if (!id) return;

        const fetchHistory = async () => {
            try {
                const patientId = id;
                console.log("link : => ", `${baseUrl}/history/${patientId}`);

                const res = await apiGet(`${baseUrl}/history/${patientId}`);

                if (res) {
                    setMasterTimeline(res);
                }

                console.log("res of history:", res);
            } catch (error) {
                console.log("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, [id]);



    const isDateInRange = (date: string, tab: keyof typeof dateFilters) => {

        console.log('date : ', date, 'tab :', tab, 'dateFilter : ', dateFilters);


        const { from, to } = dateFilters[tab];

        if (!from && !to) return true;

        const current = new Date(date).getTime();

        if (from && current < new Date(from).getTime()) return false;
        if (to && current > new Date(to).getTime()) return false;

        return true;
    };



    const DateFilter = ({ tab }: { tab: 'prescriptions' | 'invoices' | 'billing' }) => {
        const filter = dateFilters[tab];

        return (
            <div className="flex flex-wrap items-center gap-6 p-5 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg transition-all duration-300">

                {/* From */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
                        From
                    </label>
                    <input
                        type="date"
                        value={filter.from}
                        onChange={(e) =>
                            setDateFilters(prev => ({
                                ...prev,
                                [tab]: { ...prev[tab], from: e.target.value }
                            }))
                        }
                        className="px-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                    />
                </div>

                {/* To */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
                        To
                    </label>
                    <input
                        type="date"
                        value={filter.to}
                        onChange={(e) =>
                            setDateFilters(prev => ({
                                ...prev,
                                [tab]: { ...prev[tab], to: e.target.value }
                            }))
                        }
                        className="px-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                    />
                </div>

                {/* Clear Button */}
                {(filter.from || filter.to) && (
                    <button
                        onClick={() =>
                            setDateFilters(prev => ({
                                ...prev,
                                [tab]: { from: '', to: '' }
                            }))
                        }
                        className="ml-auto px-5 py-2 bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 font-bold text-sm rounded-full hover:bg-rose-200 dark:hover:bg-rose-800 transition-all shadow-sm"
                    >
                        Clear
                    </button>
                )}
            </div>
        );
    };






    // Modal State for deletions
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: string | null;
        type: 'prescription' | 'invoice' | null
    }>({
        isOpen: false,
        id: null,
        type: null
    });

    const patient = useSelector((state: RootState) => state?.patients?.list?.find(p => p.id === id));
    const appointments = useSelector((state: RootState) => state?.appointments?.list?.filter(a => a.patientId === id));
    const billing = useSelector((state: RootState) => state?.invoices?.list?.filter(b => b.patientId === id));
    const prescriptions = useSelector((state: RootState) => state?.prescriptions?.list?.filter(p => p.patientId === id));
    const doctors = useSelector((state: RootState) => state?.doctors?.list);

    // Merge all activities for a master timeline
    // const masterTimeline = useMemo(() => {
    //     const items = [
    //         ...appointments.map(a => ({ ...a, activityType: 'appointment' as const })),
    //         ...prescriptions.map(p => ({ ...p, activityType: 'prescription' as const })),
    //         ...billing.map(b => ({ ...b, activityType: 'billing' as const }))
    //     ];
    //     return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // }, [appointments, prescriptions, billing]);

    console.log('prescriptions : ', prescriptions);
    console.log('billing : ', billing);



    useEffect(() => {

        const fetchBalance = async () => {
            try {
                setBalanceLoading(true);
                const patientId = id;
                const res = await apiGet(`${baseUrl}/wallet/${patientId}`);
                if (res) {
                    // console.log('res of billing : ',res);
                    
                    setBalanceLoading(false);
                    setBalance(res);
                }
            } catch (error) {
                setBalanceLoading(false);
                showToast({ text: "Balance not get", type: "error" });
                console.log(error)
            }
        }

        fetchBalance();

    }, [])


    if (!patient) {
        return (
            <div className="text-center py-20 flex flex-col items-center">
                <User size={64} className="text-slate-200 mb-4" />
                <h2 className="text-2xl font-bold">Patient record not found</h2>
                <Link to="/patients" className="text-primary-500 mt-4 inline-flex items-center gap-2 font-bold hover:underline">
                    <ArrowLeft size={16} /> Return to Patients List
                </Link>
            </div>
        );
    }

    const handlePayment = (invoiceId: string, amount: number, patientId: string) => {
        dispatch(recordPayment({ invoiceId, amount }));
        dispatch(updateWallet({ patientId, amount }));
    };

    const handleConfirmDelete = () => {
        if (!deleteModal.id || !deleteModal.type) return;

        if (deleteModal.type === 'prescription') {
            dispatch(deletePrescription(deleteModal.id));
        } else if (deleteModal.type === 'invoice') {
            dispatch(deleteInvoice(deleteModal.id));
        }

        setDeleteModal({ isOpen: false, id: null, type: null });
    };

    const handleInvoiceLink = (link) => {
        navigate(link);
    }

    const handletimeCard=(item)=>{

        var link ;
        
        if(item?.type == 'invoice'){
            link = `/invoices/view/${item?.referenceId}`;
        }
        else if(item?.type == 'prescription'){
            link = `/prescriptions/${item?.referenceId}`;
        }
        else{
            return;
        }

         navigate(link);
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 w-full">
            {/* Header Profile Section */}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/patients" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-3xl bg-primary-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-primary-500/20">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-3xl font-black tracking-tight">{patient?.name}</h2>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-slate-500 tracking-widest uppercase">ID: {patient.id}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-slate-500 dark:text-slate-400">
                                {/* <span className="flex items-center gap-1.5 text-xs font-medium"><Calendar size={14} /> Joined {patient?.createdAt}</span> */}
                                <span className="flex items-center gap-1.5 text-xs font-medium"><MapPin size={14} /> {patient?.address?.split(',')[0]}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link to={`/prescriptions/new/${patient?.id}`} className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary-500/10 active:scale-95">
                        <Plus size={18} /> New Prescription
                    </Link>
                    <Link to="/appointments/new" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95">
                        <Calendar size={18} /> Book Visit
                    </Link>
                    <Link to={`/patients/${id}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95">
                        <Minimize size={18} /> Minimize
                    </Link>
                </div>
            </div>

            {/* /////////// */}


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full ">

                {/* Right Content Area: Tabs & Timeline */}
                <div className="lg:col-span-12 w-full">
                    <div className="  w-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm  flex flex-col">
                        {/* Tab Navigation */}
                        <div className="  flex p-2 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
                            {[
                                { id: 'timeline', label: 'History Timeline', icon: History },
                                { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
                                { id: 'invoices', label: 'Invoices', icon: CreditCard },
                                { id: 'billing', label: 'Billing Ledger', icon: ReceiptText }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`mt-[5px] ml-[2px] flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-2xl ${activeTab === tab.id
                                        ? 'bg-white dark:bg-slate-900 text-primary-500 shadow-lg shadow-black/5'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content View */}
                        <div className="p-8 flex-1 ">

                            {activeTab === 'timeline' && (
                                <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-400">

                                    {masterTimeline && masterTimeline?.length > 0 ? (
                                        masterTimeline?.map((item: any, idx) => {
                                            const isApt = item.type === 'appointment';
                                            const isRx = item.type === 'prescription';
                                            const isBill = item.type === 'invoice';
                                            const isLeader = item.type === 'billing';

                                            // Determine dot color
                                            const dotColor = isApt
                                                ? 'bg-primary-500'
                                                : isRx
                                                    ? 'bg-purple-500'
                                                    : isLeader
                                                        ? 'bg-emerald-500'
                                                        : 'bg-emerald-400';

                                            // Determine icon
                                            const DotIcon = isApt
                                                ? Calendar
                                                : isRx
                                                    ? FileText
                                                    : isLeader
                                                        ? ReceiptText
                                                        : CreditCard;

                                            return (
                                                <div onClick={()=> handletimeCard(item)} key={idx} className=" cursor-pointer relative pl-12 group">
                                                    {/* Timeline Dot */}
                                                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-xl border-4 border-white dark:border-slate-900
                            flex items-center justify-center text-white z-10 transition-transform group-hover:scale-110 ${dotColor}`}>
                                                        <DotIcon size={16} />
                                                    </div>

                                                    {/* Timeline Card */}
                                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl hover:bg-white dark:hover:bg-slate-800 
                            hover:shadow-xl hover:shadow-black/5 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            {/* Left Content */}
                                                            <div className='' >
                                                                <div className='w-full flex items-center justify-between' >
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                                                        {isApt
                                                                            ? 'Appointment'
                                                                            : isRx
                                                                                ? 'Prescription Generated'
                                                                                : isBill
                                                                                    ? 'Invoice generated'
                                                                                    : 'Billing record'}
                                                                    </p>
                                                                    
                                                                </div>
                                                                <h5 className="font-black text-lg ">
                                                                    {
                                                                        <div className=' flex gap-2 items-center justify-center' >
                                                                        {item?.referenceId}  
                                                                        </div>
                                                                    }
                                                                </h5>
                                                                <p className="text-xs text-slate-500 mt-1 font-medium">
                                                                    Assigned to: {item?.doctor?.name || 'Medical Team'}
                                                                </p>
                                                            </div>

                                                            {/* Right Content */}
                                                            <div className=" text-left sm:text-right shrink-0">
                                                                <div className='w-full flex justify-end items-start ' >
                                                                <MoveUpRight className='mt-[-10px] text-[#a5b1c3] ' size={14} />
                                                                </div>
                                                                <p className="mt-[10px] text-sm text-[#727c8d] font-bold"> {formatDate(item?.createdAt || item?.date)}</p>
                                                                <p className="text-[10px]  text-[#727c8d] uppercase tracking-widest">{formatTime(item?.createdAt || item?.date)}</p>
                                                                {/* {isApt && (
                                                                    <p className="text-[10px] font-bold text-[#a5b1c3] uppercase tracking-widest">{formatTime(item?.createdAt || item?.date)}</p>
                                                                )} */}
                                                                {/* {isBill && ( */}
                                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'
                                                                    }`}>
                                                                    {item.status}
                                                                </p>
                                                                {/* )} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-24">
                                            <History className="mx-auto mb-4 text-slate-200" size={64} />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                                No activity records found
                                            </p>
                                        </div>
                                    )}

                                </div>
                            )}

                            {activeTab === 'prescriptions' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-400">

                                    {/* Date Filter */}
                                    <DateFilter tab="prescriptions" />

                                    {prescriptions && prescriptions.length > 0 ? (
                                        (() => {
                                            const filteredPrescriptions = prescriptions.filter(rx =>
                                                isDateInRange(rx.date, 'prescriptions')
                                            );

                                            return filteredPrescriptions.length > 0 ? (
                                                filteredPrescriptions.map(rx => (
                                                    <div
                                                        key={rx.id || rx._id}
                                                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800
                         flex flex-col sm:flex-row sm:items-center justify-between gap-4 group
                         hover:border-primary-500/50 hover:shadow-xl hover:shadow-black/5 transition-all"
                                                    >
                                                        {/* Left Side */}
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600
                                rounded-2xl flex items-center justify-center shrink-0">
                                                                <FileText size={24} />
                                                            </div>

                                                            <div>
                                                                <p className="font-black text-lg group-hover:text-primary-500 transition-colors">
                                                                    {rx.diagnosis}
                                                                </p>

                                                                <div className="flex items-center gap-4 mt-1">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                        <Calendar size={12} />
                                                                        {new Date(rx.date).toLocaleDateString()}
                                                                    </span>

                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                        <User size={12} />
                                                                        {doctors?.find(d => d.id === rx.doctorId)?.name || 'Unknown'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                to={`/prescriptions/${rx.id || rx._id}`}
                                                                className="p-2.5 text-slate-400 hover:text-primary-500
                             hover:bg-primary-50 dark:hover:bg-primary-900/20
                             rounded-2xl transition-all"
                                                                title="View Prescription"
                                                            >
                                                                <Eye size={18} />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeleteModal({
                                                                        isOpen: true,
                                                                        id: rx.id || rx._id,
                                                                        type: 'prescription'
                                                                    })
                                                                }
                                                                className="p-2.5 text-slate-400 hover:text-rose-500
                             hover:bg-rose-50 dark:hover:bg-rose-900/20
                             rounded-2xl transition-all"
                                                                title="Delete Record"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem]
                          border border-dashed border-slate-200 dark:border-slate-800">
                                                    <FileText className="mx-auto mb-4 text-slate-200" size={64} />
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
                                                        No clinical prescriptions found
                                                    </p>

                                                    <Link
                                                        to={`/prescriptions/new/${patient.id}`}
                                                        className="inline-flex items-center gap-2 bg-primary-600 text-white
                         px-6 py-3 rounded-2xl font-bold text-sm
                         shadow-lg shadow-primary-500/20 active:scale-95"
                                                    >
                                                        <Plus size={18} />
                                                        Create New Plan
                                                    </Link>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        // fallback if prescriptions array is empty
                                        <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem]
                      border border-dashed border-slate-200 dark:border-slate-800">
                                            <FileText className="mx-auto mb-4 text-slate-200" size={64} />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
                                                No clinical prescriptions found
                                            </p>

                                            <Link
                                                to={`/prescriptions/new/${patient.id}`}
                                                className="inline-flex items-center gap-2 bg-primary-600 text-white
                     px-6 py-3 rounded-2xl font-bold text-sm
                     shadow-lg shadow-primary-500/20 active:scale-95"
                                            >
                                                <Plus size={18} />
                                                Create New Plan
                                            </Link>
                                        </div>
                                    )}

                                </div>
                            )}

                            {activeTab === 'invoices' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-400">

                                    {/* Date Filter */}
                                    <DateFilter tab="invoices" />

                                    {billing && billing.length > 0 ? (
                                        (() => {
                                            const filteredInvoices = billing.filter(inv =>
                                                isDateInRange(inv.createdAt || inv.date, 'invoices')
                                            );

                                            return filteredInvoices.length > 0 ? (
                                                filteredInvoices.map(inv => (
                                                    <div
                                                        key={inv.id}
                                                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 
                flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                                                    >
                                                        {/* Left side */}
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 
                  rounded-2xl flex items-center justify-center shrink-0">
                                                                <CreditCard size={18} />
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-3">
                                                                    <p className="font-black text-sm">Invoice #{inv.id}</p>

                                                                    <span
                                                                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${inv.status === 'Paid'
                                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                                                                            : inv.status === 'Partial'
                                                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                                                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
                                                                            }`}
                                                                    >
                                                                        {inv.status}
                                                                    </span>
                                                                </div>

                                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                                    {new Date(inv.createdAt || inv.date).toLocaleDateString()} • Total:{' '}
                                                                    <span className="text-slate-900 dark:text-slate-200">
                                                                        ${inv.totalAmount.toLocaleString()}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Right side */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right hidden sm:block mr-2">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                                                    Payment Details
                                                                </p>
                                                                <p className="text-xs font-bold">
                                                                    Paid: ${inv.paidAmount.toLocaleString()}
                                                                </p>
                                                            </div>

                                                            {/* View */}
                                                            <Link
                                                                to={`/invoices/view/${inv.id}`}
                                                                className="p-2.5 text-slate-400 hover:text-primary-500 rounded-2xl transition-all"
                                                                title="View Invoice"
                                                            >
                                                                <Eye size={18} />
                                                            </Link>

                                                            {/* Delete */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeleteModal({ isOpen: true, id: inv.id, type: 'invoice' })
                                                                }
                                                                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                                                                title="Delete Invoice"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                // If no invoices after filter
                                                <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                                                    <CreditCard className="mx-auto mb-4 text-slate-200" size={64} />
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
                                                        No invoices found
                                                    </p>

                                                    <Link
                                                        to={`/invoices/new`}
                                                        className="inline-flex items-center gap-2 bg-primary-600 text-white
                 px-6 py-3 rounded-2xl font-bold text-sm
                 shadow-lg shadow-primary-500/20 active:scale-95"
                                                    >
                                                        <Plus size={18} />
                                                        Create New Invoice
                                                    </Link>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        // fallback if billing array is empty
                                        <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                                            <CreditCard className="mx-auto mb-4 text-slate-200" size={64} />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
                                                No invoices found
                                            </p>

                                            <Link
                                                to={`/invoices/new`}
                                                className="inline-flex items-center gap-2 bg-primary-600 text-white
             px-6 py-3 rounded-2xl font-bold text-sm
             shadow-lg shadow-primary-500/20 active:scale-95"
                                            >
                                                <Plus size={18} />
                                                Create New Invoice
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}


                            {activeTab === 'billing' && (
                                <>
                                    <DateFilter tab="billing" />

                                    {BalanceLoading ? (
                                        <div className="w-full flex justify-center items-center h-[20vh]">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : (
                                        (() => {
                                            // Filter history based on date range
                                            const filteredHistory = balance?.history?.filter(h =>
                                                isDateInRange(h.createdAt || h.date, 'billing')
                                            );

                                            if (!filteredHistory || filteredHistory.length === 0) {

                                                return (

                                                    <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                                                        <ReceiptText className="mx-auto mb-4 text-slate-200" size={64} />
                                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
                                                            No Billing Record Found
                                                        </p>
                                                    </div>
                                                )
                                            }

                                            return filteredHistory?.map((h, idx, arr) => (
                                                <div key={h._id} className="relative pl-8 pb-6">

                                                    {/* vertical line */}
                                                    {idx !== arr.length - 1 && (
                                                        <span className="absolute left-3 top-3 h-full w-px bg-slate-200" />
                                                    )}

                                                    {/* dot */}
                                                    <span
                                                        className={`absolute left-1.5 top-3 h-4 w-4 rounded-full border-2 ${h.changeAmount >= 0
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'bg-rose-500 border-rose-500'
                                                            }`}
                                                    />

                                                    {/* card */}
                                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm transition-all hover:shadow-md">
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                                <p >
                                                                Invoice Transaction
                                                                </p>
                                                                <p className='text-[#a5b1c3]' >{h?._id}</p>
                                                            </div>

                                                            <span
                                                                className={`text-sm font-medium ${h.changeAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                                                    }`}
                                                            >
                                                                {h.changeAmount >= 0 ? '+' : ''}
                                                                {h.changeAmount}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-slate-600 dark:text-slate-300">
                                                            <div>
                                                                <span className="text-slate-400 dark:text-slate-400">Previous Balance</span>
                                                                <div className="font-medium">{h.prevWalletBalance}</div>
                                                            </div>

                                                            <div>
                                                                <span className="text-slate-400 dark:text-slate-400">New Balance</span>
                                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                                    {h.newWalletBalance}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <span className="text-slate-400 dark:text-slate-400">Total Bill</span>
                                                                <div>{h.totalAmount}</div>
                                                            </div>

                                                            <div>
                                                                <span className="text-slate-400 dark:text-slate-400">Paid</span>
                                                                <div>{h.paidAmount}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between items-center mt-3 text-xs text-slate-400 dark:text-slate-500">
                                                            <span
                                                                onClick={() => handleInvoiceLink(`/invoices/view/${h.invoiceId}`)}
                                                                className="cursor-pointer flex gap-2 items-center text-slate-500 transition-all duration-200 ease-out hover:text-blue-600 hover:scale-[1.02]"
                                                            >
                                                                <p>Invoice :</p>
                                                                <p>{h?.invoiceId}</p>
                                                                <Link2 size={14} />
                                                            </span>

                                                            <span>{new Date(h.createdAt).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ));
                                        })()
                                    )}
                                </>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null, type: null })}
                onConfirm={handleConfirmDelete}
                title={deleteModal.type === 'prescription' ? "Delete Prescription?" : "Void Invoice?"}
                subtitle={
                    deleteModal.type === 'prescription'
                        ? "This will permanently remove the medical instructions and diagnosis from the patient record. This action cannot be undone."
                        : "This will remove the billing record and cancel any outstanding dues. This action is recorded for audit purposes."
                }
            />
        </div>
    );
};

export default PatientProfileFullView;
