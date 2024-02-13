import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const LeaderBoard = () => {
  const { userId } = useLocalSearchParams();

  const [users, setUsers] = useState([]);

  const query = collection(firestore, 'users');

  const createLeaderBoardUser = (user) => {
    const { nickName, gamesWon, gamesPlayed, uid } = user;
    const winningP = Math.ceil((gamesWon / gamesPlayed) * 100);
    return { nickName, winPercentage: winningP, userId: uid };
  };

  useEffect(() => {
    let temp = [];
    getDocs(query)
      .then((res) => {
        res.forEach((_) => temp.push(createLeaderBoardUser(_.data())));
      })
      .catch((err) => console.log('Error Occured in Leaderboard: ', err))
      .finally(() => {
        setUsers(temp.sort((a, b) => b.winPercentage - a.winPercentage));
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ ...styles.headerContainer }}>
        <Text style={styles.header}>Leaderboard</Text>
        <TouchableOpacity
          style={{
            ...styles.button,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => router.back()}
        >
          <AntDesign name="back" size={18} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {users.map((user) => (
          <View
            style={
              userId === user.userId
                ? { ...styles.listItem, borderColor: '#06ccb4' }
                : styles.listItem
            }
          >
            <Text key={user.uid}>{user.nickName}</Text>
            <Text key={user.uid}>{user.winPercentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    width: 390,
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    fontSize: 25,
    fontWeight: '700',
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
    width: '20%',
    borderWidth: 1,
    padding: 5,
    borderRadius: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  listContainer: { width: '100%', alignItems: 'center' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  highlight: {
    borderColor: '#06ccb4',
    borderWidth: 2,
  },
});
