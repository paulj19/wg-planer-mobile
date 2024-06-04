import { View } from "react-native";
import { Button } from "react-native-paper";
import Login from "./Login";
import { Text, TouchableOpacity } from "react-native";

export default function EntryScreen({ route, navigation }) {
  return (
    <View
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: "auto",
      marginBottom: "auto",
      }}
    >
        <Login {...{ navigation, route }} />
      <Button
        mode="contained-tonal"
        style={{
          width: "75%",
        }}
        onPress={() => navigation.navigate("Create Floor")}
      >
        CREATE FLOOR
      </Button>
      <Button
        mode="contained-tonal"
        style={{
          width: "75%",
        }}
        onPress={() => navigation.navigate("RegistrationForm")}
      >
        SIGN UP
      </Button>
    </View>
  );
}
