const User = require("./models/User");
const Shop = require("./models/Shop");
const Booking = require("./models/Booking");
const Notification = require("./models/Notification");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send("Token required");
  try {
    const decoded = jwt.verify(token.split(" ")[1] || token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const isAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).send("Admin access required");
    }
  });
};

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    
    // Auto-seed default admin if no admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const defaultAdmin = new User({
        name: 'Super Admin',
        rationCardNumber: 'admin123',
        password: 'admin123',
        role: 'admin'
      });
      await defaultAdmin.save();
      console.log("Default Admin Account Created: admin123 / admin123");
    }
  })
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Add Shop
app.post("/add-shop", isAdmin, async (req, res) => {
  try {
    const existingShop = await Shop.findOne({ adminId: req.user.userId });
    if (existingShop) {
      return res.status(403).send("You already have a registered shop");
    }

    const shop = new Shop({ ...req.body, adminId: req.user.userId });
    await shop.save();
    res.send("Shop added successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get Admin's Shop
app.get("/admin/my-shop", isAdmin, async (req, res) => {
  try {
    const shop = await Shop.findOne({ adminId: req.user.userId });
    res.json(shop || null);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Shop Status
app.put("/update-status/:shopId", isAdmin, async (req, res) => {
  try {
    const { isOpen, openTime, closeTime } = req.body;
    const shop = await Shop.findOne({ _id: req.params.shopId, adminId: req.user.userId });
    if (!shop) return res.status(403).send("Unauthorized to manage this shop");
    
    await Shop.findByIdAndUpdate(req.params.shopId, { isOpen, openTime, closeTime });
    res.send("Shop status updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Shop Stock
app.put("/update-stock/:shopId", isAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    const shop = await Shop.findOne({ _id: req.params.shopId, adminId: req.user.userId });
    if (!shop) return res.status(403).send("Unauthorized to manage this shop");
    
    await Shop.findByIdAndUpdate(req.params.shopId, { stock });
    res.send("Shop stock updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Shop Announcement
app.put("/update-announcement/:shopId", isAdmin, async (req, res) => {
  try {
    const { announcement } = req.body;
    const shop = await Shop.findOne({ _id: req.params.shopId, adminId: req.user.userId });
    if (!shop) return res.status(403).send("Unauthorized to manage this shop");

    await Shop.findByIdAndUpdate(req.params.shopId, { announcement });
    res.send("Shop announcement updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

// Get Shops (with optional location sorting)
app.get("/shops", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let shops = await Shop.find();
    
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      shops = shops.map(shop => {
        const dist = getDistanceFromLatLonInKm(userLat, userLng, shop.latitude, shop.longitude);
        return { ...shop.toObject(), distance: dist };
      });
      shops.sort((a, b) => a.distance - b.distance);
    }
    res.json(shops);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Register
app.post("/register", async (req, res) => {
  try {
    const roleAssigned = req.body.rationCardNumber.toUpperCase().startsWith('ADMIN') ? 'admin' : 'user';
    const user = new User({
      name: req.body.name,
      rationCardNumber: req.body.rationCardNumber,
      password: req.body.password,
      role: roleAssigned
    });
    await user.save();
    res.send("User registered");
  } catch (err) {
    if(err.code === 11000) return res.status(400).send("Ration Card already exists");
    res.status(500).send(err.message);
  }
});

// Single unified login
app.post("/login", async (req, res) => {
  try {
    const expectedRole = req.body.role || 'user';
    const user = await User.findOne({
      rationCardNumber: req.body.rationCardNumber,
      password: req.body.password,
    });

    if (user) {
      if (user.role !== expectedRole) {
        return res.status(403).send(`Unauthorized. Please login from the correct portal. Expected: ${expectedRole}`);
      }
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "default_secret", { expiresIn: "24h" });
      res.json({ message: "Login successful", token, role: user.role, userId: user._id, name: user.name });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Admin Register
app.post("/admin/register", async (req, res) => {
  try {
    const adminUser = new User({
      name: req.body.name,
      rationCardNumber: req.body.rationCardNumber,
      password: req.body.password,
      role: 'admin'
    });
    await adminUser.save();
    res.send("Admin registered");
  } catch (err) {
    if(err.code === 11000) return res.status(400).send("ID already exists");
    res.status(500).send(err.message);
  }
});

 // Removed standalone admin login. Managed by Single Unified Login API above.


// Get Booked Slots for a Shop on a specific date
app.get("/shop-slots/:shopId/:date", async (req, res) => {
  try {
    const bookings = await Booking.find({
      shopId: req.params.shopId,
      date: req.params.date
    });
    res.json(bookings);
  } catch(err) {
    res.status(500).send(err.message);
  }
});

// Book Slot
app.post("/book-slot", async (req, res) => {
  try {
    const { userId, shopId, slot, time, date } = req.body;
    
    // Check if user already booked in current month
    const bookingDate = new Date(date);
    const month = bookingDate.getMonth();
    const year = bookingDate.getFullYear();
    const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
    const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0];
    
    const userMonthBookings = await Booking.countDocuments({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status: "completed"
    });
    
    if (userMonthBookings > 0) {
      return res.send("User already booked a slot this month. Limit is once per month and verified after collection.");
    }

    // Check if mini-slot already booked
    const timeMatch = await Booking.findOne({ shopId, date, time });
    if(timeMatch) {
       return res.send("Mini-slot already booked");
    }

    // Check if total bookings in hour >= 15
    const hourBookings = await Booking.countDocuments({
      shopId,
      date,
      slot
    });

    if (hourBookings >= 15) {
      return res.send("Slot full");
    }

    const booking = new Booking(req.body);
    await booking.save();

    res.send("Slot booked successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Admin Verify Booking
app.put("/verify-booking/:id", isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("Booking not found");
    if (booking.status === "completed") return res.status(400).send("Already verified");
    booking.status = "completed";
    booking.collectedAt = new Date();
    await booking.save();
    
    // Reduce Stock
    const shop = await Shop.findById(booking.shopId);
    if (shop && shop.stock) {
      if (shop.stock.rice) shop.stock.rice = Math.max(0, shop.stock.rice - 10);
      if (shop.stock.wheat) shop.stock.wheat = Math.max(0, shop.stock.wheat - 5);
      if (shop.stock.sugar) shop.stock.sugar = Math.max(0, shop.stock.sugar - 2);
      await shop.save();
    }
    res.send("Booking verified and stock updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Admin Dashboard - Get Bookings
app.get("/admin/bookings/:shopId", isAdmin, async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.shopId, adminId: req.user.userId });
    if (!shop) return res.status(403).send("Unauthorized to view this shop's bookings");

    const bookings = await Booking.find({ shopId: req.params.shopId });
    res.json(bookings);
  } catch(error) {
    res.status(500).send(error.message);
  }
});

// Notifications
app.get("/notifications", async (req, res) => {
  try {
    const notes = await Notification.find().sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/notifications", async (req, res) => {
  try {
    const note = new Notification(req.body);
    await note.save();
    res.send("Notification added");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
