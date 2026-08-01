const mongoose = require('mongoose');

// Need to use the exact MONGODB_URI from .env.local
const uri = "mongodb+srv://test1234:hi123456hi@cluster0.h0btd.mongodb.net/?appName=Cluster0";

// Define schemas to interact with the database without compiling the full Next.js app
const CategorySchema = new mongoose.Schema({ name: String }, { strict: false });
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: mongoose.Schema.Types.ObjectId,
  images: [String],
  ingredients: [String],
  allergens: [String],
  stock: Number,
  bestSeller: Boolean,
  status: String,
}, { timestamps: true });

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
    const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

    // Find the Cakes category
    const cakesCategory = await Category.findOne({ name: { $regex: /Cake/i } });
    if (!cakesCategory) {
      console.log("Could not find 'Cakes' category.");
      process.exit(1);
    }
    console.log("Found category:", cakesCategory.name, cakesCategory._id);

    const newCakes = [
      {
        name: "Pink Floral Drip Cake",
        description: "A beautiful pink drip cake adorned with fresh flowers and a 'Happy Birthday' topper. Perfect for elegant celebrations.",
        price: 300,
        category: cakesCategory._id,
        images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop"],
        ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Vanilla Extract", "Pink Food Coloring", "Edible Flowers"],
        allergens: ["Wheat", "Dairy", "Eggs"],
        stock: 10,
        bestSeller: false,
        status: "Active"
      },
      {
        name: "Yellow Sunshine Birthday Cake",
        description: "A bright yellow frosted cake decorated with cherries and a custom 'Happy Birthday' message. Guaranteed to bring a smile.",
        price: 400,
        category: cakesCategory._id,
        images: ["https://images.unsplash.com/photo-1557925923-33b251dc3296?q=80&w=600&auto=format&fit=crop"],
        ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Lemon Zest", "Cherries"],
        allergens: ["Wheat", "Dairy", "Eggs"],
        stock: 8,
        bestSeller: false,
        status: "Active"
      },
      {
        name: "Emerald Chocolate Drip Cake",
        description: "A striking green cake featuring a rich gold drip and topped with an assortment of premium chocolate wafers and truffles.",
        price: 200,
        category: cakesCategory._id,
        images: ["https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=600&auto=format&fit=crop"],
        ingredients: ["Flour", "Sugar", "Butter", "Cocoa Powder", "Chocolate Truffles", "Gold Edible Paint"],
        allergens: ["Wheat", "Dairy", "Eggs", "Soy"],
        stock: 5,
        bestSeller: false,
        status: "Active"
      },
      {
        name: "Heart-Shaped Floral Cake",
        description: "A classic white heart-shaped cake featuring an elegant cascade of red floral decorations. Perfect for anniversaries and loved ones.",
        price: 500,
        category: cakesCategory._id,
        images: ["https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=600&auto=format&fit=crop"],
        ingredients: ["Flour", "Sugar", "Butter", "Vanilla Bean", "Red Fondant"],
        allergens: ["Wheat", "Dairy", "Eggs"],
        stock: 5,
        bestSeller: false,
        status: "Active"
      },
      {
        name: "Artisanal Celebration Cake",
        description: "Our signature handcrafted cake designed for your most special occasions. Made with premium ingredients and unmatched attention to detail.",
        price: 299,
        category: cakesCategory._id,
        images: ["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop"],
        ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Premium Vanilla"],
        allergens: ["Wheat", "Dairy", "Eggs"],
        stock: 12,
        bestSeller: false,
        status: "Active"
      }
    ];

    const result = await Product.insertMany(newCakes);
    console.log("Successfully inserted", result.length, "cakes!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
