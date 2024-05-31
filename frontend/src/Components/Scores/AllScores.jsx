import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { API_URL } from '../../../Api';
import { styles } from '../../../theme';

const AllScores = ({ route }) => {
  const [topScores, setTopScores] = useState([]);
  const email = route.params ? route.params.email : 'No email provided';
  const name = route.params ? route.params.name : 'No name provided'
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const endpoint = isGoogleSignedIn ? `/top-scores-google/${email}` : `/top-scores/${email}`;
        const response = await API_URL.get(endpoint);
        setTopScores(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching top scores:', error);
      }
    };

    fetchTopScores();
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Scores</Text>
      
      {topScores.length > 0 ? (
        <FlatList
          data={topScores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={style.scoreItem}>
              <Text style={style.userName}>{item.userName}</Text>
              <Text style={style.score}>{item.score}</Text>
            </View>
          )}
        />
      ) : (

        <Text style={styles.container}>No Scores Found</Text>

      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
});

export default AllScores;

