"use client"
import { useState,useContext } from 'react';
import { Button, DatePicker, Input, Select } from 'antd';
 // Import Tailwind CSS styles
import { AppContext } from '../layout';
const { Option } = Select;

const TaskForm = () => {


  const context = useContext(AppContext)


  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [team, setTeam] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');

  const handleTaskSubmission = () => {
    // Implement task submission logic here
    console.log('Task submitted:', {
      taskName,
      description,
      dueDate,
      team,
      assignedBy,
      assignedTo,
      status
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Add New Task</h2>
      <Input
        className="mb-4"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <Input.TextArea
        className="mb-4"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DatePicker
        className="mb-4 w-full"
        placeholder="Due Date"
        value={dueDate}
        onChange={(date) => setDueDate(date)}
      />
      <Select
        className="mb-4 w-full"
        placeholder="Select Team"
        value={team}
        onChange={(value) => setTeam(value)}
      >
        <Option value="Team 1">Team 1</Option>
        <Option value="Team 2">Team 2</Option>
        {/* Add more options as needed */}
      </Select>
      <Input
        className="mb-4"
        placeholder="Assigned By"
        value={assignedBy}
        onChange={(e) => setAssignedBy(e.target.value)}
      />
      <Select
        className="mb-4 w-full"
        placeholder="Assign To"
        value={assignedTo}
        onChange={(value) => setAssignedTo(value)}
      >
       {
context.user?.Teams.map((ele)=>{return(<Option key={ele._id} value={ele._id} >

  {ele.teamName}


</Option>)})
       }
        {/* Add more options as needed */}
      </Select>
      <Select
        className="mb-4 w-full"
        placeholder="Select Status"
        value={status}
        onChange={(value) => setStatus(value)}
      >
        <Option value="To Do">To Do</Option>
        <Option value="In Progress">In Progress</Option>
        <Option value="Completed">Completed</Option>
      </Select>
      <Button type="primary" onClick={handleTaskSubmission}>Submit Task</Button>
    </div>
  );
};

export default TaskForm;
