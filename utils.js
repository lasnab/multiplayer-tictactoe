import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

export const EMPTY_BOARD = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

export const maybeWinner = (board) => {
  // check rows
  for (let i = 0; i < 3; i++) {
    const isRowXWinning = board[i].every((cell) => cell === 'x');
    const isRowOWinning = board[i].every((cell) => cell === 'o');

    if (isRowXWinning) {
      return 'x';
    }
    if (isRowOWinning) {
      return 'o';
    }
  }

  // check columns
  for (let col = 0; col < 3; col++) {
    let isColumnXWinner = true;
    let isColumnOWinner = true;

    for (let row = 0; row < 3; row++) {
      if (board[row][col] !== 'x') {
        isColumnXWinner = false;
      }
      if (board[row][col] !== 'o') {
        isColumnOWinner = false;
      }
    }

    if (isColumnXWinner) {
      return 'x';
    }
    if (isColumnOWinner) {
      return 'o';
    }
  }

  // check diagonals
  let isDiagonal1OWinning = true;
  let isDiagonal1XWinning = true;
  let isDiagonal2OWinning = true;
  let isDiagonal2XWinning = true;
  for (let i = 0; i < 3; i++) {
    if (board[i][i] !== 'o') {
      isDiagonal1OWinning = false;
    }
    if (board[i][i] !== 'x') {
      isDiagonal1XWinning = false;
    }

    if (board[i][2 - i] !== 'o') {
      isDiagonal2OWinning = false;
    }
    if (board[i][2 - i] !== 'x') {
      isDiagonal2XWinning = false;
    }
  }

  if (isDiagonal1OWinning || isDiagonal2OWinning) {
    return 'o';
  }
  if (isDiagonal1XWinning || isDiagonal2XWinning) {
    return 'x';
  }
};

export const getCurrentTimeZoneWithOffset = () => {
  const date = new Date();
  const timeZoneOffsetInMinutes = date.getTimezoneOffset();

  // Convert the offset to hours and minutes
  const offsetHours = Math.floor(Math.abs(timeZoneOffsetInMinutes) / 60);
  const offsetMinutes = Math.abs(timeZoneOffsetInMinutes) % 60;

  // Determine if the offset is positive or negative
  const offsetSign = timeZoneOffsetInMinutes > 0 ? '-' : '+';

  // Format the offset string as 'GMT+HH:MM' or 'GMT-HH:MM'
  const offsetString = `GMT${offsetSign}${String(offsetHours).padStart(
    2,
    '0'
  )}:${String(offsetMinutes).padStart(2, '0')}`;

  return offsetString;
};

const isLastGamePlayedYesterday = (lastGamePlayed, homeTimeZone) => {
  const currentDate = new Date();
  const lastGameDate = new Date(lastGamePlayed);

  // Adjust the last game date to the user's home timezone
  const homeTimeZoneOffset = parseInt(homeTimeZone.substring(4), 10);
  const lastGameDateInHomeTimeZone = new Date(
    lastGameDate.getTime() + homeTimeZoneOffset * 60 * 1000
  );

  // Check if the last game was played yesterday in the user's current timezone
  return (
    currentDate.getDate() - lastGameDateInHomeTimeZone.getDate() === 1 &&
    currentDate.getMonth() === lastGameDateInHomeTimeZone.getMonth() &&
    currentDate.getFullYear() === lastGameDateInHomeTimeZone.getFullYear()
  );
};

export const handleStreakOnGameEnd = (userId) => {
  console.log('IN HANDLE STREAK GAME END');
  console.log({ userId });
  const userRef = doc(firestore, 'users/', userId);
  getDoc(userRef)
    .then((res) => {
      console.log('og data ', res.data());
      const {
        homeTimeZone,
        streak: { currentStreak, lastGamePlayed, longestStreak },
      } = res.data();
      console.log(isLastGamePlayedYesterday(lastGamePlayed, homeTimeZone));
      console.log({ updatedStreak });
      const didPlayYesterday = isLastGamePlayedYesterday(
        lastGamePlayed,
        homeTimeZone
      );
      const updatedStreak = {
        currentStreak: didPlayYesterday ? currentStreak + 1 : 1,
        lastGamePlayed: new Date().toISOString(),
        longestStreak:
          currentStreak > longestStreak ? currentStreak + 1 : longestStreak,
      };
      setDoc(
        userRef,
        {
          streak: updatedStreak,
        },
        { merge: true }
      )
        .then((res) => {
          console.log('updated data: ', res.data());
        })
        .finally(() => {
          return;
        });
    })
    .finally(() => {
      return;
    });
};
