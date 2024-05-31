
import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform,Image
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './theme';
import ManageAccountScreen from './ManageAccountScreen';
import Scores from './Scores';
import Test from './IQTest';

const Tab = createMaterialBottomTabNavigator();

const iconImages = {
  Test: {
    dark: require('./assets/test-dark.png'),
  },
  Score: {
    dark: require('./assets/scores-dark.png'),
  },
  Account: {
    dark: require('./assets/account-dark.png'),
  },
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Use route params directly instead of state variables
  const email = route.params ? route.params.email : 'No email provided';
  const name = route.params ? route.params.name : '';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

  useEffect(() => {
    // You can still perform additional logic here if needed
  }, [route.params]);

  const handleTabPress = (tabName) => {
    navigation.navigate(tabName, { email, name,isGoogleSignedIn });
  };

  return (
    <>
     

      <Tab.Navigator
        shifting={true}
        activeColor="white"
        inactiveColor="#FFFFFF"
        barStyle={{ backgroundColor: '#fb5b5a' }}
      >
        <Tab.Screen
          name="Test"
          component={Test}
          options={{
            tabBarLabel: 'Test',
            tabBarIcon: ({ focused }) => (
              <Image
                source={iconImages.Test.dark}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? 'white' : 'black',
                }}
              />
            ),
          }}
          initialParams={{ email, name, isGoogleSignedIn }}
        />
        <Tab.Screen
          name="Score"
          component={Scores}
          options={{
            tabBarLabel: 'Score',
            tabBarIcon: ({ focused }) => (
              <Image
                source={iconImages.Score.dark}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? 'white' : 'black',
                }}
              />
            ),
          }}
          initialParams={{ email, name, isGoogleSignedIn }}
        />
        <Tab.Screen
          name="Account"
          component={ManageAccountScreen}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ focused }) => (
              <Image
                source={iconImages.Account.dark}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? 'white' : 'black',
                }}
              />
            ),
          }}
          initialParams={{ email, name, isGoogleSignedIn }}
        />
      </Tab.Navigator>
    </>
  );
};

export default HomeScreen;

