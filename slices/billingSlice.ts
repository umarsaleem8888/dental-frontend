
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '../types';

const initialState: { list: Invoice[] } = {
  list: [
    {
      id: 'INV001',
      patientId: 'P001',
      prescriptionId: 'RX001',
      date: '2023-10-01',
      items: [
        { id: 'I001', description: 'Consultation', amount: 50 },
        { id: 'I002', description: 'Filling', amount: 100 },
      ],
      totalAmount: 150,
      paidAmount: 0,
      status: 'Unpaid',
    }
  ],
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.list.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.list.findIndex(inv => inv.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    recordPayment: (state, action: PayloadAction<{ invoiceId: string; amount: number }>) => {
      const invoice = state.list.find(inv => inv.id === action.payload.invoiceId);
      if (invoice) {
        invoice.paidAmount += action.payload.amount;
        if (invoice.paidAmount >= invoice.totalAmount) {
          invoice.status = 'Paid';
        } else if (invoice.paidAmount > 0) {
          invoice.status = 'Partial';
        }
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(inv => inv.id !== action.payload);
    },
  },
});

export const { addInvoice, updateInvoice, recordPayment, deleteInvoice } = billingSlice.actions;
export default billingSlice.reducer;
