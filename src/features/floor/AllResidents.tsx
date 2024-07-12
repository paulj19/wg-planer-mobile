import { useGetPostLoginyInfoQuery } from "features/registration/FloorSlice";
import { ToastAndroid, View, Text } from "react-native";
import Loading from "components/Loading";
import { Checkbox, DataTable, Divider } from "react-native-paper";
import Button from "components/Button";
import { ScrollView, StyleSheet } from "react-native";
import AllResidentsRecord from "features/floor/AllResidentsRecord";

export default function AllResidents() {
  const { data, isLoading, isError, error } =
    useGetPostLoginyInfoQuery(undefined);

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
        <Text>Availability</Text>
      </View>
      <Divider />
      {data.floor.Rooms?.map((room) => {
        return (
          <>
            <AllResidentsRecord room={room} />
            <Divider />
          </>
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
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  residentName: {
    width: 140,
  },
});
