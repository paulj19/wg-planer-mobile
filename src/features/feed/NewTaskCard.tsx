import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {Voting} from "types/types";

type NewTaskCardProps = {
  voting: Voting;
  updateVoting: (any) => Promise<any>;
};

export default function NewTaskCard({voting, updateVoting}: NewTaskCardProps) {
  const handleAction = async (action) => {
    try {
      await updateVoting({voting, action});
    } catch (e) {
      console.error("Error accepting or decline voting for task create", e);
      ToastAndroid.show("An error occured, please try again later", ToastAndroid.SHORT);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.infos}>
        <Text style={styles.text}>{
          `Request to create new Task ${voting.Data}`}
        </Text>
      </View>
      <View style={styles.actions}>
        <IconButton  name="check" color="green" testID="accept" onPress={() => handleAction("ACCEPT")} />
        <IconButton  name="close" color="grey"  testID="reject" onPress={() => handleAction("REJECT")} />
      </View>
    </View>
  );
}
const IconButton = ({ name, color, onPress, testID }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} testID={testID}>
    <FontAwesome name={name} size={24} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
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
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
  },
  infos: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    maxWidth: 210,
  },
  text: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 15,
  }, 
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
  },
});
