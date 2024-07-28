import { ReactElement } from "react";
import { Platform, Switch, Text, ToastAndroid, View } from "react-native";
import {
  useUpdateAvailabilityStatusMutation,
  useGetPostLoginInfoQuery,
} from "features/registration/FloorSlice";
import Loading from "components/Loading";

export function Settings(): ReactElement {
  const [updateAvailabilityStatus] = useUpdateAvailabilityStatusMutation();
  const { data, isLoading, isError, error, refetch } =
    useGetPostLoginInfoQuery(undefined);

  let userId;
  if (Platform.OS === "ios") {
    userId = 1;
  } else {
    userId = 2;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.error("Error loading floor data ", error);
    ToastAndroid.show(
      "Error loading page, please refresh or try again later",
      ToastAndroid.SHORT
    );
  }

  const myRoom = data.floor?.Rooms?.find(
    (room) => room.Resident?.Id === userId.toString()
  );

  const handleAvailabilityStatusChange = async () => {
    //are you sure?
    await updateAvailabilityStatus({
      action: myRoom.Resident.Available
        ? "RESIDENT_UNAVAILABLE"
        : "RESIDENT_AVAILABLE",
    }).unwrap();
    ToastAndroid.show("Set to unavailable", ToastAndroid.SHORT);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={myRoom.Resident.Available ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleAvailabilityStatusChange}
        value={myRoom.Resident.Available}
      />
    </View>
  );
}
