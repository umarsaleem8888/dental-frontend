
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Prescription } from '../types';

const initialState: { list: Prescription[] } = {
  list: [
    // {
    //   id: 'RX001',
    //   patientId: 'P001',
    //   doctorId: 'D001',
    //   date: '2023-10-01',
    //   diagnosis: 'Mild Cavity',
    //   notes: 'Fill with composite resin',
    //   selectedTeeth: [14, 15],
    //   // Fix: Add missing medicines property to satisfy the Prescription interface
    //   medicines: [],
    //   status: 'Final',
    // }
  ],
};

const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {

    emptyPrescription: (state)=> {
      state.list = [];
    },

    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.list.push(action.payload);
    },
    updatePrescription: (state, action: PayloadAction<Prescription>) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deletePrescription: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
  },
});

export const { addPrescription, updatePrescription, deletePrescription, emptyPrescription } = prescriptionsSlice.actions;
export default prescriptionsSlice.reducer;
