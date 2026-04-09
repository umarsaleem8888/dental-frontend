
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '../types';

const initialState: { list: Appointment[] } = {
  list: [
    {
      id: 'A001',
      patientId: 'P001',
      doctorId: 'D001',
      date: new Date().toISOString().split('T')[0],
      time: '10:30 AM',
      type: 'Checkup',
      status: 'Upcoming',
    },
    {
      id: 'A002',
      patientId: 'P002',
      doctorId: 'D002',
      date: new Date().toISOString().split('T')[0],
      time: '02:00 PM',
      type: 'Cleaning',
      status: 'Upcoming',
    }
  ],
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.list.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.list.findIndex(a => a.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(a => a.id !== action.payload);
    },
  },
});

export const { addAppointment, updateAppointment, deleteAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
