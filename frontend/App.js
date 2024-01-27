import React, { useEffect, useState } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import Navigation from './Navigation';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const requestImagePickerPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work!');
      }
    };

    requestImagePickerPermission();

    // Simulate a delay for the splash screen
    const splashTimeout = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000); // 3000 milliseconds (3 seconds)

    // Clean up the timeout to prevent memory leaks
    return () => clearTimeout(splashTimeout);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isSplashVisible ? (
        <LottieView
          source={require('./assets/splashscreen.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => setIsSplashVisible(false)}
        />
      ) : (
        <Navigation />
      )}
    </View>
  );
};

// Register the component with AppRegistry
AppRegistry.registerComponent(appName, () => App);

export default App;
