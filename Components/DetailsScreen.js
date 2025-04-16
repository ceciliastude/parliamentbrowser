import React, { useEffect, useState } from "react";

import {
  View,
  ActivityIndicator,
  Text,
  StatusBar,
  ScrollView,
} from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import { Layout } from "../Styles/Layout";

export const DetailsScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [person, setPerson] = useState(null);
  const route = useRoute();

  const personId = route.params?.member?.id;

  const getRoleById = async (id) => {
    const response = await fetch(`https://api.lagtinget.ax/api/roles/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();
    return data.title;
  };

  const getOrganizationNameById = async (id) => {
    const response = await fetch(
      `https://api.lagtinget.ax/api/organizations/${id}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    const data = await response.json();
    return data.title;
  };

  const enrichBindings = async (bindings) => {
    const now = new Date();
    const enriched = await Promise.all(
      bindings
        .filter((b) => !b.period_end || new Date(b.period_end) > now)
        .map(async (binding) => {
          const roleTitle = await getRoleById(binding.role);
          const orgTitle = await getOrganizationNameById(binding.organization);
          return {
            ...binding,
            roleTitle,
            orgTitle,
          };
        })
    );
    return enriched;
  };

  const getPersonById = async (id) => {
    try {
      const response = await fetch(
        `https://api.lagtinget.ax/api/persons/${id}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const json = await response.json();
      const enrichedBindings = await enrichBindings(json.bindings || []);
      setPerson({ ...json, bindings: enrichedBindings });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) {
      getPersonById(personId);
    }
  }, [personId]);

  return (
    <ScrollView>
      <View style={Layout.container}>
        <Text style={Layout.h1}>Namn</Text>
        <Text style={Layout.h2}>Politiskt Parti</Text>
        <Text style={Layout.h3}>Medlem sedan</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : person ? (
          <ListItem>
            <Avatar
              containerStyle={Layout.image}
              {...(person.image?.url
                ? { source: { uri: person.image.url } }
                : {
                    title: person.first_name?.[0] ?? "?",
                  })}
            />
            <ListItem.Content>
              <Text style={Layout.title}>E-mail:</Text>
              <Text>{person.email}</Text>
              <Text style={Layout.title}>Profession:</Text>
              <Text>{person.profession || "Classified"}</Text>
              <Text style={Layout.title}>Electoral district:</Text>
              <Text>{person.state || "Unknown"}</Text>
              <Text style={Layout.title}>
                Present memberships in committees:
              </Text>
              {person.bindings.map((b, index) => (
                <View key={index}>
                  <Text>
                    {b.orgTitle} ({b.roleTitle})
                  </Text>
                  <Text>
                    •{" "}
                    {b.period_start
                      ? new Date(b.period_start).toLocaleDateString()
                      : "?"}
                    -
                  </Text>
                </View>
              ))}
            </ListItem.Content>
          </ListItem>
        ) : (
          <Text>Person not found.</Text>
        )}
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
};
