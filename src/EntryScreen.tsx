import { Button } from "react-native";
import Login from "./login/Login";

export default function EntryScreen({ route, navigation }) {
  return (
    <div>
      <div>
        <Login {...{ navigation, route }} />
      </div>
      <Button
        title="REGISTER"
        onPress={() => navigation.navigate("RegistrationForm")}
      />
    </div>
  );
}
