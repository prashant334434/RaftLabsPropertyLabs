# 🏡 Property Booking App (React Native + Expo)

This is a **Property Listing & Booking** mobile app built using **React Native**, **Expo**, **TypeScript**, and modern tools such as **NativeWind**, **Zustand**, and **React Navigation**.

The app allows users to:
- View a list of properties.
- View property details.
- Select check-in and check-out dates via a calendar in a bottom sheet.
- Confirm bookings.
- View bookings in a separate booking screen.
- View profile details.

---

## 📲 Features Overview

### 🔹 Home Screen (Property Listings)
- Displays a list of **20 properties**.
- Each property card contains an image, title, price, and location.
- On tapping a card, user navigates to the **Property Details** screen.

### 🔹 Property Details Screen
- Shows complete information about a selected property.
- Includes a **"Book Now"** button that triggers a **calendar bottom sheet**.

### 🔹 Booking Bottom Sheet
- Implemented using `@gorhom/bottom-sheet`.
- Contains a **calendar (react-native-calendars)** to select check-in and check-out dates.
- After date selection, user can **confirm the booking**.
- Once confirmed, the booking is saved in the **Booking List** state.

### 🔹 Bookings Screen
- Displays the list of all bookings the user has made.
- Shows property title, check-in and check-out dates, and location.

### 🔹 Profile Screen
- Displays basic user profile details (name, email, avatar, etc.).

---

## 🛠️ Tech Stack

| Tool/Library               | Purpose                                  |
|---------------------------|------------------------------------------|
| **React Native (Expo)**   | Mobile development framework              |
| **TypeScript**            | Type safety and scalable architecture     |
| **React Navigation**      | App navigation                           |
| **@gorhom/bottom-sheet**  | Modal bottom sheet UI                    |
| **react-native-calendars**| Calendar for date selection              |
| **Zustand**               | Lightweight state management              |
| **NativeWind** / **twrnc**| Tailwind CSS in React Native             |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/property-booking-app.git
cd property-booking-app
