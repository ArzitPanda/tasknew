'use client'
import React, { useState } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const Signup = () => {
    const [loading, setLoading] = useState(false);



    
const router = useRouter();
    const onFinish = async (values) => {
    
        console.log(values);

        // const value = {...values,dataOfBirth:values.dateOfBirth.toString()}
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:3001/user/signup', values);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
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
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email' }]}
                >
                    <Input type="email" placeholder="Email" />
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
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
    );
};

export default Signup;
