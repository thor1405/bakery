import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Need to import to register the model for populate
import { OrdersClient } from "@/components/admin/OrdersClient";

export const dynamic = 'force-dynamic';

async function getOrders() {
  try {
    await connectToDatabase();
    // We import Product above to ensure Mongoose knows about it before populating
    const orders = await Order.find({})
      .populate("items.product", "name price")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to fetch orders for admin", error);
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return <OrdersClient orders={orders} />;
}
