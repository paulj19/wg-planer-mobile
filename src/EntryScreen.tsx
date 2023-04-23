import { Button } from "react-native";
import { RegistrationForm } from "../src/RegistrationForm";
import Login from "./login/Login";

export default function EntryScreen({ route, navigation }) {
  const { setIsTokenLoaded } = route.params;
  function navigateToRegisterScreen() {}
  return (
    <div>
      <div>
        <Login setIsTokenLoaded={setIsTokenLoaded} />
      </div>
      <Button title="REGISTER" onPress={() => navigateToRegisterScreen} />
      <div>
        <RegistrationForm />
      </div>
    </div>
  );
}
