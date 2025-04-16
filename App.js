import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "@react-navigation/elements";
import { ListScreen } from "./Components/ListScreen";
import { DetailsScreen } from "./Components/DetailsScreen";
import { Layout } from "./Styles/Layout";

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={[Layout.h1, { marginBottom: 20 }]}>Ålands Lagting</Text>
      <Image
        style={styles.image}
        source={require("./assets/lagtinget_image.jpg")}
      />
      <Text style={styles.title}>Det självstyrda Ålands parlament</Text>
      <Text style={styles.text}>
        Självstyrelsen ger ålänningarna möjlighet att själva stifta lagar om
        sina inre angelägenheter. Ålands lagting är det folkvalda parlamentet.
      </Text>
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
    headerStyle: { backgroundColor: "seablue" },
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
  image: {
    width: "100%",
    height: 300,
  },
  text: {
    marginHorizontal: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "bold",
  },
});
