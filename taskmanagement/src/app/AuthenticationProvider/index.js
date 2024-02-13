'use client'
import UseLocalstorage from '@/Hooks/UseLocalstorage'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const AuthenticationProvider = ({children}) => {


const Router =useRouter();









useEffect(()=>{

  const LocalData =localStorage.getItem("token")
    if(LocalData ===undefined || LocalData===null)
    {
      Router.push("/login")
    }


},[])




  return (
    <>{children}</>
  )
}

export default AuthenticationProvider