import { React, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView, Pressable, Image } from 'react-native';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { Snackbar } from 'react-native-paper';
import { Button } from '@rneui/themed';
import axios from 'axios';

import Logo from "../assets/CLARITY LINK.png"

//26.220.220.122

export default function LoginScreen({ navigation, route }) {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")
    const emailInput = useRef();
    const passwordInput = useRef();

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const isEmailValid = () => {
        const reEmail = /\S+@\S+\.\S+/;
        const isEmailValid = reEmail.test(email);
        if (isEmailValid === false) {
            setEmailError("Please enter a valid email address")
            emailInput.current.shake();
            return false;
        } else {
            if (emailError !== "") {
                setEmailError("")
            }
        }
    }

    const isPasswordValid = () => {
        const rePassword = /^[a-zA-Z0-9]+$/;
        const isPasswordValid = rePassword.test(password);
        if (password.length < 5) {
            setPasswordError("password must be at least 5 characters")
            passwordInput.current.shake();
            return false;
        }
        if (isPasswordValid === false) {
            setPasswordError("Password can only contain letters and numbers")
            passwordInput.current.shake();
            return false;
        } else {
            if (passwordError !== "") {
                setPasswordError("")
            }
        }
    }

    const submitData = async () => {
        let valid = true;

        try {
            // if (isEmailValid() === false) {
            //     valid = false;
            // }
            // if (isPasswordValid() === false) {
            //     valid = false;
            // }
            // if (!valid) {
            //     return; // Stop execution
            // }

            const response = await axios.post('http://192.168.0.110:8080/login', {
                email: "yousef@gmail.com",
                password: "7946135",
                // email,
                // password,
            });

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                navigation.navigate("Dashboard", { "data": "start" })
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        < SafeAreaView style={styles.container}>
            <Image
                style={styles.logo}
                source={Logo}
            />
            <Text style={styles.text}>Log in</Text>
            <Input
                placeholder='Email'
                containerStyle={styles.input}
                inputContainerStyle={styles.inputInner}
                inputStyle={styles.inputText}
                onChangeText={text => setEmail(text)}
                errorMessage={emailError}
                ref={emailInput}
                leftIcon={
                    <Icon
                        name='mail-outline'
                        size={24}
                        color='rgb(170, 170, 170)'
                    />
                }
            />
            <Input
                placeholder='Password'
                containerStyle={styles.input}
                inputContainerStyle={styles.inputInner}
                inputStyle={styles.inputText}
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                errorMessage={passwordError}
                ref={passwordInput}
                leftIcon={
                    <Icon
                        name='key-outline'
                        size={24}
                        color='rgb(170, 170, 170)'
                    />
                }
            />

            <Button
                title="Login"
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={submitData}
            />
            <Pressable onPress={() => navigation.navigate('HiddenStack', { screen: 'SignIn' })}>
                <Text style={styles.link}>You don't have an account? Sign Up</Text>
            </Pressable>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Ok',
                    onPress: () => {
                        onDismissSnackBar();
                    },
                }}>
                <Text style={{ color: "white" }}>{snackMsg}.</Text>
            </Snackbar>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "start",
        alignItems: "center",
        // backgroundColor: "rgb(29,60,107)",
        backgroundColor: "rgb(250, 250, 250)",

    },
    text: {
        color: "rgb(100, 100 ,100)",
        // textShadowColor: 'rgba(0, 0, 0, 0.10)',
        // textShadowOffset: { width: 3, height: 3 },
        // textShadowRadius: 10,
        fontSize: 22,
        marginBottom: 20
    },
    logo: {
        width: 250,
        height: 250,
        marginTop: 50
    },
    input: {
        marginBottom: 0,
        width: "90%",

    },
    inputInner: {
        borderWidth: 2,
        backgroundColor: "white",
        borderRadius: 20,
        height: 55,
        paddingLeft: 10,
        paddingRight: 15,
        borderWidth: 1,
        borderColor: "rgba(245, 245, 245, 0.3)",
        elevation: 1,
    },
    inputText: {
        fontSize: 13
    },
    button: {
        backgroundColor: 'rgb(73,149,243)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
        padding: 15,
    },
    buttonContainer: {
        width: "70%",
        marginHorizontal: 50,
        marginVertical: 10,
    },
    link: {
        color: "rgb(0, 0, 130)"
    }
})