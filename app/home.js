import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { v4 as uuidv4 } from 'uuid';
import { ref, set, update } from 'firebase/database';
import { database as db } from '../firebaseConfig';
import { EMPTY_BOARD } from '../utils';

const Home = () => {
  const [nickName, setNickName] = useState('');
  const [error, setError] = useState('');

  const [joinGameId, setJoinGameId] = useState('');
  const [newGameId, setNewGameId] = useState();

  useEffect(() => {
    setNewGameId(uuidv4());
  }, []);

  const handleCreateGame = () => {
    if (nickName === '') {
      setError('Add a nickname before joining a game!');
      return;
    }

    set(ref(db, 'games/' + newGameId), {
      x: nickName,
      currentTurn: 'x',
      winner: null,
      board: JSON.stringify(EMPTY_BOARD),
      activePlayers: 1,
      gameEnded: false,
    });

    router.navigate({
      pathname: '/game',
      params: { type: 'new', gameId: newGameId, nickName },
    });
  };

  const handleJoinGame = () => {
    if (nickName === '') {
      setError('Add a nickname before joining a game!');
      return;
    }
    if (joinGameId === '') {
      setError('No Game Code Provided! Ask your friend for one asap!');
      return;
    }
    update(ref(db, 'games/' + joinGameId), {
      o: nickName,
      activePlayers: 2,
    });

    router.navigate({
      pathname: '/game',
      params: { type: 'join', gameId: joinGameId, nickName },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TicTacToe</Text>
      <Text style={styles.error}>{error}</Text>
      <TextInput
        style={{ ...styles.textInput, marginBottom: 50 }}
        value={nickName}
        onChangeText={(v) => {
          if (v) {
            setError('');
          }
          setNickName(v);
        }}
        placeholder="Enter your nickname..."
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setJoinGameId}
        value={joinGameId}
        placeholder="Enter Game Code Here"
      />
      <TouchableOpacity onPress={handleJoinGame} style={styles.button}>
        <Text style={styles.buttonText}>Join Game</Text>
      </TouchableOpacity>
      <Text style={styles.header}>or</Text>
      <TouchableOpacity onPress={handleCreateGame} style={styles.button}>
        <Text style={styles.buttonText}>Create New Game</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  textInput: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '70%',
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  buttonText: {},
  button: {
    width: '70%',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
