// import React, { useEffect, useState } from "react";
// import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
// import { useNavigation, useIsFocused } from "@react-navigation/native";
// import { styles } from "../../../theme";
// import { API_URL } from "../../../Api";
// import Toast from 'react-native-toast-message';
// import Loading from "../../../LoadingScreen";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const Category = ({ route }) => {
  // const email = route.params ? route.params.email : 'No email provided';
  // const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const [userAge, setUserAge] = useState(null);
//   const [showAgeInput, setShowAgeInput] = useState(false);
//   const [inputAge, setInputAge] = useState('');
//   const [attemptedCategories, setAttemptedCategories] = useState([]);
//   const [scores, setScores] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const isChild = AsyncStorage.getItem?.('isChild')==='true';


//   const categories = [
//     'verbal_reasoning',
//     'logical',
//     'abstract_reasoning',
//     'numerical_reasoning'
//   ];

  
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       setIsLoading(true);
//       try {
//         console.log(isChild);
//         const ageEndpoint = isGoogleSignedIn ? `/user-age-google/${email}` : `/user-age/${email}`;
//         const categoriesEndpoint = isGoogleSignedIn ? `/attempted-categories-google/${email}` : `/attempted-categories/${email}`;
//         const scoresEndpoint = isGoogleSignedIn ? `/category-scores-google/${email}` : `/category-scores/${email}`;
        
//         const [ageResponse, categoriesResponse, scoresResponse] = await Promise.all([
//           API_URL.get(ageEndpoint),
//           API_URL.get(categoriesEndpoint),
//           API_URL.get(scoresEndpoint)
//         ]);
  
//         if (ageResponse.data.age) {
//           setUserAge(ageResponse.data.age);
//         } else {
//           setShowAgeInput(true);
//         }
  
//         const fetchedAttemptedCategories = categoriesResponse.data.attemptedCategories;
//         const fetchedScores = scoresResponse.data.scores.reduce((acc, { category, score }) => {
//           if (score !== undefined) {
//             acc[category] = score;
//           }
//           return acc;
//         }, {});
  
//         const fetchedCategoriesCount = fetchedAttemptedCategories.length;
//         const fetchedScoresCount = Object.keys(fetchedScores).length;
  
//         console.log('Fetched Categories Count', fetchedCategoriesCount);
//         console.log('Fetched Scores Count', fetchedScoresCount);
  
//         // Update attempted categories
//         const updatedAttemptedCategories = fetchedAttemptedCategories.filter(category => fetchedScores[category] !== undefined);
//         setAttemptedCategories(updatedAttemptedCategories);
  
//         // Update scores
//         setScores(fetchedScores);
  
//         // Delete additional categories
//         await Promise.all(
//           fetchedAttemptedCategories
//             .filter(category => fetchedScores[category] === undefined)
//             .map(async category => {
//               const deleteEndpoint = isGoogleSignedIn ? `/delete-attempted-category-google/${email}` : `/delete-attempted-category/${email}`;
//               await API_URL.post(deleteEndpoint, { category });
//             })
//         );
  
//         // Add scores for specific categories
//         await Promise.all(
//           Object.entries(fetchedScores)
//             .map(async ([category, score]) => {
//               const updateEndpoint = isGoogleSignedIn ? `/update-attempted-categories-google/${email}` : `/update-attempted-categories/${email}`;
//               await API_URL.post(updateEndpoint, { category });
//             })
//         );
        
//       } catch (error) {
//         let errorMessage = 'Failed to fetch user details. Please try again later.';
//         if (error.response && error.response.data && error.response.data.error) {
//           errorMessage = error.response.data.error;
//         }
//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: errorMessage,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchUserDetails();
//   }, [email, isGoogleSignedIn, isFocused]);
  
    
//   console.log('User Age',userAge);
  

//   useEffect(() => {
//     const calculateIQIfNeeded = async () => {
//       const scoresEndpoint = isGoogleSignedIn ? `/category-scores-google/${email}` : `/category-scores/${email}`;
//       const scoresResponse = await API_URL.get(scoresEndpoint);

//       const fetchedScores = scoresResponse.data.scores.reduce((acc, { category, score }) => {
//         if (score !== undefined) {
//           acc[category] = score;
//         }
//         return acc;
//       }, {});
//       const attemptedCategoriesCount = Object.keys(fetchedScores).length;
//       if (attemptedCategoriesCount === 4) {
//         setIsLoading(true);
//         let iqEndpoint = isGoogleSignedIn ? `/calculate-IQ-google` : `/calculate-IQ`;
//         if(isChild){
//           iqEndpoint = isGoogleSignedIn ? `/calculate-child-IQ-google` : `/calculate-child-IQ`;
//         }

//         try {
//           const iqResponse = await API_URL.post(iqEndpoint, {
//             verbal_reasoning: fetchedScores.verbal_reasoning,
//             logical: fetchedScores.logical,
//             abstract_reasoning: fetchedScores.abstract_reasoning,
//             numerical_reasoning: fetchedScores.numerical_reasoning,
//             email,
//             age:userAge
//           });
//           const { iq } = iqResponse.data;

//           Alert.alert(
//             'IQ Score',
//             `Your IQ score is ${iq}`,
//             [
//               {
//                 text: 'OK',
//                 onPress: async () => {
//                   setAttemptedCategories([]);
//                   const scoreResetEndpoint = isGoogleSignedIn ? `/update-category-score-google/${email}` : `/update-category-score/${email}`;
//                   await API_URL.post(scoreResetEndpoint, { reset: 1 });
//                   setIsLoading(false);
//                 }
//               }
//             ],
//             { cancelable: false }
//           );
//         } catch (error) {
//           console.error('Error calculating IQ:', error);
//           Toast.show({
//             type: 'error',
//             text1: 'Error',
//             text2: 'Failed to calculate IQ. Please try again later.',
//           });
//           setIsLoading(false);
//         }
//       }
//     };

//     calculateIQIfNeeded();
//   }, [scores,email,isGoogleSignedIn,isFocused]);

//   const handleCategory = async (route, index) => {
//     const reset = index === categories.length - 1;
//     const endpoint = isGoogleSignedIn ? `/update-attempted-categories-google/${email}` : `/update-attempted-categories/${email}`;
  
//     try {
//       if (reset) {
//         await API_URL.post(endpoint, { reset });
//       }
//       navigation.navigate(route, { email, isGoogleSignedIn,userAge });
//     } catch (error) {
//       console.error('Error updating attempted category:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Failed to update attempted category. Please try again later.',
//       });
//       setIsLoading(false);
//     }
//   };
  

//   const handleAgeSubmit = async () => {
//     if (inputAge.trim() === '') {
//       Alert.alert('Error', 'Please enter your age');
//       return;
//     }

//     try {
//       if(inputAge<=14){
//         AsyncStorage.setItem('isChild','true');
//       }
//       await API_URL.post(isGoogleSignedIn?`/update-user-age-google`:`/update-user-age/${email}`, { age: inputAge });
//       setUserAge(inputAge);
//       setShowAgeInput(false);
//     } catch (error) {
//       console.error('Error updating age:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Failed to update age. Please try again later.',
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
//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <Loading />
//         </View>
//       ) : (
//         <>
//           <Text style={styles.screen_title}>Select a Category</Text>
//           <Text style={styles.screen_title}>For {userAge<=14 ?'Kids':'Adults'}</Text>
//           {categories.map((category, index) => (
//             <TouchableOpacity
//               key={category}
//               style={[styles.card, attemptedCategories.includes(category) && styles.disabledCard]}
//               onPress={() => !attemptedCategories.includes(category) && handleCategory(category, index)}
//               disabled={attemptedCategories.includes(category)}
//             >
//               <Text style={styles.cardText}>{category.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</Text>
//               {attemptedCategories.includes(category)}
//             </TouchableOpacity>
//           ))}
//         </>
//       )}
//     </View>
//   );
// }

// export default Category;


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native';
import { API_URL } from '../../../Api';
import { styles } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../../LoadingScreen';

const Category = ({ route }) => {
  const email = route.params ? route.params.email : 'No email provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [iq, setIQ] = useState(null);
  const [questions, setQuestions] = useState({
      Verbal_Questions: null,
      numerical_reasoning_questions: null,
      Image_Questions: null,
      Logical_Questions: null,
  });
  const [currentCategory, setCurrentCategory] = useState('Verbal_Questions');
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [testEnded, setTestEnded] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [totalScore, setTotalScore] = useState({ Verbal_Questions: 0, numerical_reasoning_questions: 0, Image_Questions: 0, Logical_Questions: 0 });
  const [inputAge, setInputAge] = useState('');
  const [ageEntered, setAgeEntered] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState({ Verbal_Questions: 20, numerical_reasoning_questions: 25, Image_Questions: 20, Logical_Questions: 15 });
  const navigation = useNavigation();

  const categories = ['Verbal_Questions', 'numerical_reasoning_questions', 'Image_Questions', 'Logical_Questions'];
  const kidsCategories = ['kids_verbal_questions', 'kids_numerical_questions', 'kids_image_questions', 'kids_logical_questions'];

  const getMappedCategory = (category, isKid) => {
      const index = categories.indexOf(category);
      return isKid ? kidsCategories[index] : category;
  };

  useEffect(() => {
      if (ageEntered) {
          fetchQuestions(currentCategory);
      }
  }, [ageEntered]);

  useEffect(() => {
      if (timeLeft === 0) {
          handleTestEnd();
      }
  }, [timeLeft]);

  useEffect(() => {
      const timer = setInterval(() => {
          if (!testEnded && timeLeft > 0) {
              setTimeLeft(prevTime => prevTime - 1);
          } else {
              clearInterval(timer);
              setTestEnded(true);
          }
      }, 1000);

      return () => clearInterval(timer);
  }, [testEnded, timeLeft]);

  const handleBack = () => {
      navigation.navigate('TestSelection');
  };

  const handleAgeSubmit = () => {
      if (!inputAge || isNaN(inputAge) || inputAge <= 0) {
          // Instead of showing toast, just keep the input and button.
          return;
      }
      setAgeEntered(true);
  };

  const fetchQuestions = async (category) => {
      try {
          setIsLoading(true);
          const ageForEndpoint = parseInt(inputAge, 10);
          const isKid = ageForEndpoint <= 14;
          const mappedCategory = getMappedCategory(category, isKid);
          const endpoint = isKid ? `/fetch-general-kids/${mappedCategory}` : `/fetch-general/${category}`;

          console.log(`Fetching from endpoint: ${endpoint}`);
          const response = await API_URL.get(endpoint);
          console.log(`Response for ${category}:`, response.data);

          const { question, options } = response.data;

          // Transform options to match the expected structure
          const transformedOptions = options.map(option => ({
              option_id: option.option_id,
              question_id: option.question_id,
              option_text: option.option_text,
              is_correct: option.is_correct === 1 || option.is_correct === true, // Convert is_correct to boolean
          }));

          setQuestions(prevQuestions => ({
              ...prevQuestions,
              [category]: { question, options: transformedOptions }
          }));
          setIsImageLoaded(false);

      } catch (error) {
          console.log(`Error fetching ${category} questions:`, error);
          Toast.show({
              type: 'error',
              text1: 'Error',
              text2: `Failed to fetch ${category} questions`,
          });
      } finally {
          setIsLoading(false);
      }
  };

  const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex) => {
      setSelectedOptionIndex(optionIndex);
  };

  const handleNextQuestion = async () => {
      if (selectedOptionIndex === null) {
          // Handle option not selected state
          return;
      }

      const categoryQuestions = questions[currentCategory];
      const selectedOption = categoryQuestions.options[selectedOptionIndex];

      if (selectedOption.is_correct) {
          setScore(prevScore => prevScore + 1);
          setTotalScore(prevTotalScore => ({
              ...prevTotalScore,
              [currentCategory]: prevTotalScore[currentCategory] + 1
          }));
      }

      const nextQuestionCount = questionCount + 1;
      const questionLimits = totalQuestions;

      if (nextQuestionCount < questionLimits[currentCategory]) {
          setQuestionCount(nextQuestionCount);
          setSelectedOptionIndex(null);
          await fetchQuestions(currentCategory);
      } else {
          const nextCategory = getNextCategory(currentCategory);
          if (nextCategory) {
              setCurrentCategory(nextCategory);
              setQuestionCount(0);
              setSelectedOptionIndex(null);
              await fetchQuestions(nextCategory);
          } else {
              handleTestEnd();
          }
      }
  };

  const getNextCategory = (currentCategory) => {
      const currentIndex = categories.indexOf(currentCategory);
      if (currentIndex !== -1 && currentIndex < categories.length - 1) {
          return categories[currentIndex + 1];
      }
      return null;
  };

  const handleTestEnd = async () => {
      setTestEnded(true);
      try {
          setIsLoading(true);
          const endpoint = isGoogleSignedIn ? '/calculate-IQ-google' : '/calculate-IQ'
          const response = await API_URL.post(endpoint, {
            email:email,
            totalScore: totalScore,
            age: parseInt(inputAge, 10)
          });

          const { iq } = response.data;
          setIQ(iq);
      } catch (error) {
          console.error('Error calculating IQ:', error);
      } finally {
          setIsLoading(false);
      }
  };

  const renderAgeInput = () => (
      <View style={styles.container}>
          <Text style={styles.title}>Enter Your Age</Text>
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

  const renderQuestionCard = (category) => {
      const categoryQuestions = questions[category];

      if (!categoryQuestions || !categoryQuestions.question) {
          return (
              <View style={styles.loadingContainer}>
                  <Loading />
              </View>
          );
      }

      const { question, options } = categoryQuestions;

      return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.questions_container}>
          <View style={styles.question_con_prop}>
                          <View style={styles.timerContainer}>
                              <Ionicons name="timer-outline" size={24} color="black" />
                              <Text style={styles.timerText}>
                              {formatTime(timeLeft)}
                              </Text>
                              </View>
                              <View style={styles.content}>
                              <Text style={styles.question_text}>
                          Question {questionCount + 1} of {totalQuestions[category]}
                      </Text>
                      </View>
                              <ScrollView>
                          <Text
                                  numberOfLines={3}
                                  ellipsizeMode="tail"
                                  style={styles.question_text}
                              >
                                  {question.question_text}
                              </Text>
                          </ScrollView>
                  {question.question_img && (
                      <ScrollView>
                      <Image
                          source={{ uri: question.question_img }}
                          style={styles.questionImage}
                          onLoad={() => setIsImageLoaded(true)}
                      />
                      </ScrollView>
                  )}
                  {(question.question_text || question.question_img) && options.map((option, index) => (
                      <TouchableOpacity
                          key={index}
                          style={[
                              styles.optionButton,
                              selectedOptionIndex === index ? styles.selectedOption : null,
                          ]}
                          onPress={() => handleOptionSelect(index)}
                      >
                          <Text style={[
                              styles.optionText,
                              selectedOptionIndex === index ? styles.selectedOptionText : null,
                          ]}>{option.option_text}</Text>
                      </TouchableOpacity>
                  ))}
              </View>
              <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
              >
                  <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
              </View>
          </ScrollView>
      );
  };

  const renderIQResult = () => (
      <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your IQ is: {iq}</Text>
      </View>
  );

  return (
      <>
          {isLoading ? (
              <View style={styles.loadingContainer}>
                  <Loading />
              </View>
          ) : !ageEntered ? (
              renderAgeInput()
          ) : questions && !iq ? (
              <>
                  {renderQuestionCard(currentCategory)}
              </>
          ) : iq !== null ? (
              <View style={styles.container}>
                  <View style={styles.resultContainer}>
                      {testEnded && renderIQResult()}
                  </View>
                  <TouchableOpacity
                      style={styles.nextButton}
                      onPress={handleBack}
                  >
                      <Text style={{ color: 'white' }}>Back</Text>
                  </TouchableOpacity>
              </View>
          ) : (
              console.log('Loading Question')
          )}
      </>
  );
};

export default Category;




// {!ageEntered ? (
//     renderAgeInput()
// ) : (
//     <>
//         {renderQuestionCard(currentCategory)}
        // {testEnded && iq !== null && renderIQResult()}
//     </>
// )}