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
  Table,
 
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
import useColor from "@/Hooks/useColor";

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

const colors = useColor();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/team/team/get/${params.id}`
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


  const [form] = Form.useForm();
  const handleUpdateTeamOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await axios.put(BASE_URL+`/team/team/update/${params.id}`, values);
      console.log(response.data); // Handle response data as needed
      setLoading(false);
      context.openNotification("sucessfully updated")
      setUpdateTeamVisible(false);
    } catch (error) {
      console.error('Error updating team details:', error);
      // Handle error state or display error message to user
      setLoading(false);
    }
  }

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
  const [selectedTaskUser,setSelectedTaskUser]=useState(null)

  const handleItemClick = (item, type) => {
    // Logic to handle item click, for example, open modal
    if (type === "TASK") {
      setModalData({ ...modalData, task: item, Team: teamData });
      console.log(item, "item");
      setModalVisible(true);
    }
    if (type === "TEAM") {
        setSelectedTaskUser(item)
      console.log(item,"user here")
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



  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
      width: '30%',
      render: (text) => <span className="text-lg font-semibold">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (text) => <p className="text-gray-600">{text}</p>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => <span className="text-gray-600">{moment(date).format("MMMM Do, YYYY")}</span>,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      render: (assignedToName) => <Tag color="gold-inverse">{assignedToName}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => <Tag color={PriorityColorizer(priority)}>{priority}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={StatusColorizer(status)}>{status}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="default"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => handleItemClick(record, "TASK")}
        />
      ),
    },
  ];
  
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
        onCancel={() => {setUpdateTeamVisible(false)}}
      >
        <Form form={form} name="update-team-form" initialValues={{ remember: true,isActive:true }}>
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
        onCancel={() =>{setDeleteTeamVisible(false)}}
      >
        <p>Are you sure you want to delete this team?</p>
      </Modal>

      {/* Buttons for Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg lg:text-2xl  font-bold font-sans ${colors.darkMode?'text-white':'text-blue-500'}`}>
          Team Management
        </h2>
        {teamCreator?._id === context.user?._id && (
          <Button
            type="dashed"
            style={{backgroundColor:colors.darkMode?'#151515':"",color:colors.darkMode?'white':"#151515"}}
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
                style={{backgroundColor:colors.darkMode?'#151515':"",color:colors.darkMode?'white':"#151515"}}
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

      <div className= {`p-6 rounded-lg shadow-md mb-8 ${colors.darkMode?"bg-[#141414]":"bg-white"}`} >
        <h3 className={"text-lg font-semibold mb-4 "+colors.primaryText}>
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
        <h3 className={"text-lg font-semibold mb-4 "+colors.primaryText}>
          Team Members
        </h3>
        <List
          bordered
        style={{backgroundColor:'white'}}
          dataSource={teamMembers}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                 
                  key="add-task"
                  size="small"
                  onClick={(e) => handleItemClick(item, "TEAM")}
                  style={{backgroundColor:colors.darkMode?'#151515':"",color:colors.darkMode?'white':"#151515"}}
                >
                  Add Task
                </Button>,
              ]}
              style={{backgroundColor:colors.darkMode?'#141414':"",color:colors.darkMode?'GrayText':"black",borderColor:colors.darkMode?'InactiveBorder':"ButtonShadow"}}
              className="cursor-pointer"
              onClick={(e) => handleItemClick(item, e)}
              key={item._id}
            >
              <div className="flex items-center  sm:justify-start  gap-x-1">
                <Avatar
                  style={{ backgroundColor: colors.darkMode?'cadetblue': "#87d068" }}
                  icon={<UserOutlined />}
                  size="small"
                />
                <div className="ml-0 lg:ml-4">
                  <div className="flex items-center  gap-x-0 lg:gap-x-2">
                    <span className="font-semibold">{item.name}</span>
                    <Tag color={DesignationColorizer(item.designation)} >{item.designation}</Tag>
                  
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
          <h3 className={"text-lg font-semibold mb-4 "+colors.primaryText}>Tasks</h3>
          <Button

            className={" px-4 py-2 rounded-md"}
            onClick={() => {
              setTaskFormVisible(!TaskFormVisible);
            }}
          >
            AddTask
          </Button>
        </div>

        {/* Tasks list using List.Item for clarity and visual grouping */}
       
        <div className={"overflow-x-auto  lg:p-0 "+colors.PrimarybgColor}>
      <Table
        columns={columns}
        dataSource={tasks.reverse()}
        bordered
        size="middle"
        pagination={true} // Disable pagination
      />
    </div>



      </div>

      <Modal
        open={modalVisible}
        okType="text"
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <TaskFormSingular Team={modalData?.Team} task={modalData?.task} setModalVisibe={setModalVisible} />
      </Modal>
      <Modal
        open={TaskFormVisible}
        onCancel={() => {
          setTaskFormVisible(false);
        }}
        okType="text"
      >
        <TaskForm data={selectedTaskUser} Team={params.id} setTaskFormVisible={setTaskFormVisible}/>
      </Modal>
    </div>
    </Suspense>
 
  );
};

export default TeamManagementComponent;
