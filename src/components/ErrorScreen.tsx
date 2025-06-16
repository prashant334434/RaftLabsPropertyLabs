import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorScreenProps {
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry }) => (
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
        onPress={onRetry}
        className="mt-4 px-6 py-3 bg-blue-600 rounded-lg"
      >
        <Text className="text-white font-medium">Retry</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export default ErrorScreen;
