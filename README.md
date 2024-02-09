# React Native TicTacToe Game

This mobile application is a simple TicTacToe game built using React Native and Expo. It incorporates Firebase Authentication for user authentication and Firebase Realtime Database for real-time updates during gameplay.

## Getting Started

### Project Planning

Given the short turnaround for this project, things had to move quick, so this is a light overveiw of some of the steps I took to keep things moving fast.

1. Put the prompt in chatgpt and generate specifications.
2. Based on that info, sketch out a wireframe of the most basic app that fulfills all the requirements
3. Based on this wireframe, feed it into chatgpt and generate 'tickets' for work.
4. Look for exisitng solutions and see how they implement it.
5. Use existing projects as reference, and build on top of it.
   - https://github.com/Savinvadim1312/TicTacToe
   - https://medium.com/@anujguptawork/building-an-online-multiplayer-game-using-react-native-and-firebase-overview-dd01bebf2d58

### Prerequisites

- Node.js and npm installed on your machine.
- Expo CLI installed

### Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/lasnab/tictactoe-app.git
```

2. Navigate to the project directory:

```bash
cd tictactoe-app
```

3. Install dependencies:

```bash
npm install
```

### Running the App

#### Simulator/Emulator

```bash
npm start
```

Sometimes expo has issues with caching. In that case use -

```bash
npx expo start -c
```

This will open the Expo Developer Tools in your browser. You can run the app on an emulator/simulator from there.

#### Physical Device

Ensure you have the Expo Go app installed on your device.

1. Scan the QR code displayed in the Expo Developer Tools with your device's camera.
2. Open the notification or follow the prompt to open the app in Expo Go.

## Features

- Create a game and invite others.
- Join a game using an invitation code.
- Play TicTacToe in real-time with Firebase updates.
- User authentication with Firebase.

## Technologies Used

- React Native
- Expo
- Firebase Authentication
- Firebase Realtime Database

## Future Improvements

Given I haven't touched react native in 3 years, I feel proud of my progress so far. However, there are always improvements that can be made. Here are some that I would implement next in order to make the app more polished -

- More organized data schema to encapsulate game information in an efficient manner
- Signout Button
- Authentication Session (Using Context API or Expo)
- Game Session (Handling A Case When either user exits game prematurely)
  - Notify the user still in session to say that other user logged out/quit
  - Could use some kind of polling (lastActive field for each user that updates every couple ms)
  - Delete the current created game (so as to not pollute the db)
- Styling
- Onboarding and saving nickname as part of the user identity
  - Link firebase auth with another user table that maintains list of user details
- Friend lists and invite
- Manual mode - Two players can play on the same device, one after the other (no db)
- Better error handling
  - Slight issues with db can cause the app to blow up, causing log out/log in
- Scoring system
  - Will probably have to modify the schema for this to keep track of scores for games played
  - Alternatively can use existing schema and run a search query for all games played between two given platers and aggregate scores for each
