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

const Scores = ({ route }) => {
    const email = route.params ? route.params.email : 'No email provided';
    const name = route.params ? route.params.name : 'No name provided'
    console.log('Email in Scores screen:', email);

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: 0,
                    right: 0,
                    bottom: '30%',
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
                <Text style={styles.app_title}>Score</Text>
                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btn_text}>Recent Scores</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
export default Scores