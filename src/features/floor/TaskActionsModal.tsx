import Button from "components/Button";
import React, { useState } from "react";
import { ToastAndroid, View } from "react-native";
import { Text } from "react-native";
import { Modal, Portal, Provider as PaperProvider } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useGetPostLoginInfoQuery, useRemindTaskMutation } from "features/registration/FloorSlice";
import Loading from "components/Loading";
import { useUpdateTaskMutation } from "features/registration/FloorSlice";

export default function TaskActionsModal({ route, navigation }) {
  const { taskId } = route.params;
  const { data, isLoading, isError, error } =
    useGetPostLoginInfoQuery(undefined);
  const [assignTask] = useUpdateTaskMutation();
  const [remindTask] = useRemindTaskMutation();

  const task = data.floor?.Tasks.find((task) => task.Id === taskId);

  const handleUnassignTask = async () => {
    await assignTask({
      floorId: data.floor.Id,
      task,
      action: "UNASSIGN",
    }).unwrap();

    ToastAndroid.show("Task unassigned", ToastAndroid.SHORT);
    navigation.navigate("AllTasks");
  };

  const handleRemindTask = async () => {
  try {
    await remindTask({
      floorId: data.floor.Id,
      task,
      action: "REMIND",
    }).unwrap();

    ToastAndroid.show("Reminder sent", ToastAndroid.SHORT);
    navigation.navigate("AllTasks");
  } catch (error) {
    console.error("Error reminding task ", error);
    ToastAndroid.show(
      "Error reminding task, please refresh or try again later",
      ToastAndroid.SHORT
    );
  };
  }

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
      {task.assignedTo !== -1 ? (
        <>
          <Button onPress={() => {handleRemindTask}}>REMIND</Button>
          <Button onPress={() => navigation.navigate("AssignTask", { taskId })}>
            REASSIGN
          </Button>
          <Button onPress={handleUnassignTask}>UNASSIGN</Button>
        </>
      ) : (
        <Button onPress={() => navigation.navigate("AssignTask", { taskId })}>
          ASSIGN
        </Button>
      )}
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
