import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { LandingPageClient } from "@/components/home/LandingPageClient";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).limit(4).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch categories for homepage", error);
    return [];
  }
}

async function getProducts() {
  try {
    await connectToDatabase();
    // Fetch a few products for the best sellers section
    const products = await Product.find({ status: "Active" }).limit(3).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch products for homepage", error);
    return [];
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return <LandingPageClient categories={categories} products={products} />;
}
