
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analysis: React.FC = () => {
  const treatmentData = [
    { name: 'Checkup', count: 45 },
    { name: 'Cleaning', count: 32 },
    { name: 'Surgery', count: 12 },
    { name: 'Root Canal', count: 18 },
    { name: 'Orthodontics', count: 25 },
  ];

  const doctorPerformance = [
    { name: 'Dr. Sarah', revenue: 12000 },
    { name: 'Dr. Michael', revenue: 8500 },
    { name: 'Dr. James', revenue: 6200 },
    { name: 'Dr. Emily', revenue: 15000 },
  ];

  const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Clinic Analytics</h2>
        <p className="text-slate-500">In-depth insights into your clinic's operational performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Treatment Distribution */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg mb-8">Treatment Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={treatmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  strokeWidth={5}
                >
                  {treatmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Revenue Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg mb-8">Revenue by Practitioner</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorPerformance} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 10, 10, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="font-bold text-lg mb-6">Patient Retention Metrics</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                   <th className="py-4 px-2">Metric</th>
                   <th className="py-4 px-2">Current Period</th>
                   <th className="py-4 px-2">Previous Period</th>
                   <th className="py-4 px-2">Growth</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                 <tr>
                   <td className="py-4 px-2 font-bold">New Patients</td>
                   <td className="py-4 px-2">124</td>
                   <td className="py-4 px-2">98</td>
                   <td className="py-4 px-2 text-emerald-500 font-bold">+26.5%</td>
                 </tr>
                 <tr>
                   <td className="py-4 px-2 font-bold">Follow-up Rate</td>
                   <td className="py-4 px-2">68%</td>
                   <td className="py-4 px-2">72%</td>
                   <td className="py-4 px-2 text-rose-500 font-bold">-4.0%</td>
                 </tr>
                 <tr>
                   <td className="py-4 px-2 font-bold">Average Invoice Value</td>
                   <td className="py-4 px-2">$450</td>
                   <td className="py-4 px-2">$390</td>
                   <td className="py-4 px-2 text-emerald-500 font-bold">+15.3%</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
