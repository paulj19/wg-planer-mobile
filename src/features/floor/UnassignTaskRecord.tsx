import { useNavigation } from "@react-navigation/native";
import Button from "components/Button";
import { StyleSheet, View, Text, ToastAndroid, Task } from "react-native";
import { Resident, Room } from "types/types";

export function UnassignTaskRecord({ task, floorId }: {task: Task, floorId: string}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
    width: 160,
  },
});
