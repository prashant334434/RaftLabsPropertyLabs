import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabButtonProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  title,
  isSelected,
  onPress,
}) => (
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

interface Property {
  id: string;
  title?: string;
  type?: string;
}

interface HomeHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  filteredProperties: Property[];
  tabs: string[];
  selectedTab: string;
  onTabPress: (tab: string) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  filteredProperties,
  tabs,
  selectedTab,
  onTabPress,
}) => (
  <View className="px-4 py-2">
    <View className="flex-row items-center mb-4">
      <Ionicons name="location" size={16} color="#2563EB" />
      <Text className="text-sm font-medium ml-2">Delhi, India</Text>
      <Ionicons name="chevron-down" size={16} color="#374151" />
    </View>

    <View className="relative mb-4">
      <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 py-2">
        <Ionicons name="search" size={16} color="#9CA3AF" />
        <TextInput
          placeholder="Search apart, hotel, etc..."
          className="flex-1 ml-2 text-sm"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClearSearch} className="ml-2">
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity className="w-10 h-10 bg-gray-600 rounded-2xl items-center justify-center ml-2">
          <Ionicons name="options" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>

    {searchQuery.length > 0 && (
      <View className="mb-2">
        <Text className="text-sm text-gray-500">
          {filteredProperties.length} result
          {filteredProperties.length !== 1 ? "s" : ""} for "{searchQuery}"
        </Text>
      </View>
    )}

    <FlatList
      horizontal
      data={tabs}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TabButton
          title={item}
          isSelected={selectedTab === item}
          onPress={() => onTabPress(item)}
        />
      )}
      contentContainerStyle={{ paddingBottom: 8 }}
    />
  </View>
);

export default HomeHeader;
