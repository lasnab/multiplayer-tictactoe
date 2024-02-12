import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

const WelcomeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    // Basic data validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setError('');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          setError('Invalid email or password.');
        } else if (errorCode === 'auth/user-not-found') {
          setError('User not found. Please create an account.');
        } else {
          console.error('Error during sign-in:', error);
          setError('An error occurred. Please try again later.');
        }
      });
  };

  const handleSignUp = () => {
    router.navigate('/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Tic Tac Toe</Text>
      <Text style={styles.error}>{error}</Text>
      <TextInput
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.textInput}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <Text style={{ ...styles.header, marginBottom: 0, fontWeight: 'normal' }}>
        or
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text>Create Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  text: {
    marginBottom: 12,
  },
  textInput: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    width: '50%',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WelcomeScreen;
