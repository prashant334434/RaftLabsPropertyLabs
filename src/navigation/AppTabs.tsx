// navigation/AppTab.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScreenRouter from "./ScreenRouter";
import BookingScreen from "../screens/BookingScreen";

export type TabParamList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Custom Tab Bar Icon Component with Animation
const AnimatedTabIcon = ({
  focused,
  iconName,
  label,
  color,
}: {
  focused: boolean;
  iconName: string;
  label: string;
  color: string;
}) => {
  const scale = useSharedValue(focused ? 1 : 0.95);
  const backgroundOpacity = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.05 : 0.95, {
      damping: 15,
      stiffness: 200,
    });
    backgroundOpacity.value = withTiming(focused ? 1 : 0, {
      duration: 300,
    });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center py-2 relative">
      {/* Active Background */}
      <Animated.View
        style={animatedBackgroundStyle}
        className="absolute  bg-blue-600 h-20 w-20 rounded-3xl  "
      />

      {/* Icon Container */}
      <Animated.View
        style={animatedIconStyle}
        className="items-center justify-center"
      >
        <View className="items-center justify-center mb-1">
          <Ionicons
            name={iconName as any}
            size={22}
            color={focused ? "#FFFFFF" : color}
          />
        </View>
        <Text
          className={`text-xs font-semibold ${
            focused ? "text-white" : "text-gray-500"
          }`}
          style={{ fontSize: 10 }}
        >
          {label}
        </Text>
      </Animated.View>
    </View>
  );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View className="absolute bottom-6 left-5 right-5 h-16 bg-white rounded-3xl shadow-lg border border-gray-100">
      <View className="flex-1 flex-row items-center px-2">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: string;
          let label: string;

          if (route.name === "Home") {
            iconName = isFocused ? "home" : "home-outline";
            label = "Home";
          } else if (route.name === "Bookings") {
            iconName = isFocused ? "calendar" : "calendar-outline";
            label = "Bookings";
          } else if (route.name === "Profile") {
            iconName = isFocused ? "person" : "person-outline";
            label = "Profile";
          } else {
            iconName = "help-outline";
            label = "Help";
          }

          return (
            <Animated.View key={route.key} className="flex-1">
              <Animated.View
                onTouchEnd={onPress}
                className="flex-1 items-center justify-center active:scale-95"
              >
                <AnimatedTabIcon
                  focused={isFocused}
                  iconName={iconName}
                  label={label}
                  color="#9CA3AF"
                />
              </Animated.View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const AppTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={ScreenRouter} />
      <Tab.Screen name="Bookings" component={BookingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppTab;
