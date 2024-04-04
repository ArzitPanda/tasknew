import ThemeContext from '@/app/ThemeProvider';
import React, { useContext, useEffect, useState } from 'react'

const useColor = () => {
    const { darkMode } = useContext(ThemeContext);

    const [colors,setColors] = useState();
    useEffect(() => {

  setColors({
    PrimarybgColor: darkMode ? 'bg-slate-900' : 'bg-white',
    SecondarybgColor: darkMode ? 'bg-slate-800' : 'bg-slate-100',
    TertbgColor:darkMode ? 'bg-slate-700' : 'bg-slate-200',
    primary: darkMode ? 'text-blue-500' : 'text-blue-700',
    secondary: darkMode ? 'text-gray-400' : 'text-gray-600',
    button: darkMode ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-700',
    input: darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-400',
    tertiary: darkMode ? 'text-red-500' : 'text-red-700',
    modal: darkMode ? 'bg-gray-800' : 'bg-white',
    primaryText: darkMode ? 'text-white' : 'text-black',
    secondaryText: darkMode ? 'text-gray-400' : 'text-gray-600',
    borderColor: darkMode ? 'border-gray-700' : 'border-gray-300',
});




    },[darkMode]);

    // Define colors based on the current theme mode
 

    return colors;
};

export default useColor