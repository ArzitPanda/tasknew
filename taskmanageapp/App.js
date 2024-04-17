import React, { useContext, useEffect, useState } from "react";
import { Image, NativeBaseProvider, View, extendTheme } from "native-base";
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
import { BASE_URL } from "./Constant";
import axios from "axios";
const App = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const MainScreens = () => {
    const navigation = useNavigation();
    const context = useContext(AppContext);
    console.log("data", context);
const [userData,setUserData] = useState(null);
  
    useEffect(() => {
    
      const authenticate =async  () => {
        const data =await  AsyncStorage.getItem("userId");
        if (data == undefined || data == null) {
          navigation.navigate("Login");
        } else {
          console.log("hello");
          navigation.navigate("MainScreens");
        }
      };

      authenticate();
    }, []);

useEffect(()=>{

const fetchUserProfile= async ()=>{
  const userId =await AsyncStorage.getItem("userId")
  const response = await axios.get(BASE_URL+'/user/userdetails/'+userId);
  const userData = response.data;
  setUserData(userData)

}
 fetchUserProfile()



},[])








    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Profile") {
             let iconImage = <Image
              source={{uri: userData?.profilePhoto || `https://api.dicebear.com/7.x/lorelei/png?seed=${context.user?.name}`}}
              rounded={'full'}
              style={{ width: size, height: size}}
            />;
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {focused ? (
                  <View style={{ alignItems: 'center', justifyContent: 'center', width: size + 4, height: size + 4, borderRadius: (size + 8) / 2, backgroundColor: '#2196f3' }}>
                    {iconImage}
                  </View>
                ) : (
                  <View style={{ width: size, height: size }}>
                    {iconImage}
                  </View>
                )}
              </View>
            )


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
          options={{headerShown:false }}
          
        />
        <Tab.Screen
          name="Teams"
          component={TeamScreen}
          options={{ title: "Teams",headerShown:false }}
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



const LoginGroup =() =>{
  const context = useContext(AppContext);
  const user = context?.user
return user ===null && (<Stack.Group screenOptions={{}}>
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
  </Stack.Group>)
}
  
 

  





  const config = {
    useSystemColorMode: false,
    initialColorMode: 'light',
  };
  


const NavigationManager =() =>{
  const context = useContext(AppContext);
  const user = context?.user
const [flag,setFlag]= useState(false)
  useEffect(()=>{


if(user)
{
  setFlag(false)

}
else
{
  setFlag(true)
}

  },[user])



return ( 
<NavigationContainer>
  <Stack.Navigator initialRouteName="Login">
    <Stack.Group>
      <Stack.Screen
        name="MainScreens"
        component={MainScreens}
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


{
  flag && (   
    <Stack.Screen
    name="Login"
    component={LoginPage}
    options={{ headerShown: false }}
    />)}
    <Stack.Screen
    name="SignUp"
    component={Signup}
    options={{ headerShown: false }}
    />
    

    </Stack.Group>

  </Stack.Navigator>
</NavigationContainer>)


}



  // extend the theme
  const customTheme = extendTheme({ config });
  return (
    <NativeBaseProvider theme={customTheme}>
      <AppProvider>
       <NavigationManager/>
      </AppProvider>
    </NativeBaseProvider>
  );
};

export default App;
