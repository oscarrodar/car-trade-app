// screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext'; // Adjust path as needed

// Navigation prop type - will be refined when integrated with navigator
type LoginScreenProps = {
  navigation: { navigate: (screenName: string) => void };
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Will be fully implemented later

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Actual login logic will be called here in a later step
      await login(email, password);
      // Navigation to main app will be handled by onAuthStateChanged listener
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.socialLoginContainer}>
        <Text style={styles.socialLoginText}>Or login with:</Text>
        {/* Placeholder buttons for social logins */}
        <Button title="Google (Placeholder)" onPress={() => {}} />
        <Button title="Apple (Placeholder)" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 12, borderRadius: 5 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  linkText: { color: 'blue', textAlign: 'center', marginTop: 15 },
  socialLoginContainer: { marginTop: 30, alignItems: 'center' },
  socialLoginText: { marginBottom: 10, fontSize: 16 },
});

export default LoginScreen;
