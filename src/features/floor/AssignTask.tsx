import { useGetPostLoginInfoQuery } from "features/user/UserSlice";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import Loading from "components/Loading";
import { ToastAndroid } from "react-native";
import { AssignTaskRecord } from "./AssignTaskRecord";
import { Divider } from "react-native-paper";
import Button from "components/Button";

export function AssignTask({route, params}) {
  const { data, isLoading, isError, error } =
    useGetPostLoginInfoQuery(undefined);
  const {taskId} = route.params;
  const assignedTo = data.floor?.Tasks?.find(
    (task) => task.Id === taskId
  )?.AssignedTo;

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.residentName}>Resident Name</Text>
        <Text>Room</Text>
      </View>
      <Divider />

      {data.floor?.Rooms?.filter((room)=> assignedTo !== room.Id).map((room) => {
        return (
          room.Resident?.Available && (
            <>
              <AssignTaskRecord room={room} />
              <Divider />
            </>
          )
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "white",
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    paddingLeft: 20,
  },
  residentName: {
    width: 140,
  },
});
