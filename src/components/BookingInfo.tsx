import React from "react";
import { Text, View } from "react-native";
import { formatDate } from "../utils/dateutils";

interface BookingInfoProps {
  checkInDate: string;
  checkOutDate: string;
  selectingCheckIn: boolean;
}

const BookingInfo: React.FC<BookingInfoProps> = ({
  checkInDate,
  checkOutDate,
  selectingCheckIn,
}) => (
  <>
    <View className="flex-row justify-between py-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="text-sm text-gray-600 mb-1">Check-in</Text>
        <Text className="text-base font-semibold text-gray-800">
          {checkInDate ? formatDate(checkInDate) : "Select date"}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm text-gray-600 mb-1">Check-out</Text>
        <Text className="text-base font-semibold text-gray-800">
          {checkOutDate ? formatDate(checkOutDate) : "Select date"}
        </Text>
      </View>
    </View>

    <Text className="text-sm text-blue-500 text-center py-3 font-medium">
      {selectingCheckIn
        ? "Select your check-in date"
        : "Select your check-out date"}
    </Text>
  </>
);

export default BookingInfo;
