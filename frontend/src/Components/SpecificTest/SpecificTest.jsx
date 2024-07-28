import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../theme';

const SpecificTest = ({route}) => {
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
    const generalTest = route.params? route.params.generalTest : false;
    const navigation = useNavigation();

    const handleNavigation = (category) => {
        navigation.navigate(category,{ email,isGoogleSignedIn,generalTest});
    };

    return (
        <View style={styles.container}>
             <Text style={styles.specific_title}>Select a Specific Test</Text>
            <View style={styles.cardView}>
            <TouchableOpacity style={styles.card} onPress={() => handleNavigation('verbal_reasoning')}>
                <Text style={styles.cardText}>Verbal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => handleNavigation('logical')}>
                <Text style={styles.cardText}>Logical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => handleNavigation('abstract_reasoning')}>
                <Text style={styles.cardText}>Abstract</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => handleNavigation('numerical_reasoning')}>
                <Text style={styles.cardText}>Numerical</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

export default SpecificTest;
