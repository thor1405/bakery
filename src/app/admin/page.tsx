import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ timeframe?: string }>;
}) {
  const { timeframe } = await searchParams;
  await connectToDatabase();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // 1. Today's Revenue
  const todayOrders = await Order.find({ createdAt: { $gte: startOfDay } });
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // 2. Total Orders & Customers
  const totalOrders = await Order.countDocuments();
  const activeCustomers = await Customer.countDocuments();

  // 3. Pending Payouts
  const pendingOrders = await Order.find({ paymentStatus: "Pending" });
  const pendingPayouts = pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // 4. Dynamic Chart Revenue
  let chartData: any[] = [];
  
  if (timeframe === "1y") {
    // This Year (Group by Month)
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const yearOrders = await Order.find({ createdAt: { $gte: startOfYear } });
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      const monthOrders = yearOrders.filter(order => new Date(order.createdAt).getMonth() === i);
      const monthlyTotal = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      // Only push up to the current month to avoid empty future months, or push all 12. Let's push all 12 for a full year view.
      chartData.push({ name: months[i], revenue: monthlyTotal });
    }
  } else if (timeframe === "1m") {
    // This Month (Group by Week)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthOrders = await Order.find({ createdAt: { $gte: startOfMonth } });
    
    // Divide into 4 weeks roughly
    for (let i = 0; i < 4; i++) {
      const weekStart = i * 7 + 1;
      const weekEnd = (i === 3) ? 31 : (i + 1) * 7;
      
      const weekOrders = monthOrders.filter(order => {
        const d = new Date(order.createdAt).getDate();
        return d >= weekStart && d <= weekEnd;
      });
      const weekTotal = weekOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      chartData.push({ name: `Week ${i + 1}`, revenue: weekTotal });
    }
  } else {
    // Default: Last 7 Days
    const sevenDaysAgo = new Date(startOfDay);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const recentOrdersForChart = await Order.find({ createdAt: { $gte: sevenDaysAgo } });
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      
      const dayOrders = recentOrdersForChart.filter(order => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === d.getDate() &&
          orderDate.getMonth() === d.getMonth() &&
          orderDate.getFullYear() === d.getFullYear()
        );
      });
      const dailyTotal = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      chartData.push({ name: days[d.getDay()], revenue: dailyTotal });
    }
  }

  // 5. Recent Activity Feed
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5);

  const recentActivity = recentOrders.map(order => ({
    id: order._id.toString(),
    user: order.customerName,
    action: `placed a new order (${order.orderNumber})`,
    time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: `₹${order.totalAmount}`
  }));

  const kpis = [
    { 
      title: "Today's Revenue", 
      value: `₹${todayRevenue.toLocaleString()}`, 
      trend: "+12.5%", // Mock trend
      isPositive: true,
      iconName: "TrendingUp" 
    },
    { 
      title: "Total Orders", 
      value: totalOrders.toString(), 
      trend: "+8.2%", 
      isPositive: true,
      iconName: "ShoppingBag" 
    },
    { 
      title: "Active Customers", 
      value: activeCustomers.toString(), 
      trend: "+2.4%", 
      isPositive: true,
      iconName: "Users" 
    },
    { 
      title: "Pending Payouts", 
      value: `₹${pendingPayouts.toLocaleString()}`, 
      trend: "-4.1%", 
      isPositive: false,
      iconName: "CreditCard" 
    },
  ];

  return (
    <DashboardClient 
      chartData={chartData} 
      kpis={kpis} 
      recentActivity={recentActivity} 
    />
  );
}
