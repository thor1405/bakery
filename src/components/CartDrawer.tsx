"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function CartDrawer({ isScrolled }: { isScrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const cartStore = useCartStore();
  const router = useRouter();

  // If zustand persist is hydrating, cartStore might be empty initially on server, but this is client component.
  
  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`relative hover:text-[var(--primary)] transition-colors ${isScrolled ? "text-[var(--foreground)]" : "text-white"}`}
      >
        <ShoppingBag className="w-5 h-5" />
        {cartStore.getCartCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-[var(--primary)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {cartStore.getCartCount()}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-[#1a1a1a] z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-serif text-[var(--foreground)]">Your Cart</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartStore.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                    <p className="text-lg">Your cart is empty.</p>
                  </div>
                ) : (
                  cartStore.items.map((item) => (
                    <div key={item._id} className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-[var(--foreground)] line-clamp-2">{item.name}</h3>
                            <button 
                              onClick={() => cartStore.removeItem(item._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[var(--primary)] font-semibold mt-1">₹{item.price}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <button 
                            onClick={() => cartStore.updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center text-[var(--foreground)]">{item.quantity}</span>
                          <button 
                            onClick={() => cartStore.updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartStore.items.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-2xl font-serif font-semibold text-[var(--foreground)]">
                      ₹{cartStore.getCartTotal()}
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-[var(--primary)] text-white uppercase tracking-widest text-sm font-semibold hover:bg-[#724a23] transition-colors rounded-sm shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
