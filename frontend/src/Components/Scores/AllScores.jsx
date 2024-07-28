import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { API_URL } from '../../../Api';
import { styles } from '../../../theme';
import Loading from '../../../LoadingScreen';
import { ScrollView } from 'react-native-gesture-handler';

const AllScores = ({ route }) => {
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = route.params ? route.params.email : 'No email provided';
  const name = route.params ? route.params.name : 'No name provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const endpoint = isGoogleSignedIn ? `/top-scores-google/${email}` : `/top-scores/${email}`;
        const response = await API_URL.get(endpoint);
        setTopScores(response.data.topScores);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching top scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScores();
  }, [email]);

  return (

      <>
       {loading ? (
        <Loading/>
      ) : topScores.length > 0 ? (
        <View style={styles.container}>
        <Text style={styles.score_title}>Top IQ Scores</Text>
         <View style={styles.content}>
        <FlatList
          data={topScores}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={style.scoreItem}>
              <Text style={style.userName}>{name}</Text>
              <Text style={style.score}>{item.iq}</Text>
              <Text style={style.timestamp}>{item.timestamp}</Text>
            </View>
        
          )}
        />
            </View>
            </View>
      ) : (
        <Text style={style.message}>No Scores Found</Text>
      )}

    </>
  );
};

const style = StyleSheet.create({
  scoreItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
  },
  message: {
    fontSize: 18,
    color: '#888',
  },
});

export default AllScores;
