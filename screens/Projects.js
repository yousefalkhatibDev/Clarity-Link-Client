import { React, useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View, Pressable, RefreshControl, Image } from 'react-native';
import axios from 'axios';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';

import Logo from "../assets/CLARITY LINK.png"


export default function Projects({ navigation, route }) {
    const [projects, setProjects] = useState([])
    const [bids, setBids] = useState([])
    const [userId, setUserID] = useState("")
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserId = async () => {
        try {
            const response = await axios.get(`http://192.168.0.110:8080/getUserId?userType=${route.params.userType}`);
            setUserID(response.data.UserId);
        } catch (err) {
            console.log(err)
        }

    }

    const fetchAllBids = async (resolve) => {
        try {
            const response = await axios.get(`http://192.168.0.110:8080/getAllBids`);

            if (response.data.ErrorMessage) {
                console.warn(response.data.ErrorMessage)
            } else if (response.data.Response) {
                setBids(false)
            } else {
                if (bids === response.data.results) {
                    fetchProjects();
                }
                setBids(response.data.results)
            }
        } catch (err) {
            console.log(err)
        }

    }

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`http://192.168.0.110:8080/getProjects?userType=${route.params.userType}`);
            if (response.data.ErrorMessage) {
                console.warn(response.data.ErrorMessage)
            } else {
                let projects;

                if (bids !== "no response" && bids.length > 0) {
                    let numbOfFounds = 0;
                    bids.map((el) => {
                        if (el.Bider_id === userId) {
                            // console.log(el.Bider_id, userId);
                            projects = response.data.results.filter((elem) => {
                                return elem.Project_id !== el.Project_id
                            })
                            numbOfFounds = numbOfFounds + 1;
                        }
                    })
                    if (numbOfFounds === 0) {
                        projects = response.data.results
                    }
                } else {
                    projects = response.data.results
                }
                setProjects(projects)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const HandlePlaceBid = async (id, title, description, budget, timeline, client) => {

        navigation.navigate("HiddenStack", {
            screen: "PlaceBid",
            params: {
                "id": id,
                "title": title,
                "description": description,
                "budget": budget,
                "timeline": timeline,
                "userType": route.params.userType,
                "client": client
            }
        })
    }

    const signOut = async () => {
        const response = await axios.post(`http://192.168.0.110:8080/logout`);
        if (response.data.error) {
            console.warn(response.data.error)
        } else {
            navigation.navigate("Dashboard")
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllBids();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    useEffect(() => {
        if (userId !== "") {
            fetchAllBids()
        } else {
            fetchUserId()
        }
    }, [route])

    useEffect(() => {
        if (userId !== "") {
            fetchAllBids()
        }
    }, [userId])

    useEffect(() => {
        if (bids.length > 0 || bids === false) {
            fetchProjects()
        }
    }, [bids])
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
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={25} />}>
                {
                    projects && projects.length > 0 ? projects.map((el, index) => {
                        return (
                            <View key={index} style={styles.cardContainer}>
                                <View>
                                    <Text style={styles.cardTitle}>{el.Title}</Text>
                                    <Text style={styles.cardDescription}>{el.Description.slice(0, 100)}...</Text>
                                </View>
                                <View>
                                    <Text style={styles.cardBudget}>{el.Budget}$</Text>
                                    <Button
                                        title="Place A Bid"
                                        titleStyle={{ fontWeight: '700' }}
                                        buttonStyle={styles.button}
                                        containerStyle={styles.buttonContainer}
                                        onPress={() => { HandlePlaceBid(el.Project_id, el.Title, el.Description, el.Budget, el.Deadline, el.Client) }}
                                    />
                                </View>
                            </View>
                        );
                    })
                        :
                        <View style={{ alignItems: "center", justifyContent: "space-between" }}>
                            <Text>No Projects Found</Text>
                            <Image
                                style={styles.logo}
                                source={Logo}
                            />
                        </View>
                }
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "rgb(250, 250, 250)",
    },
    scrollView: {
        marginTop: 100,
        alignItems: "center",
        backgroundColor: "rgb(250, 250, 250)",
    },
    logo: {
        width: 250,
        height: 250,
        marginTop: "100%"
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
        top: 40,
        right: 25,
        zIndex: 1000,
    },
    cardContainer: {
        width: "90%",
        height: 200,
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
        fontSize: 11,
        color: "rgb(150, 150, 150)",
        width: "80%"
    },
    cardBudget: {
        marginBottom: 7,
        color: "rgb(160, 180, 100)"
    },
    button: {
        backgroundColor: 'rgb(73,149,243)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
    }
})