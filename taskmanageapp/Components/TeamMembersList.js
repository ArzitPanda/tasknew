import React from 'react';
import { FlatList, Box, Tag, Text, Icon, Pressable } from 'native-base';
 // Import your DesignationColorizer function
 import {MaterialCommunityIcons,FontAwesome,Entypo } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


const DesignationColorizer = (val) => {
    switch (val) {
      case 'MANAGER':
        return 'blue.400';
      case 'DEVELOPER':
        return 'orange.400';
      case 'CREATOR':
        return 'green.400';
      case 'INTERN':
        return 'yellow.400';
      default:
        return 'red.400';
    }
  };


const TeamMembersList = ({ teamMembers, handleRemoveUser, handleUserProfileView }) => {

    const Navigation = useNavigation();
  const renderItem = ({ item: member }) => (
    <Pressable key={member._id} p={2}
    
    onPress={() =>{Navigation.navigate("UserProfile",{_id:member._id})}}
    >
      <Tag

        bg={DesignationColorizer(member.designation)}
        rounded="full"
        // Call the provided handleUserProfileView function
      >
        <Text paddingX={2} fontWeight={'semibold'} >{member.name} ({member.designation})</Text>
        {handleRemoveUser && ( // Conditionally render remove button if a handler is provided
          <Icon as={Entypo} name="cross" size={5} ml={2} onPress={() => handleRemoveUser(member._id)} />
        )}
      </Tag>
    </Pressable>
  );

  return (
    <FlatList
      data={teamMembers}
      horizontal={true} // Set horizontal scrolling
      showsHorizontalScrollIndicator={false} // Hide scroll indicator for a cleaner look (optional)
      renderItem={renderItem}
      keyExtractor={(item) => item._id} // Efficient key extraction
    />
  );
};

export default TeamMembersList;