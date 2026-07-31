"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Eye, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";



const STATUS_COLORS: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Baking": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Ready": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Out for Delivery": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Delivered": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const PAYMENT_COLORS: Record<string, string> = {
  "Paid": "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  "Partial": "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  "Unpaid": "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
};

export function OrdersClient({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Order Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all customer orders across branches.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#724a23] transition-colors shadow-sm">
          Create Order
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by order ID, customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-[#242424]/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {orders.map((order: any, idx: number) => (
                <motion.tr 
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-[#242424]/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {order.items.map((item: any) => `${item.quantity}x ${item.product?.name || 'Unknown'}`).join(", ")}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", STATUS_COLORS[order.status] || STATUS_COLORS["Pending"])}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", PAYMENT_COLORS[order.paymentStatus] || PAYMENT_COLORS["Pending"])}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-[var(--primary)] hover:bg-amber-50 dark:hover:bg-gray-800 rounded-md transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[var(--primary)] hover:bg-amber-50 dark:hover:bg-gray-800 rounded-md transition-colors" title="Invoice">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-md transition-colors" title="Mark Complete">
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to {orders.length} of {orders.length} entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-[var(--primary)] text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
