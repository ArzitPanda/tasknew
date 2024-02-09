'use client'
import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, List } from 'antd';
import { TeamOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TeamManagementComponent = () => {
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [updateTeamVisible, setUpdateTeamVisible] = useState(false);
  const [deleteTeamVisible, setDeleteTeamVisible] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const handleAddUserOk = () => {
    // Handle form submission here
    setAddUserVisible(false);
    message.success('User added to team successfully');
  };

  const handleUpdateTeamOk = () => {
    // Handle form submission here
    setUpdateTeamVisible(false);
    message.success('Team updated successfully');
  };

  const handleDeleteTeamOk = ({params}) => {
    // Handle form submission here
    setDeleteTeamVisible(false);
    message.success('Team deleted successfully');
  };

  const handleCancel = (setState) => {
    setState(false);
  };

  return (
    <div className="p-8">
      {/* Add User Modal */}
      <Modal
        title="Add User to Team"
        visible={addUserVisible}
        onOk={handleAddUserOk}
        onCancel={() => handleCancel(setAddUserVisible)}
      >
        <Form name="add-user-form" initialValues={{ remember: true }}>
          <Form.Item
            name="userId"
            rules={[{ required: true, message: 'Please enter user ID' }]}
          >
            <Input placeholder="User ID" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Team Modal */}
      <Modal
        title="Update Team Details"
        visible={updateTeamVisible}
        onOk={handleUpdateTeamOk}
        onCancel={() => handleCancel(setUpdateTeamVisible)}
      >
        <Form name="update-team-form" initialValues={{ remember: true }}>
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

      {/* Delete Team Modal */}
      <Modal
        title="Confirm Delete Team"
        visible={deleteTeamVisible}
        onOk={handleDeleteTeamOk}
        onCancel={() => handleCancel(setDeleteTeamVisible)}
      >
        <p>Are you sure you want to delete this team?</p>
      </Modal>

      {/* Buttons for Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-black font-bold">Team Management</h2>
        <Button type="primary" icon={<TeamOutlined />} onClick={() => setAddUserVisible(true)}>
          Add User to Team
        </Button>
      </div>

      <div className="flex flex-row justify-between items-center mb-4 w-52 gap-4">
        
        <Button type="primary" icon={<EditOutlined />} onClick={() => setUpdateTeamVisible(true)}>
          Update Team Details
        </Button>
        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => setDeleteTeamVisible(true)}>
          Delete Team
        </Button>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-black">Team Members</h3>
        <List
          bordered
          dataSource={teamMembers}
          renderItem={(item) => (
            <List.Item>
              {item.name} - {item.email}
            </List.Item>
          )}
        />
      </div>

      {/* List of Tasks */}

      <div>
        <h3 className="text-lg font-semibold mb-2 text-black">Tasks</h3>
        <List
          bordered
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item>
              {item.title} - {item.description}
            </List.Item>
          )}
        />
      </div>
 
    </div>
  );
};

export default TeamManagementComponent;
