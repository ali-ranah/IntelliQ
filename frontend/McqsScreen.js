import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { styles } from './theme';
import { API_URL } from './Api';
import Loading from './LoadingScreen';

const Mcqs = ({ navigation }) => {
    const [mcqData, setMCQData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFetching, setIsFetching] = useState(true); // Initially set to true to fetch on the first render

    const fetchRandomMCQ = () => {
        setIsFetching(true);

        API_URL
            .post('/mcqs')
            .then((response) => setMCQData(response.data))
            .catch((error) => console.error('Error fetching MCQ data:', error))
            .finally(() => setIsFetching(false));
    };

    useEffect(() => {
        // Fetch only on the initial render when selectedOption is null
        if (selectedOption === null) {
            fetchRandomMCQ();
        }
    }, [selectedOption]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        // Proceed only if an option is selected
        if (selectedOption !== null) {
            // Set mcqData to null to trigger the useEffect fetch
            setMCQData(null);
            setSelectedOption(null);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.questions_container}>
                <Text style={styles.app_title}>IQ Test</Text>

                {isFetching ? (
                    <View style={styles.loadingContainer}>
                        <Loading />
                    </View>
                ) : mcqData ? (
                    <>
                        <View style={styles.question_con_prop}>
                            <ScrollView>
                                <Text
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                    style={styles.question_text}
                                >
                                    {mcqData.Question}
                                </Text>
                            </ScrollView>

                            {['option1', 'option2', 'option3', 'option4'].map((key) => (
                                <View key={key}>
                                    <TouchableOpacity
                                        style={{
                                            marginBottom: '5%',
                                            padding: 10,
                                            marginVertical: 5,
                                            backgroundColor:
                                                selectedOption === mcqData[key] ? 'gray' : '#DDDDDD',
                                        }}
                                        onPress={() => handleOptionSelect(mcqData[key])}
                                    >
                                        <Text>{mcqData[key]}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={handleNextQuestion}
                            disabled={!selectedOption}
                        >
                            <Text style={{ color: 'white' }}>Next</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    console.log('Loading Question')
                )}
            </View>
        </ScrollView>
    );
};

export default Mcqs;
