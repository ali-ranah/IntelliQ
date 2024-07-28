import React from "react";
import {
    View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
    Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";
import { styles } from "./theme";

const Test = ({ route }) => {
    const navigation = useNavigation();
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

    console.log('Email in Test screen:', email);


    const handleIQTest = () => {
        navigation.navigate('TestSelection',{ email,isGoogleSignedIn })
    }

    const handleGeneralTest = () => {
        navigation.navigate('GeneralPractice',{ email,isGoogleSignedIn })
    }



    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: 0,
                    right: 0,
                    bottom: '60%',
                    zIndex: 1,
                    marginBottom: '10%'
                }}
            >
                <LottieView
                    source={require('./assets/Test.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />

            </KeyboardAvoidingView>
            <View style={styles.container}>

                <Text style={styles.screen_title}>IQ Test</Text>
                <TouchableOpacity style={styles.btn} onPress={handleIQTest}>
                    <Text style={styles.btn_text}>Start IQ Test</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={handleGeneralTest}>
                    <Text style={styles.btn_text}>Start IQ Test Practice</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default Test;
