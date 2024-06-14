import * as React from "react";
import { Avatar, Card, Text } from "react-native-paper";
import { View } from "react-native";
import Button from "components/Button";
import { StyleSheet } from "react-native";

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

type TaskCardFeedProps = {
  taskName: string;
  reminders: number;
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
  taskName,
  reminders,
}: TaskCardFeedProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        marginTop: 5,
        marginBottom: 10,
        height: 85,
        backgroundColor: "#fff",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      }}
    >
      <Text style={styles.taskName}>{taskName}</Text>
      {reminders > 0 ? <Reminders reminders={reminders} /> : null}
      <Button>DONE</Button>
    </View>
  );
}

const Reminders = ({ reminders }) => {
  const backgroundColor = reminders > 1 ? "#ff704d" : "#ffcc00";
  return (
    <View style={styles.reminderContainer}>
      <Text style={styles.reminderLabel}>Reminders</Text>
      <View style={[styles.reminders, { backgroundColor: backgroundColor }]}>
        <Text style={styles.reminderText}>{reminders}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
reminderContainer: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
},
  reminders: {
    width: 40,
    height: 40,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#000",
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
