"use client"
import React, { useContext } from 'react';
import { Avatar, Card, Divider, Tag, Tooltip } from 'antd';
import { AppContext } from '@/app/layout';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';

const ProfilePage = () => {
  const contextData = useContext(AppContext);
  const user = contextData.user;

  return (
    <div className="flex justify-center items-center h-auto lg:h-screen">
      <Card className="w-full h-full">
        <div className='w-full h-32 flex items-start justify-end gap-x-6'>
          <Tooltip title="edit">
        <EditOutlined color='blue' style={{fontSize:30}}  className='cursor-pointer'/>
        </Tooltip>
        <Tooltip title="log out">
        <LogoutOutlined color='blue' style={{fontSize:27}}   className='cursor-pointer'/>
        </Tooltip>
        </div>
        <div className="flex flex-col justify-center lg:justify-between items-center lg:flex-row">
          <div className="mb-4 lg:mb-0 lg:mr-4">
            <Avatar size={128} src="https://via.placeholder.com/150" />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold">{user?.name || "Arijit"}</h2>
            <p className="text-gray-600">{user?.email || "arzit.panda@gmail.com"}</p>
            <p className="mt-2">Address: {user?.address || "Not provided"}</p>
            <p>Phone No: {user?.phone || "Not provided"}</p>
            {/* Add more details like social links if available */}
          </div>
        </div>
        <Divider className="mt-4" />
        <div className="text-left">
          <h3 className="text-lg font-bold">Information</h3>
          <p>Date of Birth: {user?.DateOfBirth ? user.DateOfBirth.toDateString() : 'Not provided'}</p>
          <h4 className='text-xl'>Teams</h4>
       
          <div>
            {
              user?.Teams.map((ele) => (<Tag key={ele._id}>{ele.teamName}</Tag>))
            }
          </div>
        </div>
        <Divider />
        <div className="text-left">
          <h3 className="text-lg font-bold">Tasks</h3>
          <ul>
            {user ? user?.Tasks.map(task => (
              <li key={task._id}>{task.name}</li>
            )) : <li>User not present</li>}
          </ul>
        </div>
      </Card>
      
    </div>
  );
};

export default ProfilePage;
