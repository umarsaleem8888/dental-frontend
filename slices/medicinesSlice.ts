
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Medicine } from '../types';

const initialState: { list: Medicine[] } = {
  list: [
    // { id: 'M001', name: 'Amoxicillin 500mg', category: 'Antibiotic', price: 12.50, unit: 'Tablet' },
    // { id: 'M002', name: 'Ibuprofen 400mg', category: 'Painkiller', price: 8.00, unit: 'Tablet' },
    // { id: 'M003', name: 'Chlorhexidine Rinse', category: 'Antiseptic', price: 15.00, unit: 'Bottle' },
    // { id: 'M004', name: 'Paracetamol 500mg', category: 'Analgesic', price: 5.00, unit: 'Tablet' },
    // { id: 'M005', name: 'Metronidazole 400mg', category: 'Antibiotic', price: 10.00, unit: 'Tablet' },
  ],
};

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    addMedicine: (state, action: PayloadAction<any>) => {
      // console.log("redux m : ",action.payload);
      
      state.list.push(action.payload);
    },
    updateMedicine: (state, action: PayloadAction<any>) => {
      console.log('act : ',action);

      const id = action.payload._id
      
      const index = state.list.findIndex(m => m.id === id);
      console.log("index : ",index);
      
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteMedicine: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(m => m.id !== action.payload);
    },
    emptyMedicine:(state)=>{
      state.list = [];
    }
  },
});

export const {emptyMedicine, addMedicine, updateMedicine, deleteMedicine } = medicinesSlice.actions;
export default medicinesSlice.reducer;
