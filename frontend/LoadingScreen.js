import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('./assets/loading.json')} // Update with your loading animation file
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
    },
});

export default Loading;
