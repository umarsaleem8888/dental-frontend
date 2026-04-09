
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { updateInvoice } from '../slices/billingSlice';
import { Invoice } from '../types';
import { ArrowLeft, Save, CreditCard } from 'lucide-react';

const BillingEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingInv = useSelector((state: RootState) => state.billing.list.find(inv => inv.id === id));

  const [formData, setFormData] = useState<Partial<Invoice>>({});

  useEffect(() => {
    if (existingInv) {
      setFormData(existingInv);
    }
  }, [existingInv]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      dispatch(updateInvoice(formData as Invoice));
      navigate('/billing');
    }
  };

  if (!existingInv) return <div className="p-10 text-center">Invoice not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Invoice</h2>
          <p className="text-slate-500">Update payment status or details for #{existingInv.id}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Total Amount ($)</label>
              <input required type="number" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.totalAmount || 0} onChange={e => setFormData({...formData, totalAmount: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Paid Amount ($)</label>
              <input required type="number" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.paidAmount || 0} onChange={e => setFormData({...formData, paidAmount: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Status</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            <Save size={18} /> Update Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingEdit;
