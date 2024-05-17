import { React, useEffect, useState, } from 'react';
import { StyleSheet, Text, SafeAreaView, Pressable, View, ScrollView, RefreshControl, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Button } from '@rneui/themed';
import { Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';

import Logo from "../assets/CLARITY LINK.png"


const { SlideInMenu } = renderers;


export default function AcceptBidsScreen({ navigation, route }) {
    const [bids, setBids] = useState([])
    const [project, setProject] = useState("")
    const [isModalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")
    const [isModalVisiblePop, setModalVisiblePop] = useState(false);


    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const fetchCurrentProjectId = async () => {
        try {
            const response = await axios.get("http://192.168.0.110:8080/getCurrentProjectId");

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                fetchProjectArg(response.data.ProjectId)
                // setCurrentProjectId(response.data.ProjectId)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProjectArg = async (currentProjectId) => {
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

    const fetchProject = async () => {
        try {
            // if (currentProjectId === "") {
            //     return;
            // }
            const response = await axios.get(`http://192.168.0.110:8080/getProjectById?ProjectId=${route.params.currentProjectId}`);

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                console.log("In project")
                setProject(response.data.results[0])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchBids = async () => {
        try {
            const response = await axios.get("http://192.168.0.110:8080/getBids");
            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                let bids;

                if (project.Developer !== null && project.Engineer !== null) {
                    bids = "";
                    navigation.navigate("Dashboard", { "data": "start" })
                }
                if (project.Developer !== null && project.Engineer === null) {
                    if (response.data.results === undefined) {
                        bids = response.data.results
                    } else {
                        bids = response.data.results.filter((el) => {
                            return el.Bid_type !== "Developer"
                        })
                    }
                }
                if (project.Engineer !== null && project.Developer === null) {
                    if (response.data.results === undefined) {
                        bids = response.data.results
                    } else {
                        bids = response.data.results.filter((el) => {
                            return el.Bid_type !== "Engineer"
                        })
                    }
                }
                if (project.Developer === null && project.Engineer === null) {
                    bids = response.data.results
                }
                setBids(bids)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAcceptBid = async (type, id, pId) => {
        try {
            const response = await axios.post("http://192.168.0.110:8080/accept/bid", {
                bidType: type,
                userId: id,
                projectId: pId
            });

            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                setSnackMsg("You accepted a bid");
                onToggleSnackBar();
                if (route.params === undefined) {
                    fetchCurrentProjectId();
                } else {
                    fetchProject();
                }

                // setBids(response.data.results)
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

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleModalPop = () => {
        setModalVisiblePop(!isModalVisiblePop);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchBids();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    const goBack = () => {
        navigation.goBack()
    };


    useEffect(() => {
        if (route.params === undefined) {
            fetchCurrentProjectId();
        } else {
            setProject(route.params.Project)
        }
    }, [])

    useEffect(() => {
        if (project !== "") {
            fetchBids();
        }
    }, [project])

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
            {/* <Pressable style={styles.pressableContainer} onPress={signOut}>
                <View style={styles.iconContainer}>
                    <Icon
                        name='log-out-outline'
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
                        <MenuOption style={styles.menuOption} onSelect={goBack}>
                            <Text style={styles.menuOptionText}>Go back</Text>
                            <Icon
                                name='arrow-up-outline'
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

            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={25} />}>
                {
                    bids && bids.length > 0 ? bids.map((el, index) => {
                        return (
                            <View key={index} style={styles.cardContainer}>
                                <View>
                                    <Text style={styles.cardUserName}>{el.Bider_name}</Text>
                                    <Text style={styles.cardDescription}>{el.Solution}</Text>
                                </View>
                                <View>
                                    <View style={styles.cardFooter}>
                                        <View>
                                            {
                                                el.Bid_type === "Engineer" ?
                                                    (
                                                        <Text style={styles.cardType}>Type: Requirement Engineer</Text>
                                                    )
                                                    :
                                                    (
                                                        <Text style={styles.cardType}>Type: {el.Bid_type}</Text>
                                                    )
                                            }
                                            <Text style={styles.cardUserSkills}>Skills: {el.Bider_skills.slice(0, 95)} </Text>
                                            {/* <Text style={styles.cardType}>Name: {el.Bider_name}</Text>
                                            <Text style={styles.cardType}>Skills: {el.Bider_skills}</Text> */}
                                        </View>
                                        <Text style={styles.cardBudget}>{el.Price}$</Text>
                                    </View>
                                    <Button
                                        title="Accept Bid"
                                        titleStyle={{ fontWeight: '700' }}
                                        buttonStyle={styles.button}
                                        containerStyle={styles.buttonContainer}
                                        onPress={() => { handleAcceptBid(el.Bid_type, el.Bider_id, el.Project_id) }}
                                    />
                                </View>
                            </View>
                        );
                    })
                        :
                        <View style={{ alignItems: "center", justifyContent: "space-between" }}>
                            <Text>No Bids Found</Text>
                            <Image
                                style={styles.logo}
                                source={Logo}
                            />
                        </View>
                }
            </ScrollView>
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
                        <Text>After creating the project, it will be published and shown to The Requirements Engineers and The Developers.
                            Then both Requirements Engineers and Developers will be able to view the project and submit bids.
                            After that, the submitted bids will be shown to you (Client), and you will be able to see all bids and choose the best ones of them.
                            After choosing the best bids for you (Client), you will need to answer some questions related to your project.
                            All your answers will be sent to the AI, and the AI will show you its response, and it will be sent to the Requiremnts Engineer.
                            Then you will be directed to the chat page, where you can chat with Requiremnts Engineer.</Text>
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
        // backgroundColor: "rgb(29,60,107)",
        backgroundColor: "rgb(250, 250, 250)",
    },
    scrollView: {
        marginTop: 130,
        alignItems: "center",
        backgroundColor: "rgb(250, 250, 250)",

    },
    logo: {
        width: 250,
        height: 250,
        marginTop: "100%"
    },
    modalContainer: {
        minHeight: "50%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: 20,
        borderRadius: 8,
        justifyContent: "space-between",
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
    buttonContainer: {
        width: "30%",
        marginHorizontal: 50,
        marginVertical: 10,
    },
    cardContainer: {
        width: "90%",
        minHeight: 220,
        backgroundColor: "white",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgb(230, 230, 230)",
        borderRadius: 7,
        elevation: 1,
        padding: 15,
        marginBottom: 20
    },
    cardTitle: {
        fontSize: 20,
        color: "rgb(90, 90, 90)",
        marginBottom: 15
    },
    cardDescription: {
        fontSize: 12,
        color: "rgb(150, 150, 150)",
        width: "100%",
        marginBottom: 70
    },
    cardBudget: {
        marginBottom: 7,
        color: "rgb(160, 180, 100)"
    },
    cardType: {
        fontSize: 12,
        color: "rgb(120, 120, 120)",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cardUserName: {
        color: "rgb(70, 70, 70)",
        fontSize: 16,
        marginBottom: 10,
    },
    cardUserSkills: {
        color: "rgb(120, 120, 120)",
        fontSize: 10,
        marginBottom: 8,
        marginTop: 8,
        width: 240
    },
    button: {
        backgroundColor: 'rgb(73,149,243)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 7,
        padding: 15,
    },
    buttonContainer: {
        width: "100%",
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