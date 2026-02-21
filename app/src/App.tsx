import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Screens
import WelcomeScreen from './screens/Auth/WelcomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import SignupScreen from './screens/Auth/SignupScreen';
import JoinFleetScreen from './screens/Auth/JoinFleetScreen';
import CreateProfileScreen from './screens/Auth/CreateProfileScreen';
import CommandDeck from './screens/CommandDeck';
import RosterScreen from './screens/RosterScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  JoinFleet: undefined;
  CreateProfile: undefined;
  CommandDeck: undefined;
  Roster: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  function onAuthStateChanged(userIn: FirebaseAuthTypes.User | null) {
    setUser(userIn);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0B0B0B' },
          }}
        >
          {user ? (
            /* Authenticated Stack */
            <>
              <Stack.Screen name="CommandDeck" component={CommandDeck} />
              <Stack.Screen name="Roster" component={RosterScreen} />
              <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
            </>
          ) : (
            /* Unauthenticated Stack */
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="JoinFleet" component={JoinFleetScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
