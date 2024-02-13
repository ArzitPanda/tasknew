'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import AuthenticationProvider from "@/app/AuthenticationProvider";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./Constant";
import { io } from "socket.io-client";
import { Button, Card, Drawer, Space } from "antd";
import  {useSwipeable}  from "react-swipeable"; 
const inter = Inter({ subsets: ["latin"] });


export const AppContext = createContext();
export default function RootLayout({ children }) {


  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
   
  });



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






const [subscription, setSubscription] = useState(null);

useEffect(() => {
  // Check if the browser supports service workers and push notifications
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    // Register service worker
    navigator.serviceWorker.register('/service-worker.js',{scope:"/"})
      .then(registration => {
        console.log('Service Worker registered');

        // Subscribe user to push notifications
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BJKNf4xgCw1YLwzA-1vj5JwCx8IEaGPPZOV-KINasQ6wbbmyC8euOqQhV7fYrwvgpjH-dwDXlYU0QDKFJtY6ZZ4'
        })
        .then(subscription => {
          console.log('User subscribed:', subscription);
          setSubscription(subscription);

          // Send subscription to server
          sendSubscriptionToServer(subscription);
        })
        .catch(error => {
          console.error('Failed to subscribe user:', error);
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }
}, []);


const [notifications,setNotifications]= useState([])

const socket = io('http://localhost:3001');


const handleNotificationClick = (notification) => {
  // Update the seen status of the clicked notification
  const updatedNotifications = notifications.map((item) => {
    if (item.id === notification.id) {
      return { ...item, seen: true }; // Set seen to true for the clicked notification
    }
    return item;
  });

  // Update the state with the updated notifications
  setNotifications(updatedNotifications);
};
const handleSwipe = (notification) => {
  // Filter out the notification that is being swiped
  const updatedNotifications = notification.filter(
    (item) => item.id !== notification.id
  );
  // Update the state with the updated notification list
  setNotifications(updatedNotifications);
};

useEffect(() => {
  // Establish a connection to the Socket.IO server
  // Adjust URL as needed

  const id  = localStorage.getItem("userId")
  socket.emit('joinRoom', id);
  // Listen for 'taskAssigned' event
  socket.on('Notification', (data) => {
    // Handle the task assigned event
    console.log('New task assigned:', data);
      setNotifications([...notifications,{...data,seen:false}])
    // Update tasks state with the new task
  
  });

  // Clean up socket connection when component unmounts
  return () => {
    socket.disconnect();
  };
}, [socket]);



const sendSubscriptionToServer = (subscription) => {
  // Send subscription object to your server using Axios

  const userId = localStorage.getItem('userId');
  axios.post(BASE_URL+'/api/save-push-subscription', { subscription ,id:userId })
    .then(response => {
      if (response.status === 200) {
        console.log('Push subscription sent to server');
      } else {
        console.error('Failed to send push subscription to server');
      }
    })
    .catch(error => {
      console.error('Error sending push subscription to server:', error);
    });
};



const [openDrawer,setOpenDrawer] =useState(false);
const onClose =()=>{

  setOpenDrawer(false)
}

  return (

    <html lang="en">
      <AuthenticationProvider>
     <AppContext.Provider  value ={{user,setUser,Tasks,SelectedTeam,setSelectedTeam,setOpenDrawer,notifications}} >
     <body className={inter.className}>{children}</body>
     <Drawer
      title="Notifications"
      placement="right"
      width={500}
      onClose={onClose}
      visible={openDrawer}
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose} className="mr-2">
            Close
          </Button>
        </div>
      }
    >
      {notifications.map((notification, index) => (
      
          <Card
        
            className={`mb-4 ${notification.seen ? 'bg-gray-200' : 'bg-blue-200'}`}
            onClick={() => handleNotificationClick(notification)}
          >
            {notification.type === 'Task' ? (
              <>
                <h4 className="font-semibold">New Task Assigned:</h4>
                <p>{notification.data.taskName}</p>
                <p>{notification.data.description}</p>
              </>
            ) : (
              <>
                <h4 className="font-semibold">You've been added to a new Team:</h4>
                <p>{notification.data.teamName}</p>
                <p>{notification.data.description}</p>
              </>
            )}
          </Card>
      
      ))}
    </Drawer>


     </AppContext.Provider >
     </AuthenticationProvider>
    </html>
  );
}
