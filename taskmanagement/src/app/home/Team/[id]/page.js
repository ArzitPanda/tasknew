'use client'
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, List, Select, Avatar, Tag } from 'antd';
import { TeamOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { AppContext } from '@/app/layout';
import axios from 'axios';
import { BASE_URL } from '@/app/Constant';
import moment from 'moment/moment';
import TaskFormSingular from '@/app/Components/SingularTaskForm';
import TaskForm from '@/app/Components/TaskForm';


const TeamManagementComponent = ({ params }) => {


  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return date.toLocaleString("en-US", options);
  }
  console.log(params.id);
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [updateTeamVisible, setUpdateTeamVisible] = useState(false);
  const [deleteTeamVisible, setDeleteTeamVisible] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUserToAdd,setSelectedUserToAdd] = useState("");
  const [teamCreator, setCreator] = useState();
  const [teamData,setTeamData] =useState()
const context =useContext(AppContext);

const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);
const [TaskFormVisible,setTaskFormVisible] = useState(false);

useEffect(() => {

  const fetchTeamData = async () => {


    console.log("hello world ")
    try {
      const response = await axios.get(`http://localhost:3001/team/team/get/${params.id}`);
     setTeamData(response.data)
        setTeamMembers(response.data?.teamMembers)
        setCreator(response.data?.teamCreator)
        setTasks(response.data?.tasks)


      // Handle the response data as needed
    } catch (error) {
      console.error('Error fetching team data:', error);
      // Handle errors
    }
  };
  
  // Call the function to fetch team data
  fetchTeamData();




},[]);

  const handleAddUserOk = async () => {
    // Handle form submission here

    try
    {
      const response = await axios.post(BASE_URL+`/team/team/adduser/${params.id}`,{userId:selectedUserToAdd})
      console.log(response.data)
    }catch(error)
    {
      console.log(error)

    }

    setAddUserVisible(false);
    message.success('User added to team successfully');
  };



  const handleUpdateTeamOk = () => {
    // Handle form submission here
    setUpdateTeamVisible(false);
    message.success('Team updated successfully');
  };

  const handleDeleteTeamOk = ({params}) => {
    // Handle form submission here
    setDeleteTeamVisible(false);
    message.success('Team deleted successfully');
  };

  const handleCancel = () => {
    setAddUserVisible(false);
  };


  const handleUserSelectChange = (value) => {
    setSelectedUserToAdd(value);
  };

  const handleSearch = async (value) => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL+`/user/search?q=${value}`);
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      // Handle error here
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData,setModalData] = useState();

  const handleItemClick = (item,e) => {
    // Logic to handle item click, for example, open modal
 

    setModalData({...modalData,task:item,Team:teamData})
      console.log(item,"item");
    setModalVisible(true);

  };

  const handleModalOk = () => {
    // Logic to handle modal submit
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    // Logic to handle modal cancel
    setModalVisible(false);
  };

  return (
    <div className="p-0">
      {/* Add User Modal */}
      <Modal
      title="Add User to Team"
      visible={addUserVisible}
      onOk={handleAddUserOk}
      onCancel={handleCancel}
    >
      <Form name="add-user-form" initialValues={{ remember: true }}>
        <Form.Item
          name="userId"
          rules={[{ required: true, message: 'Please enter user ID' }]}
        >
          <Select
            showSearch
            placeholder="Search for user"
            onSearch={handleSearch}
            loading={loading}
            filterOption={false}
            onChange={handleUserSelectChange}
          >
            {searchResults.map(user => (
              <Option key={user._id} value={user._id}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size="small">
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>

      {/* Update Team Modal */}
      <Modal
        title="Update Team Details"
        visible={updateTeamVisible}
        onOk={handleUpdateTeamOk}
        onCancel={() => handleCancel(setUpdateTeamVisible)}
      >
        <Form name="update-team-form" initialValues={{ remember: true }}>
          <Form.Item
            name="teamName"
            rules={[{ required: true, message: 'Please enter team name' }]}
          >
            <Input placeholder="Team Name" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Team Modal */}
      <Modal
        title="Confirm Delete Team"
        visible={deleteTeamVisible}
        onOk={handleDeleteTeamOk}
        onCancel={() => handleCancel(setDeleteTeamVisible)}
      >
        <p>Are you sure you want to delete this team?</p>
      </Modal>

      {/* Buttons for Actions */}
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-lg lg:text-2xl text-blue-500 font-bold">Team Management</h2>
  {teamCreator?._id === context.user?._id && (
    <Button type="dashed" icon={<TeamOutlined />} onClick={() => setAddUserVisible(true)}>
      Add User to Team
    </Button>
  )}
</div>

<div className="flex flex-row justify-between items-center mb-4 w-full lg:w-52 gap-4">
  {teamCreator?._id === context.user?._id && (
    <>
     <div className='hidden lg:block'>
    <Button color='blue' icon={<EditOutlined />} onClick={() => setUpdateTeamVisible(true)} className="hidden lg:inline-block">
        Update Team Details
      </Button>
      <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => setDeleteTeamVisible(true)} className="hidden lg:inline-block">
        Delete Team
      </Button>
    </div>
      {/* Display only icons on mobile screens */}
      <div className="lg:hidden">
        <Button icon={<EditOutlined />} onClick={() => setUpdateTeamVisible(true)} type="link" className="text-blue-500">
          Update
        </Button>
        <Button icon={<DeleteOutlined />} onClick={() => setDeleteTeamVisible(true)} type="link" className="text-red-500">
          Delete
        </Button>
      </div>
    </>
  )}
</div>


      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
  <h3 className="text-lg font-semibold mb-4 text-blue-500">Team Details</h3>
  <p className="text-gray-800 mb-2">
    <span className="font-bold text-black">Name:</span> {teamData?.teamName}
  </p>
  <p className="text-gray-800 mb-2">
    <span className="font-bold text-black">Description:</span> {teamData?.description}
  </p>
  <p className="text-gray-800 mb-2">
    <span className="font-bold text-black">Date Created:</span> {formatDate(teamData?.creationDate)}
  </p>
</div>

<div className="mb-8">
  <h3 className="text-lg font-semibold mb-4  text-blue-500">Team Members</h3>
  <List
    bordered
    dataSource={teamMembers}
    renderItem={(item) => (
      <List.Item
        actions={[
          <Button type="primary" key="add-task" size="small" onClick={(e) => handleItemClick(item,e)}>
            Add Task
          </Button>,
        ]}
        className="cursor-pointer"
        onClick={(e) => handleItemClick(item,e)}
        key={item._id}
      >
        <div className="flex items-center">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size="small" />
          <div className="ml-4">
            <span className="font-semibold">{item.name}</span>
            <p className="text-gray-500">{item.email}</p>
          </div>
        </div>
      </List.Item>
    )}
  />
</div>

<div className="mt-8">
  {/* List title with clear hierarchy */}
 <div className='w-full flex items-center justify-between px-4'>
 <h3 className="text-lg font-semibold mb-4 text-blue-500">Tasks</h3>
<button className='text-white bg-blue-500 hover:text-black hover:bg-white px-4 py-2 rounded-md' onClick={()=>{setTaskFormVisible(!TaskFormVisible)}}>AddTask</button>
 </div>

  {/* Tasks list using List.Item for clarity and visual grouping */}
  <List
    bordered
    dataSource={tasks}
    renderItem={(item) => (
      <List.Item
        key={item._id}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Task details */}
        <div className="flex flex-col lg:flex-row justify-between items-center w-3/4">
          <h4 className="text-lg font-semibold">{item.taskName}</h4>
          <p className="text-gray-600">{item.description}</p>

          {/* Formatted date and time using moment or similar library */}
          <p className="text-gray-600">Due Date: {moment(item.dueDate).format('MMMM Do, YYYY')}</p>

          {/* Tags for priority */}
          <div className="flex mt-2">
            <Tag color="blue">{item.priority}</Tag>
            {/* Add more tags for other priorities */}
          </div>
        </div>

        {/* Edit button */}
        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleItemClick(item)} />
      </List.Item>
    )}
  />
</div>


<Modal open={modalVisible} onCancel={()=>{setModalVisible(false)}}>

      <TaskFormSingular Team={modalData?.Team}  task={modalData?.task}/>


</Modal>
<Modal
              open={TaskFormVisible}
              onCancel={() => {
                setTaskFormVisible(false);
              }}
            >
              <TaskForm />
            </Modal>
 
    </div>
  );
};

export default TeamManagementComponent;
