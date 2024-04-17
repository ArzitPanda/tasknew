import React, { useState, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button, Input, Checkbox, HStack, VStack, Link, useColorModeValue} from 'native-base';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../Hooks/AppContext';
import { BASE_URL } from '../Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableWithoutFeedback, Keyboard} from 'react-native'
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');



    const context = useContext(AppContext);
  
    const navigation = useNavigation();


    const {isAuthenticate,setIsAuthenticate,setUser,setLoading} = context;

    useEffect(()=>{


        const authenticate =async ()=>{
        
        
          const data = await AsyncStorage.getItem("userId");
        if(data!=undefined || data!=null)
        {
          navigation.navigate('MainScreens')
        }
        
        
        
        
        }
        
        authenticate()
        
        
        },[])


        const fetchUserData = async (userId,token) => {
            // Assuming you have the userId and token stored in local storage
      
      
      
        
      
            // Make sure userId and token are not null or undefined
            if (userId ) {
             
              // Set up Axios headers with the token
   
      
            
                // Make the Axios request to the getUser endpoint
                console.log(BASE_URL)
                setLoading(true)
                const response = await axios.get(`${BASE_URL}/user/getUser/${userId}`);
                
              console.log("here comes")
                setUser(response?.data);
                setLoading(false)
                // Do something with the user data
              
            } else {
              setLoading(false)
              console.error('userId or token not found in local storage');
              // Handle the case where userId or token is missing
            }
          };
    // Handle form submission
    const handleSubmit = async () => {
        console.log('Form submitted:', { username, password });

        try {
            const response = await axios.post(BASE_URL+'/user/login', {
                email: username,
                password: password
            });



            console.log(response.data)
            // Assuming the response contains the token and userId
            const { token, userId } = response.data;

            // You can save the token and userId to AsyncStorage or state
            // For example, you can use AsyncStorage:
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userId', userId);

          fetchUserData(userId,token);


            // Do something after successful login, like navigating to a dashboard screen
            // Example: navigation.navigate('Dashboard');
            console.log('user details',token,userId)
            navigation.navigate('MainScreens')
            
        
         
          
       
        } catch (error) {
            // Handle error
            console.log('Login failed:', error?.response.data?.error);
            // openNotification(error?.response.data?.error || 'Error', 'error');

            // You can display an error message to the user
        }

        // You can add your login logic here
    };

    const text = useColorModeValue("gray.400", "Dark");
    const bg = useColorModeValue("warmGray.50", "coolGray.800");
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <VStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        bg={bg}
        p={4}
        space={4}
    >
        <VStack width="90%" space={6}>
            <Input
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <HStack space={2} alignItems="center">
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                    
                />
                <Checkbox isChecked={false} colorScheme="blue" />
            </HStack>
            <Button
                onPress={handleSubmit}
                colorScheme="indigo"
                _text={{ color: 'white' }}
                width="100%"
            >
                Sign in
            </Button>
            <HStack justifyContent="center">
                <Text fontSize="sm" color={text}>
                    Not yet registered?{' '}
                    <Text  color="indigo.600" onPress={()=>{navigation.navigate('SignUp')}}>
                        Register here
                    </Text>
                </Text>
            </HStack>
        </VStack>
    </VStack>
    </TouchableWithoutFeedback>
    );
};

export default LoginPage;
