// car-marketplace-app/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext'; // Adjust path as necessary

const ProfileScreen = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      // Navigation will be handled by the RootNavigator due to currentUser becoming null
    } catch (error: any) {
      console.error("Logout failed: ", error);
      Alert.alert("Logout Failed", error.message || "Could not log out at this time.");
      setLoading(false); // Only set loading false here if logout fails
    }
    // If logout is successful, onAuthStateChanged will set isLoading to false in AuthContext
    // and RootNavigator will switch screens. So, no need to setLoading(false) on success here.
  };

  if (!currentUser) {
    // This case should ideally not be reached if conditional navigation is working correctly
    // However, it's good for robustness during development or if navigation logic changes.
    // The AuthContext's isLoading state will prevent premature rendering of this screen
    // if currentUser is null during initial load.
    return (
      <View style={styles.container}>
        <Text>Loading user...</Text>
        {/* Or show an ActivityIndicator if preferred, but AuthContext handles global loading state */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.emailText}>Email: {currentUser.email}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.logoutButton} />
      ) : (
        <Button title="Logout" onPress={handleLogout} color="red" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 30,
  },
  logoutButton: {
    marginTop: 10, // To give some space if it's an ActivityIndicator
  }
});

export default ProfileScreen;
