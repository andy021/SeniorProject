import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback,
    Keyboard, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import Colors from '../constants/Colors';
import firebase from 'firebase';
import Helpers from '../components/Helpers';
import { Context as AuthContext} from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';
import { Context as FirebaseContext } from '../context/dbContext';

//WHY THIS RENDERS 4 TIMES

const SignIn = ({ navigation }) => {

    const { state, signin, clearErrorMessage } = useContext(AuthContext);

    const lang = navigation.getParam('language')

    console.log("sign in language", lang)

    const [phoneNumber, setphoneNumber] = useState('');
    const [code, setCode] = useState('');

    const updatePhone = phone => {
        setphoneNumber(phone);
    };

    const updateCode = code => {
        setCode(code);
    };

    const signIn = () => {
        console.log(phoneNumber)
        console.log(code)

        global.PHONE_NUMBER = phoneNumber;

        signin({ phone: phoneNumber, code: code });
    }


    // const signInHandler = async () => {

    //     try {
    //         let { data } = await axios.post(`${ROOT_URL}/verifyOneTimePassword`, { phone: phoneNumber, code: code });

    //         //store the token so user no longer needs to log in
    //         await AsyncStorage.setItem('token', data.token);
    //         let result = await AsyncStorage.getItem('token')

    //         // if (result != null){
    //         //     props.onTapSignIn()
    //         // }

    //         //authenticates into firebase
    //         firebase.auth().signInWithCustomToken(data.token);

    //         //go to the landing page
    //         props.navigation.navigate('mainFlow')
    //         // props.onTapSignIn();

    //     } catch (error) {
    //         console.log(error);
    //         if (error.response.data.error != null) {
    //             errorMessage = error.response.data.error
    //             if (error.response.data.error.message)
    //                 errorMessage = error.response.data.error.message
    //             //TODO find a way to translate this
    //             Alert.alert('Error', errorMessage,
    //                 [
    //                     { text: 'Try again' },
    //                 ],
    //                 { cancelable: false });
    //         }
    //         return;
    //     }
    // }

    return (
        <TouchableWithoutFeedback  onPress={() => { Keyboard.dismiss() }}>
            <View style={styles.screen}>
                
                <Image
                    source={require('../../assets/images/mom-and-baby-icon.png')}
                    style={styles.profileIcon}
                />

                <View style={styles.box}>
                    <View style={{ flexDirection: 'row' }}>
                        <Input
                            style={styles.textInput}
                            placeholder='888-888-8888'
                            onChangeText={updatePhone}
                            value={navigation.getParam('phone')}
                            autoCompleteType={'tel'} //where is this???
                            keyboardType='number-pad'
                            leftIcon={
                                <Icon style={styles.iconStyle}
                                    name='mobile'
                                    size={24}
                                    color='lightgrey'
                                />}
                            inputContainerStyle='none'
                            containerStyle='none'
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Input
                            style={styles.textInput}
                            placeholder={Helpers('code', lang)}
                            onChangeText={setCode}
                            value={code}
                            secureTextEntry
                            keyboardType='number-pad'
                            leftIcon={
                                <Icon style={styles.iconStyle}
                                    name='lock'
                                    size={24}
                                    color='lightgrey'
                                />}
                        />
                    </View>
                </View>
                
                <View>
                    <NavigationEvents onWillBlur={clearErrorMessage} />
                    {/*{state.errorMessage ? (
                        //TODO find a way to translate the error messages 
                        Alert.alert('Sign Up Errors', state.errorMessage,
                            [
                                { text: 'Try Again' }
                            ],
                            {
                                cancelable: false
                            })
                        ) : null }*/}
                    <TouchableHighlight
                        style={styles.signInButton}
                        onPress={signIn}
                        underlayColor={Colors.hoverColor} >
                        <Text style={styles.labelText}>{Helpers('Sign In!', lang)}</Text>
                    </TouchableHighlight>
                </View>

                <View style={styles.seperator}>
                    <TouchableOpacity style={{ opacity: 0.5 }} onPress={() => navigation.navigate('Signup', { language: lang })}>
                        <Text style={styles.labelText}>{Helpers('New mom? Sign Up!', lang)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.newBackground
    },
    box: {
        justifyContent: 'space-around',
        margin: 10,
        padding: 10,
        width: '80%',
        height: '20%',
        backgroundColor: Colors.newBackground
    },
    labelText: {
        fontSize: 15,
        color: Colors.fontColor,
    },
    textInput: {
        fontSize: 20,
        width: '80%',
    },
    profileIcon: {
        marginBottom: 40,
        marginTop: '20%'
    },
    signInButton: {
        marginTop: 100,
        marginBottom: 30,
        padding: 10,
        backgroundColor: Colors.buttonColor,
        paddingHorizontal: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    seperator: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 10
    },
    iconStyle: {
        paddingRight: 18
    },
    textSignIn: {
        fontSize: 18,
        color: 'black',
    }
});

export default SignIn;