"use client"
import { useState,useContext, useEffect } from 'react';
import { Avatar, Button, DatePicker, Input, Select ,Tag} from 'antd';
import { AppContext } from '../layout';
import { UserOutlined } from '@ant-design/icons';
import { BASE_URL } from '../Constant';
import axios from 'axios';
 // Import Tailwind CSS styles

const { Option } = Select;

const TaskForm = ({data,Team,setTaskFormVisible}) => {

  const context = useContext(AppContext)


  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [team, setTeam] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
const [TeamData,setTeamData] =useState(null)

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserToAdd,setSelectedUserToAdd] = useState("");





const [teamMembers,setTeamMembers] = useState([]);


useEffect(()=>{
const fetchTeamMembers =async ()=>{

  
    const data = await axios.get(BASE_URL+"/team/team/get/"+Team);
    const TeamFetched = data.data;
    console.log(data)
    setTeamMembers(TeamFetched.teamMembers)
    setTeamData(data.data);
    console.log("fetcheed")
  






}




fetchTeamMembers()


},[])












 

  const handleSearch = async (value) => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL+`/user/search?q=${value}`);
      console.log(response.data)
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      // Handle error here
    }
  };

  const handleTaskSubmission = async() => {
    // Implement task submission logic here

    try {
      // Make the Axios POST request
      console.log(selectedUserToAdd)
      const response = await axios.post(BASE_URL+`/task/api/Task/add-to-member/${data._id}`,  {
        taskName,
        description,
        dueDate,
        team:Team,
        assignedBy:context?.user._id,
        
        status
      });
      context.openNotification("sucessfully added Task ")



   
      // Return the response data if needed

   

       
   
    } catch (error) {
      // Handle errors
      console.error('Error adding task to member:', error);
      context.openNotification("Error adding task to member")
      throw error; // You can handle the error in the calling code
    }
    setTaskFormVisible(false)




  
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4  border-2 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Add New Task</h2>
      <Input
        className="mb-4"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <Input.TextArea
        className="mb-4"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DatePicker
        className="mb-4 w-full"
        placeholder="Due Date"
        value={dueDate}
        onChange={(date) => setDueDate(date)}
      />
    
    <Input  className="mb-4" value={TeamData?.teamName} contentEditable={false} /> 
      <div className='p-2 flex flex-col items-start gap-2'>
      <Tag color='blue'>assignedTo</Tag>
    
      <div className='flex items-center justify-between mx-4 p-2 bg-white'>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size="small">
                  {data?.name.charAt(0).toUpperCase()}
                </Avatar>
                {data?.name}
              </div>
      </div>
      
    
     <Select
        className="mb-4 w-full"
        placeholder="Select Status"
        value={status}
        onChange={(value) => setStatus(value)}
      >
        <Option value="To Do">To Do</Option>
        <Option value="In Progress">In Progress</Option>
        <Option value="Completed">Completed</Option>
      </Select>
    
     
      <Button type="default" onClick={handleTaskSubmission}>Submit Task</Button>
    </div>
  );
};

export default TaskForm;
