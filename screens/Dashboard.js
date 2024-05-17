import { React, useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, Pressable, BackHandler } from 'react-native'
import axios from 'axios';
import { Button } from '@rneui/themed';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';

export default function DashboardScreen({ navigation, route }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentProjectId, setCurrentProjectId] = useState("")
    const [project, setProject] = useState("")
    const [isProjectQueryDone, setIsProjectQueryDone] = useState("")
    const [accType, setAccType] = useState("")

    const fetchIsLogged = async () => {
        try {
            const response = await axios.get('http://192.168.0.110:8080/isLoggedIn');

            if (response.data.isSigned === false) {
                if (isLoggedIn === true) {
                    setIsLoggedIn(false)
                }
                navigation.navigate("HiddenStack", {
                    screen: "LogIn",

                })
            } else {
                setIsLoggedIn(true)
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
                fetchIsProjectQueryDone(response.data.ProjectId)
                // setCurrentProjectId(response.data.ProjectId)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchIsProjectQueryDone = async (currentProjectId) => {
        try {
            const response = await axios.get(`http://192.168.0.110:8080/isProjectQueryDone?ProjectId=${currentProjectId}`);
            if (response.data) {
                // setIsProjectQueryDone(response.data.results[0].isDone)
                // setCurrentProjectId(response.data.ProjectId)
                fetchProject(currentProjectId, response.data.results[0].isDone)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchProject = async (currentProjectId, isProjectQueryDone) => {
        try {
            // if (currentProjectId === "") {
            //     return;
            // }
            const response = await axios.get(`http://192.168.0.110:8080/getProjectById?ProjectId=${currentProjectId}`);
            const responseInitial = await axios.get('http://192.168.0.110:8080/isInitialInputSet');
            if (response.data.ErrorMessage) {
                console.warn(response.data.ErrorMessage)
            } else {
                if (response.data.results[0].Engineer !== null && response.data.results[0].Developer !== null) {
                    if (isProjectQueryDone === 1 && responseInitial.data.results[0].Initial_context === null) {
                        navigation.navigate('HiddenStack', {
                            screen: 'AiChat',
                            params: {
                                "userType": accType,
                                "project": response.data.results[0],

                            }
                        })
                    } else if (isProjectQueryDone === 0) {
                        navigation.navigate('HiddenStack', { screen: 'ProjectQuestions', params: { "ProjectId": currentProjectId, } })
                    } else if (isProjectQueryDone === 1 && responseInitial.data.results[0].Initial_context !== null) {
                        console.log("GOING THERE")
                        navigation.navigate("HiddenStack", {
                            screen: "ProjectDetails",
                            params: {
                                "currentProjectId": currentProjectId,
                                "Project": response.data.results[0],
                                "userType": accType,

                            }
                        })
                    }
                } else {
                    navigation.navigate("HiddenStack", {
                        screen: "ProjectDetails",
                        params: {
                            "currentProjectId": currentProjectId,
                            "Project": response.data.results[0],
                            "userType": accType,

                        }
                    })
                }
                // fetchBids(currentProjectId, response.data.results[0], isProjectQueryDone)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const fetchAccountType = async () => {
        try {
            const response = await axios.get('http://192.168.0.110:8080/getAccountType');

            if (response.data.accountType !== false) {
                if (response.data.accountType === "Client") {
                    console.log(response.data.isInProject)
                    if (response.data.isInProject) {
                        setAccType(response.data.accountType);
                        fetchCurrentProjectId();
                    } else {
                        navigation.navigate("HiddenStack", {
                            screen: "AddProject",

                        })
                    }

                } else if (response.data.accountType === "Engineer") {
                    if (response.data.isInProject) {
                        navigation.navigate("HiddenStack", {
                            screen: "RecieveInput",
                            params: {
                                "userType": response.data.accountType,

                            }
                        })
                    } else {
                        navigation.navigate("HiddenStack", {
                            screen: "Projects",
                            params: {
                                "userType": response.data.accountType,

                            }
                        })
                    }
                } else {
                    if (response.data.isInProject) {
                        navigation.navigate("HiddenStack", {
                            screen: "RecieveSrs",
                            params: {
                                "userType": response.data.accountType,

                            }
                        })
                    } else {
                        navigation.navigate("HiddenStack", {
                            screen: "Projects",
                            params: {
                                "userType": response.data.accountType,

                            }
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
        setIsLoggedIn(false);
        fetchIsLogged()
    }, [route])

    useEffect(() => {
        if (isLoggedIn === true) {
            fetchAccountType()
        }
    }, [isLoggedIn])

    // useEffect(() => {
    //     if (currentProjectId !== "") {
    //         fetchIsProjectQueryDone();
    //     }
    // }, [currentProjectId])

    // useEffect(() => {
    //     if (isProjectQueryDone !== "") {
    //         fetchProject();
    //     }
    // }, [isProjectQueryDone])

    // useEffect(() => {
    //     if (project !== "") {
    //         fetchBids();
    //     }
    // }, [project])

    return (
        < SafeAreaView style={styles.container}>
            <WaveIndicator color='rgb(50, 100, 150)' />
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgb(29,60,107)",
        backgroundColor: "rgb(250, 250, 250)",


    },
    button: {
        backgroundColor: 'rgb(73,149,243)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
        padding: 7,
    },
    buttonContainer: {
        width: "30%",
        marginHorizontal: 50,
        marginVertical: 10,
    }
})