import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './screens/Auth/WelcomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import JoinFleetScreen from './screens/Auth/JoinFleetScreen';
import CreateProfileScreen from './screens/Auth/CreateProfileScreen';
import CommandDeck from './screens/CommandDeck';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  JoinFleet: undefined;
  CreateProfile: undefined;
  CommandDeck: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0B0B0B' },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="JoinFleet" component={JoinFleetScreen} />
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
          <Stack.Screen name="CommandDeck" component={CommandDeck} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
