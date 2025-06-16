import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Calendar } from "react-native-calendars";
import { useBookingStore } from "../store/bookingStore"; // Update with correct path

const BookingCalendarBottomSheet = ({
  isVisible,
  onClose,
  onBookingConfirm,
  propertyId, // Add propertyId as a required prop
  location = "Manhattan, New York, United States",
}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["75%"], []);

  // Zustand store
  const { createBooking } = useBookingStore();

  const [selectedDates, setSelectedDates] = useState({});
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // Handle visibility changes from parent
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index) => {
      console.log("handleSheetChanges", index);
      if (index === -1 && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle date selection
  const onDayPress = (day) => {
    const dateString = day.dateString;

    if (selectingCheckIn) {
      // Selecting check-in date
      setCheckInDate(dateString);
      setSelectedDates({
        [dateString]: {
          startingDay: true,
          endingDay: true,
          color: "#007AFF",
          textColor: "#ffffff",
        },
      });

      setSelectingCheckIn(false);
    } else {
      // Selecting check-out date
      if (dateString <= checkInDate) {
        // If checkout is before checkin, reset and start over
        setCheckInDate(dateString);
        setCheckOutDate("");
        setSelectedDates({
          [dateString]: {
            selected: true,
            selectedColor: "#007AFF",
          },
        });
        setSelectingCheckIn(false);
      } else {
        // Valid checkout date
        setCheckOutDate(dateString);

        // Create date range
        const start = new Date(checkInDate);
        const end = new Date(dateString);
        const dateRange = {};

        const currentDate = new Date(start);
        while (currentDate <= end) {
          const currentDateString = currentDate.toISOString().split("T")[0];

          if (currentDateString === checkInDate) {
            dateRange[currentDateString] = {
              startingDay: true,
              color: "#007AFF",
              textColor: "#ffffff",
            };
          } else if (currentDateString === dateString) {
            dateRange[currentDateString] = {
              endingDay: true,
              color: "#007AFF",
              textColor: "#ffffff",
            };
          } else {
            dateRange[currentDateString] = {
              color: "#E3F2FD", // light blue for in-between dates
              textColor: "#007AFF",
            };
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        setSelectedDates(dateRange);
        setSelectingCheckIn(true);
      }
    }
  };

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Error", "Please select both check-in and check-out dates");
      return;
    }

    if (!propertyId) {
      Alert.alert("Error", "Property ID is required for booking");
      return;
    }

    setIsCreatingBooking(true);

    try {
      const bookingData = {
        propertyId: propertyId,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        // Add other required fields based on your Booking type
        // For example:
        // userId: currentUserId,
        // totalPrice: calculatedPrice,
        status: "pending",
        // createdAt: new Date().toISOString(),
      };

      // Create booking using Zustand store
      await createBooking(bookingData);

      // Call parent callback if provided
      if (onBookingConfirm) {
        onBookingConfirm({
          checkIn: checkInDate,
          checkOut: checkOutDate,
          location: location,
          propertyId: propertyId,
        });
      }

      console.log("Booking confirmed:", bookingData);

      // Show success message
      Alert.alert("Success", "Your booking has been confirmed!");

      // Close the bottom sheet
      bottomSheetRef.current?.close();

      // Reset state after booking
      setTimeout(() => {
        resetDates();
      }, 300);
    } catch (error) {
      console.error("Booking creation failed:", error);
      Alert.alert(
        "Booking Failed",
        "There was an error creating your booking. Please try again."
      );
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const resetDates = () => {
    setSelectedDates({});
    setCheckInDate("");
    setCheckOutDate("");
    setSelectingCheckIn(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleClose = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={{
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 40,
      }}
    >
      <BottomSheetView className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-lg text-gray-600 font-semibold">✕</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">
            Select Dates
          </Text>
          <TouchableOpacity onPress={resetDates}>
            <Text className="text-base text-blue-500 font-medium">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View className="py-4">
          <Text className="text-sm text-gray-600">📍 {location}</Text>
        </View>

        {/* Date Selection Info */}
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

        {/* Selection Instruction */}
        <Text className="text-sm text-blue-500 text-center py-3 font-medium">
          {selectingCheckIn
            ? "Select your check-in date"
            : "Select your check-out date"}
        </Text>

        {/* Calendar */}
        <Calendar
          onDayPress={onDayPress}
          markedDates={selectedDates}
          markingType={"period"}
          theme={{
            selectedDayBackgroundColor: "#000",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#007AFF",
            dayTextColor: "#1E3A8A",
            textDisabledColor: "#94A3B8",
            textDayFontWeight: "500",
            textDayFontSize: 16,
            dotColor: "#007AFF",
            selectedDotColor: "#ffffff",
            arrowColor: "#007AFF",
            disabledArrowColor: "#CBD5E1",
            monthTextColor: "#1E3A8A",
            textMonthFontWeight: "600",
            textMonthFontSize: 18,
            textDayHeaderFontWeight: "600",
            textDayHeaderFontSize: 14,
            textDayHeaderColor: "#2563EB",
            indicatorColor: "#007AFF",
          }}
          className="mb-5"
        />

        {/* Confirm Button */}
        <TouchableOpacity
          className={`py-4 rounded-xl items-center mb-5 ${
            !checkInDate || !checkOutDate || isCreatingBooking
              ? "bg-gray-200"
              : "bg-blue-500"
          }`}
          onPress={handleConfirmBooking}
          disabled={!checkInDate || !checkOutDate || isCreatingBooking}
        >
          <Text
            className={`text-base font-semibold ${
              !checkInDate || !checkOutDate || isCreatingBooking
                ? "text-gray-400"
                : "text-white"
            }`}
          >
            {isCreatingBooking ? "Creating Booking..." : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BookingCalendarBottomSheet;
