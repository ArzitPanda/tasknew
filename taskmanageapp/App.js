import React, { useContext, useEffect } from "react";
import { NativeBaseProvider } from "native-base";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./Scrrens/ProfileScreen";
import TeamScreen from "./Scrrens/TeamScreen";
import LoginPage from "./Scrrens/LoginScreen";
import Signup from "./Scrrens/SignupScreen";
import { AntDesign } from "@expo/vector-icons";
import { AppContext, AppProvider } from "./Hooks/AppContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskScreen from "./Scrrens/TaskScreen";
import { FontAwesome } from "@expo/vector-icons";
import TeamManagementComponent from "./Scrrens/TeamDetailsScreen";
import UserScreen from "./Scrrens/UserScreen";
import TaskForm from "./Scrrens/TaskAddScreen";
import QueryScreen from "./Scrrens/QueryScreen";
import ProfileStack from "./Scrrens/ProfileStack";
const App = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const MainScreens = () => {
    const navigation = useNavigation();
    const context = useContext(AppContext);
    console.log("data", context);

    const user = AsyncStorage.getItem("userId");
    useEffect(() => {
      const authenticate = () => {
        const data = AsyncStorage.getItem("userId");
        if (data == undefined || data == null) {
          navigation.navigate("Login");
        } else {
          console.log("hello");
          navigation.navigate("MainScreens");
        }
      };

      authenticate();
    }, []);

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Profile") {
              iconName = focused ? "profile" : "profile";
            } else if (route.name === "Teams") {
              iconName = focused ? "team" : "team";
            } else if (route.name === "Tasks") {
              return <FontAwesome name="tasks" size={size} color={color} />;
            }

            return <AntDesign name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{ title: "Profile" }}
        />
        <Tab.Screen
          name="Teams"
          component={TeamScreen}
          options={{ title: "Teams" }}
        />
        <Tab.Screen
          name="Tasks"
          component={TaskScreen}
          options={{ title: "Tasks" }}
        />
         <Tab.Screen
          name="Query"
          component={QueryScreen}
          options={{ title: "Query" ,headerShown:false}}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NativeBaseProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Group>
              <Stack.Screen
                name="MainScreens"
                component={MainScreens}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={Signup}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UserProfile"
                options={{ title: "UserProfile" }}
                component={UserScreen}
              />
              <Stack.Screen
                name="TeamDetails"
                component={TeamManagementComponent}
                options={({ route }) => ({ title: `Team: Details` })} // Set title based on ID
              />
                <Stack.Screen
                name="TaskFormScreen"
                options={{ title: "Add Task" }}
                component={TaskForm}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </NativeBaseProvider>
  );
};

export default App;
