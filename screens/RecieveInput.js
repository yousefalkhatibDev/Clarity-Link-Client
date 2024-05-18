import { React, useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from '@rneui/themed';
import { Snackbar } from 'react-native-paper';
import WebSocket from 'react-native-websocket'; // Import WebSocket from react-native-websocket
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

//26.220.220.122

const CustomTitle = () => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Icon
                name='cloud-upload'
                size={24}
                color='white'
            />
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 10, color: "white" }}>Send SRS To Developer</Text>
        </View>
    );
};

export default function RecieveInput({ navigation, route }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState("")
    const [project, setProject] = useState("")
    const [context, setContext] = useState("")
    const [isSrsFileUploaded, setIsSrsFileUploaded] = useState();
    const [redirectToChat, setRedirectToChat] = useState(false)
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => {
        if (redirectToChat === true) {
            goToSelectChats()
        }
        setVisible(false)
    };

    const fetchCurrentProjectId = async () => {
        try {
            const response = await axios.get("http://192.168.0.110:8080/getCurrentProjectId");

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                setCurrentProjectId(response.data.ProjectId)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProject = async () => {
        try {
            // if (currentProjectId === "") {
            //     return;
            // }
            const response = await axios.get(`http://192.168.0.110:8080/getProjectById?ProjectId=${currentProjectId}`);

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                setProject(response.data.results[0])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getClientInput = async () => {
        try {
            // if (currentProjectId === "") {
            //     return;
            // }
            const response = await axios.get(`http://192.168.0.110:8080/getClientInput`);

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                setContext(response.data.results[0].Initial_context)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const copyToClipboard = async () => {
        try {
            await Clipboard.setStringAsync(context);
            setSnackMsg("Text has been copied to clipboard");
            onToggleSnackBar();
        } catch (error) {
            console.log(error)
        }
    };

    const goToSelectChats = () => {
        navigation.navigate('HiddenStack', {
            screen: 'SelectChats',
            params: {
                "userType": route.params.userType,
                "project": project,
            }
        })
    }

    const fetchIsSrsFileUploaded = async () => {
        try {
            // if (currentProjectId === "") {
            //     return;
            // }
            const response = await axios.get(`http://192.168.0.110:8080/isSrsFileUploaded`);

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                setIsSrsFileUploaded(response.data.isFileUploaded)
                // setContext(response.data.results[0].Initial_context)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const documentPicker = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
            });

            if (result.canceled === true) {
                console.log('User cancelled the document picker');
                return;
            }

            if (result.assets[0].mimeType !== 'application/pdf') {
                console.warn('Selected file is not a PDF. Please choose a PDF document.');
                return;
            }

            const uri = result.assets[0].uri;
            const response = await fetch(uri);
            const fileBlob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(fileBlob);
            reader.onloadend = async () => {
                const base64String = reader.result.split(',')[1];

                const response = await axios.post('http://192.168.0.110:8080/uploadSrsFile', {
                    fileName: result.assets[0].name,
                    base64: base64String
                });

                if (response.data.ErrorMessage) {
                    setSnackMsg(response.data.ErrorMessage);
                    onToggleSnackBar();
                } else {
                    setRedirectToChat(true)
                    setSnackMsg("File has been sent to the developer you will be redirected to the chat so feel free to talk to the developer and ask them anything you need!");
                    onToggleSnackBar();
                    fetchIsSrsFileUploaded();
                    // setContext(response.data.results[0].Initial_context)
                }
            };

        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const signOut = async () => {
        const response = await axios.post(`http://192.168.0.110:8080/logout`);
        if (response.data.error) {
            setSnackMsg(response.data.error);
            onToggleSnackBar();
        } else {
            navigation.navigate("Dashboard", { "data": "start" })
        }
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        fetchIsSrsFileUploaded()
        getClientInput()
        fetchCurrentProjectId()
    }, [])

    const handleMessage = (data) => {
        if (data.finish === true) {
            navigation.navigate("HiddenStack", {
                screen: "Projects",
                params: {
                    "userType": route.params.userType,

                }
            })
        }
    }

    useEffect(() => {
        if (currentProjectId !== "") {
            fetchProject()
        }
    }, [currentProjectId])


    return (
        < SafeAreaView style={styles.container}>
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
                <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                    {
                        context !== "" ?
                            <Text style={styles.inputContent}>{context}</Text>
                            :
                            <Text style={styles.inputContent}>*Any inputs recieved from the client will be displayed here*</Text>
                    }
                </ScrollView>
                <Pressable onPress={copyToClipboard} style={styles.pressableCopyContainer}>
                    <View style={styles.iconCopyContainer}>
                        <Icon
                            name='clipboard-outline'
                            size={24}
                            color='rgb(110, 110, 110)'
                        />
                    </View>
                </Pressable>
            </View>
            <Button
                title={<CustomTitle />}
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={async () => { await documentPicker() }}
                disabled={isSrsFileUploaded}
            />
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
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>After the Client answers some questions, the AI will generate a response with the answers of the Client,
                            and you will be able to see the response in this page. When you (Requirements Engineer) are done working on the SRS,
                            you can send it to the Developer from this page.</Text>
                    </View>
                    <Button title="Close" onPress={toggleModal} />
                </View>
            </Modal>
            <WebSocket
                url="ws://192.168.0.110:8094"
                onMessage={(message) => {
                    try {
                        // // console.log(message.data)
                        const parsedMessage = JSON.parse(message.data);
                        // console.log(parsedMessage)
                        handleMessage(parsedMessage);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                }
                }

                onOpen={() => console.log("WebSocket connection opened")}
            />
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        // backgroundColor: "rgb(29,60,107)",
        backgroundColor: "rgb(250, 250, 250)",
    },
    modalContainer: {
        minHeight: "50%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: 20,
        borderRadius: 8,
        justifyContent: "space-between",
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
    inputContainer: {
        width: "90%",
        minHeight: 300,
        maxHeight: 400,
        borderWidth: 1,
        borderColor: "rgb(150, 150, 150)",
        borderRadius: 5,
        marginTop: 130,
        padding: 15
    },
    inputContent: {
        color: "rgb(90, 90, 90)",
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
    iconCopyContainer: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(250, 250, 250)',
        width: 30,
        height: 40,
    },
    pressableCopyContainer: {
        position: "absolute",
        bottom: 25,
        right: 25,
        zIndex: 1000,
    },
    buttonContainer: {
        marginTop: 50,
        width: "85%",
        marginVertical: 10,
    },
    button: {
        backgroundColor: 'rgb(73,149,243)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
        padding: 15,
    },
})