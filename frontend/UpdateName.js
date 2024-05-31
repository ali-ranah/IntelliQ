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
    const [newAge, setNewAge] = useState(null);
    console.log('Google Signed In?:', isGoogleSignedIn);

    const handleUpdateDetails = async () => {
        try {
            if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(newName)) {
                Alert.alert('Invalid Name', 'Name should contain only alphabets');
            }
            else if (/\s\s/.test(newName)) {
                Alert.alert('Invalid Name', 'Should not contain double spaces between Names');
            }
            else if (newAge && (newAge < 9 || newAge > 80)) {
                Alert.alert('Invalid Age', 'Age must be between 9 and 80 and also should not contain special characters');
            }
            else {
                let endpoint = route.params.isGoogleSignedIn
                    ? '/update-details-google'
                    : '/update-details';
    
                // Prepare the data to be sent in the request body
                const requestData = { email, newName };
    
                if (newAge) {
                    requestData.newAge = newAge;
                }
    
                // Make API call to update the name and age
                await API_URL.post(endpoint, requestData);
    
                // Navigate back to the previous screen
                navigation.navigate('Profile', { email, newName, isGoogleSignedIn });
            }
        } catch (error) {
            console.error('An unexpected update error occurred:', error.message);
        }
    };
    
    return (
        <View style={styles.p_container}>
            <Text style={styles.screen_title}>Update Details</Text>
            <View style={styles.profilePictureContainer}>
                <Text style={styles.p_label}>Current Name</Text>
                <Text style={styles.p_text}>{currentName}</Text>
            </View>
            <Text style={styles.p_label}>New Name</Text>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter new Name"
                    onChangeText={(text) => setNewName(text)}
                />
            </View>
            <Text style={styles.p_label}>New Age</Text>

<View style={styles.inputView}>

<TextInput
          style={styles.inputText}
          placeholder="Enter Your Age"
          onChangeText={(text) => {
            const age = parseInt(text);
            setNewAge(isNaN(age) ? null : age);
        }}
          keyboardType="numeric"
        />
</View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateDetails}>
                <Text style={styles.updatebuttonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateNameScreen;
