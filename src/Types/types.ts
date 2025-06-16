export type Location = {
  address: string;
  city: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type Property = {
  id: string;
  title: string;
  price: number;
  location: Location;
  features: string[];
  images: string[];
};

export type Booking = {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "cancelled";
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  bookings: string[];
};
export interface BookingData {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

export interface BookingCalendarProps {
  isVisible: boolean;
  onClose: () => void;
  onBookingConfirm?: (data: {
    checkIn: string;
    checkOut: string;
    location: string;
    propertyId: string;
  }) => void;
  propertyId: string;
  location?: string;
}
