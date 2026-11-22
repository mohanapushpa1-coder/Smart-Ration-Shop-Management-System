📁 Files Created or Modified
Action	File Path	Description
Created	README.md	Comprehensive, portfolio-grade project documentation with all 11 required sections.
Created	ration-backend/.env.example	Safe environment configuration template with non-sensitive placeholders.
Untouched	Application code	All existing backend and frontend application source code remains intact.
📄 Generated README.md Content

Below is the complete content written to your README.md:

markdown
🛒 Smart Ration Shop Management System

GitHub Repository
Node.js
React
Express
MongoDB
Tailwind CSS

A modern, full-stack web application designed to digitize and streamline the Public Distribution System (PDS). The system minimizes long queues, eliminates stock uncertainty, and prevents crowding at ration distribution centers through GPS-based shop discovery, live stock monitoring, automated time-slot reservations, and administrative inventory management.

📌 Table of Contents
Overview
Key Features
Technologies Used
Project Architecture
Installation and Setup
Environment Variables
API Endpoints
Project Screenshots
Future Enhancements
Author
📖 Project Overview

Traditional public ration distribution systems often suffer from unpredictable commodity availability, manual ledger record-keeping, and exhausting waiting lines for citizens.

The Smart Ration Shop Management System solves these challenges by providing a unified digital platform for both beneficiaries and ration shop administrators:

For Citizens / Beneficiaries:

Find nearby ration outlets automatically sorted by GPS distance.
Check live inventory levels (Rice, Wheat, Sugar) before leaving home.
Reserve specific 5-minute time slots to collect rations without standing in lines.
Review personal booking history and track past distribution records.
Receive official government updates and shop notices in real-time.

For Ration Shop Administrators:

Register shop location with precise geographic coordinates (latitude and longitude).
Update operating hours, open/closed status, and public announcements dynamically.
Maintain real-time stock balances.
Verify beneficiary bookings and automatically deduct allocated quantities upon collection.
✨ Key Features
👤 Beneficiary Portal (User Features)
Role-Based Authentication: Secure registration and login using unique Ration Card numbers and password validation with JWT token authorization.
Smart Shop Finder with Geolocation: Detects user location via the browser's Geolocation API and calculates aerial distance to each shop in kilometers using the Haversine formula.
Real-Time Stock & Status Indicators: View dynamic stock counters for essential commodities (Rice, Wheat, Sugar) with color-coded alerts and live Open/Closed badges with opening hours.
Instant Search: Quickly filter and find specific ration outlets by name.
Micro-Slot Booking Engine:
Select collection dates and 1-hour primary time windows (e.g., 09:00 AM – 10:00 AM).
Pick specific 5-minute collection mini-slots.
Capacity capping: Maximum of 15 users per 1-hour slot to prevent over-crowding.
Conflict prevention: Prevents overlapping bookings for identical 5-minute slots.
Fair allocation policy: Restricts bookings to once per calendar month per verified cardholder.
Personal Booking Timeline: View previous and upcoming bookings with status badges (Confirmed / Completed).
Government Announcements: Integrated dashboard feed displaying administrative alerts and public notices.
🛡️ Administrator Portal (Admin Features)
Shop Profile Management: Register shop details, location coordinates (latitude & longitude), and operating hours.
Operational Status Control: Toggle shop availability (Open / Closed) in real time.
Live Stock Management: Adjust stock levels (Rice, Wheat, Sugar) dynamically.
Custom Shop Announcements: Broadcast shop-specific alerts (e.g., "Fresh stock arrived today", "Closed for maintenance").
Booking Verification & Automated Inventory Deduction: Inspect scheduled beneficiary bookings and verify distribution with one click, which automatically decrements item stock (Rice: -10 kg, Wheat: -5 kg, Sugar: -2 kg).
🛠️ Technologies Used
Frontend
Technology	Version	Purpose
React	^19.2.5	Component-driven user interface
React Router	^7.14.1	Declarative client-side routing & protected routes
Tailwind CSS	^3.4.1	Utility-first responsive modern styling
Lucide React	^1.8.0	Clean vector iconography
Axios	^1.15.0	HTTP client with automatic JWT bearer interceptors
Capacitor	^8.5.0	Native runtime support for mobile / Android packaging
Backend
Technology	Version	Purpose
Node.js	>= 18.0.0	JavaScript runtime environment
Express	^5.2.1	REST API framework and routing
Mongoose	^9.4.1	Object Data Modeling (ODM) for MongoDB
JSON Web Token (JWT)	^9.0.3	Stateless authentication and role-based access control
Bcryptjs	^3.0.3	Password encryption and hashing
Dotenv	^17.4.2	Environment variable management
CORS	^2.8.6	Cross-Origin Resource Sharing middleware
Database & Algorithms
Tool / Concept	Details
MongoDB	Cloud-hosted NoSQL database (MongoDB Atlas) or local instance
Haversine Formula	Mathematical calculation of spherical distance between user coordinates and shop coordinates
📂 Project Architecture

Smart-Ration-Shop-Management-System/ ├── .gitignore # Git ignore rules for dependencies and secrets ├── package.json # Workspace root configuration ├── walkthrough.md # Project delivery and feature notes │ ├── ration-backend/ # Node.js Express REST API │ ├── models/ # Mongoose Schema Definitions │ │ ├── Booking.js # Slot reservation schema & collection status │ │ ├── Notification.js # Public bulletins & government updates │ │ ├── Shop.js # Shop schema (coordinates, hours, stock, status) │ │ └── User.js # User & Admin credentials schema │ ├── .env.example # Template for backend environment variables │ ├── package.json # Backend dependencies and scripts │ ├── seed-shops.js # Database seeder with sample ration shops │ ├── server.js # Primary Express application and API routes │ ├── test-booking.js # Booking endpoint verification script │ ├── test-endpoints.js # API route integration testing script │ └── view-db.js # Database inspection utility │ └── ration-frontend/ # React Single Page Application (SPA) ├── android/ # Capacitor Android native project files ├── public/ # Static assets (HTML shell, favicons, logos) ├── src/ │ ├── components/ # Reusable UI Components │ │ ├── Layout.js # Shared page layout wrapper │ │ ├── Navbar.js # Navigation bar with role-based links │ │ └── ShopCard.js # Shop display card with stock and distance │ ├── pages/ # Page Views │ │ ├── AddShop.js # Admin dashboard & shop manager │ │ ├── AdminBookings.js # Admin booking verification & stock decrement │ │ ├── BookSlot.js # Slot selection & reservation interface │ │ ├── BookingHistory.js # User booking timeline & status │ │ ├── Dashboard.js # User home view with updates & quick links │ │ ├── Login.js # Unified authentication portal (User / Admin) │ │ ├── Register.js # New ration card registration │ │ └── Shops.js # Shop listing with search & location sorting │ ├── services/ │ │ └── api.js # Centralized Axios instance & API client functions │ ├── App.js # Route definitions & Protected Route wrappers │ ├── index.css # Tailwind CSS entry point │ └── index.js # React DOM mount point ├── capacitor.config.ts # Capacitor cross-platform configuration ├── package.json # Frontend dependencies and scripts └── tailwind.config.js # Tailwind theme and styling configuration

---
## 🚀 Installation and Setup
### Prerequisites
Make sure you have installed on your local machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **MongoDB**: An active [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI or a local MongoDB instance (`mongodb://localhost:27017/ration-db`)
- **Git**: Installed and configured on your system
---
### Step 1: Clone the Repository
```bash
git clone https://github.com/mohanapushpa1-coder/Smart-Ration-Shop-Management-System.git
cd Smart-Ration-Shop-Management-System
Step 2: Configure & Run the Backend

Navigate to the backend directory:

bash
cd ration-backend

Install backend dependencies:

bash
npm install

Set up the environment variables: Create a .env file inside ration-backend/ based on .env.example:

bash
# On Windows (PowerShell)
Copy-Item .env.example .env
# On Linux/macOS
cp .env.example .env

Open .env and fill in your MongoDB connection string and a secret key:

env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here

(Optional) Seed demo ration shops into the database:

bash
node seed-shops.js

Start the backend server:

bash
node server.js

The backend API will run at http://localhost:5000.

Step 3: Configure & Run the Frontend

Open a new terminal window and navigate to the frontend directory:

bash
cd ration-frontend

Install frontend dependencies:

bash
npm install

Start the React development server:

bash
npm start

Open your browser and navigate to:

Citizen / User Portal: http://localhost:3000
Administrator Portal: http://localhost:3000/admin-login
🔐 Environment Variables

The backend application requires the following environment variables configured in ration-backend/.env:

Variable	Description	Example / Default
PORT	Network port for the Express backend server	5000
MONGO_URI	MongoDB connection string (Atlas or Local)	mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET	Secret key used for signing and validating JWT tokens	your_secure_random_jwt_secret

A sample template is provided in ration-backend/.env.example:

env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here

CAUTION

Never commit your active .env file or expose raw database credentials in your public Git repository. The project's .gitignore is pre-configured to keep secret files private.

📡 API Endpoints
Authentication & Users
Method	Endpoint	Access	Description
POST	/register	Public	Register new citizen cardholder
POST	/admin/register	Public	Register new shop administrator
POST	/login	Public	Unified login returning JWT token and user role
Shops & Geolocation
Method	Endpoint	Access	Description
GET	/shops	Public	Retrieve all shops (optional ?lat=&lng= query for distance sorting)
GET	/admin/my-shop	Admin	Fetch authenticated administrator's shop profile
POST	/add-shop	Admin	Register a new ration outlet
PUT	/update-status/:shopId	Admin	Update operating hours and open/closed status
PUT	/update-stock/:shopId	Admin	Update commodity stock balances (Rice, Wheat, Sugar)
PUT	/update-announcement/:shopId	Admin	Update shop announcement message
Bookings & Slots
Method	Endpoint	Access	Description
GET	/shop-slots/:shopId/:date	Public	Fetch already booked mini-slots for a shop on a date
POST	/book-slot	User	Reserve a 5-minute time slot
GET	/admin/bookings/:shopId	Admin	View all customer bookings for an admin's shop
PUT	/verify-booking/:id	Admin	Verify ration collection and deduct stock
Announcements
Method	Endpoint	Access	Description
GET	/notifications	Public	Retrieve system bulletins and government updates
POST	/notifications	Admin	Publish a new public notification
📷 Project Screenshots

To showcase your application visually, take screenshots of your running application at http://localhost:3000, save them in an assets/ or screenshots/ directory, and update the paths below:

View	Screenshot Preview
Citizen Dashboard
(Overview with announcements and quick navigation)	
Citizen Dashboard Placeholder

Nearby Shops & Live Stock
(Distance sorting and live inventory levels)	
Shops and Stock Placeholder

Slot Booking Interface
(Date picker, hour blocks, and 5-minute mini-slots)	
Slot Booking Placeholder

Admin Shop & Inventory Manager
(Update status, hours, announcements, and stock)	
Admin Shop Management Placeholder

Admin Booking Verification
(Verify collections and automated stock deduction)	
Booking Verification Placeholder
🔮 Future Enhancements

While the core functionality of the system is fully operational, several extensions can further enhance user experience and security:

 SMS / WhatsApp OTP Verification: Send instant booking confirmations and reminders with one-time verification passcodes.
 QR Code Collection Pass: Generate a unique digital QR pass for each booking that administrators can scan for instant verification.
 Biometric / Aadhaar Integration Mock: Integrate fingerprint/iris verification simulation for enhanced PDS security compliance.
 Multilingual Support (i18n): Add local and regional language options (e.g., Tamil, Hindi, Telugu) for inclusive accessibility.
 Interactive Map View: Embed interactive maps (e.g., Leaflet or Google Maps) to visually pinpoint shop locations and route navigation.
 Automated Low-Stock Alerts: Automatically trigger notifications to administrators when essential commodity reserves fall below a specified threshold.
👩‍💻 Author

Mohana Pushpa V

GitHub: @mohanapushpa1-coder
Repository: Smart-Ration-Shop-Management-System
📄 License

This project is developed for educational and portfolio demonstration purposes. All rights reserved by the author.

---
### 💡 Next Steps for Git
To push this README and the `.env.example` template to your GitHub repository:
```bash
git add README.md ration-backend/.env.example
git commit -m "docs: add comprehensive README and backend env example"
git push origin main
