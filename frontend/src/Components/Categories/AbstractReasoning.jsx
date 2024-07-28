import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput, BackHandler } from 'react-native';
import { styles } from '../../../theme';
import { API_URL } from '../../../Api';
import Loading from '../../../LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AbstractReasoning = ({ route }) => {
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
    const generalTest = route.params? route.params.generalTest : false;
    const age = route.params ? route.params.userAge : 'Age not passed in params';
    const [mcqData, setMCQData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [questionScores, setQuestionScores] = useState(Array(20).fill(0));
    const [testEnded, setTestEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1200);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [inputAge, setInputAge] = useState('');
    const [ageEntered, setAgeEntered] = useState(false);
    const [iq, setIQ] = useState(null);
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
        let endpoint = '/image-mcqs';
        if (inputAge <= 14) {
            endpoint = '/image-mcqs-kids';
        }
        console.log('Endpoint Selected',endpoint);
        API_URL
            .post(endpoint)
            .then((response) => {
                setMCQData(response.data);
                setIsImageLoaded(false);
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
                score: score,
                category: 'abstract',
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

    // useEffect(() => {
    //     const backAction = () => {
    //         if (!testEnded) {
    //             Alert.alert(
    //                 'Are you sure?',
    //                 'Your score will be counted if you go back.',
    //                 [
    //                     {
    //                         text: 'Yes, I want to go back',
    //                         onPress: async () => {
    //                             const score = questionScores.reduce((acc, val) => acc + val, 0);
    //                             await sendScore(score);
    //                             navigation.goBack();
    //                         },
    //                     },
    //                     {
    //                         text: "No, I'll continue the test",
    //                         onPress: () => { },
    //                         style: 'cancel'
    //                     }
    //                 ],
    //                 { cancelable: false }
    //             );
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction
    //     );

    //     return () => backHandler.remove();
    // }, [testEnded, questionScores]);

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
                                <Image
                                    source={{ uri: mcqData.question.question_img }}
                                    style={styles.questionImage}
                                    onLoad={() => setIsImageLoaded(true)}
                                />
                            </ScrollView>

                            {isImageLoaded && mcqData.options.map((option, index) => (
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
                        {isImageLoaded && (
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={handleNextQuestion}
                                disabled={selectedOption === null}
                            >
                                <Text style={{ color: 'white' }}>Next</Text>
                            </TouchableOpacity>
                        )}
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

export default AbstractReasoning;
