import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  StatusBar,
  Text,
} from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { memberEntry } from "../Styles/memberEntry";
import { Layout } from "../Styles/Layout";

//List screen shows a list of each currently active parliament member.
export const ListScreen = () => {
  const [isLoading, setLoading] = useState(true); //Checks if the API request is loading correctly
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  //API request that fetches each person entry in the persons API
  const getPersons = async () => {
    try {
      const listResponse = await fetch("https://api.lagtinget.ax/api/persons", {
        headers: {
          Accept: "application/json",
        },
      });
      const json = await listResponse.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPersons();
  }, []);

  //Filters person entries to only include currently active members
  //nameMatch will filter out data based on search in the search bar. For example: If you start typing a name, it will try and match your search. If not the list will be empty.
  const filteredData = data.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(query.toLowerCase());
    const isActive = Number(item.state) === 1;
    return nameMatch && isActive;
  });

  //Sorts the list from A-Z based on surname
  const sortedData = filteredData.sort((a, b) => {
    if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) return -1;
    if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) return 1;
    return 0;
  });

  return (
    <View style={styles.backGround}>
      <Text style={[Layout.h2, { marginTop: 20, textAlign: "center" }]}>
        List of parliament members
      </Text>

      {/*Search bar implementation.*/}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search for a member"
          value={query}
          onChangeText={(text) => setQuery(text)}
        />
      </View>

      {/*Member entry implementation.*/}
      <View style={memberEntry.listContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={sortedData}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3} //Shows 3 entries horizontally before switching to a new column.
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <ListItem.Content>
                <Avatar //Profile image implementation.
                  containerStyle={memberEntry.image}
                  {...(item.image?.url
                    ? { source: { uri: item.image.url } }
                    : {
                        title: item.first_name?.[0] ?? "?",
                      })}
                />
                {/*Pressable is a function similar to onPress(), but not tied to a buttton or a single element.*/}
                {/*If you press either the first name or last name of a person, it will display a seperate page with details about the specific member.*/}
                <Pressable
                  onPress={() =>
                    navigation.navigate("Details", { member: item })
                  }
                >
                  <Text style={memberEntry.title}>{item.last_name},</Text>
                  <Text style={memberEntry.title}>
                    {item.first_name} {">"}
                  </Text>
                </Pressable>
              </ListItem.Content>
            )}
          />
        )}
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backGround: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    fontSize: 40,
  },
  searchBar: {
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 20,
    height: 40,
    paddingLeft: 10,
    fontSize: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  row: {
    marginLeft: 25,
    marginBottom: 30,
  },
});
