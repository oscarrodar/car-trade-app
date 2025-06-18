// screens/auth/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext'; // Adjust path

type SignupScreenProps = {
  navigation: { navigate: (screenName: string) => void };
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth(); // Will be fully implemented later

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Actual signup logic will be called here in a later step
      await signup(email, password);
      // Navigation to main app will be handled by onAuthStateChanged listener
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Use similar styles as LoginScreen or define new ones
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 12, borderRadius: 5 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  linkText: { color: 'blue', textAlign: 'center', marginTop: 15 },
});

export default SignupScreen;
