"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { useCartStore } from "@/lib/store";

export function ProductDetailModal({ product, onClose, onAddedToCart }: { product: any, onClose: () => void, onAddedToCart?: () => void }) {
  const [activeTab, setActiveTab] = useState<"DESCRIPTION" | "DETAILS">("DESCRIPTION");
  const [showToast, setShowToast] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-5xl bg-[#f2f8f9] dark:bg-[#1a2022] rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-white">
            <Image 
              src={product.images?.[0] || "https://images.unsplash.com/photo-1582293041079-7814c2f12063"} 
              alt={product.name} 
              fill 
              className="object-cover" 
            />
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
            <h2 className="text-3xl font-serif text-[#a58641] dark:text-[#c4a661] mb-6">{product.name}</h2>
            
            <p className="text-2xl text-gray-900 dark:text-white font-medium mb-8">₹ {product.price}</p>
            
            <button 
              onClick={() => {
                addItem(product);
                if (onAddedToCart) onAddedToCart();
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
              className="inline-block px-8 py-3 rounded-full bg-[#f4c8b6] hover:bg-[#efb9a2] text-[#a58641] dark:bg-[#d8a894] dark:text-white dark:hover:bg-[#c9957f] font-semibold text-sm tracking-wider uppercase transition-colors mb-12 shadow-sm"
            >
              Order Online
            </button>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-300 dark:border-gray-700 mb-6">
              {["DESCRIPTION", "DETAILS"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-3 text-sm font-bold tracking-widest transition-colors relative ${
                    activeTab === tab 
                      ? "text-[#a58641] dark:text-[#c4a661]" 
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#a58641] dark:bg-[#c4a661]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-light min-h-[200px]">
              {activeTab === "DESCRIPTION" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="mb-4">{product.description || "A handcrafted artisanal treat made with love and premium ingredients."}</p>
                  <p className="mb-8">Allergens - {product.allergens?.length > 0 ? product.allergens.join(", ") : "Eggs, Wheat, Dairy, Soy"}</p>
                  
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Consumption & Storage Guidelines -</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Consume within 4 days of purchase.</li>
                    <li>Store at room temperature if cool, refrigerate in summer.</li>
                  </ul>
                </motion.div>
              )}
              {activeTab === "DETAILS" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
                  <p><strong>Category:</strong> {product.category?.name || "General"}</p>
                  {product.ingredients?.length > 0 && (
                    <div className="mt-4">
                      <strong>Ingredients:</strong>
                      <p>{product.ingredients.join(", ")}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
          </div>
        </motion.div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#a58641] text-white px-6 py-3 rounded-full shadow-lg font-medium text-sm flex items-center z-[100]"
            >
              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse" />
              Added to cart successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
