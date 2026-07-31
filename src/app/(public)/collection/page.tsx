import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { CollectionClient } from "@/components/collection/CollectionClient";

export const dynamic = 'force-dynamic';

async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

async function getProducts() {
  try {
    await connectToDatabase();
    // Fetch all active products
    const products = await Product.find({ status: "Active" })
      .populate("category", "_id name")
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

export default async function CollectionPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return <CollectionClient categories={categories} products={products} />;
}
