import { StyleSheet } from "react-native";

export const memberEntry = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    marginVertical: 30,
    flextDirection: "row",
  },
  image: {
    width: 100,
    height: 150,
    backgroundColor: "gray",
    borderWidth: 0.2,
    borderColor: "gray",
  },
  title: {
    fontSize: 13,
    marginTop: 8,
    justifyContent: "center",
    color: "darkblue",
    fontStyle: "italic",
    textDecorationLine: "underline",
    fontFamily: "serif",
  },
});
