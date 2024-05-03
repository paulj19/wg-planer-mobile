import { Button, View } from "react-native";
import Login from "./Login";
import { Text, TouchableOpacity } from 'react-native';

export default function EntryScreen({ route, navigation }) {
  return (
    <View>
      <View>
        <Login{...{ navigation, route }} />
      </View>
      <Button
        title="REGISTER"
        onPress={() => navigation.navigate("RegistrationForm")}
      />
    <TouchableOpacity onPress={() => navigation.navigate('Create Floor')}>
      <Text>Go to Details</Text>
    </TouchableOpacity>
      
      

    </View>
  );
}
