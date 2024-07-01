import Button from "components/Button";
import React, { useState } from "react";
import { ToastAndroid, View } from "react-native";
import { Text } from "react-native";
import { Modal, Portal, Provider as PaperProvider } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useGetPostLoginInfoQuery } from "features/user/UserSlice";
import Loading from "components/Loading";

export default function TaskActionsModal({ route, navigation }) {
  const { taskId } = route.params;
  const { data, isLoading, isError, error } =
    useGetPostLoginInfoQuery(undefined);

  const assignedTo = data.floor?.Tasks.find(
    (task) => task.Id === taskId
  ).AssignedTo;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.error("Error loading floor data ", error);
    ToastAndroid.show(
      "Error loading page, please refresh or try again later",
      ToastAndroid.SHORT
    );
  }

  return (
    <View style={styles.container}>
      {assignedTo !== null ? (
        <Button onPress={() => navigation.navigate("AssignTask", { taskId })}>
          REASSIGN
        </Button>
      ) : null}
      <Button>DELETE</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "white",
    height: "100%",
  },
});
