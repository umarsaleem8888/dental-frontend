
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Medicine } from '../types';

const initialState: { list: any } = {
  list: [
    // {
    //   id:'m001',
    //   roleId:'12345',
    //   name:'superAdmin',
    // },
    // {
    //   id:'m002',
    //   roleId:'m0076',
    //   name:'admin',
    // },
    //   {
    //   id:'m003',
    //   roleId:'m00987',
    //   name:'hr',
    // },
    //     {
    //   id:'m004',
    //   roleId:'m004787',
    //   name:'doctor',
    // }
  ],
};

const RolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    addRole: (state, action: PayloadAction<any>) => {
      // console.log("redux m : ",action.payload);
      
      state.list.push(action.payload);
    },
    updateRole: (state, action: PayloadAction<any>) => {
      console.log('act : ',action);

      const id = action.payload._id || action.payload?.id
      
      const index = state.list.findIndex((m:any) => m.id === id);
      console.log("index : ",index);
      
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteRole: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((m:any) => m.id !== action.payload);
    },
    emptyRole:(state)=>{
      state.list = [];
    }
  },
});

export const {emptyRole, addRole, updateRole, deleteRole } = RolesSlice.actions;
export default RolesSlice.reducer;
