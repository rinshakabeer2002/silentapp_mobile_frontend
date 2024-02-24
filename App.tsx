/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {StatusBar, useColorScheme} from 'react-native';
import {AppNavigation} from './src/screens/AppNavigation';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#F3F3F3',
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AppNavigation />
    </>
  );
}

export default App;
