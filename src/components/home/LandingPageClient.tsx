"use client";
import { useCartStore } from "@/lib/store";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Star,
  Heart,
  ShoppingCart,
  Clock,
  MapPin,
  Leaf,
  Award,
  Truck,
  ChefHat,
  Coffee
} from "lucide-react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export function LandingPageClient({ categories = [], products = [] }: { categories: any[], products: any[] }) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_bakery.jpg"
            alt="Artisan Bakery Interior"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
        </div>
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-4xl md:text-7xl lg:text-8xl font-serif text-white mb-4 md:mb-6 drop-shadow-lg"
            variants={fadeIn}
          >
            Handcrafted <br />
            <span className="italic text-[var(--secondary)]">Every Morning.</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light tracking-wide"
            variants={fadeIn}
          >
            Mangalore's finest custom celebration cakes, signature Rasmalai cakes, rich plum cakes, and premium pastries.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            variants={fadeIn}
          >
            <Link 
              href="/collection"
              className="px-8 py-4 bg-[#a58641] text-white uppercase tracking-widest text-sm hover:bg-[#8b6f33] transition-all transform hover:scale-105 shadow-sm"
            >
              Visit Our Bakery
            </Link>
            
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[var(--background)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-[var(--primary)] uppercase tracking-widest text-sm font-semibold mb-4">Our Story</h4>
              <h2 className="text-3xl md:text-5xl font-serif mb-6 text-[var(--foreground)]">A Tradition of <br className="hidden sm:block"/> Uncompromised Quality.</h2>
              <p className="text-base md:text-lg text-[var(--muted-foreground)] mb-6 leading-relaxed font-light">
                At Cream Caramel, we believe that baking is an art form. Every cake and delicate pastry is crafted by hand using time-honored techniques, bringing joy to Mangalore's special moments.
              </p>
              <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed font-light">
                Known for our signature Rasmalai cake and rich seasonal plum cakes, we source only the finest local ingredients to ensure each bite delivers a moment of pure luxury.
              </p>
              <Link href="#menu" className="group inline-flex items-center text-[var(--foreground)] uppercase tracking-widest text-sm font-medium hover:text-[var(--primary)] transition-colors">
                Discover Our Craft <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div 
              className="w-full md:w-1/2 relative h-[500px]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <Image 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff"
                alt="Baker kneading dough"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-sm shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-2xl">
                <p className="text-4xl font-serif text-[var(--primary)]">25+</p>
                <p className="uppercase tracking-widest text-xs text-[var(--foreground)] mt-2">Years of <br/> Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-[var(--background)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-20 relative z-10">

            <motion.div 
              className="flex items-center space-x-4 mb-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              <div className="h-px w-8 md:w-16 bg-[var(--primary)]"></div>
              <h4 className="text-[var(--primary)] uppercase tracking-[0.3em] text-xs md:text-sm font-bold flex items-center">
                <Star className="w-4 h-4 mr-2 fill-current" />
                Signature Treats
                <Star className="w-4 h-4 ml-2 fill-current" />
              </h4>
              <div className="h-px w-8 md:w-16 bg-[var(--primary)]"></div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-7xl font-serif text-[var(--foreground)] drop-shadow-sm mb-8" 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              Best Sellers
            </motion.h2>
            
            <Link href="/collection" className="inline-flex items-center uppercase tracking-widest text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors group">
              View Entire Collection 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.length === 0 ? (
              <p className="text-gray-500 col-span-3 text-center">No products found. Add some from the admin dashboard!</p>
            ) : (
              products.map((product: any, idx: number) => (
                <motion.div 
                  key={product._id}
                  className="group flex flex-col"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="relative aspect-square overflow-hidden mb-5 bg-gray-50 shadow-sm border border-gray-100">
                    <Image 
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1582293041079-7814c2f12063"} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw" 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    <div className="absolute top-4 left-0 bg-[#f4c8b6] text-[#a58641] px-4 py-1.5 flex items-center shadow-sm z-10">
                      <span className="text-[11px] uppercase tracking-widest font-bold flex items-center">
                        <span className="w-1.5 h-1.5 bg-[#a58641] rotate-45 mr-2"></span>
                        Bestseller
                        <span className="w-1.5 h-1.5 bg-[#a58641] rotate-45 ml-2"></span>
                      </span>
                      <div className="absolute right-[-10px] top-0 border-[14px] border-transparent border-l-[#f4c8b6] h-full" style={{ borderRightWidth: 0 }}></div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-serif text-[#a58641] mb-2">{product.name}</h3>
                  <p className="text-gray-500 font-light text-sm mb-5 line-clamp-2">
                    {product.description || "A delicious artisanal treat baked fresh."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-gray-900 font-semibold text-lg">₹ {product.price}</span>
                    <button 
                      onClick={() => addItem(product)}
                      className="px-5 py-2 rounded-full bg-[#f4c8b6] hover:bg-[#efb9a2] text-[#a58641] font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
                    >
                      Order Online
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="menu" className="py-24 bg-[var(--muted)]">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="flex flex-col items-center text-center mb-16 relative z-10">

            <motion.div 
              className="flex items-center space-x-4 mb-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              <div className="h-px w-8 md:w-16 bg-[#a58641]"></div>
              <h4 className="text-[#a58641] uppercase tracking-[0.3em] text-xs md:text-sm font-bold flex items-center">
                <Star className="w-4 h-4 mr-2 fill-current" />
                The Menu
                <Star className="w-4 h-4 ml-2 fill-current" />
              </h4>
              <div className="h-px w-8 md:w-16 bg-[#a58641]"></div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-7xl font-serif text-[var(--foreground)] drop-shadow-sm mb-4" 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              Our Artisanal Selection
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.length === 0 ? (
              <p className="text-gray-500 col-span-4 text-center">No categories found. Add some from the admin dashboard!</p>
            ) : (
              categories.map((category: any, idx: number) => (
                <Link key={category._id} href={`/collection?category=${category._id}`} className="block w-full">
                <motion.div 
                  className="group relative h-[450px] w-full overflow-hidden rounded-sm cursor-pointer shadow-lg block"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Image 
                    src={category.image || "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e"} 
                    alt={category.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Inner Frame */}
                  <div className="absolute inset-4 border border-white/20 scale-[0.98] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                    <h3 className="text-2xl font-serif text-white uppercase tracking-widest drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {category.name}
                    </h3>
                    
                    <div className="overflow-hidden mt-3">
                      <p className="text-[var(--secondary)] text-xs uppercase tracking-[0.2em] font-semibold flex items-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        Discover Collection <ArrowRight className="ml-2 w-3 h-3" />
                      </p>
                    </div>
                  </div>
                </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 md:px-12">
          <motion.h2 
            className="text-4xl md:text-5xl font-serif text-[#a58641] mb-6" 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            Our Promise
          </motion.h2>
          
          <motion.div 
            className="flex justify-center items-center space-x-2 mb-20"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="w-2.5 h-2.5 bg-[#b5d5d8] rotate-45"></div>
            <div className="w-2.5 h-2.5 bg-[#b5d5d8] rotate-45"></div>
            <div className="w-2.5 h-2.5 bg-[#b5d5d8] rotate-45"></div>
            <div className="w-2.5 h-2.5 bg-[#b5d5d8] rotate-45"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { icon: "🧁", title: "AUTHENTIC RECIPES", desc: "Our products are based on traditional home-style recipes, using fresh ingredients." },
              { icon: "❤️", title: "BAKED WITH LOVE", desc: "Our passion for baking is poured into every recipe, serving smiles on a plate everyday." },
              { icon: "💝", title: "HONESTLY PRICED", desc: "We constantly strive to offer the best products at the right prices." },
              { icon: "🍰", title: "COMMITTED TO QUALITY", desc: "From our ingredients to our kitchen operations & guest services, we always prioritize quality." },
            ].map((feature, idx) => (
              <motion.div 
                key={feature.title}
                className="flex flex-col items-center text-center px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="text-4xl mb-6 drop-shadow-sm">{feature.icon}</div>
                <h3 className="text-[15px] font-semibold text-[#a58641] tracking-wide mb-4">{feature.title}</h3>
                <p className="text-gray-900 text-[15px] leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ordering Process & Subscription Section */}
      <section id="order" className="py-24 bg-[var(--background)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-[var(--muted)] p-12 md:p-20 rounded-sm relative overflow-hidden">
            <div className="absolute -right-20 -top-20 opacity-10">
              <Coffee className="w-96 h-96" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl font-serif text-[var(--foreground)] mb-6">Join our Bread & Pastry Club</h2>
              <p className="text-[var(--muted-foreground)] text-lg font-light mb-10 leading-relaxed">
                Subscribe to our newsletter for exclusive tasting invites, seasonal menus, and a complimentary coffee on your first visit.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow px-6 py-4 bg-white dark:bg-black border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors rounded-sm"
                  required
                />
                <button type="submit" className="px-8 py-4 bg-[var(--primary)] text-white uppercase tracking-widest text-sm hover:bg-[#724a23] transition-colors rounded-sm shadow-lg">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-24 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="w-full md:w-1/3">
              <h4 className="text-[var(--primary)] uppercase tracking-widest text-sm font-semibold mb-4">Visit Us</h4>
              <h2 className="text-4xl font-serif mb-10 text-[var(--foreground)]">Our Bakery</h2>
              
              <div className="mb-8">
                <h3 className="flex items-center text-lg font-serif mb-2"><MapPin className="w-5 h-5 mr-2 text-[var(--primary)]" /> Address</h3>
                <p className="text-[var(--muted-foreground)] font-light ml-7">Arya Samaj Road, Near Oasis Building<br/>Balmatta, Mangalore, Karnataka 575003</p>
              </div>

              <div className="mb-8">
                <h3 className="flex items-center text-lg font-serif mb-2"><Clock className="w-5 h-5 mr-2 text-[var(--primary)]" /> Hours</h3>
                <ul className="text-[var(--muted-foreground)] font-light ml-7 space-y-1">
                  <li>Mon - Fri: 6:30 AM - 5:00 PM</li>
                  <li>Saturday: 7:00 AM - 6:00 PM</li>
                  <li>Sunday: 7:00 AM - 2:00 PM</li>
                </ul>
              </div>
            </div>
            <div className="w-full md:w-2/3 h-[400px] bg-gray-200 dark:bg-gray-800 relative rounded-sm overflow-hidden shadow-inner">
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                loading="lazy" 
                allowFullScreen 
                referrerPolicy="no-referrer-when-downgrade" 
                src="https://maps.google.com/maps?q=Cream+Caramel,+Arya+Samaj+Road,+Balmatta,+Mangalore&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title="Cream Caramel Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
