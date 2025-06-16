import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface BookingButtonProps {
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
}

const BookingButton: React.FC<BookingButtonProps> = ({
  disabled,
  loading,
  onPress,
}) => (
  <TouchableOpacity
    className={`py-4 rounded-xl items-center mb-5 ${
      disabled ? "bg-gray-200" : "bg-blue-500"
    }`}
    disabled={disabled}
    onPress={onPress}
  >
    <Text
      className={`text-base font-semibold ${
        disabled ? "text-gray-400" : "text-white"
      }`}
    >
      {loading ? "Creating Booking..." : "Confirm Booking"}
    </Text>
  </TouchableOpacity>
);

export default BookingButton;
