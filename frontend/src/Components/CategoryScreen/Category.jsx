// import React, { useEffect, useState } from "react";
// import { View, TouchableOpacity, Text, StyleSheet, TextInput, Alert } from 'react-native';
// import { useNavigation } from "@react-navigation/native";
// import { styles } from "../../../theme";
// import { API_URL } from "../../../Api";
// import Toast from 'react-native-toast-message';

// const Category = ({ route }) => {
//   const email = route.params ? route.params.email : 'No email provided';
//   const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
//   console.log('Email in Category screen:', email);
//   const navigation = useNavigation();
//   const [userAge, setUserAge] = useState(null);
//   const [showAgeInput, setShowAgeInput] = useState(false);
//   const [inputAge, setInputAge] = useState('');

//   useEffect(() => {
//     const fetchUserAge = async () => {
//       try {
//         const endpoint = isGoogleSignedIn ? `/user-age-google/${email}` : `/user-age/${email}`;
//         const response = await API_URL.get(endpoint);
//         if (response.data.age) {
//           setUserAge(response.data.age);
//         } else {
//           setShowAgeInput(true);
//         }
//       } catch (error) {
//         console.error('Error fetching user age:', error);
//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: 'Failed to fetch user age. Please try again later.',
//         });
//       }
//     };

//     fetchUserAge();
//   }, [email, isGoogleSignedIn]);

//   const handleCategory = (route) => {
//     navigation.navigate(route, { email, isGoogleSignedIn });
//   };

//   const handleAgeSubmit = async () => {
//     if (!inputAge) {
//       Alert.alert('Please enter your age');
//       return;
//     }
//     const age = parseInt(inputAge);
//     if (isNaN(age) || age < 9 || age > 80) {
//       Alert.alert('Invalid Age', 'Age must be between 9 and 80 and also should not contain special characters');
//       return;
//     }

//     try {
//       const endpoint = isGoogleSignedIn ? `/update-user-age-google/${email}` : `/update-user-age/${email}`;
//       await API_URL.post(endpoint, { age });
//       setUserAge(age);
//       setShowAgeInput(false);
//     } catch (error) {
//       console.error('Error updating user age:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Failed to update user age. Please try again later.',
//       });
//     }
//   };

//   if (showAgeInput) {
//     return (
//       <View style={styles.p_container}>
//         <Text style={styles.screen_title}>Enter Your Age</Text>
//         <View style={styles.inputView}>
//           <TextInput
//             style={styles.inputText}
//             onChangeText={setInputAge}
//             placeholder="Enter Your Age"
//             value={inputAge}
//             keyboardType="numeric"
//           />
//         </View>
//         <TouchableOpacity onPress={handleAgeSubmit} style={styles.btn}>
//           <Text style={styles.btn_text}>Submit</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.screen_title}>Select a Category</Text>
//       <View style={styles.cardView}>
//         <View style={styles.row}>
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => handleCategory('verbal-reasoning')}
//           >
//             <Text style={styles.cardText}>Verbal Reasoning</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => handleCategory('logical')}
//           >
//             <Text style={styles.cardText}>Logical</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.row}>
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => handleCategory('abstract-reasoning')}
//           >
//             <Text style={styles.cardText}>Abstract Reasoning</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => handleCategory('numerical-reasoning')}
//           >
//             <Text style={styles.cardText}>Numerical Reasoning</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Category;

import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { styles } from "../../../theme";
import { API_URL } from "../../../Api";
import Toast from 'react-native-toast-message';

const Category = ({ route }) => {
  const email = route.params ? route.params.email : 'No email provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
  console.log('Email in Category screen:', email);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userAge, setUserAge] = useState(null);
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [inputAge, setInputAge] = useState('');
  const [attemptedCategories, setAttemptedCategories] = useState([]);

  const categories = [
    'verbal-reasoning',
    'logical',
    'abstract-reasoning',
    'numerical-reasoning'
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const ageEndpoint = isGoogleSignedIn ? `/user-age-google/${email}` : `/user-age/${email}`;
        const categoriesEndpoint = isGoogleSignedIn ? `/attempted-categories-google/${email}` : `/attempted-categories/${email}`;

        const [ageResponse, categoriesResponse] = await Promise.all([
          API_URL.get(ageEndpoint),
          API_URL.get(categoriesEndpoint)
        ]);

        if (ageResponse.data.age) {
          setUserAge(ageResponse.data.age);
        } else {
          setShowAgeInput(true);
        }

        if (categoriesResponse.data.attemptedCategories) {
          setAttemptedCategories(categoriesResponse.data.attemptedCategories);
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
    try {
        // Fetch scores for the user's attempted categories
        const scoresEndpoint = isGoogleSignedIn ? `/category-scores-google/${email}` : `/category-scores/${email}`;
        const response = await API_URL.get(scoresEndpoint);
        const scores = response.data.scores.reduce((acc, { category, score }) => {
            acc[category] = score;
            return acc;
        }, {});

        // Check if all categories are attempted
        const allCategoriesDone = Object.keys(scores).length === categories.length;

        // Send scores to calculate IQ if all categories are done
        if (allCategoriesDone) {
            const iqEndpoint = isGoogleSignedIn ? `/calculate-IQ-google/${email}` : `/calculate-IQ/${email}`;
            await API_URL.post(iqEndpoint, scores);

            // Reset attempted categories if all categories are done
            setAttemptedCategories([]);
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
      <Text style={styles.screen_title}>Select a Category</Text>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category}
            style={[styles.card, attemptedCategories.includes(category) && styles.disabledCard]}
            onPress={() => !attemptedCategories.includes(category) && handleCategory(category, index)}
            disabled={attemptedCategories.includes(category)}
          >
            <Text style={styles.cardText}>{category.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</Text>
            {attemptedCategories.includes(category) && <Text style={styles.attemptedText}>Attempted</Text>}
          </TouchableOpacity>
        ))}
    </View>
  );
};


export default Category;

