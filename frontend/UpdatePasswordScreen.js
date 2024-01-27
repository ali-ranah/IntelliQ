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

const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const route = useRoute();
    const navigation = useNavigation();

    // Get the email from the route params
    const email = route.params?.email;

    const onPressUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Passwords Do Not Match', 'Please make sure the passwords match.');
            return;
        }

        try {
            // Send a request to the server to update the password
            const response = await API_URL.post('/update-password', {
                email,
                currentPassword,
                newPassword,
            });

            if (response && response.data && response.data.message === 'Password updated successfully') {
                Alert.alert('Success', 'Your password has been updated successfully.');
                // Navigate to the login screen or any other screen as needed
                navigation.goBack();
            } else {
                console.error('Unexpected response:', response);
                Alert.alert('Error', 'An unexpected error occurred while updating the password.');
            }
        } catch (error) {
            console.log('An unexpected error occurred:', error.message);
            Alert.alert('Error', 'An unexpected error occurred while updating the password.');
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
                    bottom: '50%',
                    zIndex: 1,
                    marginBottom: '10%'
                }}
            >
                <LottieView
                    source={require('./assets/updatepass.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />

            </KeyboardAvoidingView>
            <View style={styles.container}>
                <Text style={styles.title}>Update Password</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Current Password"
                        placeholderTextColor="#003f5c"
                        secureTextEntry
                        onChangeText={(text) => setCurrentPassword(text)}
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
                <TouchableOpacity onPress={onPressUpdatePassword} style={styles.loginBtn}>
                    <Text style={styles.btn_text}>Update Password</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default UpdatePassword;