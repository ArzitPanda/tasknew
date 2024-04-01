import React, { useState, useEffect } from 'react';
import {
  Box,
  View,
  Heading,
  VStack,
  HStack,
  Text,
  Select,
  Input,
  Button,
  Modal,
  ScrollView,
  Tag,
  Icon,
  Flex,
  useToast,
  ModalFooter,
  FlatList,
  Center,
  Progress,
  CircularProgress,
  Spinner,
} from 'native-base';
import {MaterialCommunityIcons,FontAwesome,Entypo } from "@expo/vector-icons";
import axios from 'axios';
import { BASE_URL } from '../Constant';
import TeamMembersList from '../Components/TeamMembersList';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TeamManagementComponent = ({  route }) => { 

    const toast = useToast();

    const [teamData, setTeamData] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
    const [handleDesignation, setHandleDesignation] = useState('MANAGER');
    const [addUserVisible, setAddUserVisible] = useState(false);
    const [updateTeamVisible, setUpdateTeamVisible] = useState(false);
    const [deleteTeamVisible, setDeleteTeamVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState();
    const [taskFormVisible, setTaskFormVisible] = useState(false);

    const [userSearch,setUserSearch] =useState("")
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US");
      };


const navigation = useNavigation()
      const DesignationColorizer = (val) => {
        switch (val) {
          case 'MANAGER':
            return 'blue.400';
          case 'DEVELOPER':
            return 'orange.400';
          case 'CREATOR':
            return 'green.400';
          case 'INTERN':
            return 'yellow.400';
          default:
            return 'red.400';
        }
      };
    
      const PriorityColorizer = (val) => {
        switch (val) {
          case 'Low':
            return 'blue.400';
          case 'Medium':
            return 'orange.400';
          case 'High':
            return 'red.400';
          default:
            return 'gray.400';
        }
      };
    
      const StatusColorizer = (val) => {
        switch (val) {
          case 'To Do':
            return 'gray.400';
          case 'In Progress':
            return 'orange.400';
          case 'Completed':
            return 'green.400';
          default:
            return 'red.400';
        }
      };


      useEffect(() => {
        const fetchTeamData = async () => {
          try {
            setLoading(true)
            const response = await axios.get(`${BASE_URL}/team/team/get/${route.params.id}`);
            setTeamData(response.data);
            setTeamMembers(response.data?.teamMembers);
            setTasks(response.data?.tasks);
            setLoading(false)


            // console.log(teamData)
          } catch (error) {
            console.error('Error fetching team data:', error);
            toast.show('Error fetching team data', {
              placement: 'top',
              status: 'error',
            });
            setLoading(false)
          }
        };
    
        fetchTeamData();
      }, []);
    



      const handleOptions = (value, setFunction) => {
        setFunction(value);
      };
    
      const handleSearch = async (value) => {
        setUserSearch(value)
        setSelectedUserToAdd(value)
        try {
          setLoading(true);
          const response = await axios.get(BASE_URL + `/user/search?q=${value}`);
          setSearchResults(response.data);
        } catch (error)
        {
            console.error('Error searching users:', error);
            toast.show('Error searching users', {
              placement: 'top',
              status: 'error',
            });
          } finally {
            setLoading(false);
          }
        };


        const handleAddUser = async () => {
            try {
             
                const response = await axios.post(
                  BASE_URL + `/team/team/adduser/${route.params.id}`,
                  { userId: selectedUserToAdd, designation: handleDesignation }
                );
                console.log(response.data);
            
        
              setTeamMembers([...teamMembers, response.data.newMember]); // Update team members list
              setSelectedUserToAdd(''); // Clear selected user
              setAddUserVisible(false); // Close modal
        
              toast.show('User added to team successfully!', {
                placement: 'top',
                status: 'success',
              });
            } catch (error) {
              console.error('Error adding user to team:', error);
             
            }
          };
          const handleRemoveUser = async (userId) => {
            try {
              const response = await axios.delete(BASE_URL + `/team/team/removeMember`, {
                data: {
                  teamId: teamData._id,
                  userId: userId,
                },
              });
        
              setTeamMembers(teamMembers.filter((member) => member._id !== userId)); // Update team members list
        
              toast.show('User removed from team successfully!', {
                placement: 'top',
                status: 'success',
              });
            } catch (error) {
              console.error('Error removing user from team:', error);
              toast.show('Error removing user from team', {
                placement: 'top',
                status: 'error',
              });
            }
          };
        
          const handleViewTask = (taskId) => {
            const foundTask = tasks.find((task) => task._id === taskId);
            setModalData(foundTask);
            setModalVisible(true);
          };
        
          const handleOpenTaskForm = () => {
            setTaskFormVisible(true);
          };


    return(
    <>
    {loading?(<Center h={'full'}>

    <Spinner color="indigo.500" size={'lg'}/>
    </Center>):(  <View>    
                <ScrollView  bgColor={'white'} h={'5/6'} nestedScrollEnabled={true}>
        {teamData && (
          <VStack space={4} >
            <Box  rounded="lg" bg="white">
              <Box py={4} px={4}>
                <Flex justifyContent="space-between">
                  <Heading fontSize="2xl" color="gray.700">
                    {teamData.teamName.toUpperCase()}
                  </Heading>
                  <Text >
                   {teamData.teamCreator?.name}
                    </Text>
                  <VStack>
                    <Text fontSize="xs" color="gray.500">
                      Created:{formatDate(teamData?.creationDate)}
                    </Text>
                   
                  </VStack>
                </Flex>
              </Box>
              <Box px={4} py={2} borderTopColor="gray.200" borderTopWidth={1}>
                <Text fontSize="sm" color="gray.500">
                  Team Members ({teamMembers.length})
                </Text>
            
  <TeamMembersList
      teamMembers={teamData.teamMembers} // Pass your team data
      handleRemoveUser={handleRemoveUser} // Optional: Provide your remove user function
    // Optional: Provide your user profile view function
    />


              </Box>
              <Box px={4} py={2} borderTopColor="gray.200" borderTopWidth={1}>
                <Text fontSize="sm" color="gray.500">
                  Tasks ({tasks.length})
                </Text>
                {tasks.map((item) => (
        <HStack
          key={item._id}
          space={1}
          borderBottomColor="gray.200"
          borderBottomWidth={1}
          py={2}
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box>
            <Text fontSize="lg" color="black" fontWeight={'semibold'}>
              {item.taskName}
            </Text>
            <HStack mt={1} space={2}>
              <Tag bg={StatusColorizer(item.status)} borderRadius={'3xl'}>
                <Text fontSize="xs" color="black" fontWeight={'semibold'}>
                  {item.status}
                </Text>
              </Tag>
            </HStack>
          </Box>
          <VStack style={{ display: "flex", alignItems: "center" }}>
            <Icon as={MaterialCommunityIcons} name="eye-outline" size={5} onPress={() => handleViewTask(item._id)} />
            <Text fontSize={10}>{item.priority}</Text>
          </VStack>
        </HStack>
      ))}
            </Box>
           
          </Box>
          {/* Add User Modal */}
          <Modal isOpen={addUserVisible} onClose={() => setAddUserVisible(false)}>
            <Modal.Content width={'5/6'} height={'2/5'}>
              <Modal.Header >
             <Text fontWeight={'semibold'}>Add User to Team</Text>
              </Modal.Header>
              <Modal.Body>
              {
                userSearch && (  <Select
                    selectedValue={selectedUserToAdd}
                    placeholder="Choose Team Member"
                    minWidth={200}
                    accessibilityLabel="Select User"
                    onValueChange={(val) => setSelectedUserToAdd(val)}
                  >
                    {searchResults.map((user) => (
                      <Select.Item key={user._id} label={user.name} value={user._id} />
                    ))}
                  </Select>)
              }
                {loading && <Text>Searching...</Text>}
                <Input
                  placeholder="Search Users..."
                  onChangeText={handleSearch}
                  value={selectedUserToAdd}
                  marginTop={'1.5'}
                />
                <Select placeholder='add a designation' onValueChange={(value)=>{setHandleDesignation(value)}}>
                <Select.Item label="Manager" value="MANAGER" />
      <Select.Item label="Team Lead" value="TEAMLEAD" />
      <Select.Item label="Developer" value="DEVELOPER" />
      <Select.Item label="Tester" value="TESTER" />
      <Select.Item label="Intern" value="INTERN" />
                </Select>
              </Modal.Body>
              <Modal.Footer style={{display:"flex",alignItems:'center',flexDirection:"row",columnGap:10}}>
                <Button variant="outline" onPress={() => setAddUserVisible(false)}>
                  Cancel
                </Button>
                <Button onPress={handleAddUser}>Add User</Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          {/* Task View Modal */}
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <Modal.Content>
             
              <ScrollView>
                <VStack space={2} py={4} px={4}>
                  <Text fontSize="md" color="black">
                    {modalData?.taskName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Assigned To: {modalData?.assignedTo?.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Due Date: {formatDate(modalData?.dueDate)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Description: {modalData?.description}
                  </Text>
                  <HStack mt={2} space={2}>
                    <Tag bg={PriorityColorizer(modalData?.priority)}>
                      {modalData?.priority}
                    </Tag>
                    <Tag bg={StatusColorizer(modalData?.status)}>
                      {modalData?.status}
                    </Tag>
                  </HStack>
                </VStack>
              </ScrollView>
            </Modal.Content>
          </Modal>

          {/* Implement Update Team and Delete Team Modals here (Optional) */}
          {/* {taskFormVisible && <TaskForm onClose={() => setTaskFormVisible(false)} />} */}
        </VStack>
      )}
    </ScrollView>
    <Box py={1} px={4}  borderTopColor="gray.200" borderTopWidth={1}>
              <Button onPress={() => setAddUserVisible(true)}>Add Member</Button>
              <Button onPress={() =>{navigation.navigate("TaskFormScreen")}} marginY={2}>Add Task</Button>
              {/* <Button variant="outline" onPress={() => setUpdateTeamVisible(true)}>
                Update Team
              </Button>
              <Button variant="destructive" onPress={() => setDeleteTeamVisible(true)}>
                Delete Team
              </Button> */}
            </Box>
    </View>)}
    
    </>



    )}



export default TeamManagementComponent;