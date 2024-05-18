import { React, useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, Pressable, View } from 'react-native';
import { Input } from '@rneui/themed';
import axios from 'axios';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { Snackbar } from 'react-native-paper';
import Modal from "react-native-modal";


export default function AddProject({ navigation }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [budgetMin, setBudgetMin] = useState("")
    const [budgetMax, setBudgetMax] = useState("")
    const [timeline, setTimeline] = useState("")
    const [userId, setUserId] = useState("")
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)


    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => {
        setVisible(false)
        if (submitDisabled === true) {
            navigation.navigate("Dashboard", { "data": "start" })
        }
    };

    const handleBudget = (type, text) => {
        if (text.includes("-") || text.includes(".") || text.includes(",") || text.includes(" ")) {
            if (type === "min") {
                setBudgetMin("")
            } else {
                setBudgetMax("")
            }
        } else {
            if (type === "min") {
                setBudgetMin(text)
            } else {
                setBudgetMax(text)
            }
        }
    }


    const handleTimeline = (text) => {
        if (text.includes("-") || text.includes(".") || text.includes(",") || text.includes(" ")) {
            setTimeline("")
        } else {
            setTimeline(text)
        }
    }

    const submitData = async () => {
        try {
            if (Number(budgetMin) >= Number(budgetMax)) {
                setSnackMsg("Min budget must be less than max budget");
                onToggleSnackBar();
                return;
            }
            setSubmitDisabled(true);
            const response = await axios.post('http://192.168.0.110:8080/create/project', {
                title,
                description,
                budget: `${budgetMin}-${budgetMax}`,
                timeline,
                userId
            });
            if (response.data.ErrorMessage) {
                setSnackMsg(response.data.ErrorMessage);
                onToggleSnackBar();
                setSubmitDisabled(false);
            } else {
                setSnackMsg("Project created successfully you will be redirected to the bids page");
                onToggleSnackBar();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getUserId = async () => {
        try {
            const response = await axios.get('http://192.168.0.110:8080/getUserId?userType=Client')
            setUserId(response.data.UserId)
        } catch (error) {
            console.log(error)
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

    useEffect(() => {
        getUserId()
    }, [])

    return (
        < SafeAreaView style={styles.container}>
            <Pressable style={styles.pressableContainer} onPress={signOut}>
                <View style={styles.iconContainer}>
                    <Icon
                        name='log-out-outline'
                        size={24}
                        color='rgb(110, 110, 110)'
                    />
                </View>
            </Pressable>
            <View style={{ ...styles.inputContainer, marginTop: 100 }}>
                <Text style={styles.text}>Project Title:</Text>
                <Input
                    placeholder='Example name...'
                    containerStyle={styles.input}
                    inputContainerStyle={styles.inputInner}
                    inputStyle={styles.inputText}
                    onChangeText={text => setTitle(text)}
                    maxLength={60}
                />
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                    <Text style={styles.text}>Project Description:</Text>
                    <Pressable style={styles.pressableContainerInput} onPress={toggleModal}>
                        <Icon
                            name='help-circle-outline'
                            size={24}
                            color='rgb(110, 110, 110)'
                        />
                    </Pressable>
                </View>
                <Input
                    placeholder='Example description...'
                    containerStyle={styles.input}
                    inputContainerStyle={styles.inputInner}
                    inputStyle={styles.inputText}
                    multiline={true}
                    numberOfLines={5}
                    maxLength={600}
                    onChangeText={text => setDescription(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Project Budget (in $):</Text>
                <View style={styles.inputContainerDouble}>
                    <Input
                        placeholder='Minimum price'
                        containerStyle={styles.inputDouble}
                        inputContainerStyle={styles.inputInnerDouble}
                        inputStyle={styles.inputText}
                        inputMode={"numeric"}
                        value={budgetMin}
                        maxLength={10}
                        onChangeText={text => handleBudget("min", text)}
                    />
                    <View style={styles.division}></View>
                    <Input
                        placeholder='Max price'
                        containerStyle={styles.inputDouble}
                        inputContainerStyle={styles.inputInnerDouble}
                        inputStyle={styles.inputText}
                        inputMode={"numeric"}
                        value={budgetMax}
                        maxLength={10}
                        onChangeText={text => handleBudget("max", text)}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Project Timeline:</Text>
                <Input
                    placeholder='number in days'
                    containerStyle={styles.input}
                    inputContainerStyle={styles.inputInner}
                    inputStyle={styles.inputText}
                    inputMode={"numeric"}
                    value={timeline}
                    maxLength={3}
                    onChangeText={text => handleTimeline(text)}
                />
            </View>
            <Button
                title="Create Project"
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={submitData}
                disabled={submitDisabled}
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
                        <Text>The project description field emphisizes the overall and general idea of your project.</Text>
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
    modalContainer: {
        minHeight: "50%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: 20,
        borderRadius: 8,
        justifyContent: "space-between",
    },
    text: {
        marginLeft: "4%",
        marginBottom: 0
    },
    pressableContainerInput: {
        width: 40,
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
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
    },
    inputContainer: {
        width: "90%",
    },
    input: {
        marginBottom: 0,
        width: "100%",
        marginTop: 5
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
        borderColor: "rgb(200, 200, 200)"
    },
    inputContainerDouble: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    inputDouble: {
        marginBottom: 0,
        width: "43%",
        marginTop: 5
    },
    inputInnerDouble: {
        backgroundColor: "white",
        borderRadius: 10,
        minHeight: 55,
        maxHeight: 130,
        paddingLeft: 10,
        paddingRight: 15,
        paddingBottom: 5,
        paddingTop: 5,
        borderWidth: 1,
        borderColor: "rgb(200, 200, 200)"
    },
    division: {
        backgroundColor: "rgb(200, 200, 200)",
        height: 2,
        width: 20,
        marginBottom: 20
    },
    inputText: {
        fontSize: 13
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