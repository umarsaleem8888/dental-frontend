
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Patient } from '../types';

const initialState: {list:[]} = {
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

};

const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {

    emptylab:(state)=>{
       state.list = [];
    },

    addlab: (state, action) => {
      state.list.push(action.payload);
    },
    updatelab: (state, action) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deletelab: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },

  },
});

export const { addlab, updatelab, deletelab , emptylab } = labSlice.actions;
export default labSlice.reducer;
