import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Input } from '@rneui/themed';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';
import Modal from "react-native-modal";


const { SlideInMenu } = renderers;

const AiChat = ({ navigation, route }) => {
    const [message, setMessage] = useState("");
    const [currentProjectId, setCurrentProjectId] = useState("")
    const [projectQuestions, setProjectQuestions] = useState("")
    const [isInitialInputSet, setIsInitialTextSet] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false)
    const [modal2Text, setModal2Text] = useState("")
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => {
        setVisible(false)
        if (modal2Text !== "") {
            goToSelectChats(true)
        }
    };

    const submitData = async () => {
        try {
            if (projectQuestions === "") {
                return;
            }
            setIsInitialTextSet(true)
            const messageUpdated = `
                Write a SRS document for a system where its objectives and goals are: 
                ${projectQuestions.q1},

                and the users of that system are: 
                ${projectQuestions.q2}, 

                and the functional requirements of that system are: 
                ${projectQuestions.q3},

                and the non-functional requirements of that system are: 
                ${projectQuestions.q4},

                considering these constraints & information: 
                ${message}, 

                just write the sections of the SRS that are mentioned above (objectives & goals, users, functional requirements, non-functional requirements).
            `
            const response = await axios.post('http://192.168.0.110:8080/getApiResponse', {
                messageUpdated
            });
            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
                setIsInitialTextSet(false)
            } else {
                // fetchIsInitialInputSet();
                setModal2Text(response.data.completionMessage)
                toggleModal2()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCurrentProjectId = async () => {
        try {
            const response = await axios.get("http://192.168.0.110:8080/getCurrentProjectId");

            if (response.data.ErrorMessage) {
                console.warn(response.data.ErrorMessage)
            } else {
                setCurrentProjectId(response.data.ProjectId)
                // setCurrentProjectId(response.data.ProjectId)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProjectQuestions = async () => {
        try {
            const response = await axios.get(`http://192.168.0.110:8080/getProjectQuestions?ProjectId=${currentProjectId}`);

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                setProjectQuestions(response.data.results[0])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchIsInitialInputSet = async () => {
        try {
            const response = await axios.get('http://192.168.0.110:8080/isInitialInputSet');

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                if (response.data.results[0].Initial_context !== null) {
                    setIsInitialTextSet(true)
                } else {
                    setIsInitialTextSet(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const signOut = async () => {
        const response = await axios.post(`http://192.168.0.110:8080/logout`);
        if (response.data.error) {
            setSnackMsg(response.data.error);
            onToggleSnackBar();
        } else {
            navigation.navigate("Dashboard", { "data": "start" })
        }
    }

    const goToSelectChats = (redirectToDetails) => {
        if (redirectToDetails && redirectToDetails === true) {
            navigation.navigate('HiddenStack', {
                screen: 'SelectChats',
                params: {
                    "userType": route.params.userType,
                    "project": route.params.project,
                    "redirectToDetails": redirectToDetails
                }
            })
        } else {
            navigation.navigate('HiddenStack', {
                screen: 'SelectChats',
                params: {
                    "userType": route.params.userType,
                    "project": route.params.project,
                }
            })

        }
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    useEffect(() => {
        fetchIsInitialInputSet()
    }, [])

    useEffect(() => {
        if (isInitialInputSet === false) {
            fetchCurrentProjectId()
        }
    }, [isInitialInputSet])

    useEffect(() => {
        if (currentProjectId !== "") {
            fetchProjectQuestions()
        }
    }, [currentProjectId])
    return (
        <View style={styles.container}>
            <Pressable style={styles.pressableContainerLeft} onPress={toggleModal}>
                <View style={styles.iconContainer}>
                    <Icon
                        name='help-circle-outline'
                        size={24}
                        color='rgb(110, 110, 110)'
                    />
                </View>
            </Pressable>
            <View style={styles.pressableContainer}>
                <Menu style={{ flexDirection: 'column', }} renderer={SlideInMenu} >
                    <MenuTrigger>
                        <View style={styles.iconContainer}>
                            <Icon
                                name='ellipsis-vertical'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </View>
                    </MenuTrigger>
                    <MenuOptions style={{ height: 300 }}>
                        <MenuOption style={styles.menuOption} onSelect={goToSelectChats}>
                            <Text style={styles.menuOptionText}>Chat</Text>
                            <Icon
                                name='chatbubbles-outline'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </MenuOption>
                        <MenuOption style={styles.menuOption} onSelect={signOut}>
                            <Text style={styles.menuOptionText}>Sign out</Text>
                            <Icon
                                name='log-out-outline'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </MenuOption>
                    </MenuOptions>
                </Menu>

            </View>
            <View style={styles.inputContainer}>
                {isInitialInputSet === true && (<Text style={styles.text}>Sending message please wait for the AI to respond</Text>)}
                <Input
                    disabled={isInitialInputSet === true ? true : false}
                    placeholder='Send a message to AI'
                    containerStyle={styles.input}
                    inputContainerStyle={styles.inputInner}
                    inputStyle={styles.inputText}
                    multiline={true}
                    numberOfLines={3}
                    maxLength={600}
                    onChangeText={text => setMessage(text)}
                    rightIcon={
                        <Icon
                            name='send'
                            size={24}
                            color='rgb(170, 170, 170)'
                            style={{ marginLeft: 10 }}
                            onPress={() => { isInitialInputSet === false && submitData() }}
                        />
                    }
                />
            </View>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={14000}
                action={{
                    label: 'Ok',
                    onPress: () => {
                        onDismissSnackBar();
                    },
                }}>
                <Text style={{ color: "white" }}>{snackMsg}.</Text>
            </Snackbar>
            <Modal isVisible={isModalVisible2}>
                <View style={styles.modalContainer}>
                    <ScrollView style={{ width: "100%" }}>
                        <View>
                            <Text>{modal2Text}</Text>
                        </View>
                    </ScrollView>

                    <Button title="Ok" onPress={() => {
                        toggleModal2()
                        setSnackMsg("Message was sent please wait for the requirement engineer to take action, you will be redirected to chat page so feel free to ask the requirement engineer about anything!");
                        onToggleSnackBar();
                    }} />
                </View>
            </Modal>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Here you can write more information and constraints to the AI about your system.</Text>
                    </View>
                    <Button title="Close" onPress={toggleModal} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        minHeight: "50%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: 20,
        borderRadius: 8,
        justifyContent: "space-between",
    },
    inputContainer: {
        marginTop: "auto",
        width: "100%",
        alignItems: "center",
    },
    text: {
        marginBottom: 5,
        color: "rgb(150, 150,150)",
        textShadowColor: 'rgba(0, 0, 0, 0.10)',
        fontSize: 12
    },
    input: {
        marginBottom: 0,
        width: "95%",
    },
    inputInner: {
        borderWidth: 2,
        backgroundColor: "white",
        borderRadius: 20,
        minHeight: 25,
        padding: 10,
        borderWidth: 0,
        borderColor: "transparent",
        elevation: 2,
    },
    inputText: {
        fontSize: 13,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(250, 250, 250)',
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0)',
    },
    pressableContainer: {
        position: 'absolute',
        top: 50,
        right: 15,
        zIndex: 1000,
    },
    pressableContainerLeft: {
        position: 'absolute',
        top: 50,
        left: 25,
        zIndex: 1000,
    },
    menuOption: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(240, 240, 240, 0.7)',
        paddingLeft: 20,
        paddingRight: 20
    },
    menuOptionText: {
        fontSize: 22,
        color: "rgb(90, 90, 90)"
    },
});

export default AiChat;