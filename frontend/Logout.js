import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles } from './theme';

const Logout = () => {
    return (
        <>
            <View style={styles.container}>
                <LottieView
                    source={require('./assets/logout.json')} // Update with your Logout animation file
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>
        </>

    );
};

export default Logout;
