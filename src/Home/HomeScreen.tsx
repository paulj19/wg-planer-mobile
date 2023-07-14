import Logout from "../login/Logout";
import { Text, View } from "react-native";
import { useGetUserProfileQuery} from "../features/user/UserSlice";
// import {useGetXXXQuery } from "../features/api/apiSlice";

export default function HomeScreen() {
  const { data: userprofile, isLoading, isSuccess } = useGetUserProfileQuery();
  // const { data: xxx} = useGetXXXQuery();
  console.log("USER", userprofile);
  // console.log("xxx", xxx);
  return (
    <View>
      {}
      <Text>{"home screen"}</Text>
      <Logout />
    </View>
  );
}
