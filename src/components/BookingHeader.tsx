import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  location: string;
  onClose: () => void;
  onReset: () => void;
}

const BookingHeader: React.FC<HeaderProps> = ({
  location,
  onClose,
  onReset,
}) => (
  <>
    <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
      <TouchableOpacity onPress={onClose}>
        <Text className="text-lg text-gray-600 font-semibold">✕</Text>
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-gray-800">Select Dates</Text>
      <TouchableOpacity onPress={onReset}>
        <Text className="text-base text-blue-500 font-medium">Reset</Text>
      </TouchableOpacity>
    </View>
    <View className="py-4">
      <Text className="text-sm text-gray-600">📍 {location}</Text>
    </View>
  </>
);

export default BookingHeader;
