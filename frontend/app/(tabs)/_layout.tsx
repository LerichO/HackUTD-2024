import { Tabs } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { Platform, Animated, View, Dimensions } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const TAB_WIDTH = (Dimensions.get('window').width - 40) / state.routes.length;
  const INDICATOR_WIDTH = TAB_WIDTH * 0.5;
  const INDICATOR_PADDING = (TAB_WIDTH - INDICATOR_WIDTH) / 2;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index * TAB_WIDTH + INDICATOR_PADDING,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [state.index]);

  return (
    <Animated.View 
      style={{
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#1D3557',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
        position: 'absolute',
        bottom: Platform.select({
          ios: 40,
          default: 25,
        }),
        left: 20,
        right: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        transform: [{ translateY: floatAnim }]
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          height: 3,
          width: INDICATOR_WIDTH,
          backgroundColor: '#ffffff',
          bottom: 8,
          borderRadius: 3,
          transform: [{ translateX: slideAnim }],
        }}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <HapticTab
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                transform: [{
                  scale: isFocused ? 1.2 : 1
                }],
                opacity: isFocused ? 1 : 0.7,
              }}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused 
                  ? '#ffffff'
                  : 'rgba(255, 255, 255, 0.7)',
                size: 24,
              })}
            </Animated.View>
          </HapticTab>
        );
      })}
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarStyle: {
          display: 'none',
        },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.pie.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tax"
        options={{
          title: 'Tax',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="dollarsign.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'ChatBot',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="lightbulb.2.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}