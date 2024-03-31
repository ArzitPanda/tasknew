import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Center,
  Progress,
  Heading,
  Input,
  TextArea,
  Select,
  VStack,
  HStack,
  Button,
  Avatar,
  Icon,
  Text,
  FlatList,
  Modal,
  FormControl,
 
  FormHelperText,
  IconButton,
  Spinner,
  ScrollView,
} from 'native-base';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; // Assuming Expo for icons
import { AppContext } from '../Hooks/AppContext'; // Assuming AppContext for user data
import axios from 'axios';
import { BASE_URL } from '../Constant'; // Assuming BASE_URL for API calls
import DateTimePicker from '@react-native-community/datetimepicker';


const TaskFormScreen = () => {
  const context = useContext(AppContext);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [team, setTeam] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSerachLoading] = useState(false);
  const [selectedUser,setSelectedUser] =useState(null);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const fetchTeamMembers = async () => {
    if (team !== '') {
      try {
        const response = await axios.get(BASE_URL+"/team/team/get/"+team);
        setTeamMembers(response.data.teamMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    } else {
      setTeamMembers([]); // Clear team members if team is empty
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [team]);

  const handleUserSelectChange = (value) => {
    setSelectedUser(value)
    setSelectedUserToAdd(value._id);
  };

  const handleSearch = async (value) => {
    try {
        setSerachLoading(true);
      const response = await axios.get(BASE_URL+`/user/search?q=${value}`);
      setSearchResults(response.data);
      setSerachLoading(false);
    } catch (error) {
      console.error('Error searching users:', error);
      setSerachLoading(false);
    }
  };

  const handleTaskSubmission = async () => {
    try {
        const requestBody ={
            taskName,
            description,
            dueDate,
            team,
            assignedBy: context?.user._id,
            status,
          }
          console.log(requestBody)
      const response = await axios.post(BASE_URL+`/task/api/Task/add-to-member/${selectedUserToAdd}`,requestBody );
      console.log('Task submitted successfully:', response.data);
      // Handle successful submission (e.g., reset form, show confirmation)
    } catch (error) {
      console.error('Error submitting task:', error.message);
      // Handle errors (e.g., display error message)
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setDueDate(currentDate);
};

  const renderTeamMember = (item) => (
    <Box key={item._id} bg="blue.100" p={2} rounded="md" mr={2} onPress={() => setSelectedUserToAdd(item._id)}>
      <HStack>
        <Avatar size="48px" bg="blue.500" source={{ uri: `https://api.dicebear.com/7.x/lorelei/png?seed=${item.name}` }} />
        <VStack ml={2}>
          <Text fontSize="md" fontWeight="bold">{item.name}</Text>
          <Text color="gray.500">{item.email}</Text>
        </VStack>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1} bg="white">
    <ScrollView flex={1} padding={2}>
      {loading ? <Spinner size="lg" color="blue.500" /> : null}

     
      <VStack w="full" padding={3} space={3}>
    

      
        <FormControl>
          <FormControl.Label>Task Name</FormControl.Label>
          <Input
            value={taskName}
            onChangeText={(text) => setTaskName(text)}
            placeholder="Enter task name"
          />
       
        </FormControl>

        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <TextArea
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="Describe the task in detail"
          />
        </FormControl>

        <FormControl display={'flex'} alignItems={'flex-start'} justifyContent={'center'}>
          <FormControl.Label>Due Date</FormControl.Label>
       


<DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
        </FormControl>

        <FormControl>
          <FormControl.Label>Team</FormControl.Label>
          <Select
            minWidth={200} 
            selectedValue={team}
            onValueChange={(value) => setTeam(value)}
            placeholder="Select team"
          >
            {context.user?.Teams?.map((ele) => (
              <Select.Item key={ele._id} value={ele._id} label={ele.teamName} />
            ))}
          </Select>
        </FormControl>
{
    selectedUser?(
        <Box  bg="white" p={2} rounded="md" w={'full'} mb={1} shadow={2}>
    <HStack space={2} style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:'space-between'}}>
      <Avatar size="48px" bg="blue.500" source={{ uri: `https://api.dicebear.com/7.x/lorelei/png?seed=${selectedUser.name}` }} />
      <VStack>
        <Text fontSize="md" fontWeight="bold">{selectedUser.name}</Text>
        <Text color="gray.500">{selectedUser.email}</Text>
      </VStack>
      <IconButton
              onPress={() =>{setSelectedUser(null),setSelectedUserToAdd('')} }
            
            >
              <Icon as={AntDesign} name="closecircle" color={'red.400'} />
            </IconButton>
  </HStack>
  </Box>):(<FormControl>
          <FormControl.Label>Assigned To</FormControl.Label>
          <HStack space={2}>
            <Input
              isDisabled={!team} 
              width={'2/3'}
              placeholder="Search for user"
              onFocus={() => setIsSearchModalOpen(true)}
            />
            <IconButton
              onPress={() => setIsSearchModalOpen(true)}
              disabled={!team}
            >
              <Icon as={AntDesign} name="search1" />
            </IconButton>
          </HStack>
          <FormControl.HelperText>
            Select a team member to assign the task.
          </FormControl.HelperText>
        </FormControl>)
}

     
        <Modal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)}  height={550}>
          <Modal.Content height={450} w={500}>
            <Modal.Header title="Search Users" paddingTop={30} height={100}> 
              <Input
                placeholder="Search by name or email"
                onChangeText={handleSearch} // Call handleSearch function on text change
              />
            </Modal.Header>
            <Modal.Body >
  {searchLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : 
(  <FlatList
    data={teamMembers}
    renderItem={({ item }) => (
      <Box key={item._id} bg="white" p={2} rounded="md" mb={1}>
        <HStack space={2}>
          <Avatar size="48px" bg="blue.500" source={{ uri: `https://api.dicebear.com/7.x/lorelei/png?seed=${item.name}` }} />
          <VStack>
            <Text fontSize="md" fontWeight="bold">{item.name}</Text>
            <Text color="gray.500">{item.email}</Text>
          </VStack>
        </HStack>
        <Button
          size="xs"
          variant="outline"
          onPress={() => {
            handleUserSelectChange(item)
            setIsSearchModalOpen(false);
          }}
        >
          Assign
        </Button>
      </Box>
    )}
    keyExtractor={(item) => item._id}
    showsVerticalScrollIndicator={false}
  />)}
  
</Modal.Body>

<Modal.Footer>
  <Button variant="ghost" onPress={() => setIsSearchModalOpen(false)}>
    Close
  </Button>
</Modal.Footer>
            </Modal.Content>
          </Modal>

          <FormControl>
            <FormControl.Label>Status</FormControl.Label>
            <Select
              minWidth={200}
              selectedValue={status}
              onValueChange={(value) => setStatus(value)}
              placeholder="Select status"
            >
               
              <Select.Item label="Pending" value="To Do" />
              <Select.Item label="In Progress" value="In Progress" />
              <Select.Item label="Completed" value="Completed" />
            </Select>
          </FormControl>

          <Button onPress={handleTaskSubmission}>
            Submit Task
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default TaskFormScreen;
