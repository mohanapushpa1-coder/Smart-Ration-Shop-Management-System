const URL = "http://localhost:5000";

async function testAPI() {
    console.log("Starting API Tests...\n");

    try {
        // 1. Register User
        console.log("1. Testing POST /register...");
        const registerRes = await fetch(`${URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Test User", email: "test@example.com", password: "password123" })
        });
        const registerText = await registerRes.text();
        console.log("   Response:", registerText);

        // 2. Login User
        console.log("\n2. Testing POST /login...");
        const loginRes = await fetch(`${URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com", password: "password123" })
        });
        const loginText = await loginRes.text();
        console.log("   Response:", loginText);

        // 3. Add Shop
        console.log("\n3. Testing POST /add-shop...");
        const shopRes = await fetch(`${URL}/add-shop`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Ration Shop A",
                latitude: 12.9716,
                longitude: 77.5946,
                stock: { rice: 100, wheat: 50, sugar: 20 }
            })
        });
        const shopText = await shopRes.text();
        console.log("   Response:", shopText);

        // 4. Get Shops
        console.log("\n4. Testing GET /shops...");
        const getShopsRes = await fetch(`${URL}/shops`);
        const shops = await getShopsRes.json();
        console.log("   Response:", shops.length, "shops found.");
        const shopId = shops.length > 0 ? shops[0]._id : "fakeShopId";

        // 5. Book Slot
        console.log("\n5. Testing POST /book-slot...");
        const bookRes = await fetch(`${URL}/book-slot`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: "user_12345", // Mock user ID 
                shopId: shopId,
                slotTime: "10:00 AM",
                date: "2026-04-19"
            })
        });
        const bookText = await bookRes.text();
        console.log("   Response:", bookText);

        console.log("\n✅ All tests finished successfully!");
    } catch (err) {
        console.error("❌ Test failed:", err.message);
    }
}

testAPI();
