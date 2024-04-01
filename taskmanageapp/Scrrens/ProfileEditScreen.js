import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Input, Button, Image, Alert } from 'native-base';
import axios from 'axios';
import dayjs from 'dayjs';
import { BASE_URL } from '../Constant';
import { AppContext } from '../Hooks/AppContext';
const UserDetailForm = () => {
  const [imageUrl, setImageUrl] = useState( null);
  const [imgData, setImgData] = useState(null);
  const [CurruserData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const contextData = useContext(AppContext);
  const user = contextData.user;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL+'/user/userdetails/'+user._id);
        const userData = response.data;
        setUserData(userData);
        setImageUrl(userData.profilePhoto);
        console.log(response.data);
        // Update form values here
        setFormData({
          ...formData,
          address: userData.address,
          certifications: userData.certifications.map(cert => ({
            name: cert.name,
            issuer: cert.issuer,
            issuedDate: cert.issuedDate,
            url: cert.url
          }))
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [contextData]);

  const handleImage = (file) => {
    setImgData(file.file.originFileObj);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file.file.originFileObj);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('profilePhoto', imgData);
    data.append('userId', userId);
    // Append other form data
    formData.address && Object.entries(formData.address).forEach(([key, value]) => {
      data.append(`address[${key}]`, value);
    });
    formData.certifications && formData.certifications.forEach((cert, index) => {
      Object.entries(cert).forEach(([key, value]) => {
        data.append(`certifications[${index}][${key}]`, value);
      });
    });

    try {
      const response = await axios.put(BASE_URL+'/user/userdetails', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(response.data.profilePhoto);
      Alert.alert('Success', 'User details submitted successfully');
      // Clear form after successful upload
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error uploading details');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: 'blue', fontSize: 20 }}>User Details</Text>
      <View>
        <Input
          type="file"
          onChange={handleImage}
        />
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            alt="Profile preview"
            style={{ width: '100%', height: 200 }}
          />
        ) : (
          <Text>Click or drag file to this area to upload</Text>
        )}
      </View>
      <View>
        {/* Render other form fields here */}
      </View>
      <Button onPress={handleSubmit}>Submit</Button>
    </View>
  );
};

export default UserDetailForm;
