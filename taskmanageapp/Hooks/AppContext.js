import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import { BASE_URL } from '../Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext(); // Create the app context

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state
  const [tasks, setTasks] = useState(null); // Initialize tasks state
  const [selectedTeam, setSelectedTeam] = useState(null); // Initialize selectedTeam state
  const [openDrawer, setOpenDrawer] = useState(false); // Initialize openDrawer state
  const [notifications, setNotifications] = useState([]); // Initialize notifications state
  const [loading,setLoading]= useState(false);

  const [isAuthenticate,setIsAuthenticate] =useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      // Assuming you have the userId and token stored in local storage



      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token') || "hello";

      // Make sure userId and token are not null or undefined
      if (userId ) {
        setIsAuthenticate(true)
        // Set up Axios headers with the token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      
          // Make the Axios request to the getUser endpoint
          console.log(BASE_URL)
          setLoading(true)
          const response = await axios.get(`${BASE_URL}/user/getUser/${userId}`);
          
        console.log("here comes")
          setUser(response?.data);
          setLoading(false)
          // Do something with the user data
        
      } else {
        setLoading(false)
        console.error('userId or token not found in local storage');
        // Handle the case where userId or token is missing
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, [isAuthenticate]);

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        setLoading,
        setUser,
        tasks,
        setTasks,
        selectedTeam,
        setSelectedTeam,
        openDrawer,
        setOpenDrawer,
        notifications,
        setNotifications,
        isAuthenticate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
