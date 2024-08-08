import {
  useCreateTaskMutation,
  useGetPostLoginInfoQuery,
} from "features/registration/FloorSlice";
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from "react-native";
import TaskCardFloor from "./TaskCardFloor";
import type { Room } from "types/types";
import Loading from "components/Loading";
import { useCallback, useRef, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { ScrollViewWithRefresh } from "components/ScrollViewWithRefresh";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, TextInput } from "react-native";
import { Dialog, PaperProvider, Portal } from "react-native-paper";
import Button from "components/Button";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function AllTasks() {
  const { data, isLoading, isError, error, refetch } =
    useGetPostLoginInfoQuery(undefined);
  const [createTask, { isLoading: createTaskIsLoading }] =
    useCreateTaskMutation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const inputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

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
  let assignedTo: Room | undefined;
  const handleCreateTask = async () => {
    try {
      if (!inputRef.current.value) {
        ToastAndroid.show("Please enter task name", ToastAndroid.SHORT);
        return;
      }

      await createTask({ Task: {Name: inputRef.current.value} });
      setDialogVisible(false);
      ToastAndroid.show(
        "Task put for voting, when another resident accepts voting request, task will be created!",
        ToastAndroid.SHORT
      );
    } catch (e) {
      console.error("Error creating task", e);
      ToastAndroid.show("Error creating task", ToastAndroid.SHORT);
    }
  };

  const DisplayCodeDialog = () => {
    return (
      <View>
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            style={{minHeight: 200, justifyContent: "center"}}
          >
            {createTaskIsLoading ? (
              <ActivityIndicator animating={true} />
            ) : (
              <>
                <Dialog.Title>Create a new task</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    style={{
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 3,
                      padding: 5,
                    }}
                    placeholder="Task name"
                    ref={inputRef}
                    // @ts-ignore
                    onChangeText={(text) => (inputRef.current.value = text)}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={handleCreateTask}>Create</Button>
                  <Button
                    onPress={() => {
                      setDialogVisible(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Dialog.Actions>
              </>
            )}
          </Dialog>
        </Portal>
      </View>
    );
  };

  return (
    <PaperProvider>
      <ScrollViewWithRefresh refetch={refetch}>
        {data?.floor?.Tasks?.map((task) => {
          assignedTo =
            task.AssignedTo !== -1
              ? data.floor?.Rooms?.find((room) => room.Id === task.AssignedTo)
              : undefined;
          return task.Status === "PENDING" ? (
            <Text>{`${task.Name} Task is pending`}</Text>
          ) : (
            <TaskCardFloor
              task={task}
              assignedTo={assignedTo}
              floorId={data.floor.Id}
              myId={data.userprofile.id.toString()}
              key={task.Id}
            />
          );
        })}
        <TouchableOpacity
          onPress={() => setDialogVisible(true)}
          style={{ alignItems: "center" }}
        >
          <MaterialIcons name="add-circle" size={24} color="black" />
        </TouchableOpacity>
        <DisplayCodeDialog />
      </ScrollViewWithRefresh>
    </PaperProvider>
  );
}
