import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView,Alert,BackHandler } from 'react-native';
import { styles } from '../../../theme';
import { API_URL } from '../../../Api';
import Loading from '../../../LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const NumericalReasoning = ({ route }) => {
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
    const [mcqData, setMCQData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [questionCount, setQuestionCount] = useState(0);
    const [questionScores, setQuestionScores] = useState(Array(25).fill(0)); // Array to store scores for each question
    const [testEnded, setTestEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(100);
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
        fetchRandomMCQ();
    }, []);



    const fetchRandomMCQ = () => {
        setIsFetching(true);

        API_URL
            .post('/numerical-reasoning-mcqs')
            .then((response) => {
                setMCQData(response.data);
            })
            .catch((error) => console.error('Error fetching MCQ data:', error))
            .finally(() => setIsFetching(false));
    };

    const handleOptionSelect = (optionKey) => {
        setSelectedOption(optionKey);
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

            if (questionCount === 24) {
                setTestEnded(true);
            } else {
                fetchRandomMCQ();
            }
        }
    };

    const sendScore = async (score) => {
        try {
            const endpoint = isGoogleSignedIn ? `/update-category-score-google/${email}` : `/update-category-score/${email}`;
            await API_URL.post(endpoint, { category: 'numerical_reasoning', score });
            const categoryendpoint = isGoogleSignedIn ? `/update-attempted-categories-google/${email}` : `/update-attempted-categories/${email}`;
            await API_URL.post(categoryendpoint, { category: 'numerical_reasoning', reset: 0 });  
            console.log('Score sent successfully');
        } catch (error) {
            console.error('Error sending score:', error);
        }
    };
     
    
    useEffect(() => {
        const backAction = () => {
            if (!testEnded) {
                Alert.alert(
                    'Are you sure?',
                    'Your score will be counted if you go back.',
                    [
                        {
                            text: 'Yes, I want to go back',
                            onPress: async () => {
                                const score = questionScores.reduce((acc, val) => acc + val, 0);
                                await sendScore(score);
                                navigation.goBack();
                            },
                        },
                        {
                            text: "No, I'll continue the test",
                            onPress: () => {},
                            style: 'cancel'
                        }
                    ],
                    { cancelable: false }
                );
                return true;
            } else {
                return false; // Let the default back button behavior occur
            }
        };
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
    
        return () => backHandler.remove();
    }, [testEnded,questionScores]);

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
                                Question {questionCount + 1} / 25
                            </Text>
                            <ScrollView>
                                <Text
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                    style={styles.question_text}
                                >
                                    {mcqData.question_text}
                                </Text>
                            </ScrollView>

                            {Object.keys(mcqData.options).map((key) => (
                                <View key={key}>
                                    <TouchableOpacity
                                        style={{
                                            marginBottom: '5%',
                                            padding: 10,
                                            marginVertical: 5,
                                            backgroundColor: selectedOption === key ? 'gray' : '#DDDDDD',
                                        }}
                                        onPress={() => handleOptionSelect(key)}
                                    >
                                        <Text>{mcqData.options[key]}</Text>
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
<Text style={styles.resultText}>
    Your score is: {questionScores.reduce((acc, score) => acc + score, 0)} out of 25
</Text>
                ) : (
                    console.log('Loading Question')
                )}
            </View>
        </ScrollView>
    );
};

export default NumericalReasoning;
