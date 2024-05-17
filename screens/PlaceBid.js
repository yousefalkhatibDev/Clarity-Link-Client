import { React, useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View, Pressable } from 'react-native';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Button } from '@rneui/themed';
import { Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";


export default function PlaceBid({ navigation, route }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [solution, setSolution] = useState("")
    const [expectedTimeline, setExpectedTimeline] = useState("")
    const [price, setPrice] = useState("")
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [clientName, setClientName] = useState("User")
    const { id, title, description, budget, timeline, userType, client } = route.params;


    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => {
        setVisible(false)
        if (submitDisabled === true) {
            navigation.navigate("HiddenStack", {
                screen: "Projects",
                params: {
                    "data": "data"
                }
            })
        }
    };

    const handleExpectedTimeline = (text) => {
        if (text.includes("-") || text.includes(".") || text.includes(",") || text.includes(" ")) {
            setExpectedTimeline("")
        } else {
            setExpectedTimeline(text)
        }
    }

    const handlePrice = (text) => {
        if (text.includes("-") || text.includes(".") || text.includes(",") || text.includes(" ")) {
            setPrice("")
        } else {
            setPrice(text)
        }
    }

    const submitData = async () => {
        try {
            const response = await axios.post('http://192.168.0.110:8080/create/bid', {
                solution,
                expectedTimeline,
                price,
                id,
                userType
            });
            setSubmitDisabled(true)
            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
                setSubmitDisabled(false)
            } else {
                setSnackMsg("Your bid has been submited to the job poster to review, you will get the job after they accept your bid");
                onToggleSnackBar();

            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchClientName = async () => {
        try {
            const response = await axios.post('http://192.168.0.110:8080/getClientNameById', {
                userId: client
            });
            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
            } else {
                setClientName(response.data.results[0].Name)

            }
        } catch (error) {
            console.log(error)
        }
    }


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const goBack = () => {
        navigation.goBack()
    }

    useEffect(() => {
        fetchClientName()
    })

    return (
        < SafeAreaView style={styles.container}>
            <Pressable style={styles.pressableContainer} onPress={goBack}>
                <View style={styles.iconContainerBubble}>
                    <Icon
                        name='arrow-up-outline'
                        size={24}
                        color='rgb(110, 110, 110)'
                    />
                </View>
            </Pressable>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                <View style={styles.cardContainer}>
                    <View>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardPublisherHeader}>Publisher: {clientName}</Text>
                        <Text style={styles.cardDescriptionHeader}>Description:</Text>
                        <Text style={styles.cardDescription}>{description}</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardBudget}>Price: {budget}$</Text>
                        <Text style={styles.cardTimeline}>Deadline: {timeline} days</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.text}>Solution Approach:</Text>
                        <Pressable style={styles.pressableContainerInput} onPress={toggleModal}>
                            <Icon
                                name='help-circle-outline'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </Pressable>
                    </View>

                    <Input
                        placeholder='Enter Your Solution Approach...'
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        multiline={true}
                        numberOfLines={5}
                        maxLength={600}
                        onChangeText={setSolution}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Expected Timeline:</Text>
                    <Input
                        placeholder='Enter Your Expected Timeline (in days) ..'
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        inputMode={"numeric"}
                        value={expectedTimeline}
                        maxLength={3}
                        onChangeText={text => handleExpectedTimeline(text)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Your price:</Text>
                    <Input
                        placeholder='Enter Your Price (in $) ..'
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        inputMode={"numeric"}
                        value={price}
                        maxLength={10}
                        onChangeText={text => handlePrice(text)}
                    />
                </View>
                <Button
                    title="Place A Bid"
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                    onPress={submitData}
                    disabled={submitDisabled}
                />
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
                        <Text>Describe your solution for this system that will be shown to the Client.</Text>
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
        backgroundColor: "rgb(250, 250, 250)",
        alignItems: "center",

    },
    modalContainer: {
        minHeight: "50%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: 20,
        borderRadius: 8,
        justifyContent: "space-between",
    },
    pressableContainerInput: {
        width: 40,
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
    },
    text: {
        marginLeft: "4%",
        color: "rgb(90, 90, 90)",
    },
    cardContainer: {
        marginTop: 100,
        width: "90%",
        minHeight: 200,
        backgroundColor: "white",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgb(230, 230, 230)",
        borderRadius: 7,
        padding: 15,
        marginBottom: 20
    },
    cardTitle: {
        fontSize: 20,
        color: "rgb(90, 90, 90)",
        marginBottom: 15
    },
    cardDescriptionHeader: {
        color: "rgb(90, 90, 90)",
    },
    cardPublisherHeader: {
        color: "rgb(90, 90, 90)",
        marginBottom: 20,
        fontSize: 16
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
    inputContainer: {
        width: "95%",
    },
    input: {
        marginTop: 5,
        marginBottom: 0,
        width: "100%",
    },
    inputInner: {
        backgroundColor: "white",
        borderRadius: 10,
        minHeight: 55,
        maxHeight: 130,
        paddingLeft: 10,
        paddingRight: 15,
        paddingBottom: 5,
        paddingTop: 5,
        borderWidth: 1,
        borderColor: "rgb(230, 230, 230)",
    },
    inputText: {
        fontSize: 13,
    },
    button: {
        backgroundColor: 'rgb(73,149,243)',
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
    iconContainerBubble: {
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(253, 253, 253)',
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0)',
    },
    pressableContainer: {
        position: 'absolute',
        top: 40,
        right: 15,
        zIndex: 1000,
    }
})