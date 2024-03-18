import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { styles } from './theme';
import { API_URL } from './Api';

const UpdateNameScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const email = route.params ? route.params.email : 'No email provided';
    const currentName = route.params ? route.params.currentName : '';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In'
    const [newName, setNewName] = useState(currentName);
    console.log('Google Signed In?:', isGoogleSignedIn);

    const handleUpdateName = async () => {
        try {

            if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(newName)) {
                Alert.alert('Invalid Name', 'Name should contain only alphabets');
            }
            else if (/\s\s/.test(newName)) {
                Alert.alert('Invalid Name', 'Shouldnot contain double spaces between Names');
            }
            // Choose the appropriate API endpoint based on Google sign-in
            else {
                const endpoint = route.params.isGoogleSignedIn
                    ? '/update-name-google'
                    : '/update-name';

                // Make API call to update the name
                await API_URL.post(endpoint, {
                    email,
                    newName,
                });

                // Navigate back to the previous screen
                navigation.navigate('Profile', { email, newName, isGoogleSignedIn });
            }
        } catch (error) {
            console.log('An unexpected update error occurred:', error.message);
        }
    };

    return (
        <View style={styles.p_container}>
            <Text style={styles.screen_title}>Update Name</Text>
            <View style={styles.profilePictureContainer}>
                <Text style={styles.p_label}>Current Name</Text>
                <Text style={styles.p_text}>{currentName}</Text>
            </View>
            <Text style={styles.p_label}>New Name</Text>

            <View style={styles.inputView}>

                <TextInput
                    style={styles.inputText}
                    placeholder="Enter new name"
                    placeholderTextColor='white'
                    onChangeText={(text) => setNewName(text)}
                />
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateName}>
                <Text style={styles.updatebuttonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateNameScreen;
