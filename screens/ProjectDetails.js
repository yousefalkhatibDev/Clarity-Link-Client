import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';
import Modal from "react-native-modal";



const { SlideInMenu } = renderers;

export default function ProjectDetails({ navigation, route }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [project, setProject] = useState("");
    const [bidButtonDisabled, setBidButtonDisabled] = useState(false)
    const [showSelectChat, setShowSelectChat] = useState(false)


    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://192.168.0.110:8080/getProjectByIdDetails?ProjectId=${route.params.currentProjectId}`);
            if (response.data.ErrorMessage) {
                console.warn(response.data.ErrorMessage)
            } else {
                setProject(response.data.results[0])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const finishProject = async () => {
        try {
            const response = await axios.post(`http://192.168.0.110:8080/finishProject`, {
                ProjectId: route.params.currentProjectId,
                Project: route.params.Project
            });
            if (response.data.error) {
                // setSnackMsg(response.data.error);
                // onToggleSnackBar();
            } else {
                navigation.navigate("HiddenStack", {
                    screen: "AddProject",
                })
            }
        } catch (err) {
            console.log(err)
        }

    }


    const signOut = async () => {
        const response = await axios.post(`http://192.168.0.110:8080/logout`);
        if (response.data.error) {
            // setSnackMsg(response.data.error);
            // onToggleSnackBar();
        } else {
            navigation.navigate("Dashboard", { "data": "start" })
        }
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const goToSelectChats = () => {
        navigation.navigate('HiddenStack', {
            screen: 'SelectChats',
            params: {
                "userType": route.params.userType,
                "project": route.params.Project,
            }
        })
    }

    useEffect(() => {
        fetchProject()
        if (route.params.Project.Developer !== null && route.params.Project.Engineer !== null) {
            setBidButtonDisabled(true)
        }
        if (route.params.Project.Developer !== null || route.params.Project.Engineer !== null) {
            setShowSelectChat(true)
        }
    }, [route])

    return (
        <View style={styles.container}>
            {/* <Pressable style={styles.pressableContainerLeft} onPress={toggleModal}>
                <View style={styles.iconContainer}>
                    <Icon
                        name='help-circle-outline'
                        size={24}
                        color='rgb(110, 110, 110)'
                    />
                </View>
            </Pressable> */}
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
                        {
                            showSelectChat && (
                                <MenuOption style={styles.menuOption} onSelect={goToSelectChats}>
                                    <Text style={styles.menuOptionText}>Chat</Text>
                                    <Icon
                                        name='chatbubbles-outline'
                                        size={24}
                                        color='rgb(110, 110, 110)'
                                    />
                                </MenuOption>
                            )
                        }
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
            <View style={{ width: "90%" }}>
                <View style={styles.cardContainer}>
                    <View>
                        <Text style={styles.cardTitle}>{project.Title}</Text>
                        <Text style={styles.cardDescriptionHeader}>Description:</Text>
                        <Text style={styles.cardDescription}>{project.Description}</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardBudget}>Budget: {project.Budget}$</Text>
                        <Text style={styles.cardTimeline}>Deadline: {project.Deadline} days</Text>
                    </View>
                </View>
            </View>
            <Button
                title="Bids"
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={() => { navigation.navigate('HiddenStack', { screen: 'AcceptBids', params: { "currentProjectId": route.params.currentProjectId, "Project": route.params.Project } }) }}
            />

            <Button
                title="Finish Project"
                titleStyle={{ fontWeight: '700', color: "rgb(140, 140, 140)" }}
                buttonStyle={styles.buttonFinish}
                containerStyle={styles.buttonContainer}
                onPress={toggleModal}
            />

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Are you sure you want to finish working on this project?</Text>
                    </View>
                    <View style={styles.modalButtonsContainer}>
                        <Button title="Cancel" buttonStyle={{ backgroundColor: "rgb(240, 240, 240)", borderColor: "rgb(220, 220, 220)", borderWidth: 1 }} containerStyle={{ width: "48%" }} titleStyle={{ color: "rgb(100, 100, 100)" }} onPress={toggleModal} />
                        <Button title="Yes" buttonStyle={{ backgroundColor: " rgb(73,149,243)", borderColor: "rgb(53,129,203)", borderWidth: 1 }} containerStyle={{ width: "48%" }} onPress={finishProject} />
                    </View>
                </View>
            </Modal>
        </View>
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
        minHeight: "30%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: 20,
        borderRadius: 8,
        justifyContent: "space-between",
    },
    modalButtonsContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
    },
    cardContainer: {
        width: "100%",
        minHeight: 250,
        backgroundColor: "white",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgb(230, 230, 230)",
        borderRadius: 7,
        padding: 15,
        marginBottom: 20,
        marginTop: 120
    },
    cardTitle: {
        fontSize: 20,
        color: "rgb(90, 90, 90)",
        marginBottom: 15
    },
    cardDescriptionHeader: {
        color: "rgb(90, 90, 90)",
    },
    cardDescription: {
        fontSize: 11,
        color: "rgb(150, 150, 150)",
        width: "80%",
        marginTop: 7,
        marginLeft: 10,
        marginBottom: 30
    },
    cardBudget: {
        color: "rgb(160, 180, 100)"
    },
    cardTimeline: {
        color: "rgb(90, 90, 90)",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button: {
        backgroundColor: 'rgb(73,149,243)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 7,
        padding: 15,
    },
    buttonFinish: {
        backgroundColor: 'rgb(220,220,220)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 7,
        padding: 15,
    },
    buttonContainer: {
        width: "90%",
        marginHorizontal: 50,
        marginVertical: 10,
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
})