import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import ProfileEditScreen from './ProfileEditScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator  screenOptions={{headerShown:false}}>
      
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;