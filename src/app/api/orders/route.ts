import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({})
      .populate("items.product", "name price")
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    // Start a transaction if replica set is available, but for now just do sequential updates
    
    // 1. Validate items
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 });
    }

    let totalAmount = 0;
    for (const item of data.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ error: `Product not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }
      totalAmount += product.price * item.quantity;
      item.price = product.price; // Enforce server-side price
    }

    // 2. Reduce Inventory
    for (const item of data.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // 3. Create Order
    const orderNumber = `ORD-${uuidv4().split('-')[0].toUpperCase()}`;
    const order = await Order.create({
      ...data,
      orderNumber,
      totalAmount
    });

    // 4. Update Customer (if provided)
    if (data.customer) {
      await Customer.findByIdAndUpdate(data.customer, {
        $inc: { 
          totalSpent: totalAmount,
          loyaltyPoints: Math.floor(totalAmount / 100) // 1 point per $100
        }
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
