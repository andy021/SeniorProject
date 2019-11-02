import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TextInput, Text, 
    TouchableHighlight, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, 
    Picker, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import axios from 'axios'; //to make network requests
import firebase from 'firebase';

import Colors from '../constants/Colors';

const SignUp = props => {

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pregnantMonths, setPregnantMonths] = useState('');
    const [childAge, setChildAge] = useState('');
    const [notifications, setNotifications] = useState('');

    const currDate = new Date();

    //url for firebase functions 
    const ROOT_URL = 'https://us-central1-moms-and-infants-healthy.cloudfunctions.net';

    //updating the state of each prop
    const updateFirstName = (firstname) => {
        setFirstName(firstname);
    };

    const updateMiddleName = (middlen) => {
        setMiddleName(middlen);
    };

    const updateLastName = (lastname) => {
        setLastName(lastname);
    };

    const updatePhoneNumber = (phone) => {
        setPhoneNumber(phone);
    };

    const updateBirthDate = (date) => {
        setBirthDate(date);
    };

    const updatePregnancyTerm = (months) => {
        setPregnantMonths(months);
    };

    const updateChildAge = (age) => {
        setChildAge(age);
    };

    const updateNotificationsFreq = (frequency) => {
        setNotifications(frequency);
    };


    //event handler 
    const signUpHandler = async () => {
        let errorMessage = "";
        //handle errors with connection
        try {
            console.log(phoneNumber);
            console.log(firstName);
            console.log(lastName);

            if (firstName === '') {
                errorMessage += 'Please enter valid first name\n';
                err = true;
            }
            if (lastName === '') {
                errorMessage += 'Please enter valid last name\n';
                err = true;
            }
            
            //creates a user with the entered info
            await axios.post(`${ROOT_URL}/createUsers`, { phone: phoneNumber });

            //send all the user data to our database
            firebase.database().ref('users'+phoneNumber).set(
                {
                    //user data
                    fistN: firstName,
                    middleN: middleName,
                    lastN: lastName,
                    dob: birthDate,
                    phone: phoneNumber,
                    pregnant: pregnantMonths,
                    childAge: childAge,
                    notifications: notifications
                }
            ).then(() => {
                console.log("Data sent to the db");
            }).catch((error) => {
                console.log(error);
            })

            //request a code to be sent
            await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone: phoneNumber });

            //go to log in screen
            props.onTapSignUp();
        }
        catch (err){
            console.log(err);
            if (err.response.data.error != null){
                errorMessage += err.response.data.error
                Alert.alert('Sign Up Errors', errorMessage,
                [
                    { text: 'Go Back' },
                ],
                { cancelable: false });
            }
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={'padding'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={-15}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <View style={styles.screen}>
                    <View>
                        <Image source={require('../assets/images/mom-and-baby-icon.png')} />
                    </View>
                    <View style={styles.box}>
                        <ScrollView>
                            <View style={styles.labelPosition}>
                                <Text style={styles.labelText}>First Name </Text>
                                <TextInput
                                    placeholder={'First Name'}
                                    onChangeText={updateFirstName}
                                    style={styles.textInput}
                                    value={firstName}
                                />
                            </View>
                            <View style={styles.seperatorLine} />
                            <View style={styles.labelPosition}>
                                <Text style={styles.labelText}>Middle Name </Text>
                                <TextInput
                                    placeholder={'Middle Name'}
                                    onChangeText={updateMiddleName}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.seperatorLine} />
                            <View style={styles.labelPosition}>
                                <Text style={styles.labelText}>Last Name </Text>
                                <TextInput
                                    placeholder={'Last Name'}
                                    onChangeText={updateLastName}
                                    style={styles.textInput}
                                    value={lastName}
                                />
                            </View>
                            <View style={styles.seperatorLine} />
                            <View style={styles.labelPosition}>
                                <Text style={styles.labelText}>Birth Date </Text>
                                <DatePicker
                                    style={{ width: '70%' }}
                                    customStyles={{
                                        dateInput: {
                                            marginLeft: 10,
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            borderColor: 'transparent',
                                        },
                                        btnCancel: {
                                            marginLeft: 50,
                                        },
                                        btnConfirm: {
                                            marginRight: 50,
                                        },
                                        placeholderText: {
                                            fontSize: 15,
                                        }
                                    }}
                                    date={birthDate}
                                    onDateChange={updateBirthDate}
                                    showIcon={false}
                                    mode="date"
                                    placeholder="Select Date"
                                    format="MM-DD-YYYY"
                                    minDate="05-01-1940"
                                    maxDate={currDate}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                />
                            </View>
                            <View style={styles.seperatorLine} />
                            <View style={styles.labelPosition}>
                                <Text style={styles.labelText}>Phone Number </Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={"888-888-8888"}
                                    onChangeText={updatePhoneNumber}
                                    value= {phoneNumber}
                                    keyboardType='number-pad'
                                    autoCompleteType='tel' //??????
                                />
                            </View>
                            <View style={styles.seperatorLine} />
                            <View style={styles.pickerStyle}>
                                <Text style={styles.labelText}>Pregnant? </Text>
                                <Picker style={{ width: '70%', paddingRight: 20, height: 80 }}
                                    itemStyle={{ height: 80 }}
                                    selectedValue={pregnantMonths}
                                    onValueChange={updatePregnancyTerm}>
                                    <Picker.Item label='Not Pregnant' value="No" />
                                    <Picker.Item label='One Month' value="one" />
                                    <Picker.Item label='Two Months' value="two" />
                                    <Picker.Item label='Three Months' value="three" />
                                    <Picker.Item label='Four Months' value="four" />
                                    <Picker.Item label='Five Months' value="five" />
                                    <Picker.Item label='Six Months' value="six" />
                                    <Picker.Item label='Seven Months' value="seven" />
                                    <Picker.Item label='Eight Months' value="eight" />
                                    <Picker.Item label='Nine Months' value="nine" />
                                    <Picker.Item label='Ten Months' value="ten" />
                                </Picker>
                            </View>
                            <View style={styles.seperatorLine} />
                            <View style={styles.pickerStyle}>
                                <Text style={styles.labelText}>Have an Infant? </Text>
                                <Picker style={{ width: '70%', paddingRight: 20, height: 80 }} itemStyle={{ height: 80 }} selectedValue={childAge} onValueChange={updateChildAge}>
                                    <Picker.Item label='No Infant' value="No"/>
                                    <Picker.Item label='One Month' value="one" />
                                    <Picker.Item label='Two Months' value="two" />
                                    <Picker.Item label='Three Months' value="three" />
                                    <Picker.Item label='Four Months' value="four" />
                                    <Picker.Item label='Five Months' value="five" />
                                    <Picker.Item label='Six Months' value="six" />
                                    <Picker.Item label='Seven Months' value="seven" />
                                    <Picker.Item label='Eight Months' value="eight" />
                                    <Picker.Item label='Nine Months' value="nine" />
                                    <Picker.Item label='Ten Months' value="ten" />
                                </Picker>
                            </View>
                            <View style={styles.seperatorLine} />
                            <View style={styles.pickerStyle}>
                                <Text style={styles.labelText}>Receive Notifications? </Text>
                                <Picker style={{ width: '70%', paddingRight: 20, height: 80 }} itemStyle={{ height: 80 }} selectedValue={notifications} onValueChange={updateNotificationsFreq}>
                                    <Picker.Item label='No Notifications' value="No" />
                                    <Picker.Item label='Weekly' value="weekly" />
                                    <Picker.Item label='Bi-Weekly' value="biweekly" />
                                    <Picker.Item label='Monthly' value="monthly" />
                                </Picker>
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <TouchableHighlight style={styles.button} onPress={signUpHandler} underlayColor={'rgba(213, 170, 255, 0.8)'} >
                            <Text style={{ fontSize: 18, color: 'black' }}>Sign Up</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '60%',
        width: '90%',
        borderColor: 'transparent',
        borderRadius: 10,
        backgroundColor: Colors.boxBackground,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
    },
    button: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: Colors.boxBackground,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textInput: {
        fontSize: 15,
        width: '70%',
        padding: 10,
    },
    labelPosition: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 5,
        paddingTop: 5,
    },
    pickerStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    labelText: {
        fontSize: 15,
        fontWeight: 'bold',
        width: '30%',
    },
    seperatorLine: {
        width: '95%',
        borderBottomColor: Colors.separatorLine,
        borderBottomWidth: 1,
    },
})

export default SignUp;