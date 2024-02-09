'use client'
import React, { useEffect, useState } from 'react'

const UseLocalstorage = (key) => {

    const [data,setData]=useState({});




    useEffect(()=>{

        const dataFetched = localStorage.getItem(key);
        if(dataFetched)
        {
            setData({...data,key:dataFetched})
        }



    },[data])






  return data
}

export default UseLocalstorage