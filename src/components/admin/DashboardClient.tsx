"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MoreHorizontal
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useRouter, useSearchParams } from "next/navigation";

const iconMap: Record<string, any> = {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard
};

export function DashboardClient({ 
  chartData, 
  kpis, 
  recentActivity 
}: { 
  chartData: any[], 
  kpis: any[], 
  recentActivity: any[] 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeframe = searchParams.get("timeframe") || "7d";

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin?timeframe=${e.target.value}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening at Cream Caramel today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#724a23] transition-colors shadow-sm">
            New Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</h3>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-gray-800 rounded-xl text-[var(--primary)]">
                {(() => {
                  const Icon = iconMap[kpi.iconName] || TrendingUp;
                  return <Icon size={20} />;
                })()}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpi.isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {kpi.trend}
              </span>
              <span className="text-gray-400 ml-2">vs last week</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
            <select 
              value={timeframe}
              onChange={handleTimeframeChange}
              className="bg-gray-50 dark:bg-[#242424] border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--primary)] text-gray-700 dark:text-gray-200"
            >
              <option value="7d">Last 7 Days</option>
              <option value="1m">This Month</option>
              <option value="1y">This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#d4af37' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id} className="relative pl-6">
                  {/* Timeline dot and line */}
                  <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[var(--primary)] ring-4 ring-amber-50 dark:ring-gray-800"></span>
                  {idx !== recentActivity.length - 1 && (
                    <span className="absolute left-[3px] top-4 w-px h-full bg-gray-200 dark:bg-gray-700"></span>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {activity.time}
                      </div>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-medium text-[var(--primary)]">{activity.amount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            View All Activity
          </button>
        </motion.div>
      </div>
      
    </div>
  );
}
