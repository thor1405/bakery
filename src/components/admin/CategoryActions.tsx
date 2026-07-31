"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CreateCategoryModal } from "./CreateCategoryModal";

export function CategoryActions({ category }: { category: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category? All products in this category will become uncategorized.")) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/categories/${category._id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <CreateCategoryModal initialData={category} isEditMode={true} />
      
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-md transition-colors"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
