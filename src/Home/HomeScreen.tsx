import Logout from "../login/Logout";
import { Text, View } from "react-native";
import { load } from "util/storage/Store";
import * as storage from "../../src/util/storage/Store";

export default function HomeScreen() {
  return (
    <View>
    {
  }
      <Text>{"home screen"}</Text>
      <Logout />
    </View>
  );
}
