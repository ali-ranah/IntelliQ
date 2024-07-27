import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../theme';

const TestSelection = ({route}) => {
    const email = route.params ? route.params.email : 'No email provided';
    const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View></View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('SpecificTest',{ email,isGoogleSignedIn })}
      >
        <Text style={styles.btn_text}>Specific Test</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Category',{ email,isGoogleSignedIn })}
      >
        <Text style={styles.btn_text}>All Categories</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TestSelection;
