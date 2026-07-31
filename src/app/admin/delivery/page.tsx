import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { DeliveryClient } from "@/components/admin/DeliveryClient";

export const dynamic = 'force-dynamic';

async function getDeliveryOrders() {
  try {
    await connectToDatabase();
    // Fetch only orders that have a delivery address
    const orders = await Order.find({ deliveryAddress: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to fetch delivery orders", error);
    return [];
  }
}

export default async function DeliveryPage() {
  const orders = await getDeliveryOrders();

  return <DeliveryClient orders={orders} />;
}
