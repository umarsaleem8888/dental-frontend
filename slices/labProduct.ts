
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Patient } from '../types';

const initialState: {list:[]} = {
  list: [],

};

const labProductSlice = createSlice({
  name: 'labProduct',
  initialState,
  reducers: {

    emptylabPro:(state)=>{
       state.list = [];
    },

    addlabPro: (state, action) => {
      state.list.push(action.payload);
    },
    updatelabPro: (state, action) => {
      const index = state.list.findIndex(p => p.id || p._id === action.payload.id || action.payload._id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deletelabPro: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },

  },
});

export const { addlabPro, updatelabPro, deletelabPro , emptylabPro } = labProductSlice.actions;
export default labProductSlice.reducer;
