const mongoose = require('mongoose');
const uri = "mongodb+srv://test1234:hi123456hi@cluster0.h0btd.mongodb.net/?appName=Cluster0";

async function fix() {
  await mongoose.connect(uri);
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, category: mongoose.Schema.Types.ObjectId }, { strict: false }));
  const result = await Product.updateMany(
    { name: { $in: ['Pink Floral Drip Cake', 'Yellow Sunshine Birthday Cake', 'Emerald Chocolate Drip Cake', 'Heart-Shaped Floral Cake', 'Artisanal Celebration Cake'] } },
    { $set: { category: new mongoose.Types.ObjectId('6a6c1ddc6c9635a6ce9614ee') } }
  );
  console.log('Updated:', result);
  process.exit(0);
}
fix();
