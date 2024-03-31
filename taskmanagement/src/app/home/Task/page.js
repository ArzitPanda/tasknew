'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Table, Input, Select, DatePicker, Button, Drawer } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '@/app/Constant';
import { AppContext } from '@/app/layout';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

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
    assignedTo: context.user?._id, 
    status: '',
    dueDateLTE: '',
    priority: ''
  });

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

  const fetchTasks = async () => {
    try {
      const response = await axios.get(BASE_URL+'/task/api/Task', {
        params: { ...filter ,assignedTo: context.user?._id},
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter(prevFilter => ({ ...prevFilter, [key]: value }));
  };


  const handleChangeStatus = (value) => {

    const updatedTask = { ...cellDetails, status: value };
    setCellDetails(updatedTask);



  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout flex flex-col-reverse lg:flex-row">
   
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Table columns={columns} dataSource={tasks} rowKey="_id"   onRow={(record) => ({
        onClick: () => showDrawer(record),
      })}/>
          </div>
        </Content>
      </Layout>
      <Sider width={300} style={{ background: '#fff' }}>
        <Menu mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Filters</Menu.Item>
        </Menu>
        <div style={{ padding: '1rem' }}>
          <Select style={{ width: '100%', marginBottom: '1rem' }} placeholder="Status" value={filter.status} onChange={(value) => handleFilterChange('status', value)}>
            <Option value="">All</Option>
            <Option value="To Do">To Do</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>
          <DatePicker style={{ width: '100%', marginBottom: '1rem' }} onChange={(date, dateString) => handleFilterChange('dueDateLTE', dateString)} />
          <Select style={{ width: '100%', marginBottom: '1rem' }} placeholder="Priority" value={filter.priority} onChange={(value) => handleFilterChange('priority', value)}>
            <Option value="">All</Option>
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
          <Button type="primary" style={{ marginTop: '1rem', width: '100%' }} onClick={fetchTasks}>Apply Filters</Button>
        </div>
      </Sider>
      <Drawer
        title="Task Details"
        placement="bottom"
        closable={true}
        onClose={onClose}
        visible={visible}
        style={{ textAlign: 'right' }}
        height={800} // Adjust height as needed
      >
        {/* Render cell details inside the Drawer */}
        <div className="p-4 flex flex-wrap text-lg items-center w-full">
       
          <div className="w-full flex bg-slate-200 mb-4 p-4 rounded-md gap-x-6">
            <p className="text-blue-500 font-semibold  h-full ">Task Name:</p>
            <p className='font-semibold'>{cellDetails.taskName}</p>
          </div>
          <div className="w-full flex bg-blue-200 mb-4 p-4 rounded-md gap-x-6">
            <p className="text-blue-500 font-semibold">Description:</p>
            <p className='font-semibold'>{cellDetails.description}</p>
          </div>
          <div className="w-full flex bg-slate-200 mb-4 p-4 rounded-md gap-x-6">
            <p className="text-blue-500 font-semibold">Due Date:</p>
            <p className='font-semibold'>{cellDetails.dueDate}</p>
          </div>
          <div className="w-full flex bg-blue-200 mb-4 p-4 rounded-md gap-x-6">
            <p className="text-blue-500 font-semibold">Priority:</p>
            <p className='font-semibold'>{cellDetails.priority}</p>
          </div>
          <div className="w-full flex bg-slate-200 mb-4 p-4 rounded-md gap-x-6">
            <p className="text-blue-500 font-semibold">Status:</p>
            <Select
              defaultValue={cellDetails.status}
              onChange={handleChangeStatus}
              className="ml-2"
            >
              <Option value="Completed">Completed</Option>
              <Option value="In Progress">In Progress</Option>
            </Select>
          </div>


          <div className='w-full mt-6 p-4 flex gap-x-4 items-end justify-end'>
            <button className='bg-yellow-400 hover:bg-yellow-600 text-black px-4 py-2 rounded-md'>Update</button>
            <button className='bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-md' onClick={()=>{setVisible(false)}}>Cancel</button>

          </div>
        </div>

       
      </Drawer>
    </Layout>
  );
}

export default TaskPage;
