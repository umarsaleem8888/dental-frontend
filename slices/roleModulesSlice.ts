
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

const RoleModulesSlice = createSlice({
  name: 'roleModules',
  initialState,
  reducers: {
    addRoleModules: (state, action: PayloadAction<any>) => {
      
      state.list.push(action.payload);
    },
    updateRoleModules: (state, action: PayloadAction<any>) => {
      console.log('act : ',action);

      const id = action.payload._id || action.payload?.id
      
      const index = state.list.findIndex((m:any) => m.id === id);
      console.log("index : ",index);
      
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteRoleModules: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((m:any) => m.id !== action.payload);
    },
    emptyRoleModules:(state)=>{
      state.list = [];
    }
  },
});

export const {emptyRoleModules, addRoleModules, updateRoleModules, deleteRoleModules } = RoleModulesSlice.actions;
export default RoleModulesSlice.reducer;
