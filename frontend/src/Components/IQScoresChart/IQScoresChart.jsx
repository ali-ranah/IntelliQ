import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { API_URL } from '../../../Api';
import Toast from 'react-native-toast-message';
import Loading from '../../../LoadingScreen';
import { styles } from '../../../theme';

const screenWidth = Dimensions.get('window').width;

const IQScoresChart = ({ route }) => {
  const [iqScores, setIqScores] = useState([]);
  const [averageScores, setAverageScores] = useState({});
  const [averageIq, setAverageIq] = useState(0);
  const [recentIq, setRecentIq] = useState(0);
  const [topIQ, setTopIQ] = useState(0);
  const [specificCategoryIq, setSpecificCategoryIq] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const email = route.params ? route.params.email : 'No email provided';
  const name = route.params ? route.params.name : 'No name provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : false;

  useEffect(() => {
    const fetchIqScores = async () => {
      try {
        setIsLoading(true);
        const response = await API_URL.get(`/user-iq-scores/${email}`, {
          params: { google: isGoogleSignedIn }
        });
        const data = response.data;

        if (data.iqScores.length > 0) {
          setIqScores(data.iqScores);
          setAverageScores(data.averageScores);
          setRecentIq(data.recentIq);
          setAverageIq(data.averageIq);
          setTopIQ(data.topIq);
          setSpecificCategoryIq(data.specificCategoryIq);
        } else {
          throw new Error('No Data Found');
        }
      } catch (error) {
        Toast.show({
          type: 'info',
          text1: 'Error',
          text2: 'No Data Found.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIqScores();
  }, [email, isGoogleSignedIn]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  if (iqScores.length === 0) {
    return <Text style={styles.noDataText}>No Data Available</Text>;
  }

  const findCategoryIq = (category) => {
    const categoryIq = specificCategoryIq.find(item => item.category === category);
    return categoryIq ? parseFloat(categoryIq.iq.toFixed(2)) : 0; // Fix to 2 decimal places
  };

  const pieData = [
    { name: 'IQ in Verbal', score: findCategoryIq('verbal_reasoning')},
    { name: 'IQ in Logical', score: findCategoryIq('logical') },
    { name: 'IQ in Numerical', score: findCategoryIq('numerical_reasoning') },
    { name: 'IQ in Abstract', score: findCategoryIq('abstract_reasoning') }
  ].map((data, index) => ({
    ...data,
    color: `rgba(0, 0, 255, ${1 - index / 4})`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    labelRotation: 45, // Rotate labels by 45 degrees
  };

  const topIq = Math.max(...iqScores.map(score => score.iq));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screen_title}>{name ? name : 'User'} IQ Scores</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="score"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <View style={styles.lineContainer}>
        <ScrollView horizontal>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['IQ in Verbal', 'IQ in Logical', 'IQ in Numerical', 'IQ in Abstract'],
                datasets: [
                  {
                    data: [
                      findCategoryIq('verbal_reasoning'),
                      findCategoryIq('logical'),
                      findCategoryIq('numerical_reasoning'),
                      findCategoryIq('abstract_reasoning')
                    ],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color for lineData
                    label: 'IQ Scores',
                  }
                ],
              }}
              width={screenWidth * 2} // Adjust width based on additional data length
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withOuterLines={false} // Disable outer lines for a cleaner look
              withCustomBarColorFromData={true} // Enable custom bar color from data
            />
          </View>
        </ScrollView>
      </View>
      <Text style={styles.IQScoreText}>Top IQ Ever: {topIQ.toFixed(2)}</Text>
      <Text style={styles.IQScoreText}>Recent IQ: {recentIq.toFixed(2)}</Text>
      <Text style={styles.IQScoreText}>Average IQ: {averageIq.toFixed(2)}</Text>
    </ScrollView>
  );
};

export default IQScoresChart;
