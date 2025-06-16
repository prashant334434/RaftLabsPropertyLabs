import React from "react";
import { Animated, View, ViewStyle } from "react-native";

interface SkeletonLoaderProps {
  width: number | string;
  height: number;
  borderRadius?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  borderRadius = 8,
}) => {
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

  const style: ViewStyle = {
    width,
    height,
    backgroundColor: "#E5E7EB",
    borderRadius,
    opacity,
  };

  return <Animated.View style={style} />;
};

export const PropertyCardSkeleton: React.FC = () => (
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

export const HeaderSkeleton: React.FC = () => (
  <View className="px-4 py-2">
    <View className="flex-row items-center mb-4">
      <SkeletonLoader width={16} height={16} borderRadius={8} />
      <View className="ml-2">
        <SkeletonLoader width={120} height={16} borderRadius={4} />
      </View>
    </View>
    <View className="mb-4">
      <SkeletonLoader width="100%" height={40} borderRadius={20} />
    </View>
    <View className="flex-row mb-4">
      {[1, 2, 3, 4].map((item) => (
        <View key={item} className="mr-2">
          <SkeletonLoader width={60} height={32} borderRadius={16} />
        </View>
      ))}
    </View>
  </View>
);
