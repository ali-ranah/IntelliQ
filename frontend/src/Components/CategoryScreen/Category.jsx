import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { styles } from "../../../theme";
import { API_URL } from "../../../Api";
import Toast from 'react-native-toast-message';
import Loading from "../../../LoadingScreen";

const Category = ({ route }) => {
  const email = route.params ? route.params.email : 'No email provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userAge, setUserAge] = useState(null);
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [inputAge, setInputAge] = useState('');
  const [attemptedCategories, setAttemptedCategories] = useState([]);
  const [scores, setScores] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'verbal_reasoning',
    'logical',
    'abstract_reasoning',
    'numerical_reasoning'
  ];

  
  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const ageEndpoint = isGoogleSignedIn ? `/user-age-google/${email}` : `/user-age/${email}`;
        const categoriesEndpoint = isGoogleSignedIn ? `/attempted-categories-google/${email}` : `/attempted-categories/${email}`;
        const scoresEndpoint = isGoogleSignedIn ? `/category-scores-google/${email}` : `/category-scores/${email}`;
        
        const [ageResponse, categoriesResponse, scoresResponse] = await Promise.all([
          API_URL.get(ageEndpoint),
          API_URL.get(categoriesEndpoint),
          API_URL.get(scoresEndpoint)
        ]);
  
        if (ageResponse.data.age) {
          setUserAge(ageResponse.data.age);
        } else {
          setShowAgeInput(true);
        }
  
        const fetchedAttemptedCategories = categoriesResponse.data.attemptedCategories;
        const fetchedScores = scoresResponse.data.scores.reduce((acc, { category, score }) => {
          if (score !== undefined) {
            acc[category] = score;
          }
          return acc;
        }, {});
  
        const fetchedCategoriesCount = fetchedAttemptedCategories.length;
        const fetchedScoresCount = Object.keys(fetchedScores).length;
  
        console.log('Fetched Categories Count', fetchedCategoriesCount);
        console.log('Fetched Scores Count', fetchedScoresCount);
  
        // Update attempted categories
        const updatedAttemptedCategories = fetchedAttemptedCategories.filter(category => fetchedScores[category] !== undefined);
        setAttemptedCategories(updatedAttemptedCategories);
  
        // Update scores
        setScores(fetchedScores);
  
        // Delete additional categories
        await Promise.all(
          fetchedAttemptedCategories
            .filter(category => fetchedScores[category] === undefined)
            .map(async category => {
              const deleteEndpoint = isGoogleSignedIn ? `/delete-attempted-category-google/${email}` : `/delete-attempted-category/${email}`;
              await API_URL.post(deleteEndpoint, { category });
            })
        );
  
        // Add scores for specific categories
        await Promise.all(
          Object.entries(fetchedScores)
            .map(async ([category, score]) => {
              const updateEndpoint = isGoogleSignedIn ? `/update-attempted-categories-google/${email}` : `/update-attempted-categories/${email}`;
              await API_URL.post(updateEndpoint, { category });
            })
        );
        
      } catch (error) {
        let errorMessage = 'Failed to fetch user details. Please try again later.';
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserDetails();
  }, [email, isGoogleSignedIn, isFocused]);
  
    
  console.log('User Age',userAge);
  

  useEffect(() => {
    const calculateIQIfNeeded = async () => {
      const scoresEndpoint = isGoogleSignedIn ? `/category-scores-google/${email}` : `/category-scores/${email}`;
      const scoresResponse = await API_URL.get(scoresEndpoint);

      const fetchedScores = scoresResponse.data.scores.reduce((acc, { category, score }) => {
        if (score !== undefined) {
          acc[category] = score;
        }
        return acc;
      }, {});
      const attemptedCategoriesCount = Object.keys(fetchedScores).length;
      if (attemptedCategoriesCount === 4) {
        setIsLoading(true);
        const iqEndpoint = isGoogleSignedIn ? `/calculate-IQ-google` : `/calculate-IQ`;
        try {
          const iqResponse = await API_URL.post(iqEndpoint, {
            verbal_reasoning: fetchedScores.verbal_reasoning,
            logical: fetchedScores.logical,
            abstract_reasoning: fetchedScores.abstract_reasoning,
            numerical_reasoning: fetchedScores.numerical_reasoning,
            email
          });
          const { iq } = iqResponse.data;

          Alert.alert(
            'IQ Score',
            `Your IQ score is ${iq}`,
            [
              {
                text: 'OK',
                onPress: async () => {
                  setAttemptedCategories([]);
                  const scoreResetEndpoint = isGoogleSignedIn ? `/update-category-score-google/${email}` : `/update-category-score/${email}`;
                  await API_URL.post(scoreResetEndpoint, { reset: 1 });
                  setIsLoading(false);
                }
              }
            ],
            { cancelable: false }
          );
        } catch (error) {
          console.error('Error calculating IQ:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to calculate IQ. Please try again later.',
          });
          setIsLoading(false);
        }
      }
    };

    calculateIQIfNeeded();
  }, [scores,email,isGoogleSignedIn,isFocused]);

  const handleCategory = async (route, index) => {
    const reset = index === categories.length - 1;
    const endpoint = isGoogleSignedIn ? `/update-attempted-categories-google/${email}` : `/update-attempted-categories/${email}`;
  
    try {
      if (reset) {
        await API_URL.post(endpoint, { reset });
      }
      navigation.navigate(route, { email, isGoogleSignedIn,userAge });
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
      await API_URL.post(isGoogleSignedIn?`/update-user-age-google`:`/update-user-age/${email}`, { age: inputAge });
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : (
        <>
          <Text style={styles.screen_title}>Select a Category</Text>
          <Text style={styles.screen_title}>For {userAge<=14 ?'Kids':'Adults'}</Text>
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
        </>
      )}
    </View>
  );
}

export default Category;
