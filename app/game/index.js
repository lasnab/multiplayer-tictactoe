import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Vibration,
  Alert,
  Clipboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { database as db } from '../../firebaseConfig';
import { ref, onValue, set, get } from 'firebase/database';
import { EMPTY_BOARD, handleStreakOnGameEnd, maybeWinner } from '../../utils';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function GameBoard() {
  const { type, gameId, nickName: currPlayer, userId } = useLocalSearchParams();

  const yourMove = type === 'new' ? 'x' : 'o';
  const otherMove = type === 'new' ? 'o' : 'x';
  const [players, setPlayers] = useState({ you: currPlayer, other: '' });

  const [winner, setWinner] = useState('');
  const [isTied, setIsTied] = useState(false);

  const [disableInput, setDisableInput] = useState(true);
  const [activePlayers, setActivePlayers] = useState(1);

  const [board, setBoard] = useState(EMPTY_BOARD);
  const [currentTurn, setCurrentTurn] = useState('x');
  const [gameEnded, setGameEnded] = useState(false);

  const boardRef = ref(db, 'games/' + gameId + '/board');
  const currentPlayerRef = ref(db, 'games/' + gameId + '/currentTurn');
  const activePlayersRef = ref(db, 'games/' + gameId + '/activePlayers');
  const otherRef = ref(db, 'games/' + gameId + '/' + otherMove);
  const gameEndedRef = ref(db, 'games/' + gameId + '/gameEnded');
  const winnerRef = ref(db, 'games/' + gameId + '/winner');

  //   Update firebase store
  const updateBoard = (board) => {
    set(boardRef, JSON.stringify(board));
    setBoard(board);
  };

  const updateCurrentTurn = (turn) => {
    set(currentPlayerRef, turn);
    setCurrentTurn(turn);
  };

  const updateGameEnded = (val) => {
    set(gameEndedRef, val);
    setGameEnded(val);
  };

  //   Sync with datastore
  useEffect(() => {
    onValue(boardRef, (snapshot) => {
      const updatedBoard = JSON.parse(snapshot.val());
      setBoard(updatedBoard);
    });
    onValue(currentPlayerRef, (snapshot) => {
      const updatedCurrentPlayer = snapshot.val();
      setCurrentTurn(updatedCurrentPlayer);
    });
    onValue(activePlayersRef, (snapshot) => {
      if (snapshot.val() === 2) {
        setDisableInput(false);
        setActivePlayers(snapshot.val());
      }
    });
    onValue(otherRef, (snapshot) => {
      if (snapshot) {
        setPlayers({ ...players, other: snapshot.val() });
      }
    });
    onValue(gameEndedRef, (snapshot) => {
      if (snapshot) {
        setGameEnded(snapshot.val());
      }
    });
  }, []);

  //   Control game play
  useEffect(() => {
    setDisableInput(yourMove !== currentTurn);
    const winner = maybeWinner(board);
    if (winner) {
      if (winner === yourMove) {
        let winningPlayer = currPlayer;
        set(winnerRef, winningPlayer).then(updateGameEnded(true));
      }
    } else {
      isGameTied(board);
    }
  }, [board, currentTurn]);

  //   Check if game tied
  const isGameTied = (board) => {
    if (!board.some((row) => row.some((cell) => cell === ''))) {
      setIsTied(true);
      updateGameEnded(true);
    }
  };

  useEffect(() => {
    if (gameEnded) {
      get(winnerRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setWinner(snapshot.val());
          } else {
            setWinner(players.other);
          }
          handleStreakOnGameEnd(userId);
        })
        .finally(
          setTimeout(
            () =>
              router.navigate({
                pathname: '/home',
                params: { userId: userId },
              }),
            3000
          )
        );
    }
  }, [gameEnded]);

  const handleGameMove = (rowIndex, columnIndex) => {
    Vibration.vibrate();
    if (board[rowIndex][columnIndex] !== '') {
      Alert.alert('Position already occupied');
      return;
    }
    let temp = [...board];
    temp[rowIndex][columnIndex] = currentTurn;
    updateBoard(temp);
    updateCurrentTurn(currentTurn === 'x' ? 'o' : 'x');
  };

  const copyToClipboard = () => {
    Clipboard.setString(gameId);
  };

  if (gameEnded) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Game Ended</Text>
        <Text style={{ ...styles.header, textTransform: 'uppercase' }}>
          {isTied
            ? 'It was a Tie!'
            : winner === currPlayer
            ? 'You Won :)'
            : `You Lost :( ${winner} won!`}
        </Text>
        <Text>Redirecting you back in a few seconds...</Text>
        <ConfettiCannon count={300} origin={{ x: -10, y: 0 }} />
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      pointerEvents={disableInput ? 'none' : 'auto'}
    >
      {disableInput && (
        <View style={styles.disabled}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.disabledText}>
              Waiting for {activePlayers === 1 ? 'other' : players.other}{' '}
              {activePlayers === 1 ? 'to join game' : 'to make move'}
            </Text>
          </View>
        </View>
      )}
      <Link style={styles.button} href="/home">
        Menu
      </Link>
      <Text style={{ marginBottom: 4 }}>Click Below To Copy Game ID</Text>
      <TouchableOpacity
        style={styles.copyButton}
        onPress={() => copyToClipboard()}
      >
        <MaterialCommunityIcons name="content-copy" size={24} color="black" />
        <Text style={{ fontSize: 14 }}>{gameId}</Text>
      </TouchableOpacity>
      <Board board={board} handleGameMove={handleGameMove} />
      <View style={styles.scoreInfo}>
        <View style={styles.score}>
          <Text style={{ fontSize: 20 }}>{players.you}(You)</Text>
          {yourMove === 'o' && <Entypo name="circle" size={40} color="black" />}
          {yourMove === 'x' && <Entypo name="cross" size={60} color="black" />}
        </View>
        <View style={styles.score}>
          <Text style={{ fontSize: 20 }}>{players.other}(Other)</Text>
          {otherMove === 'o' && (
            <Entypo name="circle" size={40} color="black" />
          )}
          {otherMove === 'x' && <Entypo name="cross" size={60} color="black" />}
        </View>
      </View>
      <View style={{ ...styles.score, flex: 0.3 }}>
        <Text style={{ fontSize: 20 }}>
          {yourMove === currentTurn ? 'Your' : players.you + "'s"} Move
        </Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'black',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameId: { fontSize: 14, marginBottom: 24 },
  scoreInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
  },
  buttons: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  button: {
    width: '30%',
    textAlign: 'center',
    marginBottom: 50,
    fontSize: 16,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  copyButton: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
  },
  disabled: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 8,
  },
  disabledText: {
    marginTop: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

const Board = ({ board, handleGameMove }) => {
  // 450
  // transform: [{ rotate: '45deg' }],

  return (
    <View style={boardStyles.board}>
      {/* <View style={boardStyles.winLine} /> */}
      {board.map((r, ridx) => (
        <View key={`${r}-${ridx}`} style={boardStyles.row}>
          {r.map((c, cidx) => (
            <View key={`${c}-${cidx}`} style={boardStyles.column}>
              <Pressable
                onPress={() => handleGameMove(ridx, cidx)}
                style={boardStyles.pressable}
              >
                {c === 'o' && <Entypo name="circle" size={60} color="black" />}
                {c === 'x' && <Entypo name="cross" size={90} color="black" />}
              </Pressable>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const boardStyles = StyleSheet.create({
  board: {
    width: '85%',
    aspectRatio: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: 'grey',
  },

  row: { flex: 1, flexDirection: 'row' },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: '1px',
    width: '100%',
    height: '100%',
  },
  pressable: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  winLine: {
    position: 'absolute',
    height: '100%',
    width: 6,
    borderRadius: 10,
    backgroundColor: 'red',
    zIndex: 1000,
  },
});
