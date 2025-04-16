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

  //Fetches roles from the roles API, due to it being referenced in persons
  const getRoleById = async (id) => {
    const response = await fetch(`https://api.lagtinget.ax/api/roles/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();
    return data.title;
  };

  //Fetches organizations from the organizations API, due to it being referenced in persons
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

  //Enriching is adding human readable information to existing data.
  //In this case, for example: we are taking the organization/role id from the persons api and looking up details about the organization/role based on the id.
  const enrichBindings = async (bindings) => {
    const enriched = await Promise.all(
      //Promise.all waits for all async operations (lookups) to finish in parallel.
      bindings.map(async (binding) => {
        //Making a map to support multiple entries, like an array. This map takes out the role and organization title from the role/organization api and enrichs it to the person api
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
      const enrichedBindings = await enrichBindings(json.bindings || []); //Enriches the bindings
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

  //Fetches the starting date of each member, basically when they started their first membership.
  const getFirstBindingStartDate = () => {
    if (person?.bindings?.length > 0) {
      const firstBinding = person.bindings[0];
      return firstBinding.period_start
        ? new Date(firstBinding.period_start).toLocaleDateString()
        : "Unknown";
    }
    return "Unknown";
  };

  //Filters present memberships in the present memberships category
  const presentMemberships =
    person?.bindings?.filter((binding) => {
      const now = new Date();
      return !binding.period_end || new Date(binding.period_end) > now;
    }) || [];

  //Filters past memberships in the past memberships category
  const pastMemberships =
    person?.bindings?.filter((binding) => {
      const now = new Date();
      return binding.period_end && new Date(binding.period_end) <= now;
    }) || [];

  return (
    <ScrollView>
      <View style={Layout.container}>
        {person ? (
          <Text style={Layout.h1}>{person.name}</Text>
        ) : (
          <ActivityIndicator />
        )}
        <Text style={Layout.h3}>Medlem sedan {getFirstBindingStartDate()}</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : person ? (
          <ListItem containerStyle={{ alignItems: "flex-start" }}>
            <Avatar
              containerStyle={[Layout.image, { marginTop: 50 }]}
              {...(person.image?.url
                ? { source: { uri: person.image.url } }
                : {
                    title: person.first_name?.[0] ?? "?",
                  })}
            />
            {/* Details fetched with API, both from persons and organizations/roles*/}
            <ListItem.Content>
              <Text style={Layout.title}>Profession:</Text>
              <Text>{person.profession || "Not Specified"}</Text>
              <Text style={Layout.title}>E-mail:</Text>
              <Text>{person.email}</Text>
              <Text style={Layout.title}>Birthday:</Text>
              <Text>{person.birthday}</Text>
              <Text style={Layout.title}>Phone number:</Text>
              <Text>{person.phone || "Unknown"}</Text>
              <Text style={Layout.title}>
                Present memberships in committees:
              </Text>
              {presentMemberships.map((b, index) => (
                <View key={index}>
                  <Text>
                    {b.orgTitle} ({b.roleTitle})
                  </Text>
                  <Text>
                    •{" "}
                    {b.period_start
                      ? new Date(b.period_start).toLocaleDateString()
                      : "?"}
                    -{" "}
                  </Text>
                </View>
              ))}
              <Text style={Layout.title}>Past memberships in committees:</Text>
              {pastMemberships.map((b, index) => (
                <View key={`past-${index}`}>
                  <Text>
                    {b.orgTitle} ({b.roleTitle})
                  </Text>
                  <Text>
                    •{" "}
                    {b.period_start
                      ? new Date(b.period_start).toLocaleDateString()
                      : "?"}
                    -
                    {b.period_end
                      ? " " + new Date(b.period_end).toLocaleDateString()
                      : "?"}
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
