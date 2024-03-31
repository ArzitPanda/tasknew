"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  List,
  Select,
  Avatar,
  Tag,
  Badge,
 
} from "antd";
import {
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { AppContext } from "@/app/layout";
import axios from "axios";
import { BASE_URL } from "@/app/Constant";
import moment from "moment/moment";
import TaskFormSingular from "@/app/Components/SingularTaskForm";
import TaskForm from "@/app/Components/TaskForm";
import Loading from "./loading";

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
  const [selectedUserToAdd, setSelectedUserToAdd] = useState("");
  const [teamCreator, setCreator] = useState();
  const [teamData, setTeamData] = useState();
  const context = useContext(AppContext);

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [TaskFormVisible, setTaskFormVisible] = useState(false);



  const Colorizer =(val)=>{

        switch(val) {
          case 1:
            return 'blue'
          case 2:
            return 'orange'
          case 3:
            return 'green'
          case 4:
            return 'yellow'
          default: 
          return 'red'
          

  }


};


  
const DesignationColorizer =(val)=>{

  switch(val) {
    case 'MANAGER':
      return Colorizer(1)
    case 'DEVELOPER':
      return Colorizer(2)
    case 'CREATOR':
      return Colorizer(3)
    case 'INTERN':
      return Colorizer(8)
    default: 
    return Colorizer(4)
    

}


};

const PriorityColorizer =(val)=>{

  switch(val) {
    case 'Low':
      return Colorizer(1)
    case 'Medium':
      return Colorizer(2)
      default:
    return Colorizer(4)
    

}


};


const StatusColorizer =(val)=>{


  switch(val) {
    case 'To Do':
      return Colorizer(6)
    case 'In Progress':
      return Colorizer(2)
      default:
    return Colorizer(1)
    

}
};



  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/team/team/get/${params.id}`
        );

        setTeamData(response.data);
        setTeamMembers(response.data?.teamMembers);
        setCreator(response.data?.teamCreator);
        setTasks(response.data?.tasks);

        console.log(response.data, "fetching details");
        // Handle the response data as needed
      } catch (error) {
        console.error("Error fetching team data:", error);
        // Handle errors
      }
    };

    // Call the function to fetch team data
    fetchTeamData();
  }, []);

  const handleOptions = (value, functionval) => {
    functionval(value);
  };
  const [handleDesignation, setHandleDesignation] = useState("MANAGER");

  const handleAddUserOk = async () => {
    // Handle form submission here

    try {
      const response = await axios.post(
        BASE_URL + `/team/team/adduser/${params.id}`,
        { userId: selectedUserToAdd, designation: handleDesignation }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    setAddUserVisible(false);
    message.success("User added to team successfully");
  };

  const handleUpdateTeamOk = () => {
    // Handle form submission here
    setUpdateTeamVisible(false);
    message.success("Team updated successfully");
  };

  const handleDeleteTeamOk = ({ params }) => {
    // Handle form submission here
    setDeleteTeamVisible(false);
    message.success("Team deleted successfully");
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
      const response = await axios.get(BASE_URL + `/user/search?q=${value}`);
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      // Handle error here
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState();

  const handleItemClick = (item, type) => {
    // Logic to handle item click, for example, open modal
    if (type === "TASK") {
      setModalData({ ...modalData, task: item, Team: teamData });
      console.log(item, "item");
      setModalVisible(true);
    }
    if (type === "TEAM") {
      setTaskFormVisible(true);
    }
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
    <Suspense fallback={<Loading/>}>
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
            rules={[{ required: true, message: "Please enter user ID" }]}
          >
            <Select
              showSearch
              placeholder="Search for user"
              onSearch={handleSearch}
              loading={loading}
              filterOption={false}
              onChange={handleUserSelectChange}
            >
              {searchResults.map((user) => (
                <Select.Option key={user._id} value={user._id}>
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                    size="small"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              onChange={(value) => {
                handleOptions(value, setHandleDesignation);
              }}
            >
              <Option key="manager" value={"MANAGER"}>
                Manager
              </Option>
              <Option key="TeamLead" value={"TEAMLEAD"}>
                Team Lead
              </Option>
              <Option key="DEVELOPER" value={"DEVELOPER"}>
                Developer
              </Option>
              <Option key="TESTER" value={"TESTER"}>
                Tester
              </Option>
              <Option key="INTERN" value={"INTERN"}>
                Intern
              </Option>
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
            rules={[{ required: true, message: "Please enter team name" }]}
          >
            <Input placeholder="Team Name" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
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
        <h2 className="text-lg lg:text-2xl text-blue-500 font-bold font-sans">
          Team Management
        </h2>
        {teamCreator?._id === context.user?._id && (
          <Button
            type="dashed"
            icon={<TeamOutlined />}
            onClick={() => setAddUserVisible(true)}
          >
            Add User to Team
          </Button>
        )}
      </div>

      <div className="flex flex-row justify-between items-center mb-4 w-full lg:w-52 gap-4">
        {teamCreator?._id === context.user?._id && (
          <>
            <div className="hidden lg:flex items-center justify-center gap-x-4">
              <Button
                color="blue"
                icon={<EditOutlined />}
                onClick={() => setUpdateTeamVisible(true)}
                className="hidden lg:inline-block"
              >
                Update Team Details
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => setDeleteTeamVisible(true)}
                className="hidden lg:inline-block"
              >
                Delete Team
              </Button>
            </div>
            {/* Display only icons on mobile screens */}
            <div className="lg:hidden">
              <Button
                icon={<EditOutlined />}
                onClick={() => setUpdateTeamVisible(true)}
                type="link"
                className="text-blue-500"
              >
                Update
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => setDeleteTeamVisible(true)}
                type="link"
                className="text-red-500"
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-500">
          Team Details
        </h3>
        <p className="text-gray-800 mb-2">
          <span className="font-bold text-black">Name:</span>{" "}
          {teamData?.teamName}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-bold text-black">Description:</span>{" "}
          {teamData?.description}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-bold text-black">Date Created:</span>{" "}
          {formatDate(teamData?.creationDate)}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4  text-blue-500">
          Team Members
        </h3>
        <List
          bordered
          dataSource={teamMembers}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="default"
                  key="add-task"
                  size="small"
                  onClick={(e) => handleItemClick(item, "TEAM")}
                >
                  Add Task
                </Button>,
              ]}
              className="cursor-pointer"
              onClick={(e) => handleItemClick(item, e)}
              key={item._id}
            >
              <div className="flex items-center">
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                  size="small"
                />
                <div className="ml-4">
                  <div className="flex items-center gap-x-2">
                    <span className="font-semibold">{item.name}</span>
                    <Tag color={DesignationColorizer(item.designation)}>{item.designation}</Tag>
                  
                  </div>
                  <p className="text-gray-500">{item.email}</p>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div className="mt-8">
        {/* List title with clear hierarchy */}
        <div className="w-full flex items-center justify-between px-4">
          <h3 className="text-lg font-semibold mb-4 text-blue-500">Tasks</h3>
          <button
            className="text-white bg-blue-500 hover:text-black hover:bg-white px-4 py-2 rounded-md"
            onClick={() => {
              setTaskFormVisible(!TaskFormVisible);
            }}
          >
            AddTask
          </button>
        </div>

        {/* Tasks list using List.Item for clarity and visual grouping */}
        <List
          bordered
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Task details */}
              <div className="flex flex-col lg:flex-row justify-between items-center w-3/4">
               <div className="w-9/12 grid grid-cols-12">
               <h4 className="text-lg font-semibold  col-span-3">{item.taskName}</h4>
                <p className="text-gray-600  col-span-6">{item.description}</p>

                {/* Formatted date and time using moment or similar library */}
                <p className="text-gray-600 text-left col-span-3">
                  Due Date: {moment(item.dueDate).format("MMMM Do, YYYY")}
                </p>
               </div>

                {/* Tags for priority */}
                <div className="flex mt-2">
                  <Tag color="gold-inverse">{item.assignedToName}</Tag>
                  <Tag color={PriorityColorizer(item.priority)}>{item.priority}</Tag>
                  <div>
                      <Tag color={StatusColorizer(item.status)}>{item.status}</Tag>
                    </div>
                  {/* Add more tags for other priorities */}
                </div>
              </div>

              {/* Edit button */}
              <Button
                type="default"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => handleItemClick(item, "TASK")}
              />
            </List.Item>
          )}
        />
      </div>

      <Modal
        open={modalVisible}
        okType="text"
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <TaskFormSingular Team={modalData?.Team} task={modalData?.task} />
      </Modal>
      <Modal
        open={TaskFormVisible}
        onCancel={() => {
          setTaskFormVisible(false);
        }}
        okType="text"
      >
        <TaskForm />
      </Modal>
    </div>
    </Suspense>
 
  );
};

export default TeamManagementComponent;
