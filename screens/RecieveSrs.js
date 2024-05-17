import { React, useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Pressable, Image, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from "expo-sharing";
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '@rneui/themed';
import axios from 'axios'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';
import Modal from "react-native-modal";
import { Snackbar } from 'react-native-paper';
import PdfSvg from "../assets/pdf-svgrepo-com.svg"


const { SlideInMenu } = renderers;

//26.220.220.122

const CustomTitle = () => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Icon
                name='cloud-download'
                size={24}
                color='white'
            />
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 10, color: "white" }}>Download SRS File</Text>
        </View>
    );
};

export default function RecieveSrs({ navigation, route }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState("");
    const [isSrsFileUploaded, setIsSrsFileUploaded] = useState();
    const [project, setProject] = useState("");
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

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

    const downloadSrs = async () => {
        try {
            const response = await axios.get(`http://192.168.0.110:8080/getSrsFileName`);


            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                const filePath = response.data.results[0].Final_context;
                if (filePath === null) {
                    return;
                }
                let parts = filePath.split('PDFS/');
                let fileName = parts[1];

                const result = await FileSystem.downloadAsync(
                    'http://192.168.0.110:8080/getSrsFile',
                    FileSystem.documentDirectory + fileName
                );
                await Sharing.shareAsync(FileSystem.documentDirectory + fileName);
                // Log the download result
                setSnackMsg("Successfully downloaded " + fileName);
                onToggleSnackBar();
                // Optional: Open the downloaded file using a suitable third-party app
            }
        } catch (error) {
            console.log(error);
        }
    }

    const goToSelectChats = () => {
        navigation.navigate('HiddenStack', {
            screen: 'SelectChats',
            params: {
                "userType": route.params.userType,
                "project": project,
            }
        })
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

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        fetchIsSrsFileUploaded()
        fetchCurrentProjectId()
    }, [route])

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
            {/* <SvgUri width="100" height="100" source={PdfSvg} /> */}
            <Button
                title={<CustomTitle />}
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={downloadSrs}
                disabled={!isSrsFileUploaded}
            />
            {!isSrsFileUploaded && (
                <Text style={{ color: "rgb(150, 150, 150)", fontSize: 11 }}>The requirement engineer hasn't sent the SRS yet!</Text>
            )}
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
                        <Text> When the Requirements Engineer finishes working on the SRS document and sends it to you (Developer),
                            you can download the SRS document from this page.</Text>
                    </View>
                    <Button title="Close" onPress={toggleModal} />
                </View>
            </Modal>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "rgb(29,60,107)",
        width: "100%",
        backgroundColor: "rgb(245, 245, 245)",
    },
    modalContainer: {
        minHeight: "50%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: 20,
        borderRadius: 8,
        justifyContent: "space-between",
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
        right: 25,
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