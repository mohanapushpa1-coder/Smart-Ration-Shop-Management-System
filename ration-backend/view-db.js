const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Shop = require("./models/Shop");
const Booking = require("./models/Booking");

async function viewDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- 🟢 MONGODB CLOUD CONNECTION SUCCESSFUL ---\n");

    const users = await User.find({});
    console.log("👥 USERS SAVED IN DATABASE:", users.length);
    console.log(users.map(u => ({ name: String(u.name), email: String(u.email) })));

    const shops = await Shop.find({});
    console.log("\n🏪 SHOPS SAVED IN DATABASE:", shops.length);
    console.log(shops.map(s => ({ name: String(s.name), rice: s.stock?.rice, wheat: s.stock?.wheat, sugar: s.stock?.sugar })));

    const bookings = await Booking.find({});
    console.log("\n📅 BOOKINGS SAVED IN DATABASE:", bookings.length);
    console.log(bookings.map(b => ({ user: String(b.userId), date: String(b.date), time: String(b.slotTime) })));

    console.log("\n✅ Database check complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error connecting to DB:", err.message);
    process.exit(1);
  }
}

viewDatabase();
