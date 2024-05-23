import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../../theme";
import { API_URL } from "../../../Api";
import Toast from 'react-native-toast-message';

const Category = ({ route }) => {
  const email = route.params ? route.params.email : 'No email provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
  console.log('Email in Category screen:', email);
  const navigation = useNavigation();
  const [userAge, setUserAge] = useState(null);
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [inputAge, setInputAge] = useState('');

  useEffect(() => {
    const fetchUserAge = async () => {
      try {
        const endpoint = isGoogleSignedIn ? `/user-age-google/${email}` : `/user-age/${email}`;
        const response = await API_URL.get(endpoint);
        if (response.data.age) {
          setUserAge(response.data.age);
        } else {
          setShowAgeInput(true);
        }
      } catch (error) {
        console.error('Error fetching user age:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch user age. Please try again later.',
        });
      }
    };

    fetchUserAge();
  }, [email]);

  const handleCategory = () => {
    navigation.navigate('Mcqs', { email, isGoogleSignedIn });
  };

  const handleAgeSubmit = async () => {
    if (!inputAge) {
      Alert.alert('Please enter your age');
      return;
    }
    const age = parseInt(inputAge);
    if (age < 9 || age > 80) {
      Alert.alert('Invalid Age', 'Age must be between 9 and 80 and also should not contain special characters');
      return;
    }

    try {
      const endpoint = isGoogleSignedIn ? `/update-user-age-google/${email}` : `/update-user-age/${email}`;
      await API_URL.post(endpoint, {age});
      setUserAge(age);
      setShowAgeInput(false);
    } catch (error) {
      console.error('Error updating user age:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update user age. Please try again later.',
      });
    }
  };

  if (showAgeInput) {
    return (
      <View style={styles.p_container}>
        <Text style={styles.screen_title}>Enter Your Age</Text>
        {/* <View style={styles.profilePictureContainer}> */}
        <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={setInputAge}
          placeholder="Enter Your Age"
          value={inputAge}
          keyboardType="numeric"
        />
        </View>
        {/* </View> */}
        <TouchableOpacity onPress={handleAgeSubmit} style={styles.btn}>
          <Text style={styles.btn_text}>Submit</Text>
          </TouchableOpacity> 
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screen_title}>Select a Category</Text>
      <View style={styles.cardView}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={handleCategory}
          >
            <Text style={styles.cardText}>Verbal Reasoning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={handleCategory}
          >
            <Text style={styles.cardText}>Analytical</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={handleCategory}
          >
            <Text style={styles.cardText}>Pattern Recognition</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={handleCategory}
          >
            <Text style={styles.cardText}>Sequence</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Category;
