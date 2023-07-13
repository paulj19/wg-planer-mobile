import Logout from "../login/Logout";
import { Text, View } from "react-native";
import { useGetUserProfileQuery } from "../features/user/UserSlice";

export default function HomeScreen() {
  const { data: userprofile, isLoading, isSuccess } = useGetUserProfileQuery();
  return (
    <View>
      {}
      <Text>{"home screen"}</Text>
      <Logout />
    </View>
  );
}
