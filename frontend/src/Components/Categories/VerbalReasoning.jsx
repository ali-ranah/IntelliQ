import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, BackHandler } from 'react-native';
import { styles } from '../../../theme';
import { API_URL } from '../../../Api';
import Loading from '../../../LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VerbalReasoning = ({ route }) => {
    const { email, isGoogleSignedIn, userAge,generalTest} = route.params || {};
    const [mcqData, setMCQData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [iq, setIQ] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [questionScores, setQuestionScores] = useState(Array(20).fill(0));
    const [testEnded, setTestEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1200);
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

    const fetchRandomMCQ = () => {
        setIsFetching(true);
        let endpoint = '/verbal-mcqs';
        if (inputAge <= 14) {
            endpoint = '/verbal-mcqs-kids';
        }
        console.log('Endpoint Selected',endpoint);
        API_URL.post(endpoint)
            .then((response) => {
                const mcqData = response.data;
                if (inputAge <= 14) {
                    const options = [
                        { option_text: mcqData.options.option_a, is_correct: mcqData.correct_answer === mcqData.options.option_a },
                        { option_text: mcqData.options.option_b, is_correct: mcqData.correct_answer === mcqData.options.option_b },
                        { option_text: mcqData.options.option_c, is_correct: mcqData.correct_answer === mcqData.options.option_c },
                        { option_text: mcqData.options.option_d, is_correct: mcqData.correct_answer === mcqData.options.option_d }
                    ];
    
                    setMCQData({
                        ID: mcqData.id,
                        Question: mcqData.question_text,
                        options: options
                    });
                } else {
                    const options = mcqData.options.map((option) => ({
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

    const handleBack = () => {
        navigation.navigate('SpecificTest');
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

            if (questionCount === 19) {
                setTestEnded(true);
            } else {
                fetchRandomMCQ();
            }
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

    const sendScore = async (score) => {
        setIsFetching(true);
        try {
            let endpoint;

            if (generalTest) {
                endpoint = isGoogleSignedIn ? '/calculate-IQ-Specific-Practice-google' : '/calculate-IQ-Specific-Practice';
            } else {
                endpoint = isGoogleSignedIn ? '/calculate-IQ-Specific-google' : '/calculate-IQ-Specific';
            }
            console.log('Iq endpoint choosen',endpoint)
            const response = await API_URL.post(endpoint, {
                score,
                category: 'verbal',
                email,
            });
            const { iq } = response.data;
            setIQ(iq);
        } catch (error) {
            console.error('Error calculating iq:', error);
        } finally {
            setIsFetching(false);
        }
    };

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
                                Question {questionCount + 1} / 20
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
                ): (
                    console.log('Loading Question')
                )}
            </View>
        </ScrollView>
    );
};

export default VerbalReasoning;
