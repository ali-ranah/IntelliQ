import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import axios from 'axios';
import { styles } from './theme';
import { API_URL } from './Api';

const SignUp = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoginScreenPresented, setLoginScreenPresented] = useState(false);
    const [isGoogleSignedIn, setGoogleSignedIn] = useState(false);
    const [googleEmail, setGoogleEmail] = useState('');
    const [googleName, setGoogleName] = useState('');

    GoogleSignin.configure({
        androidClientId: '461073606547-m953lmaap165ev8frka3a5id5ejtqmco.apps.googleusercontent.com', 
    });

    const onPressSignUp = async () => {
        console.log('Starting onPressSignUp');
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
        } else if (password.length < 8) {
            Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
        }
        else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(name)) {
            Alert.alert('Invalid Name', 'Name should contain only alphabets');
        }
        else if (/\s\s/.test(name)) {
            Alert.alert('Invalid Name', 'Shouldnot contain double spaces between Names');
        }
        else if (password === confirmPassword) {
            try {
                const response = await API_URL.post('/signup', {
                    name,
                    email,
                    password,
                });

                if (response && response.data) {
                    console.log(response.data.message);
                    navigation.navigate('Login');
                } else {
                    console.log('Unexpected response:', response);
                }
            } catch (error) {
                Alert.alert('Account Already Exists', 'Use A Different Email Address')
                console.log('An unexpected error occurred:', error.message);
            }
        } else {
            Alert.alert(
                'Passwords Do Not Match',
                'Please make sure the entered passwords match.',
                [{ text: 'OK' }]
            );
        }
    };

    const checkIfSignedIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const isSignedIn = await GoogleSignin.isSignedIn();
            setGoogleSignedIn(isSignedIn);
            setLoginScreenPresented(!isSignedIn);
        } catch (error) {
            console.error('Error checking sign-in status', error);
        }
    };

    const handleGoogleSignup = async () => {
        checkIfSignedIn();
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const googleEmail = userInfo.user.email;
            const googleName = userInfo.user.name;

            const response = await API_URL.post('/signupwithgoogle', {
                email: googleEmail,
                name: googleName
            });

            // Update the state and then navigate to 'Home'
            navigation.navigate('Home', { email: googleEmail, name: googleName, isGoogleSignedIn: true });
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    position: 'absolute',
                    top: '5%',
                    left: 0,
                    right: 0,
                    bottom: '58%',
                    marginBottom: '10%',
                    zIndex: 1,
                }}
            >
                <LottieView
                    source={require('./assets/signup.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />

            </KeyboardAvoidingView>
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Name"
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => setName(text)} />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email"
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => setEmail(text)} />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => setPassword(text)} />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Confirm Password"
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => setConfirmPassword(text)} />
                </View>
                <TouchableOpacity
                    onPress={onPressSignUp}
                    style={styles.signupbtn}>
                    <Text style={styles.btn_text}>Sign Up </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.googlebtn}
                    onPress={handleGoogleSignup}>
                    <Image style={styles.googlelogo} source={require('./assets/icons8-google-48.png')}></Image>
                    <Text style={styles.google_btn_text}>Sign Up With Google </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default SignUp;