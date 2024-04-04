"use client"
import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Card, Divider, Tag, Tooltip,Typography } from 'antd';
import { AppContext } from '@/app/layout';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { BASE_URL } from '@/app/Constant';
import useColor from '@/Hooks/useColor';

const { Text } = Typography;
const ProfilePage = () => {
  const contextData = useContext(AppContext);
  const user = contextData.user;
  const router  = useRouter();
const [userData,setUserData] = useState(null)
const colors =useColor()

  useEffect(()=>{
   const fetchData=async() =>{


    const response = await axios.get(BASE_URL+'/user/userdetails/'+user._id);
    const userData = response.data;
    setUserData(userData)
   
    console.log(response.data)


   }
   fetchData();

  },[contextData])

  return (
    <div className="flex justify-center items-center h-auto lg:h-screen">
      <Card className="w-full h-full">
        <div className='w-full h-32 flex items-start justify-end gap-x-6'>
          <Link href={"/home/Profile/editprofile"}>
          <Tooltip title="edit" >
        <EditOutlined color='blue' style={{fontSize:30}}  className='cursor-pointer'/>
        </Tooltip>
        </Link>
        <Tooltip title="log out">
        <LogoutOutlined color='blue' style={{fontSize:27}}   className='cursor-pointer'/>
        </Tooltip>
        </div>
        <div className="flex flex-col justify-center lg:justify-between items-center lg:flex-row">
          <div className="mb-4 lg:mb-0 lg:mr-4">
            <Avatar size={128} 
            style={{backgroundColor:"green"}}
            src={userData?.profilePhoto ||`
            https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name}` } />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold">{user?.name || "Arijit"}</h2>
            <p className="text-gray-600">{user?.email || "arzit.panda@gmail.com"}</p>
            <p className="mt-2">Address: {userData?.address?.
      streetAddress || "Not provided"}</p>
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
        {userData && (
  <div className={`user-details ${colors.PrimarybgColor} shadow-md rounded-md p-4`}>
  <h2 className={colors.primaryText}>User Details</h2>
  <div className="user-info mb-4">
    <p className={`text-base ${colors.secondaryText}`}>
      Address: {userData.address.streetAddress}, {userData.address.city}, {userData.address.state} {userData.address.postalCode},{" "}
      {userData.address.country}
    </p>
  </div>
  <h2 className={colors.primaryText}>Certifications</h2>
  <ul className="flex flex-row">
    {userData.certifications.map((certification, index) => (
      <li key={index} className={`bg-white shadow-lg rounded-xl mb-4 border-b pb-2 py-6 px-6 ${colors.PrimarybgColor}`}>
        <p className={`text-base font-medium ${colors.primaryText}`}>
          <strong>{certification.name.toUpperCase()}</strong> 
        </p>
        <p className={`text-base ${colors.secondaryText}`}>
          <strong>Issuer:</strong> {certification.issuer}
        </p>
        <p className={`text-base ${colors.secondaryText}`}>
          <strong>Issued Date:</strong> {new Date(certification.issuedDate).toLocaleDateString()}
        </p>
        {certification.url && (
          <p className={`text-base ${colors.secondaryText}`}>
            <strong>URL:</strong>
            <a
              href={certification.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {certification.url}
            </a>
          </p>
        )}
      </li>
    ))}
  </ul>
</div>
)}
      <Divider/>
        <div className="text-left">
             <button className='bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-700 transition-colors' 
             onClick={()=>{

                localStorage.removeItem("userId");
                localStorage.removeItem("token")
                router.push("/login");



             }}>Log Out</button>
        </div>
      </Card>
      
    </div>
  );
};

export default ProfilePage;
