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
