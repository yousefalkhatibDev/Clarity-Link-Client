import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';


import SignInScreen from './screens/SignIn';
import LoginScreen from './screens/Login';
import DashboardScreen from './screens/Dashboard';
import AddProjectScreen from './screens/AddProject';
import ProjectsScreen from './screens/Projects';
import ProjectDetailsScreen from './screens/ProjectDetails';
import PlaceBidScreen from './screens/PlaceBid';
import AcceptBidsScreen from './screens/AcceptBids';
import ProjectQuestions from './screens/ProjectQuestions';
import AiChat from './screens/AiChat';
import SelectChats from './screens/SelectChats';
import ChatRoom from './screens/ChatRoom';
import RecieveInput from './screens/RecieveInput';
import RecieveSrs from './screens/RecieveSrs';



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HiddenStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={LoginScreen} options={{ headerShown: false, headerTransparent: true, headerTitle: "", }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="AddProject" component={AddProjectScreen} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="Projects" component={ProjectsScreen} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="PlaceBid" component={PlaceBidScreen} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="AcceptBids" component={AcceptBidsScreen} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="ProjectQuestions" component={ProjectQuestions} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="AiChat" component={AiChat} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="SelectChats" component={SelectChats} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="RecieveInput" component={RecieveInput} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="RecieveSrs" component={RecieveSrs} options={{ headerShown: false, headerTransparent: true, headerTitle: "" }} />
    </Stack.Navigator>
  );
};



function MyDrawer() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ drawerLabel: () => null, title: null, headerShown: false, drawerActiveBackgroundColor: "rgba(0, 0, 0, 0)" }} />
      <Stack.Screen name="HiddenStack" component={HiddenStack} options={{ drawerLabel: () => null, title: null, headerShown: false, drawerActiveBackgroundColor: "rgba(0, 0, 0, 0)" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [shouldSendRequest, setShouldSendRequest] = useState(false);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setShouldSendRequest(true); // Flag to trigger request
  //   }, 1 * 20 * 1000); // 2 minutes in milliseconds

  //   return () => clearInterval(intervalId); // Cleanup function
  // }, []);

  // useEffect(() => {
  //   if (shouldSendRequest) {
  //     // Make your request to the server here (e.g., using fetch)
  //     fetch('http://192.168.0.110:8080/isLoggedIn')
  //       .then(response => response.json())
  //       .then(data => console.log('Received data:', data))
  //       .catch(error => console.error('Error sending request:', error))
  //       .finally(() => setShouldSendRequest(false)); // Reset flag after request
  //   }
  // }, [shouldSendRequest]);
  return (
    <NavigationContainer>
      <MenuProvider>
        <MyDrawer />
      </MenuProvider>
    </NavigationContainer>
  );
}

