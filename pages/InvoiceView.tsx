import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

const InvoiceView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoices = useSelector((state: any) => state.invoices.list);
  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-500">
        <p>Invoice not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const patient = patients.find(p => p.id === invoice?.patientId);
  const doctor = doctors.find(d => d.id === invoice?.doctorId);

  /** ---------------- CALCULATIONS (ADDED ONLY) ---------------- */
  const itemsTotal =
    invoice?.items?.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    ) || 0;

  const checkupFee = invoice?.checkupFee || 0;

  const calculatedTotal =
    invoice?.type === 'PreviousDue'
      ? 0
      : itemsTotal + checkupFee;

  const totalAmount = invoice?.totalAmount ?? calculatedTotal;

  const remainingAmount = invoice?.status;
  const walletRemaining = (
    invoice?.walletBalance ? +invoice?.walletBalance : 0
  ).toFixed(2);

  const formatCurrency = (value: number | string) =>
    `$${Number(value).toFixed(2)}`;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-800"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
        >
          <Printer size={20} /> Print
        </button>
      </div>

      {/* Invoice Card */}
      <div className="bg-white dark:bg-slate-900 shadow-lg rounded-3xl p-8 border border-slate-200 dark:border-slate-700 space-y-6">
        {/* Title */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Invoice
            </h2>
            <p className="text-sm text-slate-400">{invoice?.id}</p>
          </div>

          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-600">
            {remainingAmount}
          </span>
        </div>

        {/* Patient & Doctor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
          <div>
            <h3 className="font-semibold text-slate-600">Patient</h3>
            <p className="text-slate-800">{patient?.name || '-'}</p>
            {patient?.phone && (
              <p className="text-sm text-slate-500">{patient.phone}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-600">Doctor</h3>
            <p className="text-slate-800">{doctor?.name || '-'}</p>
          </div>
        </div>

        {/* Invoice Items */}
        {invoice.items && invoice.items.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="font-semibold text-slate-600 mb-2">
              Lab's Products
            </h3>

            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-none">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notes */}
        {invoice?.notes && (
          <div>
            <h3 className="font-semibold text-slate-600">Notes</h3>
            <p className="text-slate-800">{invoice.notes}</p>
          </div>
        )}

        {/* Totals Section (ENHANCED, NOT REMOVED) */}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Items Total</span>
            <span className="font-medium">
              {formatCurrency(itemsTotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Checkup Fee</span>
            <span className="font-medium">
              {formatCurrency(checkupFee)}
            </span>
          </div>

          <div className="flex justify-between border-t pt-2 text-base">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Paid Amount</span>
            <span className="font-semibold">
              {formatCurrency(invoice.paidAmount)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Wallet Balance</span>
            <span className="font-semibold">{walletRemaining}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Wallet Status</span>
            <span className="font-semibold">
              {invoice.walletStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Payment Method</span>
            <span className="font-semibold">
              {invoice.paymentMethod || '-'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Invoice Type</span>
            <span className="font-semibold">{invoice.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
