const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();

async function connect() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGO_URI");
  await mongoose.connect(uri);
}

async function importData() {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("✅ Seeded products");
  process.exit();
}

async function destroyData() {
  await Product.deleteMany();
  console.log("🗑️ Deleted products");
  process.exit();
}

(async () => {
  try {
    await connect();
    const arg = process.argv[2];
    if (arg === "-d") await destroyData();
    else await importData();
  } catch (err) {
    console.error("Seeder error:", err.message);
    process.exit(1);
  }
})();
