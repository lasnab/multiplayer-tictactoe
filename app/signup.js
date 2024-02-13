import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getCurrentTimeZoneWithOffset } from '../utils';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!firstName || !lastName || !nickName || !email || !password) {
      setError('Error: All fields are required.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const timeZone = getCurrentTimeZoneWithOffset();
        const userRef = doc(firestore, 'users/', userCredential.user.uid);
        setDoc(userRef, {
          email: email,
          nickName: nickName,
          firstName: firstName,
          lastName: lastName,
          homeTimeZone: timeZone,
          streak: { lastGamePlayed: null, currentStreak: 0, longestStreak: 0 },
          gamesPlayed: 0,
          gamesWon: 0,
          gamesTied: 0,
        })
          .then((resp) => console.log(resp))
          .catch((err) => {
            console.log(err);
          })
          .finally(setError(''));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          setError('The password is too weak.');
        } else if (errorCode === 'auth/email-already-in-use') {
          setError('The email address is already in use.');
        } else {
          console.error('Error during sign-up:', error);
          setError('An error occurred. Please try again later.');
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Lets Get Your Details</Text>
      <Text style={styles.error}>{error}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          style={{
            ...styles.textInput,
            flex: 0.5,

            marginHorizontal: 5,
          }}
          label="First Name"
          placeholder="Enter your first name"
          onChangeText={setFirstName}
          value={firstName}
        />
        <TextInput
          style={{
            ...styles.textInput,
            flex: 0.5,

            marginHorizontal: 5,
          }}
          label="Last Name"
          placeholder="Enter your last name"
          onChangeText={setLastName}
          value={lastName}
        />
      </View>

      <TextInput
        style={styles.textInput}
        label="Nickname"
        placeholder="Enter your nick name"
        onChangeText={setNickName}
        value={nickName}
      />
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
    marginBottom: 10,
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
    margin: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUp;
