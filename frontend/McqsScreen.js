// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
// import { styles } from './theme';
// import { API_URL } from './Api';
// import Loading from './LoadingScreen';
// import { Ionicons } from '@expo/vector-icons';


// const Mcqs = ({ route }) => {
//     const email = route.params ? route.params.email : 'No email provided';
//     const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
//     const [mcqData, setMCQData] = useState(null);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [isFetching, setIsFetching] = useState(true);
//     const [questionCount, setQuestionCount] = useState(0);
//     const [score, setScore] = useState(0);
//     const [testEnded, setTestEnded] = useState(false);
//     const [timeLeft, setTimeLeft] = useState(100);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             if (timeLeft > 0) {
//                 setTimeLeft(timeLeft - 1);
//             } else {
//                 clearInterval(timer);
//                 // End the test when time runs out
//                 setTestEnded(true);
//             }
//         }, 1000); // Update the timer every second

//         return () => clearInterval(timer); // Clean up the timer on unmount
//     }, [timeLeft]);

//     useEffect(() => {
//         fetchRandomMCQ();
//     }, []);

//     const fetchRandomMCQ = () => {
//         setIsFetching(true);

//         API_URL
//             .post('/mcqs')
//             .then((response) => setMCQData(response.data))
//             .catch((error) => console.error('Error fetching MCQ data:', error))
//             .finally(() => setIsFetching(false));
//     };

//     const handleOptionSelect = (option) => {
//         setSelectedOption(option);
//     };

//     const handleNextQuestion = () => {
//         if (selectedOption !== null) {
//             const isCorrect = parseInt(selectedOption) === parseInt(mcqData.Correct);
//             setScore(score + (isCorrect ? 1 : 0));
//             setQuestionCount(questionCount + 1);
//             setSelectedOption(null);

//             if (questionCount === 9) {
//                 // End the test after 10 questions
//                 setTestEnded(true);
//             } else {
//                 fetchRandomMCQ();
//             }
//         }
//     };
//     const sendScore = async () => {
//         try {
//             const endpoint = isGoogleSignedIn ? `google-scores/${email}` : `scores/${email}`;
//             await API_URL.post(endpoint, { score });
//             console.log('Score sent successfully');
//         } catch (error) {
//             console.error('Error sending score:', error);
//         }
//     };
    
//     useEffect(() => {
//         if (testEnded) {
//             sendScore();
//         }
//     }, [testEnded]);
    
//     return (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//             <View style={styles.questions_container}>
//                 <Text style={styles.app_title}>IQ Test</Text>

//                 {isFetching ? (
//                     <View style={styles.loadingContainer}>
//                         <Loading />
//                     </View>
//                 ) : mcqData && !testEnded ? (
//                     <>
//                         <View style={styles.question_con_prop}>
//                         <View style={styles.timerContainer}>
//                                 <Ionicons name="timer-outline" size={24} color="black" />
//                                 <Text style={styles.timerText}>
//                                     {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
//                                 </Text>
//                             </View>
//                             <Text style={styles.question_count}>
//                                 Question {questionCount + 1} / 10
//                             </Text>
//                             <ScrollView>
//                                 <Text
//                                     numberOfLines={3}
//                                     ellipsizeMode="tail"
//                                     style={styles.question_text}
//                                 >
//                                     {mcqData.Question}
//                                 </Text>
//                             </ScrollView>

//                             {['option1', 'option2', 'option3', 'option4'].map((key, index) => (
//                                 <View key={key}>
//                                     <TouchableOpacity
//                                         style={{
//                                             marginBottom: '5%',
//                                             padding: 10,
//                                             marginVertical: 5,
//                                             backgroundColor:
//                                                 selectedOption === index + 1 ? 'gray' : '#DDDDDD', // Compare with index + 1
//                                         }}
//                                         onPress={() => handleOptionSelect(index + 1)}
//                                     >
//                                         <Text>{mcqData[key]}</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))}
//                         </View>
//                         <TouchableOpacity
//                             style={styles.btn}
//                             onPress={handleNextQuestion}
//                             disabled={!selectedOption}
//                         >
//                             <Text style={{ color: 'white' }}>Next</Text>
//                         </TouchableOpacity>
//                     </>
//                 ) : testEnded ? (
//                     <View style={styles.resultContainer}>
//                         <Text style={styles.resultText}>Your score is: {score} out of 10</Text>
//                     </View>
//                 ) : (
//                     console.log('Loading Question')
//                 )}
//             </View>
//         </ScrollView>
//     );
// };

// export default Mcqs;


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './theme';
import { API_URL } from './Api';
import Loading from './LoadingScreen';
import { Ionicons } from '@expo/vector-icons';

const Mcqs = ({ route }) => {
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
    const [mcqData, setMCQData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [questionCount, setQuestionCount] = useState(0);
    const [score, setScore] = useState(0);
    const [testEnded, setTestEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(100);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                clearInterval(timer);
                // End the test when time runs out
                setTestEnded(true);
            }
        }, 1000); // Update the timer every second

        return () => clearInterval(timer); // Clean up the timer on unmount
    }, [timeLeft]);

    useEffect(() => {
        fetchRandomMCQ();
    }, []);

    const fetchRandomMCQ = () => {
        setIsFetching(true);

        API_URL
            .post('/mcqs')
            .then((response) => setMCQData(response.data))
            .catch((error) => console.error('Error fetching MCQ data:', error))
            .finally(() => setIsFetching(false));
    };

    const handleOptionSelect = (optionIndex) => {
        setSelectedOption(optionIndex);
    };

    const handleNextQuestion = () => {
        if (selectedOption !== null) {
            const selectedOptionData = mcqData.options[selectedOption];
            const isCorrect = selectedOptionData.is_correct;
            setScore(score + (isCorrect ? 1 : 0));
            setQuestionCount(questionCount + 1);
            setSelectedOption(null);

            if (questionCount === 9) {
                // End the test after 10 questions
                setTestEnded(true);
            } else {
                fetchRandomMCQ();
            }
        }
    };

    const sendScore = async () => {
        try {
            const endpoint = isGoogleSignedIn ? `google-scores/${email}` : `scores/${email}`;
            await API_URL.post(endpoint, { score });
            console.log('Score sent successfully');
        } catch (error) {
            console.error('Error sending score:', error);
        }
    };

    useEffect(() => {
        if (testEnded) {
            sendScore();
        }
    }, [testEnded]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.questions_container}>
                <Text style={styles.app_title}>IQ Test</Text>

                {isFetching ? (
                    <View style={styles.loadingContainer}>
                        <Loading />
                    </View>
                ) : mcqData && !testEnded ? (
                    <>
                        <View style={styles.question_con_prop}>
                            <View style={styles.timerContainer}>
                                <Ionicons name="timer-outline" size={24} color="black" />
                                <Text style={styles.timerText}>
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </Text>
                            </View>
                            <Text style={styles.question_count}>
                                Question {questionCount + 1} / 10
                            </Text>
                            <ScrollView>
                                <Text
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                    style={styles.question_text}
                                >
                                    {mcqData.question.question_text}
                                </Text>
                            </ScrollView>

                            {mcqData.options.map((option, index) => (
                                <View key={index}>
                                    <TouchableOpacity
                                        style={{
                                            marginBottom: '5%',
                                            padding: 10,
                                            marginVertical: 5,
                                            backgroundColor: selectedOption === index ? 'gray' : '#DDDDDD',
                                        }}
                                        onPress={() => handleOptionSelect(index)}
                                    >
                                        <Text>{option.option_text}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={handleNextQuestion}
                            disabled={selectedOption === null}
                        >
                            <Text style={{ color: 'white' }}>Next</Text>
                        </TouchableOpacity>
                    </>
                ) : testEnded ? (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Your score is: {score} out of 10</Text>
                    </View>
                ) : (
                    console.log('Loading Question')
                )}
            </View>
        </ScrollView>
    );
};

export default Mcqs;

