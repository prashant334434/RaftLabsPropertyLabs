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
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProperties } from "../hooks/useProperties";
import PropertyCard from "../components/PropertyCard";
import BookingCalendarBottomSheet from "../components/BookingCalendarBottomSheet";
import LoadingScreen from "../components/LoadinScreen";
import ErrorScreen from "../components/ErrorScreen";
import HomeHeader from "../components/HomeHeader";

interface Property {
  id: string;
  title?: string;
  type?: string;
}

interface BookingData {
  startDate: string;
  endDate: string;
  guests: number;
}

const HomeScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Villa");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: properties, isLoading, isError, refetch } = useProperties();
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [displayCount, setDisplayCount] = useState<number>(5);

  const tabs: string[] = ["Villa", "Hotel", "Apart", "Resort"];

  const handleOpenCalendar = (property: Property): void => {
    console.log(property);
    setSelectedProperty(property);
    setIsCalendarVisible(true);
  };

  const handleCloseCalendar = (): void => {
    setIsCalendarVisible(false);
    setSelectedProperty(null);
  };

  const handleBookingConfirm = (bookingData: BookingData): void => {
    console.log("Booking confirmed:", bookingData);
    console.log("Selected property:", selectedProperty);
    setIsCalendarVisible(false);
    setSelectedProperty(null);
  };

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    setDisplayCount(5);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing properties:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const filteredProperties: Property[] =
    properties?.filter((property: Property) => {
      const matchesSearch =
        searchQuery === "" ||
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        selectedTab === "Villa" ||
        property.type?.toLowerCase() === selectedTab.toLowerCase();

      return matchesSearch && matchesTab;
    }) || [];

  const propertiesToShow: Property[] = filteredProperties.slice(
    0,
    displayCount
  );

  const clearSearch = (): void => {
    setSearchQuery("");
  };

  const renderItem: ListRenderItem<Property> = ({ item }) => (
    <View className="px-4">
      <PropertyCard property={item} onPress={() => handleOpenCalendar(item)} />
    </View>
  );

  if (isLoading && !refreshing) {
    return <LoadingScreen />;
  }

  if (isError && !refreshing) {
    return <ErrorScreen onRetry={onRefresh} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-12">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList<Property>
        data={propertiesToShow}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
            title="Pull to refresh"
            titleColor="#2563EB"
          />
        }
        ListHeaderComponent={
          <HomeHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={clearSearch}
            filteredProperties={filteredProperties}
            tabs={tabs}
            selectedTab={selectedTab}
            onTabPress={setSelectedTab}
          />
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <BookingCalendarBottomSheet
        isVisible={isCalendarVisible}
        onClose={handleCloseCalendar}
        propertyId={selectedProperty?.id}
        location={"Delhi ,India"}
        onBookingConfirm={handleBookingConfirm}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
