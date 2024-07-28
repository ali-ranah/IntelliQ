import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../theme';

const GeneralPractice = ({route}) => {
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
    const generalTest = true;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View></View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('SpecificTest',{ email,isGoogleSignedIn,generalTest })}
      >
        <Text style={styles.btn_text}>Specific Test</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('General',{ email,isGoogleSignedIn })}
      >
        <Text style={styles.btn_text}>General Test</Text>
      </TouchableOpacity>
    </View>
  );
}

export default GeneralPractice;
