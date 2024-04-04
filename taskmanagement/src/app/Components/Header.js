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
    <div className={`${darkMode ? 'bg-[#141414]' : 'bg-white'} h-14 w-full flex items-center justify-between py-5 top-0 z-50  border-b-[1px] border-gray-200`}>
      <h1 className={`font-sans px-6 uppercase font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>task management</h1>
      <div className="flex items-center justify-center gap-4 mx-12">
        <Switch
        style={{backgroundColor:'gray',caretColor:'blue'}}
          checked={darkMode}
          onChange={handleThemeToggle}
          checkedChildren={<MdOutlineDarkMode size={24}   style={{ fill: '#FFFFFF', width: '20px', height: '24px',textAlign:'center', }}/>}
          unCheckedChildren={<div className='flex items-center justify-center'><MdOutlineLightMode size={24}   style={{ fill: '#FFFFFF', width: '20px', height: '24px',textAlign:'center' }}/></div>}
        />
      </div>
    </div>
  );
};

export default Header;
