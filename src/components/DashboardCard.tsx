import React from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  backgroundClass: string;
}

export const DashboardCard = ({ title, value, icon, backgroundClass }: DashboardCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm flex items-center gap-4 lg:w-85 sm:w-full">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center ${backgroundClass} rounded-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-0.5">{title}</p>
        <h4 className="text-xl font-bold text-gray-900">{value}</h4>
      </div>
    </div>
  );
};