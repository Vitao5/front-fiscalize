import React from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  backgroundClass: string;
}

export const DashboardCard = ({ title, value, icon, backgroundClass }: DashboardCardProps) => {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-5 py-4 shadow-sm flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center ${backgroundClass} rounded-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 mb-0.5">{title}</p>
        <h4 className="text-xl font-bold text-white">{value}</h4>
      </div>
    </div>
  );
};