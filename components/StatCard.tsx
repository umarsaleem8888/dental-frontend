
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'up' | 'down';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, trendType, color = 'bg-primary-500' }) => {
  return (
    <div className="card-surface-transition rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 font-bold ${trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trendType === 'up' ? '↑' : '↓'} {trend}
              <span className="text-slate-400 font-normal ml-1">last 30d</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} text-white bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
