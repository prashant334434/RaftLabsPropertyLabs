import { create } from "zustand";
import { Booking, Property } from "../Types/types";
import { API_BASE_URL } from "../core/api";
import axios from "axios";

type BookingWithProperty = Booking & { property?: Property };

type BookingStore = {
  bookings: BookingWithProperty[];
  fetchBookings: () => Promise<void>;
  createBooking: (booking: Booking) => Promise<void>;
};

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],

  fetchBookings: async () => {
    try {
      const { data: bookings } = await axios.get(`${API_BASE_URL}/bookings`);
      const bookingWithProps = await Promise.all(
        bookings.map(async (b: Booking) => {
          const { data: property } = await axios.get(
            `${API_BASE_URL}/properties/${b.propertyId}`
          );
          return { ...b, property };
        })
      );
      set({ bookings: bookingWithProps });
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      throw err; // Re-throw to handle in component if needed
    }
  },

  createBooking: async (booking: Booking) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/bookings`, booking);

      // Optionally fetch the property details for the new booking
      let bookingWithProperty = res.data;
      try {
        const { data: property } = await axios.get(
          `${API_BASE_URL}/properties/${booking.propertyId}`
        );
        bookingWithProperty = { ...res.data, property };
      } catch (propertyErr) {
        console.warn(
          "Failed to fetch property details for new booking:",
          propertyErr
        );
      }

      set((state) => ({
        bookings: [...state.bookings, bookingWithProperty],
      }));
    } catch (err) {
      console.error("Booking failed", err);
      throw err; // Re-throw to handle in component
    }
  },
}));
