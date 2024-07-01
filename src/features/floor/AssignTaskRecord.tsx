import { useNavigation } from "@react-navigation/native";
import Button from "components/Button";
import { StyleSheet, View, Text, ToastAndroid } from "react-native";
import { Resident, Room } from "types/types";

export function AssignTaskRecord({ room }: { room: Room }) {
  const navigation = useNavigation();
  const handleAssignTask = () => {
    //handle api call
    ToastAndroid.show("Task assigned", ToastAndroid.SHORT);
    navigation.navigate("AllTasks");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.residentName}>{room.Resident?.Name}</Text>
      <Text>{room.Number}</Text>
      <Button onPress={handleAssignTask}>ASSIGN</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
  },
  residentName: {
    width: 120,
  },
});
