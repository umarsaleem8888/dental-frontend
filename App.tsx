
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import PatientForm from './pages/PatientForm';
import PatientEdit from './pages/PatientEdit';
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm';
import DoctorEdit from './pages/DoctorEdit';
import Appointments from './pages/Appointments';
import AppointmentForm from './pages/AppointmentForm';
import AppointmentEdit from './pages/AppointmentEdit';
import Prescriptions from './pages/Prescriptions';
import Billing from './pages/Billing';
import BillingEdit from './pages/BillingEdit';
import Analysis from './pages/Analysis';
import PrescriptionForm from './pages/PrescriptionForm';
import PrescriptionView from './pages/PrescriptionView';
import Medicines from './pages/Medicines';
import MedicineForm from './pages/MedicineForm';
import MedicineEdit from './pages/MedicineEdit';
import Login from './pages/Login';
import InvoiceForm from './pages/InvoiceForm';
import { jwtDecode } from "jwt-decode";
import Invoices from './pages/Invoice';
import InvoicesEdit from './pages/InvoicesEdit';
import InvoiceEdit from './pages/InvoicesEdit';
import InvoiceView from './pages/InvoiceView';
import PatientProfileFullView from './pages/PatientProfileFullView';

import Lab from './pages/Lab';
import LabForm from './pages/LabForm';
import LabEdit from './pages/LabEdit';

import LabProducts from './pages/LabProducts';
import LabProductsEdit from './pages/LabProductsEdit';
import LabProductsForm from './pages/LabProductsForm';

// Protected Route Component

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const token = localStorage.getItem('token'); 

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      // Returns true if token exists and isn't expired
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  if (!isTokenValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      {/* <Route path="/" element={<MainLayout />}> */}
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/edit/:id" element={<PatientEdit />} />
        <Route path="patients/:id" element={<PatientProfile />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/new" element={<DoctorForm />} />
        <Route path="doctors/edit/:id" element={<DoctorEdit />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/new" element={<AppointmentForm />} />
        <Route path="appointments/edit/:id" element={<AppointmentEdit />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="prescriptions/:id" element={<PrescriptionView />} />
        <Route path="prescriptions/new/:patientId?" element={<PrescriptionForm />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="medicines/new" element={<MedicineForm />} />
        <Route path="medicines/edit/:id" element={<MedicineEdit />} />
        <Route path="billing" element={<Billing />} />
        <Route path="billing/edit/:id" element={<BillingEdit />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="invoices" element={ <Invoices/> }/>

        <Route path="invoices/new" element={ <InvoiceForm/> }/>
        <Route path="invoices/edit/:id" element={ <InvoiceEdit/> }/>
        <Route path="invoices/view/:id" element={ <InvoiceView/> }/>
        <Route path="patient/view/:id" element={ <PatientProfileFullView/> }/>

        <Route path="lab" element={ <Lab/> }/>
        <Route path="labs/new" element={ <LabForm/> }/>
        <Route path="lab/edit/:id" element={ <LabEdit/> }/>

        <Route path="products/:id" element={ <LabProducts/> }/>
        <Route path="Products/new" element={ <LabProductsForm/> }/>
        <Route path="products/edit/:id" element={ <LabProductsEdit/> }/>

      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
