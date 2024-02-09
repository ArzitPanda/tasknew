'use client'
import { Checkbox, Form, Input ,Button} from 'antd';
import Link from 'next/link';

import React, { useState } from 'react'

const page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { username, password });
        // You can add your login logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <Form
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    className="mt-8 space-y-6"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox className="ml-2">Remember me</Checkbox>
                    </Form.Item>

                    <div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </Button>
                    </div>
                </Form>
                <div className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Not yet registered?{' '}
                        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
          
        </div>
    );
}

export default page