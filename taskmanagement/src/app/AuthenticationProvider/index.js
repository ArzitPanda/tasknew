'use client'
import UseLocalstorage from '@/Hooks/UseLocalstorage'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const AuthenticationProvider = ({children}) => {

const LocalData =UseLocalstorage("Auth")
const Router =useRouter();

useEffect(()=>{

console.log(Router.asPath)



},[Router])




  return (
    <>{children}</>
  )
}

export default AuthenticationProvider