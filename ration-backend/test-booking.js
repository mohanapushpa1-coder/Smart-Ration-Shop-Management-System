const axios = require('axios');

async function testBooking() {
  try {
    const res = await axios.post("http://localhost:5000/book-slot", {
      userId: "guest_user",
      shopId: "dummy_shop",
      slot: "09:00 AM - 10:00 AM",
      time: "09:15 AM",
      date: "2026-04-20"
    });
    console.log("Success:", res.status, res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error response:", err.response.status, err.response.data);
    } else {
      console.log("Network error:", err.message);
    }
  }
}

testBooking();
