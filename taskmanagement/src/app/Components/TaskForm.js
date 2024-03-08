"use client"
import { useState,useContext, useEffect } from 'react';
import { Avatar, Button, DatePicker, Input, Select ,Tag} from 'antd';
import { AppContext } from '../layout';
import { UserOutlined } from '@ant-design/icons';
import { BASE_URL } from '../Constant';
import axios from 'axios';
 // Import Tailwind CSS styles

const { Option } = Select;

const TaskForm = () => {

  const context = useContext(AppContext)


  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [team, setTeam] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');


  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserToAdd,setSelectedUserToAdd] = useState("");





const [teamMembers,setTeamMembers] = useState([]);


useEffect(()=>{
const fetchTeamMembers =async ()=>{

  if(team!=='')
  {
    const data = await axios.get(BASE_URL+"/team/team/get/"+team);
    const TeamFetched = data.data;
    setTeamMembers(TeamFetched.teamMembers)
  }






}




fetchTeamMembers()


},[team,setTeam])












  const handleUserSelectChange = (value) => {
    setSelectedUserToAdd(value);
  };

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
      const response = await axios.post(BASE_URL+`/task/api/Task/add-to-member/${selectedUserToAdd}`,  {
        taskName,
        description,
        dueDate,
        team,
        assignedBy:context?.user._id,
        
        status
      });
      



   
      // Return the response data if needed

   

       
   
    } catch (error) {
      // Handle errors
      console.error('Error adding task to member:', error);
      throw error; // You can handle the error in the calling code
    }



  
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
      <Select
        className="mb-4 w-full"
        placeholder="Select Team"
        value={team}
        onChange={(value) => setTeam(value)}
      >
       {
    context.user?.Teams.map((ele)=>{return(<Option key={ele._id} value={ele._id} >

      {ele.teamName}
    
    
    </Option>)})
       }
        {/* Add more options as needed */}
      </Select>
      <div className='p-2 flex flex-col items-start gap-2'>
      <Tag color='blue'>assignedTo</Tag>
      <Select
            showSearch
            placeholder="Search for user"
            onSearch={handleSearch}
            loading={loading}
            filterOption={false}
            className='mb-4 w-full'
            onChange={handleUserSelectChange}
          >
            {teamMembers.map(user => (
              <Option key={user._id} value={user._id}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size="small">
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                {user.name}
              </Option>
            ))}
          </Select>
      
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
