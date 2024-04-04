import { useContext } from 'react';
import ThemeContext from '../ThemeProvider'; // Adjust the path as per your project structure
import { Switch } from 'antd';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const handleThemeToggle = (checked) => {
    toggleTheme();
  };

  return (
    <div className="bg-white h-10 w-full flex items-center justify-between py-5 fixed top-0 z-50 mb-16 border-b-[1px] border-gray-200">
      <h1 className="font-sans px-6 uppercase font-semibold text-slate-800">task management</h1>
      <div className="flex items-center justify-center gap-4 mx-12">
        <Switch
        style={{backgroundColor:'gray'}}
          checked={darkMode}
          onChange={handleThemeToggle}
          checkedChildren={<MdOutlineDarkMode size={24}   style={{ fill: '#FFFFFF', width: '24px', height: '24px' }}/>}
          unCheckedChildren={<MdOutlineLightMode size={24}   style={{ fill: '#FFFFFF', width: '24px', height: '24px' }}/>}
        />
      </div>
    </div>
  );
};

export default Header;
