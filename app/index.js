import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import 'react-native-get-random-values';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.navigate({
          pathname: '/home',
          params: { userEmail: user.email, userId: user.uid },
        });
      } else {
        router.navigate('/welcome');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>TicTacToe</Text>
      <Text>If you see this, something is wrong. Restart the app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
