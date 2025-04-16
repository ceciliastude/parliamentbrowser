import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "@react-navigation/elements";
import { ListScreen } from "./Components/ListScreen";
import { DetailsScreen } from "./Components/DetailsScreen";

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate("Members")}>
        Go to Members
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    //headerStyle: { backgroundColor: "seablue" },
  },
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Members: ListScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
