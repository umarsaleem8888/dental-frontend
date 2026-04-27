
import { configureStore , combineReducers } from '@reduxjs/toolkit';
import uiReducer from '../slices/uiSlice';
import patientsReducer from '../slices/patientsSlice';
import doctorsReducer from '../slices/doctorsSlice';
import appointmentsReducer from '../slices/appointmentsSlice';
import prescriptionsReducer from '../slices/prescriptionsSlice';
import billingReducer from '../slices/billingSlice';
import medicinesReducer from '../slices/medicinesSlice';
import authReducer from '../slices/authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import invoiceReducer from '../slices/invoice';
import labReducer from '../slices/lab';
import labProductSlice from '../slices/labProduct'


const rootReducer = combineReducers({
  ui: uiReducer,
  patients: patientsReducer,
  doctors: doctorsReducer,
  appointments: appointmentsReducer,
  prescriptions: prescriptionsReducer,
  // billing: billingReducer,
  invoices:invoiceReducer,
  medicines: medicinesReducer,
  lab:labReducer,
  labProduct:labProductSlice,
  auth: authReducer,

});


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['ui','medicines','doctors','patients','prescriptions','invoices','lab','labProduct'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export const persistor = persistStore(store);



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
