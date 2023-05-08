import { Button, View } from "react-native";
import Login from "./login/Login";

export default function EntryScreen({ route, navigation }) {
  return (
    <View>
      <View>
        <Login {...{ navigation, route }} />
      </View>
      <Button
        title="REGISTER"
        onPress={() => navigation.navigate("RegistrationForm")}
      />
    </View>
  );
}
