import React from 'react';
import './src/config/firebaseConfig'; // This ensures Firebase is initialized
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import screen components
import SearchScreen from './screens/SearchScreen';
import SellScreen from './screens/SellScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrackingScreen from './screens/TrackingScreen';
import MockCarListScreen from './screens/MockCarListScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'; // Added Text for loading

const Tab = createBottomTabNavigator();
const TrackingStackNav = createNativeStackNavigator(); // Renamed for clarity from 'Stack'
const AuthStack = createNativeStackNavigator();

// Tracking Stack Navigator (nested in Tabs)
function TrackingStackNavigator() {
  return (
    <TrackingStackNav.Navigator>
      <TrackingStackNav.Screen
        name="TrackingList"
        component={TrackingScreen}
        options={{ title: 'Your Tracked Cars' }}
      />
      <TrackingStackNav.Screen
        name="MockCarList"
        component={MockCarListScreen}
        options={{ title: 'Discover Cars to Track' }}
      />
    </TrackingStackNav.Navigator>
  );
}

// Main App Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Tracking"
        component={TrackingStackNavigator}
        options={{
          tabBarLabel: 'Tracking',
          headerShown: false
        }}
      />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator (for login/signup flow)
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

// Root navigator component that decides which stack to show
function RootNavigator() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return currentUser ? <TabNavigator /> : <AuthStackNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
