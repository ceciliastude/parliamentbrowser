import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Avatar, ListItem } from "react-native-elements";

export const DetailsScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getPersons = async () => {
    try {
      const response = await fetch("https://api.lagtinget.ax/api/persons.json");
      const json = await response.json();
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <Avatar
                rounded
                {...(item.image?.url
                  ? { source: { uri: item.image.url } }
                  : {
                      title: item.first_name?.[0] ?? "?",
                      containerStyle: { backgroundColor: "#bcbcbc" },
                    })}
              />
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>
                  {item.city || item.address || "Ingen adress"}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    justifyContent: "left",
  },
});
