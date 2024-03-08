import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import SignUp from './SignUpScreen';
import Scores from './Scores';
import ManageAccountScreen from './ManageAccountScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ResetPassword from './ResetPasswordScreen'
import ProfileScreen from './ProfileScreen';
import UpdateNameScreen from './UpdateName';
import Mcqs from './McqsScreen';
import Loading from './LoadingScreen';
import Logout from './Logout';
import UpdatePassword from './UpdatePasswordScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scores" component={Scores} options={{ headerShown: false }} />
        <Stack.Screen name="Manage" component={ManageAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateName" component={UpdateNameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ headerShown: false }} />
        <Stack.Screen name="Mcqs" component={Mcqs} options={{ headerShown: false }} />
        <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
        <Stack.Screen name="Logout" component={Logout} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;


