import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../theme';

const ScoreScreen = ({route}) => {
  const navigation = useNavigation();
  const email = route.params ? route.params.email : 'No email provided';
  const name = route.params ? route.params.name : 'No name provided'
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

  const handleAllScoresPress = () => {
    navigation.navigate('AllScores',{email,name,isGoogleSignedIn});
  };

  const handleRecentScoresPress = () => {
    navigation.navigate('RecentScores',{email,name,isGoogleSignedIn});
  };

  return (
    <>
    <View style={styles.container}>
    <Text style={styles.screen_title}>Select a Score</Text>
      <TouchableOpacity style={styles.btn} onPress={handleAllScoresPress}>
        <Text style={styles.cardText}>All Scores</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleRecentScoresPress}>
        <Text style={styles.cardText}>Recent Scores</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};


export default ScoreScreen;
