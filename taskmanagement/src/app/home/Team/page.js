"use client"
import React, { useState } from "react";
import { Button, Input, Form, Modal, message, List, Card } from "antd";
import { FilterOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AppContext } from "@/app/layout";
import { BASE_URL } from "@/app/Constant";
import axios from "axios";

const HomeTeamPage = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [teamName, SetTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");

  const [form] = Form.useForm();

  const context = useContext(AppContext);
  const router = useRouter();

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
  };

  const handleOk = async () => {
    try {
      setLoading(true);

      const response = await axios.post(BASE_URL + "/team/team/create", { teamCreator: context.user?._id, teamName, description: teamDesc });

      console.log(response.data, "reponse by create Team");

      const Teams = [...context?.user.Teams, response.data];

      context?.setUser({ ...context?.user, Teams: Teams });
      message.success("Team created successfully");
      setTeamDesc("");
      SetTeamName("");
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

  return (
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
            <Input placeholder="Team Name" value={teamName} onChange={(e) => SetTeamName(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea placeholder="Description" value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex justify-between items-center w-full mb-4">
          <Button type="primary" icon={<FilterOutlined />} size="small" ghost>
            Filter
          </Button>
        </div>

        <List
          className="w-full"
          grid={{ gutter: 16, column: 1 }}
          dataSource={context.user?.Teams}
          renderItem={(item) => (
            <List.Item key={item._id}>
              <Card
                title={item.teamName}
                bordered={false}
                hoverable
                onClick={() => {
                  context.setSelectedTeam(item);
                  router.push(`/home/Team/${item._id}`);
                }}
                className="flex flex-col rounded-md shadow-md hover:shadow-xl transition-all duration-200"
              >
                <p className="text-gray-700 px-4 pt-4">{item.description}</p>
                <div className="flex items-center justify-between px-4 pb-4">
                  <TeamOutlined className="text-blue-500" />
                  <p className="text-gray-500 font-sm ml-2">{formatDate(item.creationDate)}</p>
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
