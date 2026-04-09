
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient } from '../types';

const initialState: { list: Patient[] , type : any } = {
  list: [
    // {
    //   id: 'P001',
    //   name: 'John Doe',
    //   email: 'john@example.com',
    //   phone: '123-456-7890',
    //   age: 32,
    //   gender: 'Male',
    //   bloodGroup: 'O+',
    //   address: '123 Maple St, Springfield',
    //   walletBalance: -150,
    //   createdAt: '2023-01-15',
    // },
    // {
    //   id: 'P002',
    //   name: 'Jane Smith',
    //   email: 'jane@example.com',
    //   phone: '987-654-3210',
    //   age: 28,
    //   gender: 'Female',
    //   bloodGroup: 'A-',
    //   address: '456 Oak Ave, Shelbyville',
    //   walletBalance: 200,
    //   createdAt: '2023-02-10',
    // }
  ],
  type : ''
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {

    filterType:(state,action)=>{
      state.type = action.payload;
    },

    emptyPatient:(state)=>{
       state.list = [];
    },

    addPatient: (state, action: PayloadAction<Patient>) => {
      state.list.push(action.payload);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
    updateWallet: (state, action: PayloadAction<{ patientId: string; amount: number }>) => {
      const patient = state.list.find(p => p.id === action.payload.patientId);
      if (patient) {
        patient.walletBalance += action.payload.amount;
      }
    }
  },
});

export const {filterType, addPatient, updatePatient, deletePatient, updateWallet , emptyPatient } = patientsSlice.actions;
export default patientsSlice.reducer;
