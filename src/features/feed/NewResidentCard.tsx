import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type NewResidentCardProps = {
  name: string;
  room: string;
};

export default function NewResidentCard({ name, room }: NewResidentCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.infos}>
        <Text style={styles.text}>{
          `${name} would like to be admitted to room ${room}`}
        </Text>
      </View>
      <View style={styles.actions}>
        <IconButton  name="check" color="green" onPress={() => {}} />
        <IconButton  name="close" color="red" onPress={() => {}} />
      </View>
    </View>
  );
}
const IconButton = ({ name, color, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
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
    marginTop: 5,
    marginBottom: 10,
    height: 85,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
