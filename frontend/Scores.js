import React from "react";
import LottieView from 'lottie-react-native';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { styles } from "./theme"
import { useNavigation } from '@react-navigation/native';

const Scores = ({ route }) => {
    const email = route.params ? route.params.email : 'No email provided';
    const name = route.params ? route.params.name : 'No name provided'
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

    const navigation = useNavigation();
    console.log('Email in Scores screen:', email);

 const handleScores = () =>{
    navigation.navigate('ScoreScreen',{email,name,isGoogleSignedIn});
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
                    bottom: '40%',
                    zIndex: 1,
                    marginBottom: '10%'
                }}
            >
                <LottieView
                    source={require('./assets/score.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />

            </KeyboardAvoidingView>
            <View style={styles.container}>
                <Text style={styles.screen_title}>Score</Text>
                <TouchableOpacity style={styles.btn} onPress={handleScores}>
                    <Text style={styles.btn_text}>Check Scores</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
export default Scores