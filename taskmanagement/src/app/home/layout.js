"use client";
import React, { useEffect, useState ,useContext, Suspense} from "react";
import { Layout, Menu, Modal } from "antd";
import { AppContext } from "../layout";
import {
  BookOutlined,
  DesktopOutlined,
  NotificationOutlined,
  QuestionOutlined,
  TeamOutlined,
  UngroupOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TaskForm from "../Components/TaskForm";
import Loading from "./loading";


const { Sider, Content } = Layout;

const Dashboard = ({ children }) => {
  const router = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isTaskVisible, setTaskVisible] = useState(false);
  const [TaskFormVisible, setTaskFormVisible] = useState(false);


const context = useContext(AppContext)
const [navigationKey,setNavigationKey] = useState("1"); 
  useEffect(() => {
    console.log("pathname is " + router.toLowerCase());

    if (router.startsWith("/home/Team")) {
      setNavigationKey("1")
      setTaskVisible(true);
    } else if(router.startsWith("/home/Profile")){
      setNavigationKey("2")
      setTaskVisible(false);
    }
    else if(router.startsWith("/home/Task")){
        setNavigationKey("4")

    }
    else if(router.startsWith("/home/Query"))
    {
      setNavigationKey("5")
    }
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderSidebarOrNavbar = () => {
    if (isMobile) {
      return (
        <Menu theme="dark" defaultSelectedKeys={[navigationKey]} mode="horizontal">
        
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link href="/home/Team"> Teams</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link href="/home/Profile"> Profile</Link>
          </Menu.Item>
          {isTaskVisible && (
            <Menu.Item
              key="4"
              icon={<BookOutlined />}
              onClick={() => {
                setTaskFormVisible(!TaskFormVisible);
              }}
            >
              Task
            </Menu.Item>
          )}

<Menu.Item key="1" icon={<DesktopOutlined />}>
<Link href="/Teams"> Zoom</Link>
          </Menu.Item>
        </Menu>

      );
    } else {
      return (
        <Sider collapsible theme="light" >
          <div className="logo" />
          <Menu   selectedKeys={[navigationKey]}  mode="inline">
           
            <Menu.Item key="1" icon={<TeamOutlined />}>
              <Link href="/home/Team"> Teams</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link href="/home/Profile"> Profile</Link>
            </Menu.Item>
          
            <Menu.Item key="3" icon={<NotificationOutlined />}>
              <div
              onClick={()=>{context.setOpenDrawer(true)}}
                className="flex items-center justify-between w-3/4"
              >
                <div>Notification</div>{" "}
                <div className="rounded-full h-full w-4 bg-red-900 text-white text-xs font-semibold text-center">
                {context.notifications?.length}
                </div>
              </div>
            </Menu.Item>
         
              <Menu.Item
                key="4"
                icon={<BookOutlined />}
              
              >
                  <Link href="/home/Task"> Tasks</Link>
              </Menu.Item>
              <Menu.Item
                key="5"
                icon={<QuestionOutlined />}
              
              >
                  <Link href="/home/Query"> Query</Link>
              </Menu.Item>

         

          </Menu>
        </Sider>
      );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {renderSidebarOrNavbar()}
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
        <Suspense fallback={<Loading/>} >
           
            {children}
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
