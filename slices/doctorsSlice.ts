
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Doctor } from '../types';

const initialState: { list: Doctor[] } = {
  list: [
    // {
    //   id: 'D001',
    //   name: 'Dr. Sarah Wilson',
    //   specialization: 'Orthodontics',
    //   phone: '555-0101',
    //   email: 'sarah.w@dentflow.com',
    //   status: 'Active',
    //   availability: ['Monday', 'Tuesday', 'Friday'],
    // },
    // {
    //   id: 'D002',
    //   name: 'Dr. Michael Chen',
    //   specialization: 'Periodontics',
    //   phone: '555-0102',
    //   email: 'm.chen@dentflow.com',
    //   status: 'Active',
    //   availability: ['Wednesday', 'Thursday', 'Saturday'],
    // }
  ],
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {

    emptyDoctor:(state)=>{
      state.list=[];
    },
    addDoctor: (state, action: PayloadAction<Doctor>) => {
      state.list.push(action.payload);
    },
    updateDoctor: (state, action: PayloadAction<Doctor>) => {
      const index = state.list.findIndex(d => d.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteDoctor: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(d => d.id !== action.payload);
    },
  },
});

export const { addDoctor, updateDoctor, deleteDoctor , emptyDoctor} = doctorsSlice.actions;
export default doctorsSlice.reducer;
