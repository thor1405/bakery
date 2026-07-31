"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, User, CheckCircle2, Search, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function DeliveryClient({ orders }: { orders: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [driverName, setDriverName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter deliveries
  const deliveryOrders = orders.filter((o) => o.deliveryAddress);
  
  const unassigned = deliveryOrders.filter((o) => o.deliveryStatus === "Unassigned" && o.status !== "Cancelled");
  const outForDelivery = deliveryOrders.filter((o) => o.deliveryStatus === "Out for Delivery");
  const delivered = deliveryOrders.filter((o) => o.deliveryStatus === "Delivered");

  const handleAssignDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !driverName.trim()) return;
    
    setIsUpdating(true);
    try {
      await axios.patch(`/api/orders/${selectedOrder._id}`, {
        driverName,
        deliveryStatus: "Out for Delivery",
        status: "Out for Delivery"
      });
      setSelectedOrder(null);
      setDriverName("");
      router.refresh();
    } catch (error) {
      console.error("Failed to assign driver", error);
      alert("Failed to assign driver.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, {
        deliveryStatus: "Delivered",
        status: "Delivered"
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to mark delivered", error);
    }
  };

  const Column = ({ title, count, children, bg }: any) => (
    <div className={`flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] h-[calc(100vh-180px)] overflow-hidden`}>
      <div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${bg} flex justify-between items-center`}>
        <h3 className="font-serif font-bold text-[var(--foreground)]">{title}</h3>
        <span className="px-2.5 py-0.5 bg-white dark:bg-black rounded-full text-xs font-semibold shadow-sm">{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[var(--foreground)]">Delivery Management</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Assign drivers and track active deliveries.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search deliveries..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Unassigned" count={unassigned.length} bg="bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100">
          {unassigned.map(order => (
            <motion.div 
              key={order._id}
              layoutId={order._id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white dark:bg-[#242424] p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-[var(--primary)] transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-500">{order.orderNumber}</span>
                <span className="text-xs font-medium text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <h4 className="font-medium text-[var(--foreground)] mb-1">{order.customerName}</h4>
              <p className="text-xs text-[var(--muted-foreground)] flex items-start mt-2">
                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5" /> 
                <span className="line-clamp-2">{order.deliveryAddress}</span>
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-[var(--primary)]">₹{order.totalAmount}</span>
                <span className="text-xs text-[var(--primary)] font-medium group-hover:underline">Assign Driver →</span>
              </div>
            </motion.div>
          ))}
          {unassigned.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No unassigned deliveries.</p>}
        </Column>

        <Column title="Out for Delivery" count={outForDelivery.length} bg="bg-blue-50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-100">
          {outForDelivery.map(order => (
            <motion.div 
              key={order._id}
              layoutId={order._id}
              className="bg-white dark:bg-[#242424] p-4 rounded-lg border border-blue-200 dark:border-blue-900/30 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-500">{order.orderNumber}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded text-[10px] font-bold uppercase tracking-wider flex items-center">
                  <Truck className="w-3 h-3 mr-1" /> En Route
                </span>
              </div>
              <h4 className="font-medium text-[var(--foreground)] mb-1">{order.customerName}</h4>
              <p className="text-xs text-[var(--muted-foreground)] flex items-start mb-3">
                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5" /> 
                <span className="line-clamp-2">{order.deliveryAddress}</span>
              </p>
              <div className="bg-gray-50 dark:bg-black p-2 rounded flex items-center text-xs text-[var(--foreground)] mb-4">
                <User className="w-3.5 h-3.5 mr-2 text-gray-400" />
                Driver: <span className="font-semibold ml-1">{order.driverName}</span>
              </div>
              <button 
                onClick={() => handleMarkDelivered(order._id)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-medium transition-colors flex justify-center items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Delivered
              </button>
            </motion.div>
          ))}
          {outForDelivery.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No deliveries currently en route.</p>}
        </Column>

        <Column title="Completed Today" count={delivered.length} bg="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-100">
          {delivered.map(order => (
            <motion.div 
              key={order._id}
              layoutId={order._id}
              className="bg-white dark:bg-[#242424] p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm opacity-70"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-500 line-through">{order.orderNumber}</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
                </span>
              </div>
              <h4 className="font-medium text-[var(--foreground)] line-through">{order.customerName}</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                Delivered by {order.driverName}
              </p>
            </motion.div>
          ))}
          {delivered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No completed deliveries today.</p>}
        </Column>
      </div>

      {/* Assign Driver Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-serif font-bold text-[var(--foreground)]">Assign Driver</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-[var(--foreground)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6 p-4 bg-gray-50 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-bold mb-1">{selectedOrder.orderNumber}</p>
                  <p className="font-medium text-[var(--foreground)]">{selectedOrder.customerName}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{selectedOrder.deliveryAddress}</p>
                </div>

                <form onSubmit={handleAssignDriver}>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Driver Name</label>
                  <input 
                    type="text" 
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors mb-6"
                  />
                  
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-3 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#724a23] transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                      {isUpdating ? "Assigning..." : "Assign & Dispatch"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
