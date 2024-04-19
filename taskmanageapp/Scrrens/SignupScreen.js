import React, { useState } from 'react';
import { VStack, Input, Button, HStack, Text, View} from 'native-base';
import axios from 'axios';
import {TouchableWithoutFeedback, Keyboard, Platform} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Constant';
import DateTimePicker from '@react-native-community/datetimepicker';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const navigation = useNavigation();
    const [name, setName] = useState(''); // State variable for name
    const [email, setEmail] = useState(''); // State variable for email
    const [password, setPassword] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setDateOfBirth(currentDate);
        setShowPicker(false)
    };
    const onFinish = async () => {
   
        const userData = {
            name: name,
            email: email,
            password: password,
            dateOfBirth: dateOfBirth
        };
        setLoading(true);
        try {
            const response = await axios.post(BASE_URL+'/user/signup', userData);
            console.log('Signup successful:', response.data);
            navigation.navigate("Login");
            // Redirect or perform other actions upon successful signup
        } catch (error) {
            console.error('Signup error:', error);
            // Handle error responses
        } finally {
            setLoading(false);
        }
    };
    const openDatePicker = () => {
        if (Platform.OS === 'android') {
          setShowDatePicker(true);
        }
      };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        
        <VStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            bg="white"
            p={4}
            space={6}
        >
            <Input
                    placeholder="Name"
                    onChangeText={(text) => setName(text)} // Update the name state variable
                />
             <Input
                    type="email"
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)} // Update the email state variable
                />
             <Input
                    type="password"
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)} // Update the password state variable
                />
            {/* <DatePicker placeholder="Date of Birth" /> */}
            <HStack alignItems="center">
            <View>
      <Button  onPress={() => setShowPicker(true)}>show Date</Button> 
      {showPicker && Platform.OS==="android" && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
    </View>
            </HStack>
            { Platform.OS === 'ios' && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
            <Button
                onPress={onFinish}
                colorScheme="indigo"
                _text={{ color: 'white' }}
                width="100%"
                isLoading={loading}
            >
                Sign up
            </Button>

            <HStack justifyContent="center">
                <Text fontSize="sm" color="gray.600">
                    Already registered?{' '}
                    <Text  color="indigo.600" onPress={()=>{navigation.navigate('Login')}}>
                        Sign in 
                    </Text>
                </Text>
            </HStack>
        </VStack>
        </TouchableWithoutFeedback>
    );
};

export default Signup;
