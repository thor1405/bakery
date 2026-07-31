"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { CreditCard, Banknote, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Delivery address is required"),
  paymentMethod: z.enum(["Cash", "Card"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "Card",
    },
  });

  const paymentMethod = watch("paymentMethod");

  if (!mounted) return null;

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#111] pt-24">
        <h2 className="text-3xl font-serif mb-4 text-[var(--foreground)]">Your cart is empty</h2>
        <button 
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-[var(--primary)] text-white uppercase tracking-widest text-sm hover:bg-[#724a23] transition-colors rounded-sm"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: data.customerName,
        // Optional: In a real app we'd look up the customer by email/phone or create a new Customer document first,
        // then attach the customer ID. For now, the Order schema accepts customerName directly for guests.
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: data.address,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "Card" ? "Completed" : "Pending", // Mock payment success
        status: "Pending"
      };

      await axios.post("/api/orders", orderPayload);
      
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#111] pt-24 px-4 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h1 className="text-4xl font-serif text-[var(--foreground)] mb-4">Order Confirmed!</h1>
        <p className="text-[var(--muted-foreground)] mb-8 max-w-md">
          Thank you for choosing Cream Caramel. Your artisanal treats are being prepared with love.
        </p>
        <button 
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-[var(--primary)] text-white uppercase tracking-widest text-sm hover:bg-[#724a23] transition-colors rounded-sm shadow-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111] pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-serif text-[var(--foreground)] mb-10">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Form */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-sm shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-serif mb-6 text-[var(--foreground)] border-b border-gray-100 dark:border-gray-800 pb-4">Delivery Details</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--muted-foreground)]">Full Name</label>
                    <input 
                      {...register("customerName")}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors rounded-sm"
                      placeholder="Jane Doe"
                    />
                    {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--muted-foreground)]">Phone Number</label>
                    <input 
                      {...register("phone")}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors rounded-sm"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--muted-foreground)]">Email (Optional)</label>
                  <input 
                    {...register("email")}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors rounded-sm"
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[var(--muted-foreground)]">Delivery Address</label>
                  <textarea 
                    {...register("address")}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors rounded-sm resize-none"
                    placeholder="123 Bakery Lane, Mangalore"
                  />
                  {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                </div>

                <h2 className="text-xl font-serif mb-6 mt-10 text-[var(--foreground)] border-b border-gray-100 dark:border-gray-800 pb-4">Payment Method</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer flex flex-col items-center justify-center p-6 border rounded-sm transition-all ${paymentMethod === 'Card' ? 'border-[var(--primary)] bg-amber-50 dark:bg-[#724a23]/10 text-[var(--primary)]' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'}`}>
                    <input type="radio" value="Card" {...register("paymentMethod")} className="sr-only" />
                    <CreditCard className="w-8 h-8 mb-2" />
                    <span className="font-medium text-sm">Credit / Debit Card</span>
                    <span className="text-xs mt-1 opacity-70">(Simulated)</span>
                  </label>
                  
                  <label className={`cursor-pointer flex flex-col items-center justify-center p-6 border rounded-sm transition-all ${paymentMethod === 'Cash' ? 'border-[var(--primary)] bg-amber-50 dark:bg-[#724a23]/10 text-[var(--primary)]' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'}`}>
                    <input type="radio" value="Cash" {...register("paymentMethod")} className="sr-only" />
                    <Banknote className="w-8 h-8 mb-2" />
                    <span className="font-medium text-sm">Cash on Delivery</span>
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-sm shadow-sm border border-gray-100 dark:border-gray-800 sticky top-32">
              <h2 className="text-xl font-serif mb-6 text-[var(--foreground)] border-b border-gray-100 dark:border-gray-800 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-medium text-[var(--foreground)] line-clamp-2">{item.name}</h4>
                      <p className="text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
                      <p className="text-[var(--primary)] font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3 mb-8">
                <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-serif font-semibold text-[var(--foreground)] pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>Total</span>
                  <span>₹{getCartTotal()}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--primary)] text-white uppercase tracking-widest text-sm font-semibold hover:bg-[#724a23] transition-colors rounded-sm shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing</>
                ) : (
                  `Pay ₹${getCartTotal()}`
                )}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                Payments are securely processed. <br/>This is a demo environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
