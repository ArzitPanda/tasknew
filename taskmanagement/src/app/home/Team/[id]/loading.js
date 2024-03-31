import React from 'react';
import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <Spin size="large" />
    </div>
  )
}

export default Loading