"use client"
import { AppContext } from '@/app/layout'
import { Input, Select, Tree } from 'antd'
import axios from 'axios'


import React,{useContext, useEffect, useState} from 'react'




const page = () => {

    const context = useContext(AppContext);
    const updateTreeData = (list, key, children) =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      return node;
    });
   const  {user} = context;
   const initialTeamData = user?.Teams.map((ele)=>{return {title:ele.teamName,key:ele._id}})
   const [teamdata,setTeamData] = useState(initialTeamData)


useEffect(()=>{
  const  {user} = context;
   const initialTeamData = user?.Teams.map((ele)=>{return {title:ele.teamName,key:ele._id}})
  setTeamData(initialTeamData)

},[context])



   const fetchTeamData = async (key) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/team/team/get/${key}`
      );
      console.log(response.data?.tasks, "fetching tasks at query page");
      return response.data?.tasks

    
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching team data:", error);
      return [];
      // Handle errors
    }
  };

  // Call the function to fetch team data





   const onLoadData = async ({ key, children }) =>
       {      console.log(children)
            const data = await fetchTeamData(key);
          const childrenData = data.map(ele=>{return {title:ele.taskName,key:ele._id,isLeaf:true}})
          setTeamData((origin)=>updateTreeData(origin,key,childrenData));


       }
 

console.log(user,"query page");

  return (
    <div className='w-full'>


        <div className='w-full grid grid-cols-12'>
            <Tree treeData={teamdata} loadData={onLoadData} className='col-span-3'/>
                

            <Input.TextArea
            showCount
            className='col-span-9'
            maxLength={100}
            />
        </div>
    </div>
  )
}

export default page