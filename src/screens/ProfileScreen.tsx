import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../hooks/useProfile";

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { data: profile, isLoading, isError } = useProfile();
  if (isLoading) return <ActivityIndicator />;
  if (isError) return <Text>Error loading profile</Text>;
  const menuItems = [
    {
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Update your personal information",
    },

    {
      icon: "time-outline",
      title: "Booking History",
      subtitle: "View all your past bookings",
    },

    {
      icon: "help-circle-outline",
      title: "Help & Support",
      subtitle: "Get help and contact us",
    },
  ];
  console.log(profile);
  return (
    <SafeAreaView className="flex-1 bg-white py-12">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-6 items-center border-b border-gray-100">
          <View className="relative mb-4">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=70",
              }}
              className="w-24 h-24 rounded-full"
              resizeMode="cover"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-1">
            {profile?.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">{profile?.email}</Text>

          <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
            <Ionicons name="star" size={14} color="#FBBF24" />
            <Text className="text-sm font-medium text-blue-700 ml-1">
              Premium Member
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-4 py-6">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {profile?.bookings}
              </Text>
              <Text className="text-sm text-gray-500">Total Bookings</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-gray-900">8</Text>
              <Text className="text-sm text-gray-500">Countries Visited</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-gray-900">4.9</Text>
              <Text className="text-sm text-gray-500">Rating</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Settings
          </Text>

          {/* Notifications Toggle */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#2563EB"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Push Notifications
                </Text>
                <Text className="text-sm text-gray-500">
                  Receive booking updates
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#E5E7EB", true: "#DBEAFE" }}
              thumbColor={notificationsEnabled ? "#2563EB" : "#9CA3AF"}
            />
          </View>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4 border-b border-gray-100"
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Ionicons name={item.icon} size={20} color="#374151" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-500">{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity className="flex-row items-center py-4 mt-4">
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text className="text-base font-medium text-red-600">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
