import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { addInvoice } from '@/slices/invoice';
import { apiGet, apiPut } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';
import { Plus, Trash2, FilePlus, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateInvoice } from '@/slices/billingSlice';
import Select from 'react-select';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceFormData {
  patientId: string;
  doctorId: string;
  checkupFee: number;
  items: InvoiceItem[];
  notes: string;
  paidAmount: number;
  status: 'Draft' | 'Paid' | 'Partial';
  type?: 'Checkup' | 'PreviousDue';
}

const InvoiceEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_API_URL;

  const invoices = useSelector((state: any) => state.invoices.list);
  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  const invoiceToEdit = invoices.find((inv: any) => inv.id === id);

  const [loading, setLoading] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'Checkup' | 'PreviousDue'>('Checkup');
  const [walletPrev, setWalletPrev] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online' | 'Card' | 'Other'>('Cash');
  const [prev, setPrevious] = useState<any>({});

  const [formData, setFormData] = useState<InvoiceFormData>({
    patientId: '',
    doctorId: '',
    checkupFee: 0,
    items: [],
    notes: '',
    paidAmount: 0,
    status: 'Draft',
    type: 'Checkup',
  });

  // Populate form with existing invoice
  // const invoiceToEdit = invoices.find((inv: any) => inv.id === id);

  useEffect(() => {
    if (invoiceToEdit) {
      setFormData({
        patientId: invoiceToEdit.patientId,
        doctorId: invoiceToEdit.doctorId,
        checkupFee: invoiceToEdit.checkupFee,
        items: invoiceToEdit.items || [],
        notes: invoiceToEdit.notes,
        paidAmount: invoiceToEdit.paidAmount,
        status: invoiceToEdit.status,
        type: invoiceToEdit.type || 'Checkup',
      });
      setInvoiceType(invoiceToEdit.type || 'Checkup');
      setPaymentMethod(invoiceToEdit.paymentMethod || 'Cash');
      setWalletPrev(invoiceToEdit.walletBalance ? +invoiceToEdit.walletBalance : 1000);
      setPrevious(invoiceToEdit);
    }
  }, [invoiceToEdit]);

  ////

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await apiGet(`${baseUrl}/labproducts/`);

      const formatted = res?.data?.map((p: any) => ({
        value: p._id,
        label: p.name,
        data: p,
      }));

      setOptions(formatted);
    };

    fetchProducts();
  }, []);

  ////


  // Reset type when patient changes
  useEffect(() => {
    // ✅ Do NOT reset data when editing existing invoice
    if (invoiceToEdit) return;

    setInvoiceType('Checkup');
    setFormData(prev => ({
      ...prev,
      type: 'Checkup',
      checkupFee: 0,
      items: [],
    }));
  }, [formData.patientId, invoiceToEdit]);


  // Add / Update / Remove items
  const addItem = () =>
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }],
    }));

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) =>
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });

  // Handle Previous Due mode
  const handlePrevDueMode = () => {
    setInvoiceType('PreviousDue');
    setFormData(prev => ({ ...prev, type: 'PreviousDue', checkupFee: 0, items: [] }));
  };

  // Calculations
  const totalAmount =
    invoiceType === 'PreviousDue'
      ? 0
      : formData.items.reduce((sum, i) => sum + i.quantity * i.price, 0) + formData.checkupFee;

  const remainingAmount = totalAmount - formData.paidAmount;
  const walletRemaining = walletPrev + formData.paidAmount - totalAmount;

  const walletStatus =
    walletRemaining > 0
      ? 'All Paid / Extra'
      : walletRemaining === 0
        ? 'All Paid'
        : 'Remaining Due / Negative';

  let invoiceTypeStatus = '';
  if (invoiceType === 'PreviousDue') {
    invoiceTypeStatus = 'Previous Due Payment';
  } else if (formData.paidAmount > 0 && totalAmount === 0) {
    invoiceTypeStatus = 'Payment Only';
  } else if (totalAmount > 0 && formData.paidAmount > 0 && walletPrev < 0) {
    invoiceTypeStatus = 'Checkup + Payment';
  } else if (totalAmount > 0) {
    invoiceTypeStatus = 'Checkup Invoice';
  } else {
    invoiceTypeStatus = 'Draft';
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceToEdit) return;

    if (!formData.patientId) {
      showToast({ text: 'Select a patient', type: 'error' });
      return;
    }

    // if (formData.paidAmount > totalAmount + (walletPrev < 0 ? Math.abs(walletPrev) : 0)) {
    //   showToast({ text: 'Paid amount cannot exceed total due', type: 'error' });
    //   return;
    // }

    const status =
      invoiceType === 'PreviousDue'
        ? walletRemaining < 0
          ? 'Partial'
          : 'Paid'
        : formData.paidAmount === 0
          ? 'Draft'
          : formData.paidAmount < totalAmount
            ? 'Partial'
            : 'Paid';

    try {
      setLoading(true);

      const walletBalance = walletRemaining.toFixed(2);

      const payload = {
        ...formData,
        walletBalance,
        invoiceTypeStatus,
        walletStatus,
        totalAmount,
        status,
        type: invoiceType,
        paymentMethod,
      };

      const res = await apiPut(`${baseUrl}/invoice/${invoiceToEdit.id}`, payload);

      if (res) {
        const updatedInvoice = {
          ...res,
          patient: patients.find(p => p.id === res.patientId) || {},
          doctor: doctors.find(d => d.id === res.doctorId) || {},
        };
        dispatch(updateInvoice(updatedInvoice));

        setWalletPrev(walletRemaining);
        showToast({ text: 'Invoice Updated', type: 'success' });
        navigate(-1);
      }
    } catch (error) {
      showToast({ text: 'Invoice update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold">Edit Invoice</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN FORM */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border space-y-6">
            {/* Patient + Previous Due */}
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-600 mb-1">Patient</label>
              {walletPrev < 0 && invoiceType !== 'PreviousDue' && (
                <button
                  type="button"
                  onClick={handlePrevDueMode}
                  className="text-xs text-rose-500 underline"
                >
                  Pay Previous Due
                </button>
              )}
            </div>
            <select
              value={formData.patientId}
              onChange={e => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-800"
            >
              <option value="">Select Patient</option>
              {patients?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Doctor + Checkup Fee + Items */}
            {invoiceType === 'Checkup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Doctor</label>
                  <select
                    value={formData.doctorId}
                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Checkup Fee</label>
                  <input
                    type="number"
                    min={0}
                    value={formData?.checkupFee}
                    onChange={e =>
                      setFormData({ ...formData, checkupFee: +e.target.value })
                    }
                    placeholder="Enter Checkup Fee"
                    className="w-full p-3 rounded-xl bg-slate-50 mt-1"
                  />
                </div>

                {/* <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-600">Invoice Items</label>
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 rounded-xl p-4"
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-600">
                          Item Name
                        </label>
                        <input
                          placeholder="Item name"
                          value={item.name}
                          onChange={e => updateItem(idx, 'name', e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-white border border-slate-200 mt-1 focus:ring-2 focus:ring-primary-500/20 outline-none"
                        />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-slate-600">
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          min={0}
                          value={item.price}
                          onChange={e => updateItem(idx, 'price', +e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-white border border-slate-200 mt-1 focus:ring-2 focus:ring-primary-500/20 outline-none"
                        />
                      </div>
                      <div className="w-full md:w-28">
                        <label className="block text-sm font-medium text-slate-600">
                          Qty
                        </label>
                        <input
                          type="number"
                          min={1}
                          placeholder="1"
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', +e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-white border border-slate-200 mt-1 focus:ring-2 focus:ring-primary-500/20 outline-none"
                        />
                      </div>
                      <div className="flex items-center pb-1">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-2 rounded-lg hover:bg-rose-100 transition"
                        >
                          <Trash2 className="text-rose-500" size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-primary-600 mt-2"
                  >
                    <Plus size={18} /> Add Item
                  </button>
                </div> */}

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-600">
                    Lab Products
                  </label>

                  {formData.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 rounded-xl p-4"
                    >
                      {/* Product Selector */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-600">
                          Product Name
                        </label>

                        <Select
                          options={options}
                          value={
                            options.find(
                              (opt: any) =>
                                String(opt.value) === String(item.productId || item._id || item.id)
                            ) || {
                              label: item.name,
                              value: item.productId,
                            }
                          }
                          onChange={(selected: any) => {
                            const updated = [...formData.items];

                            updated[idx] = {
                              ...updated[idx],
                              productId: selected.value,
                              name: selected.data.name,
                              price: selected.data.price,
                              lab: selected.data.lab,
                            };

                            setFormData({
                              ...formData,
                              items: updated,
                            });
                          }}
                          placeholder="Search..."
                          isSearchable
                        />
                      </div>

                      {/* Price */}
                      <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-slate-600">
                          Price
                        </label>

                        <input
                          disabled
                          value={item.price}
                          className="w-full p-2.5 rounded-lg bg-white border"
                        />
                      </div>

                      {/* Qty */}
                      <div className="w-full md:w-28">
                        <label className="block text-sm font-medium text-slate-600">
                          Qty
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...formData.items];
                            updated[idx].quantity = +e.target.value;

                            setFormData({
                              ...formData,
                              items: updated,
                            });
                          }}
                          className="w-full p-2.5 rounded-lg bg-white border"
                        />
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.items.filter(
                            (_: any, i: number) => i !== idx
                          );

                          setFormData({
                            ...formData,
                            items: updated,
                          });
                        }}
                        className="p-2 rounded-lg hover:bg-rose-100 transition"
                      >
                        <Trash2 className="text-rose-500" size={18} />
                      </button>
                      {/* /// */}

                      {/* <div className="flex items-center pb-1">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                       
                        >
                        
                        </button>
                      </div> */}

                      {/* /// */}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-primary-600 mt-2"
                  >
                    <Plus size={18} /> Add Lab's Products
                  </button>
                </div>

              </>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-600 mt-4">
                Amount Paid
              </label>
              <input
                type="number"
                min={0}
                // max={totalAmount + (walletPrev < 0 ? Math.abs(walletPrev) : 0)}
                placeholder="Amount Paid Now"
                value={formData.paidAmount}
                onChange={e => setFormData({ ...formData, paidAmount: +e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 mt-1"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mt-4">
                Notes
              </label>
              <textarea
                placeholder="Invoice notes..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 mt-1"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mt-4">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-50 mt-1"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 transition-colors text-white py-4 rounded-2xl flex items-center justify-center gap-2 mt-4 font-semibold shadow-md"
            >
              {loading ? (
                <div className="w-full flex items-center justify-center animate-in fade-in duration-500">
                  <Loader2 color={'#0ea5e9'} size={25} />
                </div>
              ) : (
                <>
                  <FilePlus size={20} /> Update Invoice
                </>
              )}
            </button>
          </div>
        </div>

        {/* SIDEBAR / SUMMARY */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 shadow-lg p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase text-slate-400 font-bold tracking-wider">Invoice Summary</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                {walletRemaining < 0 ? (
                  <span className="flex items-center gap-1 text-rose-500 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    Due
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Paid
                  </span>
                )}
              </div>
            </div>

            {/* Patient & Doctor */}
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Patient</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">
                  {patients.find(p => p.id === formData.patientId)?.name || '-'}
                </p>
              </div>
              {invoiceType === 'Checkup' && (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Doctor</p>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {doctors.find(d => d.id === formData.doctorId)?.name || '-'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Checkup Fee</p>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      ${formData.checkupFee.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Items */}
            {formData.items.length > 0 && (
              <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  Lab Products
                </p>
                {formData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                    <p>{item.name} x {item.quantity}</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Today's Bill</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Paid</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">${formData.paidAmount}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Wallet Remaining</p>
                <p className={`font-semibold ${walletRemaining < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  ${walletRemaining.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Wallet + Type + Payment Method */}
            <div className="space-y-2 pt-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Wallet Status</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{walletStatus}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Invoice Type</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{invoiceTypeStatus}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Payment Method</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceEdit;
