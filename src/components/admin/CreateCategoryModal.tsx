"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, X, Loader2, Plus } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CreateCategoryModal({ initialData, isEditMode = false }: { initialData?: any, isEditMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || "",
      image: initialData.image || "",
    } : undefined
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setError(null);
      
      let imageUrl = data.image;

      // Handle file upload first if a file was selected
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

      const payload = { ...data, image: imageUrl || initialData?.image };

      if (isEditMode && initialData) {
        await axios.put(`/api/categories/${initialData._id}`, payload);
      } else {
        await axios.post("/api/categories", payload);
      }
      
      setIsOpen(false);
      if (!isEditMode) reset();
      setSelectedFile(null);
      router.refresh(); // Refresh the Server Component to show new data
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
          <Plus size={16} className="mr-2" /> Add Category
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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">{isEditMode ? "Edit Category" : "New Category"}</h3>
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

              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                    <input
                      {...register("name")}
                      placeholder="e.g. Signature Cakes"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                    <textarea
                      {...register("description")}
                      placeholder="Brief description of the category..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Image (Optional)</label>
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

                  <div className="pt-4 flex justify-end space-x-3">
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
                      disabled={isSubmitting}
                      className="flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[#724a23] disabled:opacity-70 transition-colors shadow-sm"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                      Save Category
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
