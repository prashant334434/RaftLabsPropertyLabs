# 🏡 Property Booking App

A simple, modern mobile application built with **React Native (Expo)** and **TypeScript**, allowing users to browse properties, book them via a calendar modal, and view their booking and profile details.

---

## 🚀 Features

- 📋 **Home Screen**: View a list of 20 hardcoded property cards.
- 🔍 **Details Screen**: View detailed info about a selected property.
- 📆 **Booking via Bottom Sheet**: Choose check-in and check-out dates via a calendar modal.
- ✅ **Booking List Screen**: See all confirmed bookings.
- 👤 **Profile Screen**: Displays basic user profile data (dummy data).

---

## 📸 User Flow

1. **Open app** → Land on **Home Screen** with 20 property cards.
2. **Tap a property card** → Navigate to **Details Screen**.
3. **Click “Book Now”** → Bottom sheet opens with a **calendar**.
4. **Select check-in & check-out dates** → Tap **Confirm Booking**.
5. **Navigate to Bookings Screen** → Booking appears in the list.
6. **Navigate to Profile Screen** → View basic static profile data.

---

## 🛠 Tech Stack

| Technology                | Purpose                                  |
|--------------------------|------------------------------------------|
| React Native (Expo)      | Mobile development framework              |
| TypeScript               | Type safety & better DX                   |
| React Navigation         | Navigation between screens                |
| @gorhom/bottom-sheet     | Modern and flexible bottom sheets         |
| react-native-calendars   | Calendar UI component                     |
| Zustand                  | Global state management                   |
| NativeWind / twrnc       | Tailwind CSS styling in RN               |

---

## 📁 Folder Structure

```bash
.
├── assets/               # Static assets (images)
├── components/           # Reusable UI components
├── screens/              # Home, Details, Booking, Profile screens
├── store/                # Zustand state management
├── navigation/           # Navigation configuration
├── utils/                # Helper files/constants
├── App.tsx               # App entry point
├── tailwind.config.js    # Tailwind + NativeWind config
└── README.md
🧱 Setup Instructions
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/property-booking-app.git
cd property-booking-app
2️⃣ Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3️⃣ Start the Development Server
bash
Copy
Edit
npx expo start
Scan the QR code using your Expo Go app or launch the Android/iOS simulator.

📦 Zustand Store (State Management)
We use Zustand for global state including:

Booking list

Check-in and check-out dates

Selected property (optional)

Example store shape:

ts
Copy
Edit
interface Booking {
  propertyId: string;
  title: string;
  checkIn: string;
  checkOut: string;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}
🧠 Assumptions
App does not include authentication (user is assumed logged in).

Bookings are stored only in memory — no database or persistence.

Profile screen uses static dummy data.

All 20 properties are static mock data.

App restarts will reset booking state.

📌 Future Enhancements
✅ Add persistent storage (AsyncStorage or SQLite).

🌐 Backend API for properties & bookings.

🔐 User authentication.

💳 Payment integration.

🔍 Property filters and search functionality.

🧪 Add unit & E2E tests.

