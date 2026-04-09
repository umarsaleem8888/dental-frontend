
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Trash2, 
  Edit2
} from 'lucide-react';
import { recordPayment, deleteInvoice } from '../slices/billingSlice';
import { updateWallet } from '../slices/patientsSlice';
import ConfirmDialog from '../components/ConfirmDialog';

const Billing: React.FC = () => {
  const dispatch = useDispatch();
  const invoices = useSelector((state: RootState) => state.billing.list);
  const patients = useSelector((state: RootState) => state.patients.list);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const handlePayment = (invoiceId: string, amount: number, patientId: string) => {
    dispatch(recordPayment({ invoiceId, amount }));
    dispatch(updateWallet({ patientId, amount }));
  };

  const handleDelete = () => {
    if (deleteModal.id) {
      dispatch(deleteInvoice(deleteModal.id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance & Billing</h2>
          <p className="text-slate-500 dark:text-slate-400">Track invoices and revenue collection.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-sm">#{inv.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">{patients.find(p => p.id === inv.patientId)?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400">{inv.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-sm">${inv.totalAmount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Paid: ${inv.paidAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                      inv.status === 'Partial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== 'Paid' && (
                        <button 
                          onClick={() => handlePayment(inv.id, inv.totalAmount - inv.paidAmount, inv.patientId)}
                          className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-primary-700 active:scale-95 transition-all"
                        >
                          Pay
                        </button>
                      )}
                      <Link title="Edit Invoice" to={`/billing/edit/${inv.id}`} className="p-2 text-slate-400 hover:text-amber-500 transition-all"><Edit2 size={18} /></Link>
                      <button 
                        type="button"
                        onClick={() => setDeleteModal({ isOpen: true, id: inv.id })}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Void Invoice?"
        subtitle="This will remove the billing record and cancel any outstanding dues. This action is recorded for audit purposes."
      />
    </div>
  );
};

export default Billing;
