import React, { useState, useContext, useEffect } from "react";
import {
  View,
 
  Button,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  Box,
  Card,
  Text,
  Divider,
  Icon,
  IconButton,
  VStack,
  useTheme,
  HStack,
  Center,
  InputLabel,
  Input,
  FormControl,
} from "native-base"; // Import necessary components from NativeBase
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../Hooks/AppContext";
import { BASE_URL } from "../Constant";
import axios from "axios";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const TeamScreen = () => {
  const [visible, setVisible] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const context = useContext(AppContext);
    const navigation = useNavigation();

  const [Teams, setTeams] = useState([]);

  const theme = useTheme();

 

  useEffect(() => {
    setTeams(context?.user?.Teams);
  }, [context]);

  const renderItem = ({ item }) => (
    <Box
      borderRadius="xl"
      borderColor={theme.colors.white} // Use primary color for border
      backgroundColor={"white"}
      marginBottom={2}
      
      // Add shadow
    >

      <Pressable onPress={()=>{navigation.navigate('TeamDetails', { id: item._id })}}>     
         <VStack divider={<Divider />} borderRadius={"2xl"}>
        <Box
          px={4}
          pt={4}
          height={50}
          backgroundColor={"blue.600"}
          borderTopRadius={10}
          
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            columnGap: 10,
          }}
        >
          <Text fontWeight="bold" style={{ color: "white", fontSize: 22 , }}>
            {item.teamName?.toUpperCase()}
          </Text>
         <View style={{display:"flex",alignItems:'center',flexDirection:"row",columnGap:20}}>
         <View style={{display:"flex",alignItems:'center',flexDirection:"row",columnGap:2}}>
          <FontAwesome6 name="tasks" size={20} color={'orange'} />
          <Text
          style={{color:'white',fontSize:20}}
          >{item.tasks.length}</Text>
          </View>
          <View style={{display:"flex",alignItems:'center',flexDirection:"row",columnGap:2}}>
          <FontAwesome6 name="user-group" size={20} color={'orange'} />
          <Text
          style={{color:'white',fontSize:20}}
          > {item.teamMembers.length}</Text>
          </View>

         </View>
        </Box>
        <Box
          px={4}
          marginTop={3}
          marginBottom={3}
          style={{ display: "flex", rowGap: 3 }}
        >
          <Text style={{fontSize:16,fontStyle:"normal",fontWeight:"500"}}>{item.description}</Text>
          <Text color={'blue.700'}>{formatDate(item.creationDate)}</Text>
      </Box>
      </VStack>
      </Pressable>

    </Box>
  );
  console.log("team screen", context?.user?.Teams);
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const response = await axios.post(BASE_URL + "/team/team/create", {
        teamCreator: context.user?._id,
        teamName,
        description: teamDesc,
      });
      console.log(response.data, "response by create Team");

      const teams = [...context?.user.Teams, response.data];
      context?.setUser({ ...context?.user, Teams: teams });

      setTeamDesc("");
      setTeamName("");
      setVisible(false);
    } catch (error) {
      console.error("Team creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US");
  };

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
<View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 }}>
     
      
        <Button title="Filter" onPress={() => console.log("Filter pressed")} />
        
    
      
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Team</Text>
          <IconButton
          icon={<Ionicons name="add" size={24} color="black" />} // Example icon, replace with your desired icon
          onPress={() => {
            // Handle button press
            showModal(true);
          }}
          colorScheme="blue" // Use blue color scheme for the button
        />
        
        </View>
      </View>
    <View style={{ flex: 1, padding: 20 }}>
    
        {/* <Button title="Add Team" onPress={showModal}>
     
            </Button> */}



      <Modal
    visible={visible}
    onRequestClose={handleCancel}
    animationType="slide" 
    transparent={true}
    style={{ // Override default modal styles
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Set black with 0.5 opacity
    }}
  
    
    // Optional: Add a slide animation
  >
    <Center  flex={1} px={2} style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }} >  
      
        <Box bg="white" shadow={3} rounded="lg" p={4} mx="auto" w="full"  maxW="md" 
    >
      <VStack spacing={4} padding={1} >
        <Center>
          <Text fontSize="lg" fontWeight="bold" color={'orange.600'} marginY={2}>Create a New Team</Text>
        </Center>
        <FormControl isRequired>
       
          <Input placeholder="Enter Team Name" value={teamName} onChangeText={setTeamName} />
        </FormControl>
        <FormControl isRequired marginTop={2}>
       
          <Input
            placeholder="Describe your team"
            value={teamDesc}
            onChangeText={setTeamDesc}
            multiline
            numberOfLines={4}
            h={24} // Adjust height as needed
          />
        </FormControl>
        <HStack justifyContent="space-between" mt={4}>
          <Button title="Cancel" color={'red'} onPress={handleCancel} variant="outline" />
          <Button title="Create" onPress={handleOk} variant="solid" colorScheme="primary" />
        </HStack>
      </VStack>
    </Box>
    </Center>

  </Modal>

    

      {context.loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <View>
          <FlatList
            data={context.user?.Teams}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          
          />
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

export default TeamScreen;
