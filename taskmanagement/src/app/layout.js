'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import AuthenticationProvider from "@/app/AuthenticationProvider";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });


export const AppContext = createContext();
export default function RootLayout({ children }) {




const [user,setUser] = useState();
const [Tasks,setTask] = useState();
const [SelectedTeam,setSelectedTeam] = useState();


useEffect(() => {
  const fetchUserData = async () => {
    // Assuming you have the userId and token stored in local storage
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // Make sure userId and token are not null or undefined
    if (userId && token) {
      // Set up Axios headers with the token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        // Make the Axios request to the getUser endpoint
        const response = await axios.get(`http://localhost:3001/user/getUser/${userId}`);
        console.log('User data:', response.data);

        setUser(response.data);
        // Do something with the user data
      } catch (error) {
        console.error('Error getting user data:', error);
        // Handle errors
      }
    } else {
      console.error('userId or token not found in local storage');
      // Handle the case where userId or token is missing
    }
  };

  fetchUserData(); // Call the function to fetch user data
}, []);



  return (

    <html lang="en">
     <AppContext.Provider  value ={{user,Tasks,SelectedTeam,setSelectedTeam}} >
     <body className={inter.className}>{children}</body>
     </AppContext.Provider >
    </html>
  );
}
