import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Button from "components/Button";
import { StyleSheet, View, Text, ToastAndroid } from "react-native";
import { Checkbox } from "react-native-paper";
import { Resident, Room } from "types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

export default function AllResidentsRecord({
  room,
  generateCode,
  setCode,
}: {
  room: Room;
  generateCode: any;
  setCode: any;
}) {
  const handleGenerateCode = async () => {
    try {
      const code = await generateCode({ Room: room })
        .unwrap()
        .then((res) => setCode(res.code))

      console.log("Code generated", code);
    } catch (e) {
      console.error("Error generating code", e);
      ToastAndroid.show(
        "Error adding new user, please try again later",
        ToastAndroid.SHORT
      );
    }
  };
  return (
    <View style={styles.container}>
      {!room.Resident?.Id ? (
        <TouchableOpacity>
          <MaterialIcons.Button
            name="person-add"
            size={24}
            color="black"
            backgroundColor="white"
            style={styles.addResident}
            onPress={handleGenerateCode}
          >
            ADD
          </MaterialIcons.Button>
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

// room.Resident === null ? (
//   <TouchableOpacity>
//     <Text style={styles.addResident}>Add Resident</Text>
//     {<Ionicons name="person-add-sharp" size={24} color="black" />}
//   </TouchableOpacity>
