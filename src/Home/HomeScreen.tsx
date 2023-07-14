import Logout from "../login/Logout";
import { Text, View } from "react-native";
import { useGetUserProfileQuery } from "../features/user/UserSlice";

export default function HomeScreen() {
  const { data: userprofile } = useGetUserProfileQuery();
  if (userprofile) {
    return (
    <View>
        <Text>{"hello " + userprofile.username + "!"}</Text>
        <Logout />
    </View>
    );
  } else {
    // throw Error("userprofile must not be null");
  }
}
