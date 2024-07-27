// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
// import Toast from 'react-native-toast-message';
// import Loading from '../../../LoadingScreen';
// import { Ionicons } from '@expo/vector-icons';
// import { API_URL } from '../../../Api'; // Adjust this import based on your actual API setup
// import { styles } from '../../../theme'; // Import your styles from theme file
// import { useNavigation } from '@react-navigation/native';

// const GeneralTest = ({route}) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const email = route.params ? route.params.email : 'No email provided';
//     const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
//     const [isImageLoaded, setIsImageLoaded] = useState(false);
//     const [iq, setIQ] = useState(null);
//     const [questions, setQuestions] = useState({
//         Verbal_Questions: null,
//         numerical_reasoning_questions: null,
//         Image_Questions: null,
//         Logical_Questions: null,
//     });
//     const [currentCategory, setCurrentCategory] = useState('Verbal_Questions'); // Track the current category
//     const [questionCount, setQuestionCount] = useState(0); // Track the question count for each category
//     const [score, setScore] = useState(0); // Track the score
//     const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes timer (1800 seconds)
//     const [testEnded, setTestEnded] = useState(false); // Flag to track if the test has ended
//     const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Track selected option index
//     const [totalScore, setTotalScore] = useState({ Verbal_Questions: 0, numerical_reasoning_questions: 0, Image_Questions: 0, Logical_Questions: 0 }); // Track total score for each category
//     const navigation = useNavigation();

//     useEffect(() => {
//         fetchQuestions(currentCategory); // Fetch initial category questions
//     }, []);

//     useEffect(() => {
//         if (timeLeft === 0) {
//             handleTestEnd();
//         }
//     }, [timeLeft]);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             if (!testEnded && timeLeft > 0) {
//                 setTimeLeft(prevTime => prevTime - 1);
//             } else {
//                 clearInterval(timer);
//                 setTestEnded(true);
//             }
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [testEnded, timeLeft]);

//     const handleBack=()=>{
//         navigation.goBack();

//     }

//     const fetchQuestions = async (category) => {
//         try {
//             setIsLoading(true);
//             const response = await API_URL.get(`/fetch-general/${category}`);
    //         const { question, options } = response.data;

    //         // Transform options to match the expected structure
    //         const transformedOptions = options.map(option => ({
    //             option_id: option.option_id,
    //             question_id: option.question_id,
    //             option_text: option.option_text,
    //             is_correct: option.is_correct === 1 || option.is_correct === true, // Convert is_correct to boolean
    //         }));

    //         setQuestions(prevQuestions => ({
    //             ...prevQuestions,
    //             [category]: { question, options: transformedOptions }
    //         }));
    //         setIsImageLoaded(false);

    //     } catch (error) {
    //         console.log(`Error fetching ${category} questions:`, error);
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Error',
    //             text2: `Failed to fetch ${category} questions`,
    //         });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

//     const handleOptionSelect = (optionIndex) => {
//         setSelectedOptionIndex(optionIndex);
//     };

//     const handleNextQuestion = async () => {
//         if (selectedOptionIndex === null) {
//             Toast.show({
//                 type: 'info',
//                 text1: 'Select an option',
//                 text2: 'Please select an option before proceeding to the next question.',
//             });
//             return;
//         }

//         const categoryQuestions = questions[currentCategory];
//         const selectedOption = categoryQuestions.options[selectedOptionIndex];

//         // Check if the selected option is correct and update the score
//         if (selectedOption.is_correct) {
//             setScore(prevScore => prevScore + 1);
//             setTotalScore(prevTotalScore => ({
//                 ...prevTotalScore,
//                 [currentCategory]: prevTotalScore[currentCategory] + 1
//             }));
//         }

//         const nextQuestionCount = questionCount + 1;
//         const questionLimits = {
//             Verbal_Questions: 20,
//             numerical_reasoning_questions: 25,
//             Image_Questions: 20,
//             Logical_Questions: 15
//         };

//         if (nextQuestionCount < questionLimits[currentCategory]) {
//             setQuestionCount(nextQuestionCount);
//             setSelectedOptionIndex(null); // Reset selected option
//             await fetchQuestions(currentCategory); // Fetch the next question in the current category
//         } else {
//             const nextCategory = getNextCategory(currentCategory);
//             if (nextCategory) {
//                 setCurrentCategory(nextCategory);
//                 setQuestionCount(0); // Reset question count for the next category
//                 setSelectedOptionIndex(null); // Reset selected option
//                 await fetchQuestions(nextCategory);
//             } else {
//                 handleTestEnd();
//             }
//         }
//     };

//     const getNextCategory = (currentCategory) => {
//         const categories = ['Verbal_Questions', 'numerical_reasoning_questions', 'Image_Questions', 'Logical_Questions'];
//         const currentIndex = categories.indexOf(currentCategory);
//         if (currentIndex !== -1 && currentIndex < categories.length - 1) {
//             return categories[currentIndex + 1];
//         }
//         return null; // Return null if all categories are finished
//     };

//     const handleTestEnd = async () => {
//         setTestEnded(true);
//         try {
//             setIsLoading(true);
//             const response = await API_URL.post('/calculate-IQ', {
//                 email:email,
//                 totalScore: totalScore,
//                 age:24,
//             });

//             const { iq } = response.data;
//             setIQ(iq);
//         } catch (error) {
//             console.error('Error calculating IQ:', error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Error',
//                 text2: 'Failed to calculate IQ',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

    // const formatTime = (seconds) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const remainingSeconds = seconds % 60;
    //     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    // };

    // const renderQuestionCard = (category) => {
    //     const categoryQuestions = questions[category];

    //     if (!categoryQuestions || !categoryQuestions.question) {
    //         return (
    //             <View style={styles.card}>
    //                 <Text style={styles.cardText}>Loading Questions...</Text>
    //             </View>
    //         );
    //     }

    //     const { question, options } = categoryQuestions;

    //     return (
    //         <ScrollView contentContainerStyle={styles.scrollContainer}>
    //         <View style={styles.questions_container}>
    //         <View style={styles.question_con_prop}>
    //                         <View style={styles.timerContainer}>
    //                             <Ionicons name="timer-outline" size={24} color="black" />
    //                             <Text style={styles.timerText}>
    //                             {formatTime(timeLeft)}
    //                             </Text>
    //                             </View>
    //                             <ScrollView>
    //                         <Text
    //                                 numberOfLines={3}
    //                                 ellipsizeMode="tail"
    //                                 style={styles.question_text}
    //                             >
    //                                 {question.question_text}
    //                             </Text>
    //                         </ScrollView>
    //                 {question.question_img && (
    //                     <ScrollView>
    //                     <Image
    //                         source={{ uri: question.question_img }}
    //                         style={styles.questionImage}
    //                         onLoad={() => setIsImageLoaded(true)}
    //                     />
    //                     </ScrollView>
    //                 )}
    //                 {(question.question_text || question.question_img) && options.map((option, index) => (
    //                     <TouchableOpacity
    //                         key={index}
    //                         style={[
    //                             styles.optionButton,
    //                             selectedOptionIndex === index ? styles.selectedOption : null,
    //                         ]}
    //                         onPress={() => handleOptionSelect(index)}
    //                     >
    //                         <Text style={[
    //                             styles.optionText,
    //                             selectedOptionIndex === index ? styles.selectedOptionText : null,
    //                         ]}>{option.option_text}</Text>
    //                     </TouchableOpacity>
    //                 ))}
    //             </View>
    //             <TouchableOpacity
    //                 style={styles.nextButton}
    //                 onPress={handleNextQuestion}
    //             >
    //                 <Text style={styles.nextButtonText}>Next</Text>
    //             </TouchableOpacity>
    //             </View>
    //         </ScrollView>
    //     );
    // };

    // return (
    //     <>
    //         {isLoading ? (
    //             <View style={styles.loadingContainer}>
    //                 <Loading/>
    //             </View>
    //         ) : questions && !iq ? (
    //             <>
    //                 {renderQuestionCard(currentCategory)}
    //             </>
    //         ) : iq !== null ? (
    //             <View style={styles.container}>
    //             <View style={styles.resultContainer}>
    //                 <Text style={styles.resultText}>Calculated IQ: {iq}</Text>
    //             </View>
    //             <TouchableOpacity
    //                             style={styles.nextButton}
    //                             onPress={handleBack}
    //                         >
    //                             <Text style={{ color: 'white' }}>Back</Text>
    //                         </TouchableOpacity>
    //             </View>
    //         ) : (
    //             console.log('Loading Question')
    //         )}
    //         </>
    //     );
    // };
    
//     export default GeneralTest;


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native';
import { API_URL } from '../../../Api';
import { styles } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../../LoadingScreen';

const GeneralTest = ({ route }) => {
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
        navigation.goBack();
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
            const response = await API_URL.post('/calculate-IQ-General', {
                totalScore: totalScore,
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

export default GeneralTest;
