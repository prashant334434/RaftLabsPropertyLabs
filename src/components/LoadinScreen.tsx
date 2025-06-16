import React from "react";
import { SafeAreaView, StatusBar } from "react-native";

import {
  HeaderSkeleton,
  PropertyCardSkeleton,
} from "./skeltonLoader/SkeltonLoader";

const LoadingScreen: React.FC = () => (
  <SafeAreaView className="flex-1 bg-white pt-12">
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <HeaderSkeleton />
    {[1, 2, 3, 4, 5].map((item) => (
      <PropertyCardSkeleton key={item} />
    ))}
  </SafeAreaView>
);

export default LoadingScreen;
