const mongoose = require('mongoose');
const uri = "mongodb+srv://test1234:hi123456hi@cluster0.h0btd.mongodb.net/?appName=Cluster0";

async function fixImages() {
  await mongoose.connect(uri);
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, images: [String] }, { strict: false }));
  
  const result = await Product.updateMany(
    { name: { $in: ['Pink Floral Drip Cake', 'Yellow Sunshine Birthday Cake', 'Emerald Chocolate Drip Cake', 'Heart-Shaped Floral Cake', 'Artisanal Celebration Cake'] } },
    { $set: { images: ['/uploads/1785517279599-images2.jpg'] } }
  );
  console.log('Updated images:', result);
  process.exit(0);
}
fixImages();
