import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useBookingStore } from "../store/bookingStore";
import {
  formatDateRange,
  formatLocation,
  formatPrice,
} from "../utils/dateutils";
import { getStatusColor } from "../constants/theme";

const BookingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { bookings, fetchBookings } = useBookingStore();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      await fetchBookings();
    } catch {
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
    } catch {
      Alert.alert("Error", "Failed to refresh bookings.");
    } finally {
      setRefreshing(false);
    }
  };

  const renderBookingItem = ({ item }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row">
        <View className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden">
          {item.property?.images?.length > 0 ? (
            <Image
              source={{ uri: item.property.images[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-300 justify-center items-center">
              <Ionicons name="image-outline" size={20} color="#9CA3AF" />
            </View>
          )}
        </View>

        <View className="flex-1 ml-3">
          <View className="flex-row items-start justify-between mb-1">
            <Text
              className="text-base font-semibold text-gray-900 flex-1"
              numberOfLines={2}
            >
              {item.property?.title || "Property Name Not Available"}
            </Text>
            <Text className="text-base font-bold text-gray-900 ml-2">
              {formatPrice(item.property?.price)}
            </Text>
          </View>

          {formatLocation(item.property?.location) && (
            <Text className="text-sm text-gray-600 mb-2">
              {formatLocation(item.property.location)}
            </Text>
          )}

          <Text className="text-sm text-gray-500 mb-2">
            {formatDateRange(item.checkInDate, item.checkOutDate)}
          </Text>

          <View className="flex-row items-center justify-between">
            <View
              className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}
            >
              <Text className="text-xs font-medium capitalize">
                {item.status || "Unknown"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "PropertyDetailsScreen",
                  params: { property: item.property },
                })
              }
            >
              <Text className="text-blue-600 text-sm font-medium">
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

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

      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<View className="h-6" />}
        ListFooterComponent={<View className="h-20" />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#3B82F6"]}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              No Bookings Yet
            </Text>
            <Text className="text-gray-500 text-center mt-2 px-8">
              Your future reservations will appear here once you make a booking.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default BookingScreen;
