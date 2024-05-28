import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { styles } from "../../../theme";
import { API_URL } from "../../../Api";
import Toast from 'react-native-toast-message';
import Loading from "../../../LoadingScreen"

const Category = ({ route }) => {
  const email = route.params ? route.params.email : 'No email provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userAge, setUserAge] = useState(null);
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [inputAge, setInputAge] = useState('');
  const [attemptedCategories, setAttemptedCategories] = useState([]);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const categories = [
    'verbal_reasoning',
    'logical',
    'abstract_reasoning',
    'numerical_reasoning'
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const ageEndpoint = isGoogleSignedIn ? `/user-age-google/${email}` : `/user-age/${email}`;
        const categoriesEndpoint = isGoogleSignedIn ? `/attempted-categories-google/${email}` : `/attempted-categories/${email}`;
        const scoresEndpoint = isGoogleSignedIn ? `/category-scores-google/${email}` : `/category-scores/${email}`;

        const [ageResponse, categoriesResponse,scoresResponse] = await Promise.all([
          API_URL.get(ageEndpoint),
          API_URL.get(categoriesEndpoint),
          API_URL.get(scoresEndpoint)
        ]);

        if (ageResponse.data.age) {
          setUserAge(ageResponse.data.age);
        } else {
          setShowAgeInput(true);
        }

        if (categoriesResponse.data.attemptedCategories) {
          setAttemptedCategories(categoriesResponse.data.attemptedCategories);
        }
        if (scoresResponse.data.scores) {
          setScores(scoresResponse.data.scores.reduce((acc, { category, score }) => {
            if (score !== undefined) {
              acc[category] = score;
            }
            return acc;
          }, {}));
        }
        
      } catch (error) {
        console.error('Error fetching user details:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch user details. Please try again later.',
        });
      }
    };

    fetchUserDetails();
  }, [email, isGoogleSignedIn, isFocused]);

  const handleCategory = async (route, index) => {
    const reset = index === categories.length - 1;
    const endpoint = isGoogleSignedIn ? `/update-attempted-categories-google/${email}` : `/update-attempted-categories/${email}`;
    const scoreResetendpoint = isGoogleSignedIn ? `/update-category-score-google/${email}` : `/update-category-score/${email}`;

    try {
      const attemptedCategoriesCount = Object.keys(scores).length;
      if (attemptedCategoriesCount == 4) {
        setIsLoading(true);
        const iqEndpoint = isGoogleSignedIn ? `/calculate-IQ-google` : `/calculate-IQ`;
        const iqResponse = await API_URL.post(iqEndpoint, {
          verbal_reasoning: scores.verbal_reasoning,
          logical: scores.logical,
          abstract_reasoning: scores.abstract_reasoning,
          numerical_reasoning: scores.numerical_reasoning,
          email
        });
        const { iq } = iqResponse.data;
  
        // Show alert with IQ score
        Alert.alert(
          'IQ Score',
          `Your IQ score is ${iq}`,
          [
            {
              text: 'OK',
              onPress: async () => {
                // Reset attempted categories if all categories are done
                setAttemptedCategories([]);
                await API_URL.post(scoreResetendpoint, { reset: 1 });
                setIsLoading(false); // Move this here
              }
            }
          ],
          { cancelable: false }
        );
      }
  
      // Update attempted category for the current selection
      await API_URL.post(endpoint, { category: route, reset });
  
      navigation.navigate(route, { email, isGoogleSignedIn });
    } catch (error) {
      console.error('Error updating attempted category:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update attempted category. Please try again later.',
      });
      setIsLoading(false);
    }
  };
  

  const handleAgeSubmit = async () => {
    if (inputAge.trim() === '') {
      Alert.alert('Error', 'Please enter your age');
      return;
    }

    try {
      await API_URL.post(`/update-age/${email}`, { age: inputAge });
      setUserAge(inputAge);
      setShowAgeInput(false);
    } catch (error) {
      console.error('Error updating age:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update age. Please try again later.',
      });
    }
  };

  if (showAgeInput) {
    return (
      <View style={styles.p_container}>
        <Text style={styles.screen_title}>Enter Your Age</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            onChangeText={setInputAge}
            placeholder="Enter Your Age"
            value={inputAge}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity onPress={handleAgeSubmit} style={styles.btn}>
          <Text style={styles.btn_text}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Loading/>
        </View>
      )}
      <Text style={styles.screen_title}>Select a Category</Text>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={category}
          style={[styles.card, attemptedCategories.includes(category) && styles.disabledCard]}
          onPress={() => !attemptedCategories.includes(category) && handleCategory(category, index)}
          disabled={attemptedCategories.includes(category)}
        >
          <Text style={styles.cardText}>{category.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</Text>
          {attemptedCategories.includes(category) && <Text style={styles.attemptedText}>Attempted</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};


export default Category;
