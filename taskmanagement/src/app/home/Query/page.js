"use client";
import useColor from "@/Hooks/useColor";
import ToggleButton from "@/app/Components/ToggleButton";
import { BASE_URL } from "@/app/Constant";
import { AppContext } from "@/app/layout";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Drawer, FloatButton, Input, Select, Table, Tree } from "antd";
import axios from "axios";

import React, { useContext, useEffect, useState } from "react";

const page = () => {
  const context = useContext(AppContext);

  const { user } = context;
  console.log(user,"here in query screen")
  const initialTeamData = user?.Teams.map((ele) => {
    return { title: ele.teamName, key: ele._id };
  });
  const [teamdata, setTeamData] = useState(initialTeamData);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [queries, setQueries] = useState([]);
  const [filterBy, setFilterBy] = useState("From");
  const [formData, setFormData] = useState({
    From: '',
    To: '',
    Task: '',
    question: '',
    Type: ''
});
const [selectedQuery, setSelectedQuery] = useState(null);
const [drawerVisible, setDrawerVisible] = useState(false);

const handleRowClick = query => {
  setSelectedQuery(query);
  setDrawerVisible(true);
};

const {openNotification} =context;
const handleChange = (e) => {

  
  setFormData({...formData,From:'65c7898a7aab514b01eede23'})
  setFormData({
      ...formData,
      [e.target.name]: e.target.value
  });
};
useEffect(() => {
  fetchQueries();
}, [filterBy]);
const fetchQueries = async () => {
  try {
    const queryParams = { ...(filterBy && { [filterBy]: user._id }) };
    const response = await axios.get(BASE_URL+'/query/api/taskqueries', { params: queryParams });
    setQueries(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching TaskQueries:', error);
  }
};



const handleSubmit = async () => {
  try {
 
    const userId = localStorage.getItem('userId')
  // console.log(userId)
      const data ={To:formData.To,From:userId,Task:formData.Task,question:formData.question,Type:formData.Type}
      // console.log(data,"her in submit")
      const response = await axios.post(BASE_URL+'/query/api/query', {To:formData.To,From:userId,Task:formData.Task,question:formData.question,Type:formData.Type});
      // console.log(response.data); 
      openNotification('question added successfully:',"Success")


  } catch (error) {
      console.error('Error submitting data:', error);
  }

setFormData({
  From: '',
  To: '',
  Task: '',
  question: '',
  Type: ''
})

};



const colors = useColor()


  

  useEffect(() => {
    const { user } = context;
    const initialTeamData = user?.Teams.map((ele) => {
      return { title: ele.teamName, key: ele._id };
    });
    setTeamData(initialTeamData);
  }, [context]);



  const [queryAnswer,setQueryAnswer]=useState("");
  const [isInputVisible,setIsInputVisible]= useState(false)

  const addAnswerToQuery = async () => {



      const taskqueryid= selectedQuery._id
      const queryId = selectedQuery.queries[0]?._id;
      const answer = queryAnswer;
    try {
      const response = await axios.post(BASE_URL+`/query/api/taskquery/${taskqueryid}/${queryId}`, { answer });
      console.log('Answer added successfully:', response.data);
      openNotification('Answer added successfully:',"Success")
      setQueryAnswer("")
      return response.data; // You can return any relevant data from the response if needed
    } catch (error) {
      openNotification('Error adding answer:',"Error")
      console.error('Error adding answer:', error);
      setQueryAnswer("")
      throw error; // Throw the error to handle it in the calling code
    }
  };



  const fetchTeamData = async (key) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/team/team/get/${key}`
      );
      console.log(response.data, "fetching tasks at query page");
      setTasks(
        response.data?.tasks.map((ele) => {
          return { key: ele._id, title: ele.taskName };
        })
      );
      setMembers(
        response.data?.teamMembers.map((ele) => {
          return { key: ele._id, title: ele.name };
        })
      );
      return response.data?.tasks;

      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching team data:", error);
      return [];
      // Handle errors
    }
  };
  const getInitials = name => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(word => word[0]).join('').toUpperCase();
  };
  const columns = [
    {
      title: 'From',
      dataIndex: 'From',
      key: 'From',
      render: from => (
        <span>
          <Avatar style={{ marginRight: 8,backgroundColor:'blueviolet' }}>{getInitials(from.name)}</Avatar>
          {from.name}
        </span>
      ),
    },
    {
      title: 'To',
      dataIndex: 'To',
      key: 'To',
      render: to => (
        <span>
          <Avatar style={{ marginRight: 8 ,backgroundColor:"greenyellow"}}>{getInitials(to.name)}</Avatar>
          {to.name}
        </span>
      ),
    },
    {
      title: 'Task',
      dataIndex: 'Task',
      key: 'Task',
      render: task => <span>{task.taskName}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Queries',
      dataIndex: 'queries',
      key: 'queries',
      render: queries => (
        <ul>
          {queries.map(query => (
            <li key={query._id}>
              <strong>Request:</strong> {query.request}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => <span>{new Date(createdAt).toLocaleString()}</span>,
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: updatedAt => <span>{new Date(updatedAt).toLocaleString()}</span>,
    },
  ];
  
   
  // Call the function to fetch team data
  useEffect(() => {}, []);

  return (
    <div className="flex flex-col w-full" >
      <div className="my-2"> 
       <ToggleButton onChange={setFilterBy}  />
       </div>
    <div className={"overflow-x-auto "+colors.PrimarybgColor}>
    <Table dataSource={queries} columns={columns} onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })} />
    </div>


      <FloatButton  icon={isInputVisible?<CloseOutlined color="blue"/>:<PlusOutlined color="blue"/>} onClick={()=>{setIsInputVisible(!isInputVisible)}}/>
      <Drawer
      title="Create Announcement"
      placement="bottom"
      onClose={()=>{setIsInputVisible(false)}}
      visible={isInputVisible}
      // Remove background color
      height={500} // Adjust height as needed
    >
      <div className="grid grid-cols-12 gap-y-5 p-4">
        <div className="col-span-6 lg:col-span-2">
          <label className="block text-gray-600">Select Team:</label>
          <Select
            className="w-10/12"
            onChange={async (value) => {
              await fetchTeamData(value);
            }}
            title="TeamName"
          >
            {teamdata?.map((ele) => (
              <Select.Option key={ele.key} value={ele.key}>
                {ele.title}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="col-span-6 lg:col-span-2">
          <label className="block text-gray-600">Select Task:</label>
          <Select
            className="w-10/12"
            onChange={(value) => handleChange({ target: { name: 'Task', value: value } })}
          >
            {tasks?.map((ele) => (
              <Select.Option key={ele.key} value={ele.key}>
                {ele.title}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="col-span-6 lg:col-span-2">
          <label className="block text-gray-600">Select Member:</label>
          <Select
            className="w-10/12"
            onChange={(value) => handleChange({ target: { name: 'To', value: value } })}
          >
            {members?.map((ele) => (
              <Select.Option key={ele.key} value={ele.key}>
                {ele.title}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="col-span-6 lg:col-span-2">
          <label className="block text-gray-600">Select Type:</label>
          <Select
            className="w-10/12"
            onChange={(value) => handleChange({ target: { name: 'Type', value: value } })}
          >
            {['UPDATE', 'HELP', 'ANNOUNCEMENT', 'GENERAL'].map((ele) => (
              <Select.Option key={ele} value={ele}>
                {ele}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Input.TextArea
          showCount
          styles={{textarea:{backgroundColor:colors.darkMode?'#141414':'white',color:colors.darkMode?'white':"black"},count:{color:colors.darkMode?'white':"black"}}}
          className={"col-span-12 lg:col-span-10 rounded-xl "}
          maxLength={100}
          onChange={(e) => handleChange({ target: { name: 'question', value: e.target.value } })}
        />
        <div className="col-span-10 flex items-center justify-start mx-1">
          <Button type="default" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Drawer>
     
      <Drawer
        title={selectedQuery?.queries[0]?.request || "Query Details"}
        placement="top"
        closable={true}
        height={500}
     
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <div    className={`flex flex-col items-left justify-between h-full ${colors.darkMode?"text-white":"text-black"}`}>
        <div>
          <p><strong>Request:</strong> {selectedQuery?.queries[0]?.request }</p>
          <p><strong>Answers:</strong></p>
          <ul>
            {selectedQuery?.queries[0]?.answer?.map((ans, index) => (
              <li key={index}>{ans}</li>
            ))}
          </ul>
      
        </div>
        <div>

<Input placeholder="Type your answer..." value={queryAnswer} onChange={(e)=>{setQueryAnswer(e.target.value)}} />
  <Button onClick={addAnswerToQuery} className="my-6">Add Answer</Button>
</div>
        </div>
   
       
      </Drawer>
  
    </div>
  );
};

export default page;
