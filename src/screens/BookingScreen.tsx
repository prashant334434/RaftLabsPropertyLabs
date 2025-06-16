import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBookingStore } from "../store/bookingStore"; // Adjust path as needed

// Booking Screen Component
const BookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(15);
  const [currentMonth, setCurrentMonth] = useState("June 2025");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get bookings and fetchBookings from the store
  const { bookings, fetchBookings } = useBookingStore();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      await fetchBookings();
    } catch (error) {
      Alert.alert("Error", "Failed to load bookings. Please try again.", [
        { text: "OK" },
        { text: "Retry", onPress: loadBookings },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchBookings();
    } catch (error) {
      Alert.alert("Error", "Failed to refresh bookings.");
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  const formatDateRange = (checkIn, checkOut) => {
    if (!checkIn) return "Dates not available";

    try {
      const startDate = new Date(checkIn);
      const endDate = checkOut ? new Date(checkOut) : null;

      const startFormatted = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (endDate) {
        const endFormatted = endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return `${startFormatted} - ${endFormatted}`;
      }

      return startFormatted;
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "finished":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (amount, currency = "INR") => {
    if (!amount) return "Price not available";

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${amount}`;
    }
  };

  const formatLocation = (location) => {
    if (!location) return null;

    // If location is a string, return it as is
    if (typeof location === "string") {
      return location;
    }

    // If location is an object, format it properly
    if (typeof location === "object") {
      const parts = [];

      if (location.address) parts.push(location.address);
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);

      return parts.length > 0 ? parts.join(", ") : "Location not available";
    }

    return "Location not available";
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Loading your bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white py-10">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#3B82F6"]}
          />
        }
      >
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                My Bookings
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {bookings.length}{" "}
                {bookings.length === 1 ? "reservation" : "reservations"}
              </Text>
            </View>
            <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
              <Ionicons
                name="refresh"
                size={24}
                color={refreshing ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bookings List */}
        <View className="px-4 mt-6">
          {bookings.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
              <Text className="text-xl font-semibold text-gray-900 mt-4">
                No Bookings Yet
              </Text>
              <Text className="text-gray-500 text-center mt-2 px-8">
                Your future reservations will appear here once you make a
                booking.
              </Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View
                key={booking.id}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row">
                  {/* Property Image */}
                  <View className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden">
                    {booking.property?.images &&
                    booking.property.images.length > 0 ? (
                      <Image
                        source={{ uri: booking.property.images[0] }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full bg-gray-300 justify-center items-center">
                        <Ionicons
                          name="image-outline"
                          size={20}
                          color="#9CA3AF"
                        />
                      </View>
                    )}
                  </View>

                  <View className="flex-1 ml-3">
                    {/* Title and Price Row */}
                    <View className="flex-row items-start justify-between mb-1">
                      <Text
                        className="text-base font-semibold text-gray-900 flex-1"
                        numberOfLines={2}
                      >
                        {booking.property?.title ||
                          "Property Name Not Available"}
                      </Text>
                      <Text className="text-base font-bold text-gray-900 ml-2">
                        {formatPrice(booking.property?.price)}
                      </Text>
                    </View>

                    {/* Location */}
                    {formatLocation(booking.property?.location) && (
                      <Text className="text-sm text-gray-600 mb-2">
                        {formatLocation(booking.property.location)}
                      </Text>
                    )}

                    {/* Date Range */}
                    <Text className="text-sm text-gray-500 mb-2">
                      {formatDateRange(
                        booking.checkInDate,
                        booking.checkOutDate
                      )}
                    </Text>

                    {/* Status and Actions Row */}
                    <View className="flex-row items-center justify-between">
                      <View
                        className={`px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}
                      >
                        <Text className="text-xs font-medium capitalize">
                          {booking.status || "Unknown"}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          // Handle view details - you can navigate to booking details screen
                          console.log("View booking details:", booking.id);
                        }}
                      >
                        <Text className="text-blue-600 text-sm font-medium">
                          View Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;
