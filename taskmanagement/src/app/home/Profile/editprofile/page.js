"use client"

import React, { useState, useEffect, useContext, use } from 'react';
import { Form, Input, Upload, Button, message, Select, DatePicker } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { BASE_URL } from '@/app/Constant';
import { AppContext } from '@/app/layout';
import useColor from '@/Hooks/useColor';


const UserDetailForm = ({ initialValues = {} }) => {
  const [imageUrl, setImageUrl] = useState(initialValues.profilePhoto || null); // Store image URL for preview
  const [form] = Form.useForm();

const [imgData,setImgData] = useState(null);
const [CurruserData,setUserData] =useState(null);
const contextData = useContext(AppContext);
const user = contextData.user;
useEffect(() => {


    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL+'/user/userdetails/'+user._id);
        const userData = response.data;
        setUserData(userData)
        setImageUrl(userData.profilePhoto)
        console.log(response.data)
        form.setFieldsValue({
          userId: userData.user,
          profilePhoto: userData.profilePhoto,
        
          address: {
            streetAddress: userData.address.streetAddress,
            city: userData.address.city,
            state: userData.address.state,
            postalCode: userData.address.postalCode,
            country:userData.address.country
          },
          certifications : userData.certifications.map((ele)=>{return {issuer:ele.issuer,name:ele.name,url:ele.url}})
       
        });

      
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [form,contextData]);





const handleImage=(file)=>{

    setImgData(file.file.originFileObj);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file.file.originFileObj);


}


  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('profilePhoto', file);

 
  };

  const handleSubmit = async (values) => {

  
    
    const data ={...values,profilePhoto:imgData,userId:user._id}
    console.log(data);
    if(CurruserData)
    {
        try {
            const response = await axios.put(BASE_URL+'/user/userdetails', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            setImageUrl(response.data.profilePhoto); // Set image URL for preview
            message.success('Image uploaded successfully');
            message.success('User details submitted successfully');
            form.resetFields(); 
          // Clear form after successful upload
          } catch (error) {
            console.error(error);
            message.error('Error uploading Details');
          }
    }
    else
    {
        try {
            const response = await axios.post(BASE_URL+'/user/userdetails', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            setImageUrl(response.data.profilePhoto); // Set image URL for preview
            message.success('Image uploaded successfully');
            message.success('User details submitted successfully');
            form.resetFields(); // Clear form after successful upload
          } catch (error) {
            console.error(error);
            message.error('Error uploading Details');
          }
    }
    
  
  };
  const colors = useColor();

  return (
    <div className={` lg:w-full mx-auto px-4 py-8 shadow-md rounded-lg ${colors.PrimarybgColor}`}>
        <h1 className='text-blue-500 text-2xl'>User Details</h1>
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      s
      className="space-y-6"
    >
      
      <Form.Item
        label="Profile Photo"
        name="profilePhoto"
        
        className="mb-0 w-2/12 text-pretty"
        labelCol={{ style: { color: 'red' } }}
      >
        <Upload.Dragger onChange={handleImage} className="w-full">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile preview" className="w-full rounded-full" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <InboxOutlined className="text-4xl text-gray-400" />
              <p className="text-gray-400">Click or drag file to this area to upload</p>
            </div>
          )}
        </Upload.Dragger>
      </Form.Item>
      <Form.Item label="Address" className="mb-0">
        <Input.Group compact >
          <Form.Item
            name={['address', 'streetAddress']}
            rules={[{ required: true, message: 'Please enter street address' }]}
            className="mb-4"
          >
            <Input placeholder="Street Address" />
          </Form.Item>
          <Form.Item
            name={['address', 'city']}
            rules={[{ required: true, message: 'Please enter city' }]}
            className="mb-4"
          >
            <Input placeholder="City" />
          </Form.Item>
          <Form.Item
            name={['address', 'state']}
            rules={[{ required: true, message: 'Please enter state' }]}
            className="mb-4"
          >
            <Input placeholder="State" />
          </Form.Item>
          <Form.Item
            name={['address', 'postalCode']}
            rules={[{ required: true, message: 'Please enter postal code' }]}
            className="mb-4"
          >
            <Input placeholder="Postal Code" />
          </Form.Item>
          <Form.Item
            name={['address', 'country']}
            rules={[{ required: true, message: 'Please enter country' }]}
            className="mb-4"
          >
            <Input placeholder="Country" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.List name="certifications">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} className="space-y-4 border-b pb-4">
                <h2 className="text-xl font-semibold">Certification {index + 1}</h2>
                <Form.Item
                  {...field}
                  name={[field.name, 'name']}
                  fieldKey={[field.fieldKey, 'name']}
                  rules={[{ required: true, message: 'Missing certification name' }]}
                  className="mb-4"
                >
                  <Input placeholder="Certification Name" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'issuer']}
                  fieldKey={[field.fieldKey, 'issuer']}
                  rules={[{ required: true, message: 'Missing issuer' }]}
                  className="mb-4"
                >
                  <Input placeholder="Issuer" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'issuedDate']}
                  fieldKey={[field.fieldKey, 'issuedDate']}
                  rules={[{ required: true, message: 'Missing issued date' }]}
                  className="mb-4"
                >
                  <DatePicker placeholder="Issued Date" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'url']}
                  fieldKey={[field.fieldKey, 'url']}
                  rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                  className="mb-4"
                >
                  <Input placeholder="Optional Certification URL" />
                </Form.Item>
                <Button type="dashed" onClick={() => remove(field.name)}>
                  Remove Certification
                </Button>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} className="w-full">
                Add Certification
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item className="mb-0">
        <Button type="primary" htmlType="submit" className="w-full">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </div>
  );
};

export default UserDetailForm;


