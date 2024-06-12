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
          setAverageIq(data.averageIq);
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

  const pieData = [
    { name: 'Verbal', score: averageScores.verbalReasoning.obtained },
    { name: 'Logical', score: averageScores.logical.obtained },
    { name: 'Numerical', score: averageScores.numericalReasoning.obtained },
    { name: 'Abstract', score: averageScores.abstractReasoning.obtained }
  ].map((data, index) => ({
    ...data,
    color: `rgba(0, 0, 255, ${1 - index / 4})`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  const additionalData = [
    {
      label: 'Total Obtained Score in Verbal',
      data: [averageScores.verbalReasoning.obtained],
    },
    {
      label: 'Total Obtained Score in Logical',
      data: [averageScores.logical.obtained],
    },
    {
      label: 'Total Obtained Score in Numerical',
      data: [averageScores.numericalReasoning.obtained],
    },
    {
      label: 'Total Obtained Score in Abstract',
      data: [averageScores.abstractReasoning.obtained],
    },
  ];

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
                labels: ['Verbal', 'Logical', 'Numerical', 'Abstract'],
                datasets: [
                  {
                    data: [
                      averageScores.verbalReasoning.obtained,
                      averageScores.logical.obtained,
                      averageScores.numericalReasoning.obtained,
                      averageScores.abstractReasoning.obtained
                    ],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color for lineData
                    label: 'IQ Scores',
                  },
                  ...additionalData.map((data, index) => ({
                    data: [data.data[0]],
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Orange color for additionalData
                    label: data.label,
                  })),
                ],
              }}
              width={additionalData.length * 120} // Adjust width based on additional data length
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
      <Text style={styles.IQScoreText}>Average IQ : {averageIq.toFixed(2)}</Text>
      <Text style={styles.IQScoreText}>Total Test Attempted : {averageScores.count}</Text>
    </ScrollView>
  );
};

export default IQScoresChart;
