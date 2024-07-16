import * as React from "react";
import { Avatar, Card, Text } from "react-native-paper";
import { ToastAndroid, View } from "react-native";
import Button from "components/Button";
import { StyleSheet } from "react-native";
import { Entypo } from '@expo/vector-icons';
import {useUpdateTaskMutation} from "features/registration/FloorSlice";
import {Task} from "types/types";

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

type TaskCardFeedProps = {
  task: Task;
  reminders: number;
  floorId: string;
};
// <Card style={{ borderRadius: 3 }}>
//   <Card.Title style={{paddingTop:20}}
//     title={taskName}
//   />
//   <Card.Actions style={{marginTop:-40}}>
//     <Button>DONE</Button>
//   </Card.Actions>
// </Card>
export default function TaskCardFeed({
  task,
  reminders,
  floorId
}: TaskCardFeedProps) {
  const [assignTask] = useUpdateTaskMutation();
  const handleTaskDone = async () => {
    //handle api call
    await assignTask({floorId, task: task, action: "DONE"}).unwrap()

    ToastAndroid.show("Task assinged next room", ToastAndroid.SHORT);
  }
  return (

    <View style={styles.taskCardContainer} testID="task-card">
      <Text style={styles.taskName}>{task.Name}</Text>
      {reminders > 0 ? <Reminders reminders={reminders} /> : null}
      <Button testID="done-button" onPress={handleTaskDone}>DONE</Button>
    </View>
  );
}

const Reminders = ({ reminders }) => {
  const backgroundColor = reminders > 1 ? "#ff704d" : "#ffcc00";
  return (
    <View style={styles.reminderContainer} testID="reminder">
      <View>
        <Entypo name="bell" size={24} color="black" />
      </View>
      <View style={[styles.reminders, { backgroundColor: backgroundColor, borderColor: backgroundColor }]}>
        <Text style={styles.reminderText}>{reminders}</Text>
      </View>
    </View>
  );
};

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
  reminderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  reminders: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    // borderColor: "#000",
    opacity: 0.7,
    padding: 5,
  },
  reminderText: {
    fontSize: 16,
    color: "#000",
    margin: "auto",
    fontWeight: "bold",
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
});
