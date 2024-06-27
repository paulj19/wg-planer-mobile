import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type NewTaskCardProps = {
  creator: string;
  taskName: string;
};

export default function NewTaskCard({ creator, taskName}: NewTaskCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.infos}>
        <Text style={styles.text}>{
          `${creator} created a new task ${taskName}`}
        </Text>
      </View>
      <View style={styles.actions}>
        <IconButton  name="check" color="green" testID="accept" onPress={() => {}} />
        <IconButton  name="close" color="grey"  testID="reject" onPress={() => {}} />
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
