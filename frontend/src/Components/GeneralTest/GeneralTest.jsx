// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
// import Toast from 'react-native-toast-message';
// import Loading from '../../../LoadingScreen';
// import { API_URL } from '../../../Api'; // Adjust this import based on your actual API setup
// import { styles } from '../../../theme'; // Import your styles from theme file

// const GeneralTest = () => {
//     const [isLoading, setIsLoading] = useState(false);
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
//     const [selectedOptions, setSelectedOptions] = useState({}); // Track selected options by option_text

//     useEffect(() => {
//         fetchQuestions('Verbal_Questions'); // Fetch Verbal Questions initially
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
//             setIsLoading(false);

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
//         } catch (error) {
//             setIsLoading(false);
//             console.error(`Error fetching ${category} questions:`, error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Error',
//                 text2: `Failed to fetch ${category} questions`,
//             });
//         }
//     };

//     const handleOptionSelect = async (selectedOption) => {
//         // Update the score or handle selected option logic here if needed
//         // For now, just proceed to the next question
//         setQuestionCount(questionCount + 1);
//         setSelectedOptions(prevSelected => ({
//             ...prevSelected,
//             [selectedOption.option_text]: selectedOption.option_text, // Track selected option by option_text
//         }));

//         // Fetch next category questions when all questions are answered for current category
//         if (questionCount === 29) { // 30 questions limit (0-based index)
//             const nextCategory = getNextCategory(currentCategory);
//             if (nextCategory) {
//                 setCurrentCategory(nextCategory);
//                 setQuestionCount(0); // Reset question count for the next category
//                 await fetchQuestions(nextCategory);
//             } else {
//                 // All categories finished, handle completion logic here
//                 console.log('All categories finished');
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
//         // Handle end of test logic here, e.g., calculate IQ, send score, etc.
//         setTestEnded(true);

//         try {
//             setIsLoading(true);
//             // Calculate IQ logic here based on scores if needed
//             // For now, just setting dummy IQ
//             const calculatedIQ = 120;
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
//                     <Text style={styles.cardText}>Loading {category.toUpperCase()} Questions...</Text>
//                 </View>
//             );
//         }
    
//         const { question, options } = categoryQuestions;
    
//         return (
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <View style={styles.questionContainer}>
//                     <Text style={styles.cardTitle}>{category.toUpperCase()} Question</Text>
//                     <Text style={styles.questionText}>{question.question_text}</Text>
//                     {options.map(option => (
//                         <TouchableOpacity
//                             key={option.option_text} // Use option_text as key
//                             style={[
//                                 styles.optionButton,
//                                 selectedOptions[option.option_text] ? styles.selectedOption : null, // Apply selected style if selected
//                             ]}
//                             onPress={() => handleOptionSelect(option)}
//                         >
//                             <Text style={styles.optionText}>{option.option_text}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </ScrollView>
//         );
//     };
    

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             {isLoading && <Loading visible={isLoading} />}

//             <View style={styles.timerContainer}>
//                 <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>
//             </View>

//             {renderQuestionCard(currentCategory)}

//             {iq !== null && (
//                 <View style={styles.resultContainer}>
//                     <Text style={styles.resultText}>Calculated IQ: {iq}</Text>
//                 </View>
//             )}
//         </ScrollView>
//     );
// };

// export default GeneralTest;


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import Loading from '../../../LoadingScreen';
import { API_URL } from '../../../Api'; // Adjust this import based on your actual API setup
import { styles } from '../../../theme'; // Import your styles from theme file

const GeneralTest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [iq, setIQ] = useState(null);
    const [questions, setQuestions] = useState({
        Verbal_Questions: null,
        numerical_reasoning_questions: null,
        Image_Questions: null,
        Logical_Questions: null,
    });
    const [currentCategory, setCurrentCategory] = useState('Verbal_Questions'); // Track the current category
    const [questionCount, setQuestionCount] = useState(0); // Track the question count for each category
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes timer (1800 seconds)
    const [testEnded, setTestEnded] = useState(false); // Flag to track if the test has ended
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Track selected option index

    useEffect(() => {
        fetchQuestions('Verbal_Questions'); // Fetch Verbal Questions initially
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

    const fetchQuestions = async (category) => {
        try {
            setIsLoading(true);
            const response = await API_URL.get(`/fetch-general/${category}`);
            setIsLoading(false);

            const { question, options } = response.data;

            // Transform options to match the expected structure
            const transformedOptions = options.map(option => ({
                option_id: option.option_id,
                question_id: option.question_id,
                option_text: option.option_text,
                is_correct: option.is_correct === 1, // Convert is_correct to boolean
            }));

            setQuestions(prevQuestions => ({
                ...prevQuestions,
                [category]: { question, options: transformedOptions }
            }));
        } catch (error) {
            setIsLoading(false);
            console.error(`Error fetching ${category} questions:`, error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Failed to fetch ${category} questions`,
            });
        }
    };

    const handleOptionSelect = async (optionIndex) => {
        setSelectedOptionIndex(optionIndex);

        // Update the score or handle selected option logic here if needed
        // For now, just proceed to the next question
        setQuestionCount(questionCount + 1);

        // Fetch next category questions when all questions are answered for current category
        if (questionCount === 29) { // 30 questions limit (0-based index)
            const nextCategory = getNextCategory(currentCategory);
            if (nextCategory) {
                setCurrentCategory(nextCategory);
                setQuestionCount(0); // Reset question count for the next category
                await fetchQuestions(nextCategory);
            } else {
                // All categories finished, handle completion logic here
                console.log('All categories finished');
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
        // Handle end of test logic here, e.g., calculate IQ, send score, etc.
        setTestEnded(true);

        try {
            setIsLoading(true);
            // Calculate IQ logic here based on scores if needed
            // For now, just setting dummy IQ
            const calculatedIQ = 120;
            setIQ(calculatedIQ);
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
                    <Text style={styles.cardText}>Loading {category.toUpperCase()} Questions...</Text>
                </View>
            );
        }
    
        const { question, options } = categoryQuestions;
    
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.questionContainer}>
                    <Text style={styles.cardTitle}>{category.toUpperCase()} Question</Text>
                    <Text style={styles.questionText}>{question.question_text}</Text>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index} // Use index as key
                            style={[
                                styles.optionButton,
                                selectedOptionIndex === index ? styles.selectedOption : null, // Apply selected style if selected
                            ]}
                            onPress={() => handleOptionSelect(index)}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedOptionIndex === index ? styles.selectedOptionText : null, // Apply selected text style if selected
                            ]}>{option.option_text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        );
    };
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {isLoading && <Loading visible={isLoading} />}

            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>
            </View>

            {renderQuestionCard(currentCategory)}

            {iq !== null && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Calculated IQ: {iq}</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default GeneralTest;

