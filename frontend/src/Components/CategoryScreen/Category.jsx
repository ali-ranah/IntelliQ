import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../../theme";

const Category = ({route}) => {
  const email = route.params ? route.params.email : 'No email provided';
  const isGoogleSignedIn = route.params ? route.params.isGoogleSignedIn : 'Not Signed In';
  console.log('Email in Category screen:', email);
  const navigation = useNavigation();

  const handleCategory = () =>{
    navigation.navigate('Mcqs',{ email,isGoogleSignedIn });
  };

  return (
    <View style={styles.container}>
          <Text style={styles.screen_title}>Select a Category</Text>
    <View style={styles.cardView}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={handleCategory}
        >
          <Text style={styles.cardText}>Logical</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={handleCategory}
        >
          <Text style={styles.cardText}>Analytical</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={handleCategory}
        >
          <Text style={styles.cardText}>Pattern Recognition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={handleCategory}
        >
          <Text style={styles.cardText}>Verbal Reasoning</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};

export default Category;
