// ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
    Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { styles } from './theme';
import { useNavigation } from '@react-navigation/native';
import Loading from './LoadingScreen'; // Adjust the path based on your project structure
import { API_URL } from './Api';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const onPressSendVerificationCode = async () => {
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
        } else {
            try {
                setIsLoading(true);

                // Send a request to the server to initiate the password reset
                const response = await API_URL.post('/send-verification-code', {
                    email,
                });

                setIsLoading(false);
                Alert.alert('Verification Code Sent', 'Check your email for the verification code.');
                navigation.navigate('ResetPassword', { email });
            } catch (error) {
                setIsLoading(false);
                Alert.alert('Account Doesnt Exist', 'Please Enter Registered Account');
                console.log('An unexpected error occurred:', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Loading /> // Use the LoadingScreen component when loading
            ) : (
                <>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{
                            position: 'absolute',
                            top: '5%',
                            left: 0,
                            right: 0,
                            bottom: '55%',
                            zIndex: 1,
                        }}
                    >

                        <LottieView
                            source={require('./assets/forgotpass.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                    </KeyboardAvoidingView>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.inputText}>Enter the email of the account you want to recover</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Email"
                            placeholderTextColor="#003f5c"
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <TouchableOpacity onPress={onPressSendVerificationCode} style={styles.loginBtn}>
                        <Text style={styles.btn_text}>Send Verification Code</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default ForgotPasswordScreen;
