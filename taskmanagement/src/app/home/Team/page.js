"use client"
import React, { useState } from 'react';
import { Button, Input, Form, Modal, message, List, Card } from 'antd';
import axios from 'axios';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';


const HomeTeamPage = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const showModal = () => {
        setVisible(true);
    };


    const router = useRouter();
    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const response = await axios.post('/team/create', values);
            console.log('Team created:', response.data);
            message.success('Team created successfully');
            setVisible(false);
        } catch (error) {
            console.error('Team creation error:', error);
            message.error('Failed to create team');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };
    const data = [
        {
          title: 'Team 1',
          description: 'Description of Team 1',
        },
        {
          title: 'Team 2',
          description: 'Description of Team 2',
        },
        {
          title: 'Team 3',
          description: 'Description of Team 3',
        },
      ];

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Your Teams</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Team
        </Button>
      </div>
      <Modal
        title="Create a New Team"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create
          </Button>,
        ]}
      >
        <Form name="create-team-form" initialValues={{ remember: true }}>
          <Form.Item
            name="teamName"
            rules={[{ required: true, message: 'Please enter team name' }]}
          >
            <Input placeholder="Team Name" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    <div>
    <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Card title={item.title} bordered={false} onClick={()=>{router.push(`/home/Team/${item.title}`)}}>
              <p>{item.description}</p>
              <TeamOutlined className="text-blue-500" />
            </Card>
          </List.Item>
        )}
      />
    </div>
        </div>
    );
};

export default HomeTeamPage;
