import { useContext } from 'react';
import ThemeContext from '../ThemeProvider'; // Adjust the path as per your project structure
import { Badge, Button, Switch } from 'antd';
import { MdNotifications, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { AppContext } from '../layout';
import Image from 'next/image'
import BrandPng from "../../../public/BRAND.png"

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const {notifications,setOpenDrawer} =useContext(AppContext);

  const handleThemeToggle = (checked) => {
    toggleTheme();
  };



  const handleNotificationClick = () => {
    // Add your logic here to handle the click event
    console.log("Notification clicked");
    setOpenDrawer(true)
  };
  return (
    <div className={`${darkMode ? 'bg-[#141414]' : 'bg-white'} h-14 w-full flex items-center justify-between py-5 top-0 z-50  border-b-[1px] border-gray-200`}>
     
     <Image
      src="/brand_with_logo.png"
      className={`ml-6 ${darkMode?'filter invert-0':'invert'}`}
      width={150}
      height={`100`}
      alt="Picture of the author"
    />
      <div className="flex items-center justify-center gap-2 mx-2">
        <Switch
        style={{backgroundColor:'gray',caretColor:'blue'}}
          checked={darkMode}
          onChange={handleThemeToggle}
          checkedChildren={<MdOutlineDarkMode size={24}   style={{ fill: '#FFFFFF', width: '20px', height: '24px',textAlign:'center', }}/>}
          unCheckedChildren={<div className='flex items-center justify-center'><MdOutlineLightMode size={24}   style={{ fill: '#FFFFFF', width: '20px', height: '24px',textAlign:'center' }}/></div>}
        />
        <Button type='text' icon={<Badge count={notifications?.length}><MdNotifications size={24} onClick={handleNotificationClick} color={darkMode?'white':'black'} /></Badge>}/>
          
      </div>
    </div>
  );
};

export default Header;
