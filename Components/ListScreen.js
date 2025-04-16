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

export const ListScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

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

  const getOrganization = async () => {
    try {
      const listResponse = await fetch(
        "https://api.lagtinget.ax/api/organization",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
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

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(query.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) return -1;
    if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) return 1;
    return 0;
  });

  return (
    <View style={styles.backGround}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Enter name"
          value={query}
          onChangeText={(text) => setQuery(text)}
        />
      </View>
      <View style={memberEntry.listContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={sortedData}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <ListItem.Content>
                <Avatar
                  containerStyle={memberEntry.image}
                  {...(item.image?.url
                    ? { source: { uri: item.image.url } }
                    : {
                        title: item.first_name?.[0] ?? "?",
                      })}
                />
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
