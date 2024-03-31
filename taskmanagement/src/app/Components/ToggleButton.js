import React, { useContext } from 'react';
import { Switch } from 'antd';

import { AppContext } from '../layout';

const ToggleButton = ({ onChange }) => {
  const { user } = useContext(AppContext);

  return (
    <Switch
      checkedChildren="To"
      unCheckedChildren="From"
      onChange={checked => onChange(checked ? "To" : "From")}
    />
  );
};

export default ToggleButton;