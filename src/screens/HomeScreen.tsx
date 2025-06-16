import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProperties } from "../hooks/useProperties";
import PropertyCard from "../components/PropertyCard";
import BookingCalendarBottomSheet from "../components/BookingCalendarBottomSheet";

const { width } = Dimensions.get("window");

// Skeleton Loader Components
const SkeletonLoader = ({ width, height, borderRadius = 8 }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        width,
        height,
        backgroundColor: "#E5E7EB",
        borderRadius,
        opacity,
      }}
    />
  );
};

const PropertyCardSkeleton = () => (
  <View className="bg-white rounded-2xl p-4 mb-4 mx-4 shadow-sm border border-gray-100">
    <SkeletonLoader width="100%" height={180} borderRadius={12} />
    <View className="mt-3">
      <SkeletonLoader width="70%" height={20} borderRadius={4} />
      <View className="mt-2">
        <SkeletonLoader width="50%" height={16} borderRadius={4} />
      </View>
      <View className="flex-row justify-between items-center mt-3">
        <SkeletonLoader width="40%" height={18} borderRadius={4} />
        <SkeletonLoader width={80} height={32} borderRadius={16} />
      </View>
    </View>
  </View>
);

const HeaderSkeleton = () => (
  <View className="px-4 py-2">
    {/* Location Row Skeleton */}
    <View className="flex-row items-center mb-4">
      <SkeletonLoader width={16} height={16} borderRadius={8} />
      <View className="ml-2">
        <SkeletonLoader width={120} height={16} borderRadius={4} />
      </View>
    </View>

    {/* Search Bar Skeleton */}
    <View className="mb-4">
      <SkeletonLoader width="100%" height={40} borderRadius={20} />
    </View>

    {/* Tabs Skeleton */}
    <View className="flex-row mb-4">
      {[1, 2, 3, 4].map((item) => (
        <View key={item} className="mr-2">
          <SkeletonLoader width={60} height={32} borderRadius={16} />
        </View>
      ))}
    </View>
  </View>
);

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Villa");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: properties, isLoading, isError, refetch } = useProperties();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(5); // Show 5 properties initially

  const handleOpenCalendar = (property) => {
    console.log(property);
    setSelectedProperty(property);
    setIsCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false);
    setSelectedProperty(null);
  };

  const handleBookingConfirm = (bookingData) => {
    console.log("Booking confirmed:", bookingData);
    console.log("Selected property:", selectedProperty);
    setIsCalendarVisible(false);
    setSelectedProperty(null);
  };

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setDisplayCount(5); // Reset to show 5 properties
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing properties:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Load more properties
  const loadMoreProperties = () => {
    if (filteredProperties.length > displayCount) {
      setDisplayCount((prev) => Math.min(prev + 5, filteredProperties.length));
    }
  };

  const tabs = ["Villa", "Hotel", "Apart", "Resort"];

  // Filter properties based on search query and selected tab
  const filteredProperties =
    properties?.filter((property) => {
      const matchesSearch =
        searchQuery === "" ||
        // property.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // property.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        selectedTab === "Villa" ||
        property.type?.toLowerCase() === selectedTab.toLowerCase();

      return matchesSearch && matchesTab;
    }) || [];

  // Get properties to display (limited by displayCount)
  const propertiesToShow = filteredProperties.slice(0, displayCount);

  // Clear search function
  const clearSearch = () => {
    setSearchQuery("");
  };

  const TabButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-lg mr-2 ${
        isSelected ? "bg-blue-600" : "bg-gray-100"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          isSelected ? "text-white" : "text-gray-600"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Show skeleton loader during initial load
  if (isLoading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white pt-12">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <HeaderSkeleton />
        {[1, 2, 3, 4, 5].map((item) => (
          <PropertyCardSkeleton key={item} />
        ))}
      </SafeAreaView>
    );
  }

  if (isError && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white pt-12">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-red-500 text-center mt-4 text-lg font-medium">
            Error loading properties
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Pull down to refresh or try again
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            className="mt-4 px-6 py-3 bg-blue-600 rounded-lg"
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-12">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList
        data={propertiesToShow}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]} // Android
            tintColor="#2563EB" // iOS
            title="Pull to refresh"
            titleColor="#2563EB"
          />
        }
        ListHeaderComponent={
          <View className="px-4 py-2">
            {/* Location Row */}
            <View className="flex-row items-center mb-4">
              <Ionicons name="location" size={16} color="#2563EB" />
              <Text className="text-sm font-medium ml-2">Delhi, India</Text>
              <Ionicons name="chevron-down" size={16} color="#374151" />
            </View>

            {/* Search Bar */}
            <View className="relative mb-4">
              <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 py-2">
                <Ionicons name="search" size={16} color="#9CA3AF" />
                <TextInput
                  placeholder="Search apart, hotel, etc..."
                  className="flex-1 ml-2 text-sm"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={clearSearch} className="ml-2">
                    <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity className="w-10 h-10 bg-gray-600 rounded-2xl items-center justify-center ml-2">
                  <Ionicons name="options" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Results Info */}
            {searchQuery.length > 0 && (
              <View className="mb-2">
                <Text className="text-sm text-gray-500">
                  {filteredProperties.length} result
                  {filteredProperties.length !== 1 ? "s" : ""} for "
                  {searchQuery}"
                </Text>
              </View>
            )}

            {/* Tabs */}
            <FlatList
              horizontal
              data={tabs}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TabButton
                  title={item}
                  isSelected={selectedTab === item}
                  onPress={() => setSelectedTab(item)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <PropertyCard
              property={item}
              onPress={() => handleOpenCalendar(item)}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      {/* 
      <BookingCalendarBottomSheet
        isVisible={isCalendarVisible}
        onClose={handleCloseCalendar}
        onBookingConfirm={handleBookingConfirm}
        location={"Manhattan, New York, United States"}
      /> */}
      <BookingCalendarBottomSheet
        isVisible={isCalendarVisible}
        onClose={handleCloseCalendar}
        propertyId={"1"} // Make sure this is provided
        location="Your Location"
        onBookingConfirm={handleBookingConfirm}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
