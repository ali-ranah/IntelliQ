import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { styles } from './theme';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './Api';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    loadSavedUserInfo();
  }, []);

  const loadSavedUserInfo = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('rememberedEmail');
      const savedPassword = await AsyncStorage.getItem('rememberedPassword');

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Error loading saved user info:', error.message);
    }
  };

  const saveUserInfo = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberedPassword', password);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
      }
    } catch (error) {
      console.log('Error saving user info:', error.message);
    }
  };


  const onPressLogin = async () => {
    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
  
      if (password.length < 8) {
        Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
        return;
      }
      const response = await API_URL.post('/login', {
        email,
        password,
      });
  
      if (response.status === 200 && response.data && response.data.message === 'Login successful') {
        console.log(response.data.message);
  
        if (rememberMe) {
          await saveUserInfo();
        }
  
        const userName = response.data.name;
  
        navigation.navigate('Home', { email: email, name: userName });
      } else {
          Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
          console.log('Unexpected response:', response);
        }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Unauthorized', 'Invalid email or password.');
      } else if (error.response && error.response.status === 404) {
        Alert.alert('Not Found', 'Account does not exist.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
        console.log('An unexpected error occurred:', error.message);
      }
    }
  };
  

  const onPressForgotPassword = () => {
    navigation.navigate('Forgot');
  };

  const onPressSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <>
      <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          right: 0,
          bottom: '50%',
          marginBottom: '10%',
          zIndex: 1,
        }}
      >
        <LottieView
          source={require('./assets/login.json')}
          autoPlay
          loop
          style={styles.lottie}
        />

      </KeyboardAvoidingView>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={styles.checkbox}
          >
            {rememberMe ? (
              <Text style={styles.checkboxText}>✓</Text>
            ) : null}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </View>

        <TouchableOpacity onPress={onPressForgotPassword}>
          <Text style={styles.forgotAndSignUpText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
          <Text style={styles.btn_text}>Login </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressSignUp}>
          <Text style={styles.forgotAndSignUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default LoginScreen;
