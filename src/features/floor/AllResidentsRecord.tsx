import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Button from "components/Button";
import { StyleSheet, View, Text, ToastAndroid } from "react-native";
import { Checkbox } from "react-native-paper";
import { Resident, Room } from "types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function AllResidentsRecord({ room }: { room: Room }) {
  return (
    <View style={styles.container}>
      {room.Resident === null ? (
        <TouchableOpacity>
          <MaterialCommunityIcons.Button name="plus-circle" size={24} color="black" backgroundColor="white" style={styles.addResident}> ADD </MaterialCommunityIcons.Button>
        </TouchableOpacity>
      ) : (
        <Text style={styles.residentName}>{room.Resident?.Name}</Text>
      )}
      <Text>{room.Number}</Text>
      {room.Resident?.Available ? (
        <FontAwesome name="check-circle" size={24} color="green" />
      ) : (
        <MaterialCommunityIcons name="close-circle" size={24} color="red" />
      )}
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
  addResident: {
    width: 120,
  },
});
