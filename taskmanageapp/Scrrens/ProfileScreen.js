import { Avatar, Box, Button,Center,Progress, Card, Divider, HStack, NativeBaseProvider, ScrollView, Tag,Text, View ,Bu, Icon,FlatList, Spinner} from 'native-base';
import { AntDesign,MaterialCommunityIcons} from '@expo/vector-icons';
import React, { useContext } from 'react'
import { AppContext } from '../Hooks/AppContext';
import   {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {

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




const renderItem = ({ item: team }) => (
  <Box key={team._id} bg="blue.100" p={2} rounded="md" mr={2}>
    <Text>{team.teamName}</Text>
  </Box>
);
return (
  <Box bg="white" flex={1}>
  {loading ? (<Center h={'full'}>

<Spinner color="indigo.500" size={'lg'}/>
</Center>) : (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Avatar size="2xl" bg="blue.500" source={{ uri: `https://api.dicebear.com/7.x/lorelei/png?seed=${user?.name}` }} />
        </Box>
        <Box flexDirection="row" space={2}>
          <Button variant="unstyled" onPress={()=>{navigation.navigate('Edit_Profile')}}>
            <Icon as={AntDesign} name="edit" size={5} color="black" />
          </Button>
          <Button variant="unstyled" onPress={()=>{navigation.navigate('Login')}}>
            <Icon as={AntDesign} name="logout" size={5} color="black" />
          </Button>
        </Box>
      </Box>
      <Box mt={4}>
        <Text fontSize="2xl" fontWeight="bold">{user?.name || "Arijit"}</Text>
        <Text color="gray.500">{user?.email || "arzit.panda@gmail.com"}</Text>
      </Box>
      <Divider my={4} />
      <Text fontSize="lg" fontWeight="bold">Details</Text>
      <Box mb={4}>
        <Text>
          <MaterialCommunityIcons name="home" size={20} color="gray.500" mr={2} />
          Address: {user?.address || "Not provided"}
        </Text>
        <Text mt={2}>
          <MaterialCommunityIcons name="phone" size={20} color="gray.500" mr={2} />
          Phone No: {user?.phone || "Not provided"}
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
      <Button
        bg="red.500"
        _pressed={{ bg: 'red.700' }}
        alignSelf="center"
        mt={4}
        onPress={()=>{navigation.navigate("Login")}}
      >
        Log Out
      </Button>
    </ScrollView>
  )}
</Box>

)
}

export default ProfileScreen

