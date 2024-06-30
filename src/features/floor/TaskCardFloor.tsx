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
import { TouchableOpacity, View, Modal, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Room, Task } from "types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "components/Button";
import { ScrollView } from "react-native";

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

type TaskCardFloorProps = {
  task: Task;
  assignedTo: Room | undefined;
};

export default function TaskCardFloor({
  task,
  assignedTo,
}: TaskCardFloorProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const assignedName = assignedTo?.Resident?.Name?.split(" ")[0] || undefined;

  return (
    <View style={styles.taskCardContainer} testID="task-card">
      <Text style={styles.taskName}>{task.Name}</Text>
      <Text style={styles.assignedTo}>{assignedName ?? "unassigned"}</Text>
      <Button testID="done-button">{assignedTo ? "REMIND" : "ASSIGN"}</Button>
      <TouchableOpacity onPress={() => setModalOpen(true)}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalOpen}
          onRequestClose={() => setModalOpen(false)}
        >
          <TouchableOpacity style={styles.centeredViewModal} onPressOut={() => setModalOpen(false)}>
            <View style={styles.modalView}>
              <View style={styles.centeredView}>
                <Button>REASSIGN</Button>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
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
  backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    width: "100%",
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
