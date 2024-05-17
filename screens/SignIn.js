import { React, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView, Pressable, View, Image } from 'react-native';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { Snackbar } from 'react-native-paper';
import { Button } from '@rneui/themed';
import axios from 'axios';

import Logo from "../assets/CLARITY LINK.png"

//26.220.220.122

const data = [
    { label: 'Client', value: 'Client' },
    { label: 'Developer', value: 'Developer' },
    { label: 'Requirement Engineer', value: 'Requirement Engineer' },
];

export default function SignInScreen({ navigation }) {

    const [accType, setAccType] = useState("Client");
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [name, setName] = useState("")
    const [nameError, setNameError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [skill, setSkill] = useState("")
    const [skillError, setSkillError] = useState("")
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const nameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const skillInput = useRef();

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => {
        setVisible(false);
        if (submitDisabled === true) {
            navigation.navigate("HiddenStack", {
                screen: "LogIn"
            })
        }
    };

    const isNameValid = () => {
        const reName = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/
        const isNameValid = reName.test(name)
        if (name.length < 3) {
            setNameError("name must be at least 3 characters")
            nameInput.current.shake();
            return false;
        }
        if (isNameValid === false && name.length > 2) {
            setNameError("name can only contain letters, numbers, underscores and one space between each word")
            nameInput.current.shake();
            return false;
        } else {
            if (nameError !== "") {
                setNameError("")
            }
        }
    }

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

    const isSkillValid = () => {
        if (skill.length < 5) {
            setSkillError("password must be at least 5 characters")
            skillInput.current.shake();
            return false;
        } else {
            if (skillError !== "") {
                setSkillError("")
            }
        }
    }


    const submitData = async () => {
        let valid = true;

        try {
            if (isNameValid() === false) {
                valid = false;
            }
            if (isEmailValid() === false) {
                valid = false;
            }
            if (isPasswordValid() === false) {
                valid = false;
            }
            if (accType !== "Client") {
                if (isSkillValid() === false) {
                    valid = false;
                }
            }

            if (!valid) {
                return; // Stop execution
            }

            if (accType === "Client") {
                const response = await axios.post('http://192.168.0.110:8080/new/user/client', {
                    name,
                    email,
                    password
                });

                if (response.data.ErrorMessage) {
                    setSnackMsg(response.data.ErrorMessage);
                    onToggleSnackBar();
                } else {
                    setSubmitDisabled(true);
                    setSnackMsg("A new account has been created you will be redirected to the login page");
                    onToggleSnackBar();

                }
            } else if (accType === "Developer") {
                const response = await axios.post('http://192.168.0.110:8080/new/user/developer', {
                    name,
                    email,
                    password,
                    skill
                });

                if (response.data.ErrorMessage) {
                    setSnackMsg(response.data.ErrorMessage);
                    onToggleSnackBar();
                } else {
                    setSubmitDisabled(true);
                    setSnackMsg("A new account has been created you will be redirected to the login page");
                    onToggleSnackBar();
                }
            } else if (accType === "Requirement Engineer") {
                const response = await axios.post('http://192.168.0.110:8080/new/user/engineer', {
                    name,
                    email,
                    password,
                    skill
                });

                if (response.data.ErrorMessage) {
                    setSnackMsg(response.data.ErrorMessage);
                    onToggleSnackBar();
                } else {
                    setSubmitDisabled(true);
                    setSnackMsg("A new account has been created you will be redirected to the login page");
                    onToggleSnackBar();
                }
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
            <Text style={styles.text}>Sign up</Text>
            <Input
                placeholder='Name'
                containerStyle={styles.input}
                inputContainerStyle={styles.inputInner}
                inputStyle={styles.inputText}
                onChangeText={text => setName(text)}
                errorMessage={nameError}
                ref={nameInput}
                leftIcon={
                    <Icon
                        name='person-circle-outline'
                        size={24}
                        color='rgb(170, 170, 170)'
                    />
                }
            />
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
                secureTextEntry={true}
                inputStyle={styles.inputText}
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

            <Dropdown
                style={dropdown.dropdown}
                placeholderStyle={dropdown.placeholderStyle}
                selectedTextStyle={dropdown.selectedTextStyle}
                inputSearchStyle={dropdown.inputSearchStyle}
                data={data}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="account type"
                value={accType}
                onChange={item => {
                    setAccType(item.value);
                }}
            />

            {
                accType !== "Client" &&
                (
                    <Input
                        placeholder='Write a short description about your skills'
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        onChangeText={text => setSkill(text)}
                        errorMessage={skillError}
                        maxLength={95}
                        ref={skillInput}
                        leftIcon={
                            <Icon
                                name='pencil-outline'
                                size={24}
                                color='rgb(170, 170, 170)'
                            />
                        }
                    />
                )
            }


            <Button
                title="Sign Up"
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={submitData}
                disabled={submitDisabled}
            />
            <Pressable onPress={() => navigation.navigate('HiddenStack', { screen: 'LogIn' })}>
                <Text style={styles.link}>Already have an account? Log In</Text>
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
        textShadowColor: 'rgba(0, 0, 0, 0.10)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 10,
        fontSize: 22,
        marginBottom: 20
    },
    input: {
        marginBottom: 0,
        width: "90%",

    },
    logo: {
        width: 200,
        height: 200,
        marginTop: 30
    },
    inputInner: {
        borderWidth: 2,
        backgroundColor: "white",
        borderRadius: 20,
        height: 55,
        paddingLeft: 10,
        paddingRight: 15,
        borderWidth: 0,
        borderColor: "transparent",
        elevation: 2,
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

const dropdown = StyleSheet.create({
    dropdown: {
        height: 55,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 12,
        width: "85%",
        elevation: 2,
        marginBottom: 25
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,

    },
    placeholderStyle: {
        fontSize: 16,
        color: "rgb(160, 160, 160)"
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
