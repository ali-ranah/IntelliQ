import LottieView from 'lottie-react-native';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { styles } from "./theme"
import { useNavigation } from "@react-navigation/native"
import { GoogleSignin } from "@react-native-google-signin/google-signin"

const ManageAccount = ({ route }) => {
    const email = route.params ? route.params.email : 'No email provided';
    const name = route.params ? route.params.name : 'No name provided'
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In'
    console.log('Google Signed In?:', isGoogleSignedIn);
    console.log('Email in Manage Account screen:', email);

    const navigation = useNavigation()



    const handleProfile = () => {
        navigation.navigate('Profile', { email, name, isGoogleSignedIn });
    }

    const handlePass = () => {
        navigation.navigate('UpdatePassword', { email, isGoogleSignedIn });
    }


    const handleLogout = async () => {
        // Clear user session, reset authentication tokens, etc.
        // ...

        // Sign out of Google if applicable
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
            console.log('Google Not Signed In', error);
        }

        navigation.navigate('Logout');
        // Optional: You may want to wait for the animation to complete before navigating to the login screen
        setTimeout(() => {
            // Navigate to the login screen or the desired entry point
            navigation.navigate('Login');
        }, 2500); // Adjust the timeout based on the duration of your Lottie animation
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: 0,
                    right: 0,
                    bottom: '65%',
                    zIndex: 1,
                    marginBottom: '10%'
                }}
            >
                <LottieView
                    source={require('./assets/manage.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />

            </KeyboardAvoidingView>

            <View style={styles.container}>
                <Text style={styles.screen_title}>Account</Text>
                <TouchableOpacity style={styles.btn} onPress={handleProfile}><Text style={styles.btn_text}>Profile</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={handlePass}><Text style={styles.btn_text}>Change Password</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={handleLogout}><Text style={styles.btn_text}>Logout</Text></TouchableOpacity >
            </View >
        </>
    )
}
export default ManageAccount