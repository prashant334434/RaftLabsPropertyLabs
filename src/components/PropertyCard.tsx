import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BookingCalendarBottomSheet, {
  BookNowBottomSheet,
} from "./BookingCalendarBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const PropertyCard = ({ property, onPress }) => {
  const [favorites, setFavorites] = useState({});
  const navigation = useNavigation();
  const modalRef = useRef(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openSheet = () => {
    bottomSheetRef.current?.present();
  };
  const userId = "user1";
  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("PropertyDetailsScreen", { property })}
      className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Property Image */}
      <View className="relative">
        <Image
          source={{ uri: property.images?.[0] }}
          className="w-full h-48 rounded-t-2xl"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => toggleFavorite(property.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons
            name={favorites[property.id] ? "heart" : "heart-outline"}
            size={16}
            color={favorites[property.id] ? "#EF4444" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>

      {/* Property Details */}
      <View className="p-4">
        <Text className="font-semibold text-base mb-1 leading-tight">
          {property.title}
        </Text>

        <Text className="text-gray-600 text-sm mb-1">
          ₹ {property.price} / month
        </Text>

        <Text className="text-gray-500 text-sm mb-3">
          {property.location?.address}, {property.location?.city},{" "}
          {property.location?.state}
        </Text>

        {/* Features */}
        <View className="flex-row flex-wrap mb-2">
          {property.features?.slice(0, 3).map((feature, index) => (
            <Text
              key={index}
              className="text-xs text-gray-500 mr-2 mb-1 bg-gray-100 px-2 py-1 rounded-full"
            >
              {feature}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onPress(true)}
          className="px-4 py-2 rounded-lg items-center justify-center bg-blue-600 mt-2"
        >
          <Text className="text-sm font-medium text-white">Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
