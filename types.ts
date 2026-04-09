
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  balance: number; 
  lastVisit?: string;
  // createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave';
  availability: string[]; // ['Monday', 'Wednesday']
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'Checkup' | 'Cleaning' | 'Surgery' | 'Root Canal' | 'Orthodontics';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  type:string;
  unit: string; // e.g., 'Tablet', 'Bottle', 'Strip'
}

export interface PrescribedMedicine {
  medicineId: string;
  name: string;
  dosage: string; // e.g., "1-0-1"
  duration: number; // days
  quantity: number;
  unitPrice: number;
}

export interface Prescription {
  _id:string;
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  notes: string;
  selectedTeeth: number[];
  medicines: PrescribedMedicine[];
  status: 'Draft' | 'Final';
  patient:{name:string},
  doctor:{name:string},
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  prescriptionId?: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
}

export interface UIState {
  theme: 'light' | 'dark';
  glassMode: boolean;
  sidebarGradient: {
    start: string;
    end: string;
    name: string;
  };
  sidebarBgColor: string;
  bodyColor: string;
  primaryColor: string;
  cardColor: string;
  cardPadding: 'compact' | 'comfortable' | 'spacious';
  textColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  topBarGradient: {
    start: string;
    end: string;
  };
  topBarColor: string;
  topBarOpacity: number;
  topBarFloating: boolean;
  topBarButtonStyle: 'circle' | 'rounded' | 'square';
  buttonStyle: 'flat' | 'gradient' | 'glow';
  buttonRadius: 'none' | 'md' | 'xl' | 'full';
  sidebarLayout: {
    width: number;
    collapsed: boolean;
  };
}

export type InvoiceStatus = 'Unpaid' | 'Partial' | 'Paid';

export interface Invoice {
  id: string;

  patientId: string;
  patient: {};

  totalAmount: number;
  paidAmount: number;

  status: InvoiceStatus;

  createdAt: string;
  updatedAt: string;
}



