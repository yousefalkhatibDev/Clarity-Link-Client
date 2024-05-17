import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Input } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import WebSocket from 'react-native-websocket'; // Import WebSocket from react-native-websocket
import axios from 'axios';


const ChatRoom = ({ navigation, route }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null); // State to hold WebSocket connection


    const sendMessage = async () => {
        try {
            const response = await axios.post('http://192.168.0.110:8080/storeMessage', {
                message,
                incomingId: route.params.incomingId,
                outgoingId: route.params.outgoingId
            });

            if (response.data.ErrorMessage) {
                console.warn(response.data.ErrorMessage)
            } else {
                setMessage("")
                // console.log(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getMessages = async () => {
        try {
            const response = await axios.post('http://192.168.0.110:8080/getMessages', {
                userId: route.params.incomingId,
                userId2: route.params.outgoingId
            });

            if (response.data.ErrorMessage) {
                console.warn(response.data.ErrorMessage);
            } else {
                setMessages(response.data.results)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const goBack = () => {
        navigation.goBack()
    };

    const handleMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message.data]);
    }

    useEffect(() => {
        // Establish WebSocket connection when component mounts
        getMessages()
    }, []);
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
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView}>
                <View style={styles.messagesContainer}>
                    {
                        messages.length > 0 && messages.map(message => {
                            if (message.incoming_msg_id === route.params.incomingId) {
                                return (
                                    <View key={message.id} style={styles.messageCardLeft}>
                                        <View style={styles.messageContainerLeft}>
                                            <Text style={styles.messageTextLeft}>
                                                {message.msg}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            } else {
                                return (
                                    <View key={message.id} style={styles.messageCardRight}>
                                        <View style={styles.messageContainerRight}>
                                            <Text style={styles.messageTextRight}>{message.msg}</Text>
                                        </View>
                                    </View>
                                )
                            }

                        })
                    }
                </View>
            </ScrollView>
            {/* <Text>Incoming: {route.params.icomingId} Outgoing: {route.params.outgoingId}</Text> */}
            <View style={styles.inputContainer}>
                <Input
                    placeholder='Type somthing here...'
                    containerStyle={styles.input}
                    inputContainerStyle={styles.inputInner}
                    inputStyle={styles.inputText}
                    multiline={true}
                    numberOfLines={3}
                    maxLength={600}
                    value={message}
                    onChangeText={text => setMessage(text)}
                    rightIcon={
                        <Icon
                            name='send'
                            size={24}
                            color='rgb(170, 170, 170)'
                            style={{ marginLeft: 10 }}
                            onPress={sendMessage}
                        />
                    }
                />
            </View>
            <WebSocket
                url="ws://192.168.0.110:8082"
                onMessage={(message) => {
                    try {
                        const parsedMessage = JSON.parse(message.data);
                        handleMessage(parsedMessage);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                }
                }
                onOpen={() => console.log("WebSocket connection opened")}
                onError={(error) => console.error("WebSocket error:", error)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        marginTop: 10,
    },
    inputText: {
        fontSize: 13,
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
    },
    messagesContainer: {
        marginTop: 100,
        width: "100%"
    },
    messageCardLeft: {
        width: "100%",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    messageContainerLeft: {
        backgroundColor: "#1d9ce0",
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'rgb(230, 230, 230)',
        elevation: 1,
        maxWidth: "80%"
        // width: "90%",
        // marginHorizontal: 50,
        // marginVertical: 10,
    },
    messageTextLeft: {
        color: "white",
        fontSize: 15,
        padding: 6,
    },
    messageCardRight: {
        width: "100%",
        justifyContent: "flex-end",
        flexDirection: "row",
    },
    messageContainerRight: {
        backgroundColor: "#ebeced",
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'rgb(210, 210, 210)',
        elevation: 1,
        maxWidth: "80%"
        // width: "90%",
        // marginHorizontal: 50,
        // marginVertical: 10,
    },
    messageTextRight: {
        color: "#424242",
        fontSize: 15,
        padding: 6,
    },
});

export default ChatRoom;