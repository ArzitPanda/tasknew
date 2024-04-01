import React, { useState, useEffect, useContext } from 'react';
import { Layout, Button, Select, Drawer, Text, VStack, Box, View, Pressable, HStack, Divider, ScrollView } from 'native-base';
import axios from 'axios';
import { AppContext } from '../Hooks/AppContext';
import { BASE_URL } from '../Constant';




function TaskScreen() {
  const context = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    assignedTo: context.user?._id,
    status: '',
    dueDateLTE: '',
    priority: ''
  });



  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US');
  };

  const [visible, setVisible] = useState(false);
  const [cellDetails, setCellDetails] = useState({});

  const showDrawer = (record) => {
    setVisible(true);
    setCellDetails(record);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(BASE_URL + '/task/api/Task', {
        params: { ...filter, assignedTo: context.user?._id },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
  };

  const handleChangeStatus = (value) => {
    const updatedTask = { ...cellDetails, status: value };
    setCellDetails(updatedTask);
  };



  const getTaskPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'red.500';
      case 'medium':
        return 'orange.500';
      case 'low':
        return 'green.500';
      default:
        return 'gray.400'; // Default color for unknown priority
    }
  };

  const getTaskStatusColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'to do':
        return 'red.500';
      case 'in progress':
        return 'orange.500';
      case 'completed':
        return 'green.500';
      default:
        return 'gray.400';
    }
  };



  return (
    <ScrollView>
      <VStack>
        {tasks.map((task) => (
          <Box
            key={task._id}
            backgroundColor={'white'}
            margin={2}
            borderRadius={10}
         shadow={'2'}
            p="4"
            
          >
              <Pressable onPress={() => showDrawer(task)}>
        <VStack>
        <Text fontSize="md" fontWeight="bold">{task.taskName}</Text>
        <Text>{task.description}</Text>

        <Divider my={2} />
        
        <HStack space={2} justifyContent="space-between">
        <Text>Due: {formatDate(task.dueDate)}</Text> 
        <HStack space={1} bg={getTaskPriorityColor(task.priority)} borderRadius="md" px={2} py={1}>
        <Text color="white" fontSize="xs" fontWeight="bold">{task.priority}</Text>
        <Text>{task.status}</Text>
        </HStack>
        </HStack>
       
        </VStack>
      </Pressable>
          </Box>
        ))}
      </VStack>
      <Drawer
      isOpen={visible}
      onClose={onClose}
      placement="bottom"
      _drawerContent={{
        backgroundColor: 'white',
        padding: 20,
      }}
    >
      <VStack space={4} backgroundColor={'warmGray.100'} paddingX={2} borderTopRadius={20} paddingY={6}>
        <Text fontSize="lg" fontWeight="bold" padding={2}>Task Details</Text>
        <View style={{paddingLeft:10}}>
        <Text  fontSize="2xl" fontWeight="bold">{cellDetails.taskName}</Text>
        <View>
        <Text fontSize="md" fontWeight="light">Description</Text>
        <Text fontWeight="thin" fontStyle={'oblique' } color={'blue.700'} >{cellDetails.description}</Text>
        </View>
       </View>
       
       <Divider my={2} />
        
        <VStack space={2} justifyContent="space-between">
        <Text>Due: {formatDate(cellDetails.dueDate)}</Text> 
      <HStack space={2}>
      <HStack space={1}  bg={getTaskPriorityColor(cellDetails.priority)}  width={'1/3'} borderRadius="md" px={2} py={1}>
        <Text color="white" fontSize="xs" fontWeight="bold">{cellDetails.priority}</Text>
        </HStack>
        <HStack space={1}  bg={getTaskStatusColor(cellDetails.status)}  width={'1/3'} borderRadius="md" px={2} py={1}>
        <Text color="white" fontSize="xs" fontWeight="bold">{cellDetails.status}</Text>
        </HStack>
      </HStack>
        </VStack>
        <Select
          selectedValue={cellDetails.status}
          onValueChange={handleChangeStatus}
          mt={4}
          _selectedItem={{
            bg: 'blue.100', // Optional styling for selected item background
          }}
        >
          <Select.Item label="Completed" value="Completed" />
          <Select.Item label="In Progress" value="In Progress" />
        </Select>
    
          <Button colorScheme="blue">Update</Button>
          <Button onPress={onClose} colorScheme="red">Cancel</Button>
   
      </VStack>
    </Drawer>
    </ScrollView>
  );
}

export default TaskScreen;
