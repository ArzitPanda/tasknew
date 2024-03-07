'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Table, Input, Select, DatePicker, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '@/app/Constant';
import { AppContext } from '@/app/layout';

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout flex flex-col-reverse lg:flex-row">
   
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Table columns={columns} dataSource={tasks} rowKey="_id" />
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
    </Layout>
  );
}

export default TaskPage;
