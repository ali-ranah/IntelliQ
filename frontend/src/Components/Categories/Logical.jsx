// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView,Alert, Image,BackHandler } from 'react-native';
// import { styles } from '../../../theme';
// import { API_URL } from '../../../Api';
// import Loading from '../../../LoadingScreen';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const Logical = ({ route }) => {
//     const email = route.params ? route.params.email : 'No email provided';
//     const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
//     const [mcqData, setMCQData] = useState(null);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [isFetching, setIsFetching] = useState(true);
//     const age = route.params ? route.params.userAge:'Age not passed in params';
//     const [questionCount, setQuestionCount] = useState(0);
//     const [questionScores, setQuestionScores] = useState(Array(15).fill(0)); // Array to store scores for each question
//     const [testEnded, setTestEnded] = useState(false);
//     const [timeLeft, setTimeLeft] = useState(100);
//     const navigation = useNavigation();

//     useEffect(() => {
//         const timer = setInterval(() => {
//             if (timeLeft > 0) {
//                 setTimeLeft(timeLeft - 1);
//             } else {
//                 clearInterval(timer);
//                 setTestEnded(true);
//             }
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [timeLeft]);

//     useEffect(() => {
//         fetchRandomMCQ();
//     }, []);

   

//     const fetchRandomMCQ = () => {
//         setIsFetching(true);
    
//         API_URL
//             .post('/mcqs')
//             .then((response) => {
//                 const mcqData = response.data;
//                 const options = [
//                     { option_text: mcqData.option1, is_correct: mcqData.Correct === "1" },
//                     { option_text: mcqData.option2, is_correct: mcqData.Correct === "2" },
//                     { option_text: mcqData.option3, is_correct: mcqData.Correct === "3" },
//                     { option_text: mcqData.option4, is_correct: mcqData.Correct === "4" }
//                 ];
    
//                 setMCQData({
//                     ID: mcqData.ID,
//                     Question: mcqData.Question,
//                     Category: mcqData.Category,
//                     options: options
//                 });
    
//             })
//             .catch((error) => console.error('Error fetching MCQ data:', error))
//             .finally(() => setIsFetching(false));
//     };
    

//     const handleOptionSelect = (optionIndex) => {
//         setSelectedOption(optionIndex);
//     };

//     const handleNextQuestion = () => {
//         if (!testEnded && selectedOption !== null) {
//             const selectedOptionData = mcqData.options[selectedOption];
//             const isCorrect = selectedOptionData.is_correct;
//             const updatedScores = [...questionScores];
//             updatedScores[questionCount] = isCorrect ? 1 : 0;
//             setQuestionScores(updatedScores);

//             setQuestionCount(questionCount + 1);
//             setSelectedOption(null);

//             if (questionCount === 14) {
//                 setTestEnded(true);
//             } else {
//                 fetchRandomMCQ();
//             }
//         }
//     };

//     const sendScore = async (score) => {
//         try {
//             const endpoint = isGoogleSignedIn ? `/update-category-score-google/${email}` : `/update-category-score/${email}`;
//             await API_URL.post(endpoint, { category: 'logical', score });
//             const categoryendpoint = isGoogleSignedIn ? `/update-attempted-categories-google/${email}` : `/update-attempted-categories/${email}`;
//             await API_URL.post(categoryendpoint, { category: 'logical', reset: 0 });
//             console.log('Score sent successfully');
//         } catch (error) {
//             console.error('Error sending score:', error);
//         }
//     };


//     useEffect(() => {
//         const backAction = () => {
//             if (!testEnded) {
//                 Alert.alert(
//                     'Are you sure?',
//                     'Your score will be counted if you go back.',
//                     [
//                         {
//                             text: 'Yes, I want to go back',
//                             onPress: async () => {
//                                 const score = questionScores.reduce((acc, val) => acc + val, 0);
//                                 await sendScore(score);
//                                 navigation.goBack();
//                             },
//                         },
//                         {
//                             text: "No, I'll continue the test",
//                             onPress: () => {},
//                             style: 'cancel'
//                         }
//                     ],
//                     { cancelable: false }
//                 );
//                 return true;
//             } else {
//                 return false;
//             }
//         };

//         const backHandler = BackHandler.addEventListener(
//             'hardwareBackPress',
//             backAction
//         );

//         return () => backHandler.remove();
//     }, [testEnded, questionScores]);
      

//     useEffect(() => {
//         if (testEnded) {
//             const score = questionScores.reduce((acc, val) => acc + val, 0);
//             sendScore(score);
//         }
//     }, [testEnded]);

//     return (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//             <View style={styles.questions_container}>
//                 {isFetching ? (
//                     <View style={styles.loadingContainer}>
//                         <Loading />
//                     </View>
//                 ) : mcqData && !testEnded ? (
//                     <>
//                         <View style={styles.question_con_prop}>
//                             <View style={styles.timerContainer}>
//                                 <Ionicons name="timer-outline" size={24} color="black" />
//                                 <Text style={styles.timerText}>
//                                     {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
//                                 </Text>
//                             </View>
//                             <Text style={styles.question_count}>
//                                 Question {questionCount + 1} / 15
//                             </Text>
//                             <ScrollView>
//                             <Text
//                                     numberOfLines={3}
//                                     ellipsizeMode="tail"
//                                     style={styles.question_text}
//                                 >
//                                     {mcqData.Question}
//                                 </Text>
//                             </ScrollView>

//                             {mcqData.options.map((option, index) => (
//                                 <View key={index}>
//                                     <TouchableOpacity
//                                         style={{
//                                             marginBottom: '5%',
//                                             padding: 10,
//                                             marginVertical: 5,
//                                             backgroundColor: selectedOption === index ? 'gray' : '#DDDDDD',
//                                         }}
//                                         onPress={() => handleOptionSelect(index)}
//                                     >
//                                         <Text>{option.option_text}</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))}
//                         </View>
//                             <TouchableOpacity
//                                 style={styles.btn}
//                                 onPress={handleNextQuestion}
//                                 disabled={selectedOption === null}
//                             >
//                                 <Text style={{ color: 'white' }}>Next</Text>
//                             </TouchableOpacity>
//                     </>
//                 ) : testEnded ? (
//                     <View style={styles.resultContainer}>
// <Text style={styles.resultText}>
//     Your score is: {questionScores.reduce((acc, score) => acc + score, 0)} out of 15
// </Text>
//                     </View>
//                 ) : (
//                     console.log('Loading Question')
//                 )}
//             </View>
//         </ScrollView>
//     );
// };

// export default Logical;



import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, BackHandler } from 'react-native';
import { styles } from '../../../theme';
import { API_URL } from '../../../Api';
import Loading from '../../../LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Logical = ({ route }) => {
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
    const [mcqData, setMCQData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [iq, setIQ] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const age = route.params ? route.params.userAge : 'Age not passed in params';
    const [questionCount, setQuestionCount] = useState(0);
    const [questionScores, setQuestionScores] = useState(Array(15).fill(0)); // Array to store scores for each question
    const [testEnded, setTestEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes timer (900 seconds)
    const [inputAge, setInputAge] = useState('');
    const [ageEntered, setAgeEntered] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                clearInterval(timer);
                setTestEnded(true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (ageEntered) {
            fetchRandomMCQ();
        }
    }, [ageEntered]);

    const handleBack = () => {
        navigation.navigate('SpecificTest');
    }

    const fetchRandomMCQ = () => {
        setIsFetching(true);
        let endpoint = '/logical-mcqs';
        if (inputAge <= 14) {
            endpoint = '/logical-mcqs-kids';
        }
        console.log('Endpoint Selected',endpoint);
        API_URL
            .post(endpoint)
            .then((response) => {
                const mcqData = response.data;

                if (inputAge <= 14) {
                    const options = [
                        { option_text: mcqData.options.option_a, is_correct: mcqData.is_correct === 'a' },
                        { option_text: mcqData.options.option_b, is_correct: mcqData.is_correct === 'b' },
                        { option_text: mcqData.options.option_c, is_correct: mcqData.is_correct === 'c' },
                        { option_text: mcqData.options.option_d, is_correct: mcqData.is_correct === 'd' }
                    ];

                    setMCQData({
                        ID: mcqData.id,
                        Question: mcqData.question_text,
                        options: options
                    });
                } else {
                    const options = response.data.options.map((option, index) => ({
                        option_text: option.option_text,
                        is_correct: option.is_correct
                    }));

                    setMCQData({
                        ID: mcqData.question.question_id,
                        Question: mcqData.question.question_text,
                        options: options
                    });
                }
            })
            .catch((error) => console.log('Error fetching MCQ data:', error))
            .finally(() => setIsFetching(false));
    };

    const handleOptionSelect = (optionIndex) => {
        setSelectedOption(optionIndex);
    };

    const handleNextQuestion = () => {
        if (!testEnded && selectedOption !== null) {
            const selectedOptionData = mcqData.options[selectedOption];
            const isCorrect = selectedOptionData.is_correct;
            const updatedScores = [...questionScores];
            updatedScores[questionCount] = isCorrect ? 1 : 0;
            setQuestionScores(updatedScores);

            setQuestionCount(questionCount + 1);
            setSelectedOption(null);

            if (questionCount === 14) {
                setTestEnded(true);
            } else {
                fetchRandomMCQ();
            }
        }
    };

    const sendScore = async (score) => {
        setIsFetching(true);
        try {
            const endpoint = isGoogleSignedIn ? '/calculate-IQ-Specific-google' : '/calculate-IQ-Specific';
            const response = await API_URL.post(endpoint, {
                score: score,
                category: 'logical',
                email: email,
            });
            const { iq } = response.data;
            setIQ(iq);
        } catch (error) {
            console.error('Error calculating iq:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleAgeSubmit = () => {
        if (!inputAge || isNaN(inputAge) || inputAge <= 0) {
            return;
        }
        setAgeEntered(true);
    };

    const renderAgeInput = () => (
        <>
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
        </>
    );

    useEffect(() => {
        if (testEnded) {
            const score = questionScores.reduce((acc, val) => acc + val, 0);
            sendScore(score);
        }
    }, [testEnded]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.questions_container}>
                {isFetching ? (
                    <View style={styles.loadingContainer}>
                        <Loading />
                    </View>
                ) : !ageEntered ? (
                    renderAgeInput()
                ) : mcqData && !testEnded ? (
                    <>
                        <View style={styles.question_con_prop}>
                            <View style={styles.timerContainer}>
                                <Ionicons name="timer-outline" size={24} color="black" />
                                <Text style={styles.timerText}>
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </Text>
                            </View>
                            <View style={styles.content}>
                            <Text style={styles.question_text}>
                                Question {questionCount + 1} / 15
                            </Text>
                            </View>
                            <ScrollView>
                                <Text
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                    style={styles.question_text}
                                >
                                    {mcqData.Question}
                                </Text>
                            </ScrollView>

                            {mcqData.options.map((option, index) => (
                                <View key={index}>
                                    <TouchableOpacity
                                         style={[
                                            styles.optionButton,
                                            selectedOption === index ? styles.selectedOption : null,
                                        ]}
                                        onPress={() => handleOptionSelect(index)}
                                    >
                                        <Text>{option.option_text}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleNextQuestion}
                            disabled={selectedOption === null}
                        >
                            <Text style={{ color: 'white' }}>Next</Text>
                        </TouchableOpacity>
                    </>
                ) : testEnded ? (
                    <View style={styles.container_for_result}>
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultText}>Your IQ is: {iq}</Text>
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
            </View>
        </ScrollView>
    );
};

export default Logical;
