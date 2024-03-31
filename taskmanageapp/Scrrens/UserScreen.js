import { Avatar, Box, Button, Card, Center, Divider, FlatList, HStack, NativeBaseProvider, Progress, ScrollView, Spinner, Tag,Text, View } from 'native-base';
import { AntDesign} from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Hooks/AppContext';
import   {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../Constant';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Assuming Expo for icons


const UserScreen = ({route}) => {

const [user,setUser]= useState({})

const [loading,setLoading] =useState(false)
  

useEffect(()=>{

 const fetchUserData = async (userId) => {
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

fetchUserData(route.params._id)

},[])
  


    const renderItem = ({ item: team }) => (
      <Box key={team._id} p={2}>
        <Tag bgColor={'blue.500'} rounded="md">
          <Text color="white">{team.teamName}</Text>
        </Tag>
      </Box>
    );

const navigation = useNavigation()
return (
    <Box bg="white" flex={1}>
      {loading ? (<Center h={'full'}>

<Spinner color="indigo.500" size={'lg'}/>
</Center>) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Box flexDirection="row" alignItems="center">
            <Avatar
              size="2xl"
              bg="blue.500"
              source={{ uri: `https://api.dicebear.com/7.x/lorelei/png?seed=${user?.name}` }}
            />
            <Box ml={4} flex={1}>
              <Text fontSize="2xl" fontWeight="bold">{user?.name || "Arijit"}</Text>
              <Text color="gray.500">{user?.email || "arzit.panda@gmail.com"}</Text>
            </Box>
          </Box>
          <Divider my={4} />
          <Text fontSize="lg" fontWeight="bold">Details</Text>
          <Box mb={4}>
            <Text>
              <MaterialCommunityIcons name="home" size={20} color="gray.500" mr={2} />
           {user?.address || "Not provided"}
            </Text>
            <Text mt={2}>
              <MaterialCommunityIcons name="phone" size={20} color="gray.500" mr={2} />
            {user?.phone || "Not provided"}
            </Text>
            {/* Add more details like social links if available */}
          </Box>
          <Text fontSize="lg" fontWeight="bold">Information</Text>
          <Box mb={4}>
            <Text>
              <MaterialCommunityIcons name="calendar" size={20} color="gray.500" mr={2} />
              Date of Birth: {user?.DateOfBirth ? user.DateOfBirth.toDateString() : 'Not provided'}
            </Text>
          </Box>
          <Text fontSize="xl">Teams</Text>
          <FlatList
            data={user?.Teams || []} // Handle potential undefined user.Teams
            renderItem={renderItem}
            horizontal={true} // Make teams scroll horizontally
            showsHorizontalScrollIndicator={false} // Hide scroll indicator for cleaner look
            keyExtractor={(item) => item._id}
          />
        </ScrollView>
      )}
    </Box>
  );
}

export default UserScreen

