import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import BookingCalendarBottomSheet, {
  BookNowBottomSheet,
} from "../components/BookingCalendarBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const { width } = Dimensions.get("window");

const PropertyDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { property } = route.params;
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleOpenCalendar = () => {
    setIsCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false);
  };

  const handleBookingConfirm = (bookingData) => {
    console.log("Booking confirmed:", bookingData);
    setIsCalendarVisible(false);
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const onImageScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setCurrentImageIndex(index);
  };
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openSheet = () => {
    bottomSheetRef.current?.present();
  };
  const userId = "user1";
  const description =
    "Welcome to your dream getaway! This beautiful property features " +
    property.features?.join(", ") +
    ". Whether you're planning a vacation, remote work week, or peaceful retreat, this place has it all. Experience the comfort of a luxury villa with breathtaking views and world-class amenities.";

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Image Carousel */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onImageScroll}
            scrollEventThrottle={16}
          >
            {property.images?.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width }}
                className="h-80"
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Top Controls */}
          <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black bg-opacity-30 rounded-full items-center justify-center"
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="text-white font-medium text-base">
              {property.title}
            </Text>

            <TouchableOpacity className="w-10 h-10 bg-black bg-opacity-30 rounded-full items-center justify-center">
              <Ionicons name="ellipsis-vertical" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Dots */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {property.images?.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </View>
        </View>
        <View className=" bottom-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-gray-900">
                ₹ {property.price}
              </Text>
              <Text className="text-base text-gray-500 ml-1">/month</Text>
            </View>

            <TouchableOpacity
              onPress={() => openSheet()}
              className="bg-blue-600 px-8 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold text-base">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Property Info */}
        <View className="px-4 pt-6">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            {property.title}
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            {property.location.city}, {property.location.state}
          </Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={14} color="#10B981" />
            <Text className="text-sm text-gray-500 ml-1">
              {property.location.address}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FBBF24" />
            <Text className="text-sm font-medium ml-1">4.8</Text>
            <Text className="text-sm text-gray-500 ml-1">(102 reviews)</Text>
          </View>

          {/* Features */}
          <View className="mt-4 flex-row flex-wrap">
            {property.features?.map((feature, index) => (
              <Text
                key={index}
                className="text-xs text-gray-500 mr-2 mb-2 bg-gray-100 px-2 py-1 rounded-full"
              >
                {feature}
              </Text>
            ))}
          </View>

          {/* Description with Read More */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </Text>
            <Text className="text-sm text-gray-600 leading-relaxed">
              {showFullDescription
                ? description
                : description.slice(0, 140) + "..."}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text className="text-blue-600 font-medium mt-1">
                {showFullDescription ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View className="mt-6 mb-12">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Location Address
            </Text>
            <MapView
              style={{ width: "100%", height: 180, borderRadius: 22 }}
              initialRegion={{
                latitude: property.location.coordinates.latitude,
                longitude: property.location.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: property.location.coordinates.latitude,
                  longitude: property.location.coordinates.longitude,
                }}
                title={property.title}
                description={property.location.address}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
      <BookingCalendarBottomSheet
        isVisible={isCalendarVisible}
        onClose={handleCloseCalendar}
        onBookingConfirm={handleBookingConfirm}
        propertyId={property.id} // Pass the selected property to bottom sheet
        location={"Manhattan, New York, United States"} // Use property location if available
      />
    </SafeAreaView>
  );
};

export default PropertyDetailsScreen;
