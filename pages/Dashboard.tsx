
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const patients = useSelector((state: RootState) => state.patients.list);
  const appointments = useSelector((state: RootState) => state.appointments.list);
  const billing = useSelector((state: RootState) => state?.invoices?.list);
  const { primaryColor } = useSelector((state: RootState) => (state.ui as any));

  const totalRevenue = billing.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const pendingRevenue = billing.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0);
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);

  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Clinic Status: Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Patients" value={patients.length} icon={Users} trend="12%" trendType="up" color="bg-blue-500" />
        <StatCard label="Today's Appointments" value={todayAppointments.length} icon={Calendar} trend="5%" trendType="up" color="bg-primary-500" />
        <StatCard label="Monthly Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={TrendingUp} trend="18%" trendType="up" color="bg-emerald-500" />
        <StatCard label="Pending Invoices" value={`$${pendingRevenue.toLocaleString()}`} icon={AlertCircle} trend="2%" trendType="down" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-surface-transition p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-lg">Revenue Performance</h3>
             <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-medium outline-none">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface-transition p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Today's Schedule</h3>
            <Link to="/appointments" className="text-primary-500 hover:text-primary-600 text-sm font-semibold">View All</Link>
          </div>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? todayAppointments.map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-500 font-bold text-lg">
                  {patients.find(p => p.id === apt.patientId)?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{patients.find(p => p.id === apt.patientId)?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{apt.type}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-xs font-bold">{apt.time}</p>
                  <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Confirmed</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <Clock className="mx-auto mb-2 text-slate-300" size={32} />
                <p className="text-slate-400 text-sm italic">No more appointments today.</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-3 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            Generate Daily Report <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
