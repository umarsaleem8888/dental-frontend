
import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
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
  Expand,
  ReceiptText,
  MoveUpRight
} from 'lucide-react';
import { recordPayment, deleteInvoice } from '../../slices/billingSlice';
import { updateWallet } from '../../slices/patientsSlice';
import { deletePrescription } from '../../slices/prescriptionsSlice';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDate, formatTime } from '@/utilz/formateDate';

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'timeline' | 'prescriptions' | 'invoices'>('timeline');

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
  const masterTimeline = useMemo(() => {
    const items = [
      ...appointments.map(a => ({ ...a, activityType: 'appointment' as const })),
      ...prescriptions.map(p => ({ ...p, activityType: 'prescription' as const })),
      ...billing.map(b => ({ ...b, activityType: 'billing' as const }))
    ];
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, prescriptions, billing]);

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

  const handletimeCard = (item) => {

    var link;

    if (item?.type == 'invoice') {
      link = `/invoices/view/${item?.referenceId}`;
    }
    else if (item?.type == 'prescription') {
      link = `/prescriptions/${item?.referenceId}`;
    }
    else {
      return;
    }

    navigate(link);
  }

 

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
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
                <h2 className="text-3xl font-black tracking-tight">{patient.name}</h2>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-slate-500 tracking-widest uppercase">ID: {patient.id}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-slate-500 dark:text-slate-400">
                {/* <span className="flex items-center gap-1.5 text-xs font-medium"><Calendar size={14} /> Joined {patient.createdAt}</span> */}
                <span className="flex items-center gap-1.5 text-xs font-medium"><MapPin size={14} /> {patient.address.split(',')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/prescriptions/new/${patient.id}`} className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary-500/10 active:scale-95">
            <Plus size={18} /> New Prescription
          </Link>
          <Link to="/appointments/new" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95">
            <Calendar size={18} /> Book Visit
          </Link>
          <Link to={`/patient/view/${id}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95">
            <Expand size={18} /> Expend
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Essential Data */}
        <div className="lg:col-span-4 space-y-8">
          {/* Wallet Ledger Card */}
          <div className={`p-8 rounded-[2.5rem] border flex flex-col justify-between shadow-sm relative overflow-hidden ${patient.balance >= 0
            ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30'
            : 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800/30'
            }`}>
            <div className="relative z-10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-4">Patient Ledger Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">$</span>
                <h3 className={`text-6xl font-black tracking-tighter ${patient.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                  {patient.balance > 0 ? '+' : patient.balance < 0 ? '-' : ''}${Math.abs(patient.balance).toLocaleString()}
                </h3>
              </div>
              <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${patient.balance >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                {patient.balance >= 0 ? 'Credit / Advance' : 'Due / Pending'}
              </div>
            </div>
            <TrendingUp size={120} className={`absolute -right-8 -bottom-8 opacity-5 ${patient.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`} />
          </div>

          {/* Detailed Info Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs tracking-widest text-slate-400 uppercase">Patient Profile</h4>
              <button className="text-primary-500 font-bold text-xs hover:underline">Edit Info</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Age</p>
                <p className="font-bold">{patient.age} Yrs</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Blood</p>
                <p className="font-bold text-rose-500 flex items-center gap-1">{patient.bloodGroup}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold truncate">{patient.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area: Tabs & Timeline */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            {/* Tab Navigation */}
            <div className="flex p-2 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
              {[
                { id: 'timeline', label: 'History Timeline', icon: History },
                { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
                { id: 'invoices', label: 'Billing Ledger', icon: CreditCard }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-2xl ${activeTab === tab.id
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
            <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
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
                        <div onClick={() => handletimeCard(item)} key={idx} className=" cursor-pointer relative pl-12 group">
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
                                          : 'Billing record '}
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
                                  {/* Assigned to: {item?.doctor?.name || 'Medical Team'} */}
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
                  {prescriptions.length > 0 ? prescriptions.map(rx => (
                    <div key={rx.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary-500/50 hover:shadow-xl hover:shadow-black/5 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-black text-lg group-hover:text-primary-500 transition-colors">{rx.diagnosis}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> {rx.date}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><User size={12} /> {doctors.find(d => d.id === rx.doctorId)?.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/prescriptions/${rx.id}`} className="p-2.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-2xl transition-all" title="View Chart">
                          <Eye size={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, id: rx.id, type: 'prescription' })}
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                      <FileText className="mx-auto mb-4 text-slate-200" size={64} />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">No clinical prescriptions found</p>
                      <Link to={`/prescriptions/new/${patient.id}`} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95">
                        <Plus size={18} /> Create New Plan
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-400">
                  {billing.length > 0 ? billing.map(inv => (
                    <div key={inv.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-black text-lg">Invoice #{inv.id}</p>
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                              inv.status === 'Partial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                                'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
                              }`}>
                              {inv.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                            {inv.date} • Total: <span className="text-slate-900 dark:text-slate-200">${inv.totalAmount.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block mr-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Payment Details</p>
                          <p className="text-xs font-bold">Paid: ${inv.paidAmount.toLocaleString()}</p>
                        </div>
                        {inv.status !== 'Paid' && (
                          <button
                            type="button"
                            onClick={() => handlePayment(inv.id, inv.totalAmount - inv.paidAmount, inv.patientId)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-primary-500/20"
                          >
                            Pay Due
                          </button>
                        )}
                        <Link to={`/billing/edit/${inv.id}`} className="p-2.5 text-slate-400 hover:text-primary-500 rounded-2xl transition-all" title="Edit Invoice">
                          <ExternalLink size={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, id: inv.id, type: 'invoice' })}
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                          title="Delete Invoice"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                      <CreditCard className="mx-auto mb-4 text-slate-200" size={64} />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No billing history found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-black text-xs tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary-500" /> Treatment Impact
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Completed Visits</span>
                    <span className="font-black">{appointments.filter(a => a.status === 'Completed').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Life-time Value</span>
                    <span className="font-black text-emerald-500">${billing.reduce((s, b) => s + b.totalAmount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Active Diagnoses</span>
                    <span className="font-black">{prescriptions.length}</span>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Download Comprehensive Report
              </button>
            </div>

            <div className="bg-slate-900 dark:bg-primary-600 text-white p-8 rounded-[2rem] shadow-2xl shadow-black/20 relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-xl mb-3">Health Trajectory</h4>
                  <p className="text-white/60 text-sm leading-relaxed max-w-[200px]">Ensure continuity of care by scheduling next month's follow-up.</p>
                </div>
                <Link to="/appointments/new" className="inline-flex items-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-50 transition-all active:scale-95 w-fit shadow-xl">
                  Book Session <ArrowRight size={16} />
                </Link>
              </div>
              <Calendar size={180} className="absolute -right-12 -bottom-12 text-white/10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700" />
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

export default PatientProfile;
