'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Table, Input, Select, DatePicker, Button, Drawer } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '@/app/Constant';
import { AppContext } from '@/app/layout';
import { CheckCircleOutlined, CloseCircleOutlined,FilterOutlined } from '@ant-design/icons';
import useColor from '@/Hooks/useColor';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'Task Name',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

function TaskPage() {
  const context = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    assignedTo: context.user?._id ,
    status: '',
    dueDateLTE: '',
    priority: ''
  });

  const colors = useColor();
const darkMode = colors.darkMode;

  useEffect(() => {
    // Check if localStorage is available before accessing it
  
      const userId =  localStorage.getItem('userId');
      console.log(userId,"i am in task screen")
      setFilter(prevFilter => ({
        ...prevFilter,
        assignedTo: userId
      }));
    
  }, [ ]);

  const [visible, setVisible] = useState(false);
  const [cellDetails, setCellDetails] = useState({});

  const showDrawer = (record) => {
    console.log(record)
    setVisible(true);
    setCellDetails(record);
  };

  const onClose = () => {
    setVisible(false);
  };
  useEffect(() => {
    fetchTasks();
  }, [filter]);



  const [drawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const fetchTasks = async () => {
    try {
      const response = await axios.get(BASE_URL+'/task/api/Task', {
        params: { ...filter ,assignedTo: localStorage.getItem("userId")},
      });
      setTasks(response.data);
      closeDrawer();
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    closeDrawer()
  };

  const handleFilterChange = (key, value) => {
    setFilter(prevFilter => ({ ...prevFilter, [key]: value }));
  };
  const [selectedStatus, setSelectedStatus] = useState(cellDetails.status);





  const handleChangeStatus = (value) => {

    console.log(value)
    const updatedTask = { ...cellDetails, status: value };
    setCellDetails(updatedTask);

    setSelectedStatus(value);

  };

  const updateTaskStatus = async () => {
    try {
      const response = await axios.post(BASE_URL+`/task/api/Task/status/${cellDetails._id}`, {
        status: selectedStatus
      });
      console.log(response.data); 
     context.openNotification("Sucessfully Updated")
     setVisible(false)
      // Handle response data as needed
      // If successful, you might want to close a modal or update UI accordingly
    } catch (error) {
      context.openNotification(error?.response.data?.error || "error","error")
      console.error('Error updating task status:', error);
      setVisible(false)
      // Handle error state or display error message to user
    }
  };



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout flex flex-col-reverse lg:flex-row">
     
     
      <Drawer
        title="Filters"
        placement="right"
        width={300}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
            <Menu mode="inline" defaultSelectedKeys={['1']} style={{ background: darkMode ? '#141414' : '#fff' }}>
        <Menu.Item key="1" style={{ color: colors.primaryText }}>Filters</Menu.Item>
      </Menu>
      <div style={{ padding: '1rem', color: colors.secondaryText }}>
        <Select
          style={{ width: '100%', marginBottom: '1rem' }}
          placeholder="Status"
          value={filter.status}
          onChange={(value) => handleFilterChange('status', value)}
          dropdownStyle={{ background: darkMode ? '#141414' : '#fff' }}
        >
          <Option value="">All</Option>
          <Option value="To Do">To Do</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
        <DatePicker
          style={{ width: '100%', marginBottom: '1rem' }}
          onChange={(date, dateString) => handleFilterChange('dueDateLTE', dateString)}
          dropdownStyle={{ background: darkMode ? '#1A202C' : '#fff' }}
        />
        <Select
          style={{ width: '100%', marginBottom: '1rem' }}
          placeholder="Priority"
          value={filter.priority}
          onChange={(value) => handleFilterChange('priority', value)}
          dropdownStyle={{ background: darkMode ? '#1A202C' : '#fff' }}
        >
          <Option value="">All</Option>
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
        <Button
          type="primary"
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={fetchTasks}
          className={darkMode ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
        >
          Apply Filters
        </Button>
      </div>
        </Drawer>


        <Content className='mx-0 lg:mx-10'>
       <div className='w-full flex lg:hidden items-center justify-end p-2'>
       <Button onClick={openDrawer} icon={<FilterOutlined color={colors.darkMode?'white':'black'} />} />
       </div>
          <div className={"site-layout-background  overflow-x-auto "+colors.PrimarybgColor}  style={{minHeight: 360 }}>
            <Table columns={columns} dataSource={tasks} rowKey="_id"   onRow={(record) => ({
        onClick: () => showDrawer(record),
      })}/>
          </div>
          
        </Content>
        <div className='hidden lg:block  h-full '>
      <Sider width={300} className='h-full min-h-[700px]' style={{ background: darkMode ? '#141414' : '#fff' }}>
      <Menu mode="inline" defaultSelectedKeys={['1']} style={{ background: darkMode ? '#141414' : '#fff' }}>
        <Menu.Item key="1" style={{ color: colors.primaryText,backgroundColor: darkMode ? '#1D1D1D' : '#fff'}}>Filters</Menu.Item>
      </Menu>
      <div style={{ padding: '1rem', color: colors.secondaryText }}>
        <Select
          style={{ width: '100%', marginBottom: '1rem' }}
          placeholder="Status"
          value={filter.status}
          onChange={(value) => handleFilterChange('status', value)}
          dropdownStyle={{ background: darkMode ? '#141414' : '#fff' }}
        >
          <Option value="">All</Option>
          <Option value="To Do">To Do</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
        <DatePicker
          style={{ width: '100%', marginBottom: '1rem' }}
          onChange={(date, dateString) => handleFilterChange('dueDateLTE', dateString)}
          dropdownStyle={{ background: darkMode ? '#141414' : '#fff' }}
        />
        <Select
          style={{ width: '100%', marginBottom: '1rem' }}
          placeholder="Priority"
          value={filter.priority}
          onChange={(value) => handleFilterChange('priority', value)}
          dropdownStyle={{ background:darkMode ? '#141414' : '#fff' }}
        >
          <Option value="">All</Option>
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
        <Button
          type="primary"
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={fetchTasks}
          className={darkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-blue-500 hover:bg-blue-600'}
        >
          Apply Filters
        </Button>
      </div>
    </Sider>
      </div>
      </Layout>
     
      <Drawer
        title="Task Details"
        placement="bottom"
        closable={true}
        onClose={onClose}
        visible={visible}
        style={{ textAlign: 'right' }}
        height={500} // Adjust height as needed
      >
        {/* Render cell details inside the Drawer */}
       
        <div className="p-4 flex flex-wrap text-lg items-center w-full font-sans">
        <div className="w-full flex mb-1 p-2 rounded-md gap-x-6">
          <p className="text-blue-500 font-semibold  h-full ">Task Name:</p>
          <p className={`font-medium ${colors.primaryText}`}>{cellDetails.taskName}</p>
        </div>
        <div className="w-full flex mb-1 p-2 rounded-md gap-x-6">
          <p className="text-blue-500 font-semibold">Description:</p>
          <p className={`font-medium ${colors.primaryText}`}>{cellDetails.description}</p>
        </div>
        <div className="w-full flex mb-1 p-2 rounded-md gap-x-6">
          <p className="text-blue-500 font-semibold">Due Date:</p>
          <p className={`font-medium ${colors.primaryText}`}>{cellDetails.dueDate}</p>
        </div>
        <div className="w-full flex mb-1 p-2 rounded-md gap-x-6">
          <p className="text-blue-500 font-semibold">Priority:</p>
          <p className={`font-medium ${colors.primaryText}`}>{cellDetails.priority}</p>
        </div>
        <div className="w-full flex mb-1 p-2 rounded-md gap-x-6">
          <p className="text-blue-500 font-semibold">Status:</p>
          <Select
            value={selectedStatus}
            onChange={handleChangeStatus}
            className="ml-2 w-32"
          >
            <Option value="Completed">Completed</Option>
            <Option value="In Progress">In Progress</Option>
          </Select>
        </div>

        <div className='w-full mt-6 p-4 flex gap-x-4 items-end justify-end'>
          <button className='bg-yellow-400 hover:bg-yellow-600 text-black px-4 py-2 rounded-md' onClick={updateTaskStatus}>Update</button>
          <button className='bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md' onClick={() => { onClose() }}>Cancel</button>
        </div>
      </div>
       
      </Drawer>
     
    </Layout>
  );
}

export default TaskPage;
