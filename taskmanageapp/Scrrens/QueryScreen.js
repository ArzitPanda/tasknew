import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  Text,
  View,
  Input,
  TextArea,
  Button,
  List,
  ListItem,
  Icon,
  Select,
  Table,
  TableView,
  Thead,
  Tbody,
  Tr,
  Th,
  ScrollView,
  Card,
  Avatar,
  Tag,
  Pressable,
Actionsheet,
VStack,
Box,
Divider,
KeyboardAvoidingView,
Switch
} from "native-base";
import axios from "axios";
import { BASE_URL } from "../Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../Hooks/AppContext";
import {Keyboard} from 'react-native'
import { MaterialCommunityIcons ,AntDesign} from "@expo/vector-icons";
import { Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
const QueryScreen = () => {
  const context = useContext(AppContext);

  const { user } = context;
  console.log(user, "here in query screen");
  const initialTeamData = user?.Teams.map((ele) => {
    return { title: ele.teamName, key: ele._id };
  });
  const [teamdata, setTeamData] = useState(initialTeamData);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [queries, setQueries] = useState([]);
  const [filterBy, setFilterBy] = useState("From");
  const [formData, setFormData] = useState({
    From: "",
    To: "",
    Task: "",
    question: "",
    Type: "",
  });
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { openNotification } = context;

  useEffect(() => {
    fetchQueries();
  }, [filterBy]);
  const fetchQueries = async () => {
    try {
      const queryParams = { ...(filterBy && { [filterBy]: user._id }) };
      const response = await axios.get(BASE_URL + "/query/api/taskqueries", {
        params: queryParams,
      });
      setQueries(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching TaskQueries:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    console.log(formData,"formdata here for",name,value)
  };

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const data = {
        To: formData.To,
        From: userId,
        Task: formData.Task,
        question: formData.question,
        Type: formData.Type,
      };
      console.log(data)
      const response = await axios.post(BASE_URL + "/query/api/query", data);
      console.log(response.data);
      setIsInputVisible(false)
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    setFormData({
      From: "",
      To: "",
      Task: "",
      question: "",
      Type: "",
    });
  };

  useEffect(() => {
    const { user } = context;
    const initialTeamData = user?.Teams.map((ele) => {
      return { title: ele.teamName, key: ele._id };
    });
    setTeamData(initialTeamData);
  }, [context]);

  const [queryAnswer, setQueryAnswer] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);

  const addAnswerToQuery = async () => {
    const taskqueryid = selectedQuery._id;
    const queryId = selectedQuery.queries[0]?._id;
    const answer = queryAnswer;
    try {
      const response = await axios.post(
        BASE_URL + `/query/api/taskquery/${taskqueryid}/${queryId}`,
        { answer }
      );
      console.log("Answer added successfully:", response.data);
      openNotification("Answer added successfully:", "Success");
      setQueryAnswer("");
      return response.data; // You can return any relevant data from the response if needed
    } catch (error) {
      openNotification("Error adding answer:", "Error");
      console.error("Error adding answer:", error);
      setQueryAnswer("");
      throw error; // Throw the error to handle it in the calling code
    }
  };
  const handleRowClick = (query) => {
    setSelectedQuery(query);
    setDrawerVisible(true);
  };

  const fetchTeamData = async (key) => {
    try {
      const response = await axios.get(`${BASE_URL}/team/team/get/${key}`);
      console.log(response.data, "fetching tasks at query page");
      setTasks(
        response.data?.tasks.map((ele) => {
          return { key: ele._id, title: ele.taskName };
        })
      );
      setMembers(
        response.data?.teamMembers.map((ele) => {
          return { key: ele._id, title: ele.name };
        })
      );
      return response.data?.tasks;

      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching team data:", error);
      return [];
      // Handle errors
    }
  };
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };


  const [contentHeight, setContentHeight] = useState(500);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setContentHeight(contentHeight+ 300); // Adjust based on your needs
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setContentHeight(contentHeight- 300);
    });
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  return (

<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
<View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Query</Text>
          <TouchableOpacity onPress={() => { 
          setIsInputVisible(true)
          }}>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        
        </View>
      </View>
    
    <ScrollView style={{ flex: 1 }}>
   

     <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:'space-between',padding:3,marginHorizontal:10,marginVertical:15}}>
     <Text>{filterBy==='To'?'You received':'Yous query'}</Text>
      <Switch
        
        onValueChange={(value) => {value?setFilterBy('To'):setFilterBy('From')}}
      />
     </View>
      {queries?.map((query) => {
        return (
          <Card
            marginX={2}
            backgroundColor={"white"}
            key={query._id}
            style={styles.queryContainer}
          >
            <Pressable onPress={() => handleRowClick(query)}>
              <View
                display={"flex"}
                flexDirection="row"
                alignItems="center"
                justifyContent={"space-between"}
              >
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar backgroundColor={"blue.300"}>
                    {query.From.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Text style={styles.queryText}>{query.From.name}</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    rowGap: 2,
                    justifyContent: "center",
                  }}
                >
                  <Avatar backgroundColor={"orange.300"}>
                    {query.To.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Text style={styles.queryText}>{query.To.name}</Text>
                </View>
              </View>
              <Text style={{ fontWeight: "700", fontSize: 20 }}>
                {query.Task.taskName}
              </Text>
              <View
                borderRadius={"2xl"}
                backgroundColor={"green.300"}
                style={{
                  width: "20%",
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 6, fontWeight: "600" }}>
                  {query.Type}
                </Text>
              </View>
            </Pressable>
          </Card>
        );
      })}



 <Actionsheet isOpen={isInputVisible} onClose={()=>{setIsInputVisible(false)}}>
      <Actionsheet.Content height={contentHeight}>
      
        <Text fontSize={25} fontWeight={'bold'} textAlign={'left'} width={'full'} marginY={4}color={'blue.600'} > Enter Your query</Text>
        <VStack space={4} width={'full'}> 
          <Select width="full" placeholder="Select Team" onValueChange={async (value) => {
            await fetchTeamData(value);
          }}>
            {teamdata?.map((ele) => (
              <Select.Item key={ele.key} value={ele.key} label={ele.title} />
            ))}
          </Select>
          <Select width="full" placeholder="Select Task" onValueChange={(value) => handleChange('Task', value)}>
            {tasks?.map((ele) => (
              <Select.Item key={ele.key} value={ele.key} label={ele.title} />
            ))}
          </Select>
          <Select width="full" placeholder="Select Member" onValueChange={(value) => handleChange( 'To', value)}>
            {members?.map((ele) => (
              <Select.Item key={ele.key} value={ele.key} label={ele.title} />
            ))}
          </Select>
          <Select width="full" placeholder="Select Type" onValueChange={(value) => handleChange('Type', value)}>
            {['UPDATE', 'HELP', 'ANNOUNCEMENT', 'GENERAL'].map((ele) => (
              <Select.Item key={ele} value={ele} label={ele} />
            ))}
          </Select>

 <Box bg="gray.100" rounded="md" p={2}> 

            <TextArea
              placeholder="Enter your question..."
              maxLength={100}
              onChangeText={(text) => handleChange( 'question', text)}
            />
           
          </Box>

        
       </VStack>
         <Divider my={2} />
        <Box flexDirection="row" width={'full'} justifyContent="space-between">
          <Button variant="ghost" onPress={() => { setIsInputVisible(false)}}>Cancel</Button>
          <Button color={'blue.500'} onPress={handleSubmit}>Submit</Button>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
      <Drawer
        isOpen={drawerVisible}
        placement="top"
        onClose={() => setDrawerVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingTop: 15,
            marginHorizontal: 10,
            marginTop: 100,
            minHeight: Dimensions.get("screen").height / 2,
            borderRadius:5,
            display:'flex',
            justifyContent:"space-between"
          }}
        >
            <View>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerHeaderText}>
              {selectedQuery?.queries[0]?.request || "Query Details"}
            </Text>
          </View>

          {selectedQuery?.queries[0]?.answer ? (
            selectedQuery?.queries[0]?.answer?.map((ans, index) => (
              <View key={index} style={styles.listItem}>
                <Text>{ans}</Text>
              </View>
            ))
          ) : (
            <View style={styles.listItem}>
              <Text>Not any Query's answer yet</Text>
            </View>
          )}
</View>
       <View>
       <Input
       variant={'unstyled'}
            style={styles.input}
            placeholder="Type your answer..."
            value={formData.queryAnswer}
            onChangeText={(text) => handleChange("queryAnswer", text)}
          />
          <Button style={{...styles.button,borderColor:'black',borderWidth:1}} onPress={handleSubmit}>
            <Text>Add Answer</Text>
          </Button>
       </View>
        </View>
      </Drawer>
    </ScrollView>
</SafeAreaView>
  );
};

const styles = {
  queryContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,

    display: "flex",

    justifyContent: "space-between",
    marginVertical: 5,
  },
  queryText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
    marginHorizontal: 4,
  },
  drawerHeader: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  input: {
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "white",
    
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
};

export default QueryScreen;
