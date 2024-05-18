import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const SelectChats = ({ navigation, route }) => {
    const [clientName, setClientName] = useState("")
    const [developerName, setDeveloperName] = useState("")
    const [engineerName, setEngineerName] = useState("")

    const GetUsersNames = async () => {
        try {
            if (route.params.userType === "Client" || route.params.userType === "Developer") {
                const response = await axios.post("http://192.168.0.110:8080/getUserNameById", {
                    userType: route.params.userType,
                    userId: route.params.project.Engineer,
                    userId2: ""
                });

                if (response.data.ErrorMessage) {
                    console.warn(response.data.ErrorMessage)
                } else {
                    setEngineerName(response.data.results[0].Name)
                }
            } else if (route.params.userType === "Engineer") {
                const response = await axios.post("http://192.168.0.110:8080/getUserNameById", {
                    userType: route.params.userType,
                    userId: route.params.project.Client,
                    userId2: route.params.project.Developer
                });

                if (response.data.ErrorMessage) {
                    console.warn(response.data.ErrorMessage)
                } else {
                    if (route.params.project.Developer === null) {
                        setClientName(response.data.results[0].Name)
                    } else {
                        setClientName(response.data.results[0].client_name)
                        setDeveloperName(response.data.results[0].developer_name)
                    }
                    // setCurrentProjectId(response.data.ProjectId)
                }
            }

        } catch (err) {
            console.log(err)
        }
    }

    const goToChat = (incomingId, outgoingId) => {
        navigation.navigate('HiddenStack', {
            screen: 'ChatRoom',
            params: {
                "incomingId": incomingId,
                "outgoingId": outgoingId,
            }
        })
    }

    const goBack = () => {
        navigation.navigate("Dashboard", { "data": "start" })
    }

    useEffect(() => {
        GetUsersNames()
    })

    return (
        <View style={styles.container}>
            <Pressable style={styles.pressableContainer} onPress={goBack}>
                <View style={styles.iconContainerBubble}>
                    <Icon
                        name='arrow-up-outline'
                        size={24}
                        color='rgb(110, 110, 110)'
                    />
                </View>
            </Pressable>
            {
                route.params.userType === "Client" ? (
                    <Pressable style={{ width: '100%' }} onPress={() => goToChat(route.params.project.Client, route.params.project.Engineer)}>
                        <View style={styles.chatCardSingle}>
                            <View style={styles.iconContainer}>
                                <Icon name="hammer-outline" size={28} color="rgb(180,180,180)" />
                            </View>
                            <View style={styles.userInformation}>
                                <Text style={styles.title}>{engineerName}</Text>
                                <Text style={styles.description}>Requirement Engineer</Text>
                            </View>
                        </View>
                        <View style={styles.chatCardLastText}>
                            <Text style={{ color: "rgba(150, 150, 150, 0.6)", marginRight: 10 }}>You don't have any more chats</Text>
                            <Icon name="lock-closed-outline" size={17} color="rgba(150, 150, 150, 0.6)" />
                        </View>
                    </Pressable>
                ) : route.params.userType === "Engineer" && developerName !== "" ? (
                    <>
                        <Pressable style={{ width: '100%' }} onPress={() => goToChat(route.params.project.Engineer, route.params.project.Client)}>
                            <View style={styles.chatCard}>
                                <View style={styles.iconContainer}>
                                    <Icon name="person-outline" size={28} color="rgb(180,180,180)" />
                                </View>
                                <View style={styles.userInformation}>
                                    <Text style={styles.title}>{clientName}</Text>
                                    <Text style={styles.description}>Client</Text>
                                </View>
                            </View>
                        </Pressable>
                        <Pressable style={{ width: '100%' }} onPress={() => goToChat(route.params.project.Engineer, route.params.project.Developer)}>
                            <View style={styles.chatCardLast}>
                                <View style={styles.iconContainer}>
                                    <Icon name="laptop-outline" size={28} color="rgb(180,180,180)" />
                                </View>
                                <View style={styles.userInformation}>
                                    <Text style={styles.title}>{developerName}</Text>
                                    <Text style={styles.description}>Developer</Text>
                                </View>
                            </View>
                            <View style={styles.chatCardLastText}>
                                <Text style={{ color: "rgba(150, 150, 150, 0.6)", marginRight: 10 }}>You don't have any more chats</Text>
                                <Icon name="lock-closed-outline" size={17} color="rgba(150, 150, 150, 0.6)" />
                            </View>
                        </Pressable>
                    </>
                ) : route.params.userType === "Engineer" && developerName === "" ? (
                    <Pressable style={{ width: '100%', marginTop: 100 }} onPress={() => goToChat(route.params.project.Engineer, route.params.project.Client)}>
                        <View style={styles.chatCardLast}>
                            <View style={styles.iconContainer}>
                                <Icon name="laptop-outline" size={28} color="rgb(180,180,180)" />
                            </View>
                            <View style={styles.userInformation}>
                                <Text style={styles.title}>{clientName}</Text>
                                <Text style={styles.description}>Client</Text>
                            </View>
                        </View>
                        <View style={styles.chatCardLastText}>
                            <Text style={{ color: "rgba(150, 150, 150, 0.6)", marginRight: 10 }}>You don't have any more chats</Text>
                            <Icon name="lock-closed-outline" size={17} color="rgba(150, 150, 150, 0.6)" />
                        </View>
                    </Pressable>
                ) : route.params.userType === "Developer" && engineerName !== "" ? (
                    <Pressable style={{ width: '100%' }} onPress={() => goToChat(route.params.project.Developer, route.params.project.Engineer)}>
                        <View style={styles.chatCardSingle}>
                            <View style={styles.iconContainer}>
                                <Icon name="hammer-outline" size={20} color="rgb(150,150,150)" />
                            </View>
                            <View style={styles.userInformation}>
                                <Text style={styles.title}>{engineerName}</Text>
                                <Text style={styles.description}>Requirement Engineer</Text>
                            </View>
                        </View>
                        <View style={styles.chatCardLastText}>
                            <Text style={{ color: "rgba(150, 150, 150, 0.6)", marginRight: 10 }}>You don't have any more chats</Text>
                            <Icon name="lock-closed-outline" size={17} color="rgba(150, 150, 150, 0.6)" />
                        </View>
                    </Pressable>
                ) : route.params.userType === "Developer" && engineerName === "" && (
                    <View style={styles.missingPersonText}>
                        <Text style={{ color: "rgba(100, 100, 100, 1)", marginRight: 0 }}>It seems like there is still no requirement engineer in this project to chat with!  <Icon name="close-circle" size={17} color="rgba(100, 100, 100, 1)" /></Text>
                    </View>
                )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "rgb(250, 250, 250)"
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 90,
        marginTop: 100,
        // borderBottomWidth: 1,
        // borderColor: 'rgba(220, 220, 220, 0.6)',
        // borderTopWidth: 1,
    },
    chatCardLast: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 90,
        borderBottomWidth: 1,
        borderColor: 'rgba(220, 220, 220, 0.6)',
    },
    chatCardSingle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 100,
        minHeight: 90,
        borderBottomWidth: 1,
        borderColor: 'rgba(220, 220, 220, 0.6)',
    },
    chatCardLastText: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50
    },
    missingPersonText: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'row',
        marginTop: 130,
    },
    iconContainer: {
        width: 55,
        height: 55,
        // borderRadius: 100,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(250, 250, 250)',
        borderWidth: 1,
        borderColor: 'rgb(210,210,210)',
    },
    userInformation: {
        marginHorizontal: 15,
    },
    title: {
        fontSize: 17,
        color: 'rgb(100,100,100)',
    },
    description: {
        fontSize: 9,
        color: 'rgb(100,100,100)',
    },
    iconContainerBubble: {
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
    }
});

export default SelectChats;