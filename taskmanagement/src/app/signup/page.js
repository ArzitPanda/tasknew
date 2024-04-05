'use client'
import React, { useState } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BASE_URL, LOGO_URL } from '../Constant';
import useColor from '@/Hooks/useColor';
import Link from 'next/link';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Image from 'next/image'
const Signup = () => {
    const [loading, setLoading] = useState(false);



    
const router = useRouter();
const colors = useColor();
    const onFinish = async (values) => {
    
        console.log(values);

        // const value = {...values,dataOfBirth:values.dateOfBirth.toString()}
        setLoading(true);
        try {
            const response = await axios.post(BASE_URL+'/user/signup', values);
            console.log('Signup successful:', response.data);
            router.push("/login")
            // Redirect or perform other actions upon successful signup
        } catch (error) {
            console.error('Signup error:', error);
            // Handle error responses
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"min-h-screen flex items-center justify-center flex-col  py-12 px-4 sm:px-6 lg:px-8 "+colors.PrimarybgColor}>
<div className='block'>
<Image
      src="/brand_with_logo.png"
      className={` ${colors.darkMode?'filter invert-0':'invert'}`}
      width={250}
      height={`100`}
      alt="Picture of the author"
    />
</div>

        <div className="max-w-md w-full space-y-8">
       
            <div>
                <h2 className={"mt-6 text-center  text-xl lg:text-3xl font-extrabold font-sans "+colors.primaryText}>
                    Sign up for an account
                </h2>
            </div>
            <Form
                name="signup-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                className="mt-8 space-y-6"
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                >
                    <Input placeholder="Name"
                    className={`placeholder-${colors.darkMode ? 'gray-400' : 'gray-600'} focus:placeholder-opacity-75`} 
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email' }]}
                >
                    <Input type="email" placeholder="Email"  />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                    name="dateOfBirth"
                    rules={[{ required: true, message: 'Please select your date of birth' }]}
                >
                    <DatePicker placeholder="Date of Birth" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="default"
                        htmlType="submit"
                        loading={loading}
                        className={"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium "+colors.primaryText}
                    >
                        Sign up
                    </Button>
                </Form.Item>
            </Form>
            <div className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Already Have An Account?{' '}
                        <Link href="/login" className={"font-medium  hover:text-indigo-500 "+colors.primaryText}>
                            sign in here
                        </Link>
                    </p>
                </div>

                {loading && (  <div className='w-full flex items-center justify-center'>
               <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin={true} />} />
               </div>)}
        </div>
    </div>
    );
};

export default Signup;
