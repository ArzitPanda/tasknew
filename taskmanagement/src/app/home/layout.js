'use client'
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Modal } from 'antd';
import {
  BookOutlined,
  DesktopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TaskForm from '../Components/TaskForm';


const { Sider, Content } = Layout;

const Dashboard = ({children}) => {


  const router = usePathname()

const [isTaskVisible,setTaskVisible]=useState(false);
const [TaskFormVisible,setTaskFormVisible] = useState(false)

useEffect(()=>{
  console.log("pathname is "+router.toLowerCase())

if(router.startsWith("/home/Team/"))
{
  setTaskVisible(true)
}
else
{
  setTaskVisible(false)
}

},[router])


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<DesktopOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />}>
           <Link href="/home/Team"> Teams</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
          <Link href="/home/Profile"> Profile</Link>
          </Menu.Item>
          {
            isTaskVisible && 
        (    <Menu.Item key="4" icon={<BookOutlined />} onClick={()=>{

           setTaskFormVisible(!TaskFormVisible)

        }}>
             Task
          </Menu.Item>)
          }
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Modal open={TaskFormVisible} onCancel={()=>{setTaskFormVisible(false)}}>
              <TaskForm/>
            </Modal>
          {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
