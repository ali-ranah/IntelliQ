// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
// import Toast from 'react-native-toast-message';
// import Loading from '../../../LoadingScreen';
// import { API_URL } from '../../../Api'; // Adjust this import based on your actual API setup
// import { styles } from '../../../theme'; // Import your styles from theme file

// const GeneralTest = () => {
//     const [isLoading, setIsLoading] = useState(false);
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
//     const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes timer (1800 seconds)
//     const [testEnded, setTestEnded] = useState(false); // Flag to track if the test has ended
//     const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Track selected option index

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

//     const fetchQuestions = async (category) => {
//         try {
//             setIsLoading(true);
//             const response = await API_URL.get(`/fetch-general/${category}`);
//             const { question, options } = response.data;

//             // Transform options to match the expected structure
//             const transformedOptions = options.map(option => ({
//                 option_id: option.option_id,
//                 question_id: option.question_id,
//                 option_text: option.option_text,
//                 is_correct: option.is_correct === 1, // Convert is_correct to boolean
//             }));

//             setQuestions(prevQuestions => ({
//                 ...prevQuestions,
//                 [category]: { question, options: transformedOptions }
//             }));
//             setIsImageLoaded(false);

//         } catch (error) {
//             console.log(`Error fetching ${category} questions:`, error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Error',
//                 text2: `Failed to fetch ${category} questions`,
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

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

//         const nextQuestionCount = questionCount + 1;

//         if (nextQuestionCount < 10) {
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
//             const calculatedIQ = 120; // Dummy IQ calculation
//             setIQ(calculatedIQ);
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

//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     const renderQuestionCard = (category) => {
//         const categoryQuestions = questions[category];

//         if (!categoryQuestions || !categoryQuestions.question) {
//             return (
//                 <View style={styles.card}>
//                     <Text style={styles.cardText}>Loading Questions...</Text>
//                 </View>
//             );
//         }

//         const { question, options } = categoryQuestions;

//         return (
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <View style={styles.questionContainer}>
//                     <Text style={styles.questionText}>{question.question_text}</Text>
//                     {question.question_img && (
//                         <Image
//                             source={{ uri: question.question_img }}
//                             style={styles.questionImage}
//                             onLoad={() => setIsImageLoaded(true)}
//                         />
//                     )}
//                     {options.map((option, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             style={[
//                                 styles.optionButton,
//                                 selectedOptionIndex === index ? styles.selectedOption : null,
//                             ]}
//                             onPress={() => handleOptionSelect(index)}
//                         >
//                             <Text style={[
//                                 styles.optionText,
//                                 selectedOptionIndex === index ? styles.selectedOptionText : null,
//                             ]}>{option.option_text}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//                 <TouchableOpacity
//                     style={styles.nextButton}
//                     onPress={handleNextQuestion}
//                 >
//                     <Text style={styles.nextButtonText}>Next</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {isLoading ? (
//                 <Loading visible={isLoading} />
//             ) :questions && !iq ? (
//                 <>
//                     <View style={styles.timerContainer}>
//                         <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>
//                     </View>
//                     {renderQuestionCard(currentCategory)}
//                 </>
//             ): iq !== null ? (
//                 <View style={styles.resultContainer}>
//                     <Text style={styles.resultText}>Calculated IQ: {iq}</Text>
//                 </View>
//             ):(
//                 console.log('Loading Question')
//             )}
//         </View>
//     );
// };

// export default GeneralTest;


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import Loading from '../../../LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../../Api'; // Adjust this import based on your actual API setup
import { styles } from '../../../theme'; // Import your styles from theme file
import { useNavigation } from '@react-navigation/native';

const GeneralTest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [iq, setIQ] = useState(null);
    const [questions, setQuestions] = useState({
        Verbal_Questions: null,
        numerical_reasoning_questions: null,
        Image_Questions: null,
        Logical_Questions: null,
    });
    const [currentCategory, setCurrentCategory] = useState('Verbal_Questions'); // Track the current category
    const [questionCount, setQuestionCount] = useState(0); // Track the question count for each category
    const [score, setScore] = useState(0); // Track the score
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes timer (1800 seconds)
    const [testEnded, setTestEnded] = useState(false); // Flag to track if the test has ended
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Track selected option index
    const navigation = useNavigation();

    useEffect(() => {
        fetchQuestions(currentCategory); // Fetch initial category questions
    }, []);

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

    const handleBack=()=>{
        navigation.goBack();

    }

    const fetchQuestions = async (category) => {
        try {
            setIsLoading(true);
            const response = await API_URL.get(`/fetch-general/${category}`);
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

    const handleOptionSelect = (optionIndex) => {
        setSelectedOptionIndex(optionIndex);
    };

    const handleNextQuestion = async () => {
        if (selectedOptionIndex === null) {
            Toast.show({
                type: 'info',
                text1: 'Select an option',
                text2: 'Please select an option before proceeding to the next question.',
            });
            return;
        }

        const categoryQuestions = questions[currentCategory];
        const selectedOption = categoryQuestions.options[selectedOptionIndex];

        // Check if the selected option is correct and update the score
        if (selectedOption.is_correct) {
            setScore(prevScore => prevScore += 1);
        }

        const nextQuestionCount = questionCount + 1;

        if (nextQuestionCount < 4) {
            setQuestionCount(nextQuestionCount);
            setSelectedOptionIndex(null); // Reset selected option
            await fetchQuestions(currentCategory); // Fetch the next question in the current category
        } else {
            const nextCategory = getNextCategory(currentCategory);
            if (nextCategory) {
                setCurrentCategory(nextCategory);
                setQuestionCount(0); // Reset question count for the next category
                setSelectedOptionIndex(null); // Reset selected option
                await fetchQuestions(nextCategory);
            } else {
                handleTestEnd();
            }
        }
    };

    const getNextCategory = (currentCategory) => {
        const categories = ['Verbal_Questions', 'numerical_reasoning_questions', 'Image_Questions', 'Logical_Questions'];
        const currentIndex = categories.indexOf(currentCategory);
        if (currentIndex !== -1 && currentIndex < categories.length - 1) {
            return categories[currentIndex + 1];
        }
        return null; // Return null if all categories are finished
    };

    const handleTestEnd = async () => {
        setTestEnded(true);
        try {
            setIsLoading(true);
            // Assuming you have the total score from all categories
            const totalScore = calculateTotalScore();
            const response = await API_URL.post('/calculate-IQ-General', {
                score: totalScore,
            });

            const { iq } = response.data;
            setIQ(iq);
        } catch (error) {
            console.error('Error calculating IQ:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to calculate IQ',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotalScore = () => {
        // Return the accumulated score
        return score;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderQuestionCard = (category) => {
        const categoryQuestions = questions[category];

        if (!categoryQuestions || !categoryQuestions.question) {
            return (
                <View style={styles.card}>
                    <Text style={styles.cardText}>Loading Questions...</Text>
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

    return (
        <>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Loading/>
                </View>
            ) : questions && !iq ? (
                <>
                    {renderQuestionCard(currentCategory)}
                </>
            ) : iq !== null ? (
                <View style={styles.container}>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Calculated IQ: {iq}</Text>
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
