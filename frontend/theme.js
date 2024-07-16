import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    selectedOption: {
        backgroundColor: '#a0c0ff', // Example color for selected option background
    },
    optionText: {
        fontSize: 16,
    },
    selectedOptionText: {
        color: '#fff', // Example color for selected option text
    },
    switchButtonsContainer: {
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        zIndex: 1,
    },
    l_scontainer: {
        flex: 1,
    },
    lottieBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 90,
    },
    content: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchButton: {
        backgroundColor: '#fb5b5a',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    questionImage: {
        width: '100%' , // Adjust the width as needed
        height: 200 , // Adjust the height as needed
        resizeMode: 'contain',
    },
    switchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    app_title: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 10,
        marginTop: '20%',

    },
    title: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 20,
        marginTop: '65%',
        zIndex: 1,

    },
    lottie: {
        flex: 1,
        position: 'absolute',
        alignContent: 'center',
        justifyContent: 'center'
    },
    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        borderWidth: 2,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,
    },
    card: {
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        width: '46%',
        height: 100,
        backgroundColor: '#fb5b5a',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
      },
      disabledCard: {
        backgroundColor: '#d3d3d3', // Light grey color to indicate the category is disabled
      },
      cardText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    drawerHeaderText: {
        fontWeight: "bold",
        textAlign: 'center',
        fontSize: 45,
        color: "#fb5b5a",
        marginTop: 30,
        marginBottom: 30,
    },
    drawerItemcontainer: {
        height: '80%',
        marginTop: '50%',
        borderRadius: 25,
        width: '100%',
    },
    drawerItemText: {
        fontWeight: "bold",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        color: "white",
        marginLeft: '35%',
        marginTop: '10%',
        marginBottom: '10%',
    },
    drawerItemrest: {
        fontWeight: "bold",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        color: "white",
        marginLeft: '8%',
        marginTop: '10%',
        marginBottom: '10%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxText: {
        color: '#000',
        fontSize: 18,
    },
    checkboxLabel: {
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "500",
        fontSize: 12,
        color: "#000",
        marginBottom: 5,
    },
    inputText: {
        height: 50,
        color: "black",
        fontWeight: 'bold'
    },
    forgotAndSignUpText: {
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "400",
        fontSize: 12,
        color: "#000",
        marginBottom: 5,
    },
    p_container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    p_label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black'
    },
    p_text: {
        fontSize: 16,
        marginBottom: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    profilePictureContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 0,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 75,
        marginBottom: 10,
    },
    cardContainer: {
        backgroundColor: 'white',
        alignContent: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        width: '80%',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    cardView:{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'center',
    },
    updateButton: {
        backgroundColor: '#fb5b5a',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    updatebuttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupbtn: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 0,
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10,
    },
    btn: {
        width: 250,
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    btn_text: {
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "500",
        fontSize: 15,
        color: "white",
        marginBottom: 5,
    },
    logoutContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
    },
    logoutBtn: {
        width: 100, // Adjust the width as needed
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        marginBottom: 20 ,
    },
    timerText: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        fontWeight: "500",
        fontSize: 15,
        color: "black",
        marginBottom: 10,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultContainer: {
        width: '80%',
        height: 70,
        backgroundColor: '#fb5b5a',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
},
resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white'
},

    googlebtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        marginBottom: 0,
        backgroundColor: 'black',
    },
    google_btn_text: {
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "500",
        fontSize: 15,
        color: "white",
        marginBottom: 5,
    },
    googlelogo: {
        position: "absolute",
        left: '8%'
    },
    testLogo: {
        height: '100%',
        width: '20%',
    },
    logoview: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questions_container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',

    },
    question_con_prop: {
        flex: 1,
        marginBottom: 20,
        padding: 40,
        alignContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        height: '80%',
        width: '90%',
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    question_text: {
        fontWeight: "500",
        fontSize: 15,
        color: "black",
        marginBottom: 40,
    },
    row:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 0,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
      },
      lineContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        display:'flex',
        flexDirection:'column',
        marginVertical: 10,
        width: '100%',
      },
      chart: {
        borderRadius: 16,
      },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
    screen_title: {
        fontWeight: "bold",
        fontSize: 40,
        justifyContent: 'center',
        alignContent: 'center',
        color: "#fb5b5a",
        marginBottom: 10,
        marginTop: '10%',

    },
    IQScoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'grey',
        marginTop:10
      },
});

export { styles };
