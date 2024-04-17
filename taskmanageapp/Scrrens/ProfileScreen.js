import { Avatar, Box, Button,Center,Progress, Card, Divider, HStack, NativeBaseProvider, ScrollView, Tag,Text, View ,Bu, Icon,FlatList, Spinner, VStack, Stack, List, Image, useColorModeValue} from 'native-base';
import { AntDesign,MaterialCommunityIcons} from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Hooks/AppContext';
import   {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../Constant';
import { Linking, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Asset, useAssets } from 'expo-asset';
const ProfileScreen = () => {
  const [assets, error] = useAssets([require('../assets/cert.png'), require('../assets/favicon.png')]);
    // const user ={
    //     name: "John Doe",
    //     email: "john.doe@example.com",
    //     address: "123 Main St, Anytown, USA",
    //     phone: "+1234567890",
    //     DateOfBirth: new Date("1990-01-01"),
    //     Teams: [
    //       { _id: "1", teamName: "Team A" },
    //       { _id: "2", teamName: "Team B" },
    //       { _id: "3", teamName: "Team C" }
    //     ]
    //   };


      const contextData = useContext(AppContext);
  const user = contextData.user;
  const loading = contextData.loading;
const navigation = useNavigation()

const [userData,setUserData] = useState(null)
const bg = useColorModeValue("white", "coolGray.800");
const bgNav = useColorModeValue("white", "black");
const icon = useColorModeValue('black','white')
  useEffect(()=>{
   const fetchData=async() =>{


 try {
  const userId =await AsyncStorage.getItem("userId")
  const response = await axios.get(BASE_URL+'/user/userdetails/'+userId);
  const userData = response.data;
  setUserData(userData)
 
  console.log(response.data)
 } catch (error) {
  console.log(error)
 }


   }
   fetchData();

  },[user])

const tagcolor = useColorModeValue("blue.100","blueGray.900")
const renderItem = ({ item: team }) => (
  <Box key={team._id} bg={tagcolor} p={2} rounded="md" mr={2}>
    <Text>{team.teamName}</Text>
  </Box>
);
return (
  <Box bg="white" flex={1}>
  {loading ? (<Center h={'full'}>

<Spinner color="indigo.500" size={'lg'}/>
</Center>) : (

<SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
<View style={{  borderBottomWidth: 1, borderBottomColor: '#ccc' }} backgroundColor={bgNav}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, height: 60 }}>
       {
        !user && (   <TouchableOpacity onPress={() => navigation.goBack()} >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>)
       }
   
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profile</Text>
       
          <Box flexDirection="row" space={2}>
          <Button variant="unstyled" onPress={()=>{navigation.navigate('EditProfile')}}>
            <Icon as={AntDesign} name="edit" size={5} color={icon} />
          </Button>
          
        </Box>
        
        </View>
      </View>
    <ScrollView  style={{ flex: 1,padding:8 ,minHeight:'100vh'}} backgroundColor={bg}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box display={'flex'} justifyContent="center" alignItems="center" width={'full'}>
        <Image
            source={{ uri: userData?.profilePhoto || `https://api.dicebear.com/7.x/lorelei/png?seed=${user?.name}` }}
            alt="Profile preview"
            borderRadius={100}
            backgroundColor={'blue.400'}
            style={{ width: 150, height:150, }}
          />
        </Box>
      
      </Box>
      <Box mt={4} display={'flex'} justifyContent="center" alignItems="center" width={'full'}>
        <Text fontSize="2xl" fontWeight="bold">{user?.name || "Arijit"}</Text>
        <Text color="gray.500">{user?.email || "arzit.panda@gmail.com"}</Text>
      </Box>
      <Divider my={4} />
      <Text fontSize="lg" fontWeight="bold">Details</Text>
      <Box mb={4}>
        <Text>
          <MaterialCommunityIcons name="home" size={20} color="gray.500" mr={2} />
          {userData?.address?.
      streetAddress || "Not provided"}
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
          Date of Birth: { user?.DateOfBirth ? user.DateOfBirth.toDateString() : 'Not provided' }
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
   
     <Text fontSize="lg" fontWeight="bold">Certificates</Text>
      <Divider my={2} />
      <List space={2} borderWidth={0} paddingX={5} >
        {userData?.certifications.map((certification, index) => (
           <Box bg={bgNav} mt={2} p={2} borderRadius={8} shadow={2}>
           <Stack space={2} direction="row" alignItems="center">
             <Image  size="100px" source={assets[0]}/>
             <VStack space={2} flex={1}>
               <Text fontSize={14} fontWeight="bold" color="coolGray.800">
                 {certification.name.toUpperCase()}
               </Text>
               <Text fontSize={12} color="coolGray.600">
                 Issuer: {certification.issuer}
               </Text>
               <Text fontSize={12} color="coolGray.600">
                 Issued Date: {new Date(certification.issuedDate).toLocaleDateString()}
               </Text>
               {certification.url && (
                 <TouchableOpacity onPress={() => Linking.openURL(certification.url)}>
                   <Text fontSize={12} color="primary.500">
                     URL: {certification.url}
                   </Text>
                 </TouchableOpacity>
               )}
             </VStack>
           </Stack>
         </Box>
        ))}
      </List>
 



      <Button
        bg="red.500"
        _pressed={{ bg: 'red.700' }}
        alignSelf="center"
        mt={4}
        onPress={async ()=>{ contextData.setUser(null); await AsyncStorage.removeItem('userId');  navigation.navigate("SignUp")}}
      >
        Log Out
      </Button>
    </ScrollView>
    </SafeAreaView>
  )}
</Box>

)
}

export default ProfileScreen

