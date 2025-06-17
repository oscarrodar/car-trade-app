import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screen components
import SearchScreen from './screens/SearchScreen';
// SavedScreen will be replaced by the TrackingStackNavigator
// import SavedScreen from './screens/SavedScreen';
import SellScreen from './screens/SellScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrackingScreen from './screens/TrackingScreen';
import MockCarListScreen from './screens/MockCarListScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // For the tracking stack

// New Stack Navigator for Tracking features
function TrackingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TrackingList"
        component={TrackingScreen}
        options={{ title: 'Your Tracked Cars' }}
      />
      <Stack.Screen
        name="MockCarList"
        component={MockCarListScreen}
        options={{ title: 'Discover Cars to Track' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Tracking" // Renamed from "Saved"
        component={TrackingStackNavigator}
        options={{
          tabBarLabel: 'Tracking',
          headerShown: false // Important for nested navigators
        }}
      />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
