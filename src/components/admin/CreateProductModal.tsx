"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, X, Loader2, Plus } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  bestSeller: z.boolean().optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function CreateProductModal({ categories, initialData, isEditMode = false }: { categories: any[], initialData?: any, isEditMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      price: initialData.price,
      stock: initialData.stock,
      category: initialData.category?._id || initialData.category,
      bestSeller: initialData.bestSeller,
      description: initialData.description || "",
      sku: initialData.sku || "",
      ingredients: initialData.ingredients ? initialData.ingredients.join(", ") : "",
      allergens: initialData.allergens ? initialData.allergens.join(", ") : "",
    } : undefined
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setError(null);
      
      let imageUrl = null;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        imageUrl = uploadRes.data.url;
      }

      const payload = { 
        ...data, 
        images: imageUrl ? [imageUrl] : initialData?.images || [],
        ingredients: data.ingredients ? data.ingredients.split(',').map((i: string) => i.trim()).filter(Boolean) : [],
        allergens: data.allergens ? data.allergens.split(',').map((i: string) => i.trim()).filter(Boolean) : [],
      };

      if (isEditMode && initialData) {
        await axios.put(`/api/products/${initialData._id}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }
      
      setIsOpen(false);
      if (!isEditMode) reset();

      setSelectedFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <>
      {isEditMode ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-1.5 text-gray-400 hover:text-[var(--primary)] hover:bg-amber-50 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#724a23] transition-colors shadow-sm"
        >
          <Plus size={16} className="mr-2" /> Add Product
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">{isEditMode ? "Edit Product" : "New Product"}</h3>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFile(null);
                    reset();
                  }} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                    <input
                      {...register("name")}
                      placeholder="e.g. Rich Plum Cake"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        {...register("price")}
                        placeholder="0.00"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Stock</label>
                      <input
                        type="number"
                        {...register("stock")}
                        defaultValue={0}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#242424] rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">Best Seller</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Display this product prominently on the homepage.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register("bestSeller")} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder="Product description displayed on the details page..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                      <input
                        {...register("sku")}
                        placeholder="e.g. CAKE-001"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients (comma separated)</label>
                    <textarea
                      {...register("ingredients")}
                      rows={2}
                      placeholder="Flour, Sugar, Cocoa Powder, Eggs, Butter..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allergens (comma separated)</label>
                    <input
                      {...register("allergens")}
                      placeholder="Eggs, Dairy, Nuts..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Product Image (Optional)</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[#724a23] cursor-pointer"
                      />
                    </div>
                    {selectedFile && (
                      <p className="mt-2 text-sm text-[var(--primary)]">Selected: {selectedFile.name}</p>
                    )}
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-[#1a1a1a] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFile(null);
                    reset();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#724a23] disabled:opacity-70 transition-colors shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Save Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
