/**
 * Astra App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CommandDeck from './screens/CommandDeck';

function App() {
  return (
    <SafeAreaProvider>
      <CommandDeck />
    </SafeAreaProvider>
  );
}

export default App;
