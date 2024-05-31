import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Card } from 'react-native-elements';
import { styles } from './theme';
import { API_URL } from './Api';
import Loading from './LoadingScreen';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const email = route.params ? route.params.email : 'No email provided';
    const name = route.params ? route.params.name : 'No name provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

    const [currentName, setCurrentName] = useState(name);
    const [isLoading, setIsLoading] = useState(true);
    const [UserAge, setUserAge] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        // Fetch user details and profile picture when the screen mounts
        fetchData();
    }, [route.params]);


    const handleUpdateName = () => {
        navigation.navigate('UpdateName', { email, currentName, isGoogleSignedIn });
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch user details and profile picture separately
            await fetchUserDetails();
            await fetchProfilePicture();
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const endpoint = isGoogleSignedIn ? '/user_details_google' : '/user_details';
            const response = await API_URL.post(endpoint, { email });
            setCurrentName(response.data.name);
            if (response.data.age) {
                setUserAge(response.data.age);
            }
        } catch (error) {
            console.log('An unexpected error occurred while fetching user details:', error.message);
        }
    };
    const fetchProfilePicture = async () => {
        try {
            const endpoint = isGoogleSignedIn ? `/get_profile_picture_google/${email}` : `/get_profile_picture/${email}`;
            const profilePictureResponse = await API_URL.get(endpoint);

            if (profilePictureResponse.data.profile_picture) {
                const base64Image = profilePictureResponse.data.profile_picture;
                // You can directly set the base64 string as the source for Image
                setProfilePicture({ uri: `data:image/jpeg;base64,${base64Image}` });
            } else {
                setProfilePicture(null);
            }
        } catch (error) {
            console.error('An unexpected error occurred while fetching profile picture:', error.message);
        }
    };

    const handleUploadProfilePicture = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [6, 7],
                quality: 1,
            });

            if (!result.canceled) {
                const formData = new FormData();
                formData.append('image', {
                    name: 'profile_picture.jpg',
                    type: 'image/jpeg',
                    uri: result.assets[0].uri,
                });

                // Construct the upload endpoint based on Google sign-in
                const uploadEndpoint = isGoogleSignedIn ? `/upload-google/${email}` : `/upload/${email}`;

                // Upload the profile picture using API_URL.post
                setIsLoading(true);
                await API_URL.post(uploadEndpoint, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setIsLoading(false);

                // Refresh user details and profile picture after upload
                fetchData();
            }
        } catch (error) {
            console.error('Error choosing/uploading profile picture:', error);
        }
    };


    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Loading />
                </View>
            ) : (
                <>
                    <View>
                        <Text style={styles.screen_title}>Profile</Text>
                    </View>
                    <Card containerStyle={styles.cardContainer}>

                        <View style={styles.profilePictureContainer}>
                            <Image source={profilePicture} style={styles.profilePicture} />
                        </View>
                        <View >
                            <View style={styles.profilePictureContainer}>
                                <Text style={styles.p_label}>Email:</Text>
                                <Text style={styles.p_text}>{email}</Text>
                            </View>

                            <View style={styles.profilePictureContainer}>
                                <Text style={styles.p_label}>Name:</Text>
                                <Text style={styles.p_text}>{currentName}</Text>
                            </View>
                            
                            <View style={styles.profilePictureContainer}>
                                <Text style={styles.p_label}>Age:</Text>
                                <Text style={styles.p_text}>{UserAge}</Text>
                            </View>
                            <View style={styles.profilePictureContainer}>
                                <TouchableOpacity style={styles.btn} onPress={handleUpdateName}>
                                    <Text style={styles.updatebuttonText}>Update Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={handleUploadProfilePicture}>
                                    <Text style={styles.updatebuttonText}>Upload Profile Picture</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Card>
                </>
            )
            }
        </View >
    );
};

export default ProfileScreen;