"use client";
import React,{useContext}from 'react';
import { Avatar, Card, Divider, Tag } from 'antd';
import { AppContext } from '@/app/layout';
const ProfilePage = () => {

  const contextData = useContext(AppContext);
  const user = contextData.user;

    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full h-full p-4">
          <div className="flex flex-col lg:flex-row justify-between h-[200px]">
            <div className="lg:order-2 lg:ml-4">
              <Avatar size={128} src="https://via.placeholder.com/150" />
            </div>
            <div className="flex flex-col justify-center lg:order-1">
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
                  user?.Teams.map((ele)=>{return(<Tag key={ele._id}>{ele.teamName}</Tag>)})
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
