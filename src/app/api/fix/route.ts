import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();
    const result = await Order.updateMany(
      { deliveryAddress: { $exists: false } },
      { 
        $set: { 
          deliveryAddress: "123 Old Bakery Lane (Legacy Order)",
          deliveryStatus: "Unassigned" 
        } 
      }
    );
    return NextResponse.json({ message: "Fixed", result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
