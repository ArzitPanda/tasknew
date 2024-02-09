"use client";
import React, { useState } from "react";
import { Button, Input, Form, Modal, message, List, Card } from "antd";
import axios from "axios";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AppContext } from "@/app/layout";

const HomeTeamPage = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const context = useContext(AppContext);

  const showModal = () => {
    setVisible(true);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return date.toLocaleString("en-US", options);
  }
  const router = useRouter();
  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await axios.post("/team/create", values);
      console.log("Team created:", response.data);
      message.success("Team created successfully");
      setVisible(false);
    } catch (error) {
      console.error("Team creation error:", error);
      message.error("Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const data = [
    {
      title: "Team 1",
      description: "Description of Team 1",
    },
    {
      title: "Team 2",
      description: "Description of Team 2",
    },
    {
      title: "Team 3",
      description: "Description of Team 3",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Your Teams</h2>
          <Button type="dashed" icon={<PlusOutlined />} onClick={showModal}>
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
            <Button key="submit" type="dashed" onClick={handleOk}>
              Create
            </Button>,
          ]}
        >
          <Form name="create-team-form" initialValues={{ remember: true }}>
            <Form.Item
              name="teamName"
              rules={[{ required: true, message: "Please enter team name" }]}
            >
              <Input placeholder="Team Name" />
            </Form.Item>
            <Form.Item
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea placeholder="Description" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={context.user?.Teams}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.teamName}
                bordered={false}
                style={{
                  width: 300,
                  marginBottom: 20,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                hoverable
                onClick={() => {
                  context.setSelectedTeam(item);
                  router.push(`/home/Team/${item._id}`);
                }}
              >
                <p>{item.description}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TeamOutlined className="text-blue-500" />
                  <p style={{ marginLeft: 5 }}>
                    {formatDate(item.creationDate)}
                  </p>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default HomeTeamPage;
