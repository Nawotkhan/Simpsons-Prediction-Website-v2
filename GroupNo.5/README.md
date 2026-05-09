# SimPredictions

SimPredictions is a FAST NUCES Web Programming project dedicated to exploring the uncanny predictions made by the animated series, *The Simpsons*. It documents notable episodes and the real-world events they foresaw, allowing users to explore these predictions, leave reviews, and manage their own profiles.

## Core Features
- **Episodes & Predictions Explorer**: View detailed information about various episodes and the real-world events they predicted.
- **User Authentication**: Secure signup and login system.
- **User Profiles**: Users can manage their profiles, upload profile pictures, and manage bookmarks.
- **Reviews System**: Full CRUD implementation allowing users to leave and manage reviews for different predictions.
- **Admin Dashboard**: Administrative controls for content moderation and management.
- **Responsive & Animated Design**: A sleek, dynamic dark-themed UI with animated backgrounds and theme toggling.

## Group Members
- **Nawaal Talat Khan** (23L-5566)
- **Hubba Abid** (23L-4029)
- **Yumna Asif** (23L-5548)
- **Khadija Sajid** (23L-5568)

## Setup and Installation

### Prerequisites
- Node.js installed on your machine
- MongoDB (Local instance or MongoDB Atlas)

### 1. Backend Server Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory based on the `.env.example` format and configure the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   # OR for local DB: MONGO_URI=mongodb://127.0.0.1:27017/simpredictions
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_admin_password
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The server will start running, typically on http://localhost:5000)*

### 2. Frontend React Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The React app will be accessible at http://localhost:5173 by default)*

## Database Configuration Details
- **MONGO_URI**: The connection string required to connect to your MongoDB database. 
  - For **MongoDB Atlas** (Cloud), the format is: `mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority`. Make sure to replace `<username>`, `<password>`, `<cluster-url>`, and `<database>` with your actual MongoDB Atlas credentials and cluster URL.
  - For **Local MongoDB**, the format is typically: `mongodb://127.0.0.1:27017/simpredictions` (or `localhost`).
- Ensure that your MongoDB Atlas Network Access settings allow connections from your current IP address (or `0.0.0.0/0` for testing).
