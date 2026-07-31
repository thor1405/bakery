"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { ChevronRight } from "lucide-react";
import { ProductDetailModal } from "./ProductDetailModal";

export function CollectionClient({ products, categories }: { products: any[], categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) {
      setActiveCategory(cat);
    }
  }, []);

  const filteredProducts = activeCategory === "all"  
    ? products 
    : products.filter(p => p.category?._id === activeCategory);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0">
            <h2 className="text-[#a58641] text-xl font-serif font-bold uppercase tracking-wider mb-2">Products</h2>
            <div className="w-full h-[1px] bg-[#a58641] mb-6"></div>
            
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => setActiveCategory("all")}
                  className={`flex items-center text-lg transition-colors ${activeCategory === "all" ? "text-[#a58641] font-semibold" : "text-gray-700 hover:text-[#a58641]"}`}
                >
                  <ChevronRight className={`w-4 h-4 mr-3 ${activeCategory === "all" ? "text-[#a58641]" : "text-gray-300"}`} />
                  All Items
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <button 
                    onClick={() => setActiveCategory(cat._id)}
                    className={`flex items-center text-lg transition-colors ${activeCategory === cat._id ? "text-[#a58641] font-semibold" : "text-gray-700 hover:text-[#a58641]"}`}
                  >
                    <ChevronRight className={`w-4 h-4 mr-3 ${activeCategory === cat._id ? "text-[#a58641]" : "text-gray-300"}`} />
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full py-20 text-gray-500 font-serif text-xl"
                  >
                    No products found in this category.
                  </motion.div>
                ) : (
                  filteredProducts.map((product) => (
                    <motion.div 
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="group cursor-pointer flex flex-col"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {/* Square Image container with Ribbon */}
                      <div className="relative aspect-square overflow-hidden mb-5 bg-gray-50 shadow-sm border border-gray-100">
                        <Image 
                          src={product.images?.[0] || "https://images.unsplash.com/photo-1582293041079-7814c2f12063"} 
                          alt={product.name} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw" 
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        {product.bestSeller && (
                          <div className="absolute top-4 left-0 bg-[#f4c8b6] text-[#a58641] px-4 py-1.5 flex items-center shadow-sm z-10">
                            <span className="text-[11px] uppercase tracking-widest font-bold flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#a58641] rotate-45 mr-2"></span>
                              Bestseller
                              <span className="w-1.5 h-1.5 bg-[#a58641] rotate-45 ml-2"></span>
                            </span>
                            {/* SVG for the pointed ribbon tail on the right side of the ribbon */}
                            <div className="absolute right-[-10px] top-0 border-[14px] border-transparent border-l-[#f4c8b6] h-full" style={{ borderRightWidth: 0 }}></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <h3 className="text-xl font-serif text-[#a58641] mb-5">{product.name}</h3>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-gray-900 font-semibold text-lg">₹ {product.price}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem(product);
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 3000);
                          }}
                          className="px-5 py-2 rounded-full bg-[#f4c8b6] hover:bg-[#efb9a2] text-[#a58641] font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
                        >
                          Order Online
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
        </div>
      </div>
      
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#a58641] text-white px-6 py-3 rounded-full shadow-2xl font-medium text-sm flex items-center z-[100]"
          >
            <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse" />
            Added to cart successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
