import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Calendar, DateObject } from "react-native-calendars";
import { Alert } from "react-native";
import BookingHeader from "./BookingHeader";
import BookingInfo from "./BookingInfo";
import BookingButton from "./BookingButton";
import { calendarTheme } from "../constants/theme";
import { useBookingStore } from "../store/bookingStore";
import { BookingCalendarProps } from "../Types/types";

const BookingCalendarBottomSheet: React.FC<BookingCalendarProps> = ({
  isVisible,
  onClose,
  onBookingConfirm,
  propertyId,
  location = "Manhattan, New York, United States",
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);
  const { createBooking } = useBookingStore();

  const [selectedDates, setSelectedDates] = useState<Record<string, any>>({});
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  useEffect(() => {
    isVisible
      ? bottomSheetRef.current?.expand()
      : bottomSheetRef.current?.close();
  }, [isVisible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose]
  );

  const onDayPress = (day: DateObject) => {
    const dateString = day.dateString;

    if (selectingCheckIn || dateString <= checkInDate) {
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
      setCheckOutDate(dateString);

      const start = new Date(checkInDate);
      const end = new Date(dateString);
      const range: Record<string, any> = {};
      const current = new Date(start);

      while (current <= end) {
        const key = current.toISOString().split("T")[0];
        range[key] = {
          color:
            key === checkInDate || key === dateString ? "#007AFF" : "#E3F2FD",
          textColor:
            key === checkInDate || key === dateString ? "#ffffff" : "#007AFF",
          ...(key === checkInDate && { startingDay: true }),
          ...(key === dateString && { endingDay: true }),
        };
        current.setDate(current.getDate() + 1);
      }

      setSelectedDates(range);
      setSelectingCheckIn(true);
    }
  };

  const resetDates = () => {
    setSelectedDates({});
    setCheckInDate("");
    setCheckOutDate("");
    setSelectingCheckIn(true);
  };

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Error", "Please select both check-in and check-out dates");
      return;
    }

    setIsCreatingBooking(true);
    try {
      const bookingData = {
        propertyId,
        checkInDate,
        checkOutDate,
        status: "pending",
      };

      await createBooking(bookingData);

      onBookingConfirm?.({
        checkIn: checkInDate,
        checkOut: checkOutDate,
        location,
        propertyId,
      });

      Alert.alert("Success", "Your booking has been confirmed!");
      bottomSheetRef.current?.close();
      setTimeout(resetDates, 300);
    } catch (error) {
      Alert.alert("Booking Failed", "Please try again.");
    } finally {
      setIsCreatingBooking(false);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
    >
      <BottomSheetView className="flex-1 px-5">
        <BookingHeader
          location={location}
          onClose={onClose}
          onReset={resetDates}
        />
        <BookingInfo
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          selectingCheckIn={selectingCheckIn}
        />
        <Calendar
          onDayPress={onDayPress}
          markedDates={selectedDates}
          markingType="period"
          theme={calendarTheme}
          className="mb-5"
        />
        <BookingButton
          disabled={!checkInDate || !checkOutDate || isCreatingBooking}
          loading={isCreatingBooking}
          onPress={handleConfirmBooking}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BookingCalendarBottomSheet;
