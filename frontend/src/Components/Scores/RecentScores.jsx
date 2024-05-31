import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { API_URL } from '../../../Api';
import { styles } from '../../../theme';

const RecentScores = ({ route }) => {
  const [recentScore, setRecentScore] = useState(null);
  const email = route.params ? route.params.email : 'No email provided';
  const name = route.params ? route.params.name : 'No name provided';
  const [userName,setUserName] = useState(null);
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

  useEffect(() => {
    const fetchRecentScore = async () => {
      try {
        const endpoint = isGoogleSignedIn ? `/recent-score-google/${email}` : `/recent-score/${email}`;
        const response = await API_URL.get(endpoint);
        setRecentScore(response.data.score);
        setUserName(response.data.userName);
        console.log(response.data);
      } catch (error) {
        console.log('Error fetching recent score:', error);
      }
    };

    fetchRecentScore();
  }, [email]);

  return (
    <>
    <View style={style.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Recent Score</Text>
      </View>
      {recentScore !== null ? (
            <View style={styles.questions_container}>
        <View style={style.scoreItem}>
          <Text style={style.userName}>{userName}</Text>
          <Text style={style.score}>{recentScore}</Text>
        </View>
                          </View>
      ) : (
        <Text style={styles.container}>No Scores Found</Text>

      )}
      </View>
      </>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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

export default RecentScores;
