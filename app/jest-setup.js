import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    NavigationContainer: ({ children }) => children,
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }) => children,
      Screen: ({ children }) => children,
    }),
  };
});

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(() => jest.fn()),
  });
});

jest.mock('@react-native-firebase/app', () => {
  return {
    initializeApp: jest.fn(),
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Orbit: (props) => React.createElement(View, props),
    Zap: (props) => React.createElement(View, props),
    Terminal: (props) => React.createElement(View, props),
    Mail: (props) => React.createElement(View, props),
    Lock: (props) => React.createElement(View, props),
    LogIn: (props) => React.createElement(View, props),
    ArrowLeft: (props) => React.createElement(View, props),
    Key: (props) => React.createElement(View, props),
    Ship: (props) => React.createElement(View, props),
    UserCircle: (props) => React.createElement(View, props),
    UserPlus: (props) => React.createElement(View, props),
  };
});
