import { React, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Input } from '@rneui/themed';
import { Button } from '@rneui/themed';
import { Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import axios from 'axios';



export default function ProjectQuestions({ navigation, route }) {
    const [question1, setQuestion1] = useState("");
    const [question2, setQuestion2] = useState("");
    const [question3, setQuestion3] = useState("");
    const [question4, setQuestion4] = useState("");
    const [isModalVisible1, setModalVisible1] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [isModalVisible3, setModalVisible3] = useState(false);
    const [isModalVisible4, setModalVisible4] = useState(false);
    const [visible, setVisible] = useState(false);
    const [snackMsg, setSnackMsg] = useState("")

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const submitData = async () => {
        try {
            console.log()
            const response = await axios.post('http://192.168.0.110:8080/setQuestionsInProjectQuery', {
                question1,
                question2,
                question3,
                question4,
                ProjectId: route.params.ProjectId
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

    const signOut = async () => {
        const response = await axios.post(`http://192.168.0.110:8080/logout`);
        if (response.data.error) {
            // setSnackMsg(response.data.error);
            // onToggleSnackBar();
        } else {
            navigation.navigate("Dashboard", { "data": "start" })
        }
    }
    // const toggleModal = () => {
    //     setModalVisible(!isModalVisible);
    // };

    return (
        <SafeAreaView style={styles.container}>
            <Pressable style={styles.pressableContainer} onPress={signOut}>
                <View style={styles.iconContainer}>
                    <Icon
                        name='log-out-outline'
                        size={24}
                        color='rgb(110, 110, 110)'
                    />
                </View>
            </Pressable>
            <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={styles.scrollView}
            >
                <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.text}>What are the main goals and objectives you aim to achieve with this project/product?</Text>
                        <Pressable style={styles.pressableContainerInput} onPress={() => { setModalVisible1(!isModalVisible1); }}>
                            <Icon
                                name='help-circle-outline'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </Pressable>
                    </View>
                    <Input
                        placeholder="Your answer..."
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={600}
                        onChangeText={text => setQuestion1(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.text}>Who/What are the users of the system/product?</Text>
                        <Pressable style={styles.pressableContainerInput} onPress={() => { setModalVisible2(!isModalVisible2); }}>
                            <Icon
                                name='help-circle-outline'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </Pressable>
                    </View>
                    <Input
                        placeholder="Your answer..."
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={600}
                        onChangeText={text => setQuestion2(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.text}>What functionalities do you expect and wish to be performed by this project/product?</Text>
                        <Pressable style={styles.pressableContainerInput} onPress={() => { setModalVisible3(!isModalVisible3); }}>
                            <Icon
                                name='help-circle-outline'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </Pressable>
                    </View>
                    <Input
                        placeholder="Your answer..."
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={600}
                        onChangeText={text => setQuestion3(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.text}>What properties should project/product have?</Text>
                        <Pressable style={styles.pressableContainerInput} onPress={() => { setModalVisible4(!isModalVisible4); }}>
                            <Icon
                                name='help-circle-outline'
                                size={24}
                                color='rgb(110, 110, 110)'
                            />
                        </Pressable>
                    </View>
                    <Input
                        placeholder="Your answer..."
                        containerStyle={styles.input}
                        inputContainerStyle={styles.inputInner}
                        inputStyle={styles.inputText}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={600}
                        onChangeText={text => setQuestion4(text)}
                    />
                </View>

                <Button
                    title="Submit"
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={styles.submitBtn}
                    containerStyle={styles.submitContainer}
                    onPress={submitData}
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
            <Modal isVisible={isModalVisible1}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Think about what you hope to accomplish with the project/product, what are the outcomes of using the project/product.</Text>
                        <Text> </Text>
                        <Text>Example: </Text>
                        <Text> </Text>
                        <Text>"I want a system to create a statistical study about the exported products of a factory".</Text>
                    </View>
                    <Button title="Close" onPress={() => { setModalVisible1(!isModalVisible1); }} />
                </View>
            </Modal>
            <Modal isVisible={isModalVisible2}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Think about the stakeholders (users) of the system/product and their characterstics.</Text>
                        <Text> </Text>
                        <Text>Example: </Text>
                        <Text> </Text>
                        <Text>"The users of the system mainly are the managers".</Text>
                    </View>
                    <Button title="Close" onPress={() => { setModalVisible2(!isModalVisible2); }} />
                </View>
            </Modal>
            <Modal isVisible={isModalVisible3}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Think about what about the features and functions the system should provide for its users.</Text>
                        <Text> </Text>
                        <Text>Example: </Text>
                        <Text> </Text>
                        <Text>"The managers will be able to insert the name, the quantity and the price of the product to the system".</Text>
                    </View>
                    <Button title="Close" onPress={() => { setModalVisible3(!isModalVisible3); }} />
                </View>
            </Modal>
            <Modal isVisible={isModalVisible4}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Think about the constraints of the system.</Text>
                        <Text> </Text>
                        <Text>Example: </Text>
                        <Text> </Text>
                        <Text>- Scalability: How much will performance change with higher workloads?</Text>
                        <Text> </Text>
                        <Text>- Portability: Which hardware, operating systems, and browsers, along with their versions, does the software run on?</Text>
                        <Text> </Text>
                        <Text>- Compatibility: Does the system conflict with other applications and processes?</Text>
                        <Text> </Text>
                        <Text>- Reliability: How often does the system experience critical failures?</Text>
                        <Text> </Text>
                        <Text>- Maintainability: How much time does it take to fix the issue when it arises?</Text>
                        <Text> </Text>
                        <Text>- Availability: How long is the average system downtime?</Text>
                        <Text> </Text>
                        <Text>- Security: How well are the system and its data protected against attacks?</Text>
                        <Text> </Text>
                        <Text>- Usability: How easy is it to use the system?</Text>
                        <Text> </Text>
                    </View>
                    <Button title="Close" onPress={() => { setModalVisible4(!isModalVisible4); }} />
                </View>
            </Modal>
        </SafeAreaView >
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        width: "100%",
        backgroundColor: "rgb(250, 250, 250)",
    },
    scrollView: {
        marginTop: 130,
        alignItems: "center",
        backgroundColor: "rgb(250, 250, 250)",
        paddingBottom: 100,
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
        marginLeft: "auto",
        marginBottom: 5
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
    text: {
        marginLeft: "4%",
        marginBottom: 0,
        fontSize: 12,
        maxWidth: "80%",
        color: "rgb(90, 90, 90)"
    },
    inputContainer: {
        width: "100%",
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
        borderColor: "rgb(200, 200, 200)"
    },
    inputText: {
        fontSize: 13
    },
    submitContainer: {
        marginTop: 10,
        width: "85%",
        marginVertical: 10
    },
    submitBtn: {
        backgroundColor: 'rgb(73,149,243)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
        padding: 15
    }
});