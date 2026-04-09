import { Invoice } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { list: Invoice[], type: String, from: String, to: String } = {
    list: [],
    type: '',
    from: '',
    to: '',
};

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {

        InvoicefilterType: (state, action) => {
            state.type = action.payload;
        },

        InvoiceFrom: (state, action) => {
            state.from = action.payload;
        },

        InvoiceTo: (state, action) => {
            state.to = action.payload;
        },

        emptyInvoices: (state) => {
            state.list = [];
        },


        addInvoice: (state, action: PayloadAction<any>) => {
            const exists = state.list.some(
                invoice => invoice.id === action.payload.id
            );

            if (!exists) {
                state.list.push(action.payload);
            }
        },


        updateInvoice: (state, action: PayloadAction<any>) => {
            const index = state.list.findIndex(i => i.id === action.payload.id);
            if (index !== -1) state.list[index] = action.payload;
        },

        deleteInvoice: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(i => i.id !== action.payload);
        },
    },
});

export const {
    addInvoice,
    updateInvoice,
    deleteInvoice,
    emptyInvoices,
    InvoicefilterType,
    InvoiceFrom,
    InvoiceTo,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
