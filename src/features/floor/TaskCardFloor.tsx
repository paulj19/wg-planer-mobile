import * as React from "react";
import {
  Avatar,
  Card,
  Divider,
  Menu,
  Text,
  Button as PaperButton,
  PaperProvider,
  Portal,
} from "react-native-paper";
import {
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  ToastAndroid,
  Platform,
} from "react-native";
import { StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Room, Task } from "types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "components/Button";
import { ScrollView } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRemindTaskMutation } from "features/registration/FloorSlice";

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

type TaskCardFloorProps = {
  task: Task;
  assignedTo: Room | undefined;
  floorId: string;
  myId: string;
};

export default function TaskCardFloor({
  task,
  assignedTo,
  floorId,
  myId,
}: TaskCardFloorProps) {
  const assignedName = assignedTo?.Resident?.Name?.split(" ")[0] || undefined;
  const navigation = useNavigation();
  const [remindTask] = useRemindTaskMutation();

  const handleRemindTask = async () => {
    try {
      await remindTask({
        floorId,
        task,
        action: "REMIND",
      }).unwrap();

      ToastAndroid.show("Reminder sent", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error reminding task ", error);
      ToastAndroid.show(
        "Error reminding task, please refresh or try again later",
        ToastAndroid.SHORT
      );
    }
  };

  let userId;
  if (Platform.OS === "ios") {
    userId = "1";
  } else {
    userId = "2";
  }

  //TODO put it back
  // {assignedTo && assignedTo.Resident?.Id !== myId ? (
  return (
    <View style={styles.taskCardContainer} testID="task-card">
      <Text style={styles.taskName}>{task.Name}</Text>
      <Text style={styles.assignedTo}>{assignedName ?? "unassigned"}</Text>
      {assignedTo && assignedTo?.Resident?.Id !== userId ? (
        <Button onPress={handleRemindTask}>REMIND</Button>
      ) : (
        <Button
          testID="assign-remind-button"
          onPress={() => navigation.navigate("AssignTask", { taskId: task.Id })}
        >
          {assignedTo ? "REASSIGN" : "ASSIGN"}
        </Button>
      )}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("TaskActionsModal", { taskId: task.Id })
        }
      >
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 1,
    marginBottom: 1,
    height: 85,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    // borderColor: "#838383",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
  },
  assignedTo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    fontSize: 16,
    color: "#000",
    margin: "auto",
  },
  reminderLabel: {
    fontSize: 13,
    color: "#838383",
    fontWeight: "light",
  },
  taskName: {
    fontSize: 18,
    maxWidth: 140,
    width: 140,
  },
  centeredViewModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    gap: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 400,
    width: "80%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
