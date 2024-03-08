import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import axios from 'axios';
import { styles } from './theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from './Api';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const route = useRoute();
    const navigation = useNavigation();

    // Get the email from the route params
    const email = route.params?.email;
    const [verificationCode, setVerificationCode] = useState('');

    const onPressResetPassword = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            Alert.alert('Invalid Verification Code', 'Please enter a valid 6-digit verification code.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Passwords Do Not Match', 'Please make sure the passwords match.');
            return;
        }

        try {
            // Send a request to the server to update the password
            const response = await API_URL.post('/verify-code-and-update-password', {
                email,
                verificationCode,
                newPassword,
            });

            if (response && response.data) {
                Alert.alert('Password Reset Successful', 'Your password has been updated successfully.');
                // Navigate to the login screen or any other screen as needed
                navigation.navigate('Login');
            } else {
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            Alert.alert('Invalid Code', 'Please enter the correct Verification Code');
            console.log('An unexpected error occurred:', error.message);
        }
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: 0,
                    right: 0,
                    bottom: '55%',
                    zIndex: 1,
                    marginBottom: '10%'
                }}
            >
                <LottieView
                    source={require('./assets/verifycode.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />

            </KeyboardAvoidingView>
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Verification Code"
                        placeholderTextColor="#003f5c"
                        onChangeText={(text) => setVerificationCode(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="New Password"
                        placeholderTextColor="#003f5c"
                        secureTextEntry
                        onChangeText={(text) => setNewPassword(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Confirm Password"
                        placeholderTextColor="#003f5c"
                        secureTextEntry
                        onChangeText={(text) => setConfirmPassword(text)}
                    />
                </View>
                <TouchableOpacity onPress={onPressResetPassword} style={styles.loginBtn}>
                    <Text style={styles.btn_text}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ResetPassword;