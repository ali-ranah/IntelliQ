import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { API_URL } from '../../../Api';
import { styles } from '../../../theme';
import Loading from '../../../LoadingScreen';

const RecentScores = ({ route }) => {
  const [recentScore, setRecentScore] = useState(null);
  const [timestamp, setTimeStamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = route.params ? route.params.email : 'No email provided';
  const name = route.params ? route.params.name : 'No name provided';
  const [userName, setUserName] = useState(null);
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';

  useEffect(() => {
    const fetchRecentScore = async () => {
      try {
        const endpoint = isGoogleSignedIn ? `/recent-score-google/${email}` : `/recent-score/${email}`;
        const response = await API_URL.get(endpoint);
        setRecentScore(response.data.score);
        setUserName(response.data.userName);
        setTimeStamp(response.data.timestamp);
        console.log(response.data);
      } catch (error) {
        console.log('Error fetching recent score:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScore();
  }, [email]);

  return (
    <>
      {loading ? (
        <Loading/>
      ) : recentScore !== null ? (
        <View style={style.container}>
     <Text style={style.title}>Recent IQ Scores</Text>
     <View style={styles.content}>
        <View style={style.scoreItem}>
          <Text style={style.userName}>{userName}</Text>
          <Text style={style.score}>{recentScore}</Text>
          <Text style={style.timestamp}>{timestamp}</Text>
        </View>
        </View>
        </View>
      ) : (
        <Text style={style.message}>No Scores Found</Text>
      )}
    </>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fb5b5a",
    marginBottom: 20,
  },
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

export default RecentScores;
