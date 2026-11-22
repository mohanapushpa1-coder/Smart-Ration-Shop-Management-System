const mongoose = require("mongoose");
const Shop = require("./models/Shop");
require("dotenv").config();

const sampleShops = [
  {
    name: "Govt Ration Shop - Anna Nagar",
    latitude: 13.0850,
    longitude: 80.2104,
    stock: { rice: 500, wheat: 300, sugar: 150 },
    isOpen: true,
    openTime: "09:00 AM",
    closeTime: "06:00 PM",
    announcement: "Fresh stock arrived today."
  },
  {
    name: "Govt Ration Shop - T. Nagar",
    latitude: 13.0405,
    longitude: 80.2337,
    stock: { rice: 200, wheat: 100, sugar: 50 },
    isOpen: true,
    openTime: "08:30 AM",
    closeTime: "05:00 PM",
    announcement: "Sugar stock is currently limited."
  },
  {
    name: "Govt Ration Shop - Velachery",
    latitude: 12.9803,
    longitude: 80.2220,
    stock: { rice: 800, wheat: 400, sugar: 200 },
    isOpen: false,
    openTime: "09:00 AM",
    closeTime: "06:00 PM",
    announcement: "Closed for maintenance today."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding.");
    
    // Check existing
    const count = await Shop.countDocuments();
    if (count > 0) {
      console.log(`There are already ${count} shops. Seeding logic appends mock shops.`);
    }

    const inserted = await Shop.insertMany(sampleShops);
    console.log(`Successfully seeded ${inserted.length} additional shops.`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding DB:", err);
    mongoose.connection.close();
  }
};

seedDB();
