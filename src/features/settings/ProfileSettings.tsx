import React, { ReactElement } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {
  useUpdateAvailabilityStatusMutation,
  useGetPostLoginInfoQuery,
} from "features/registration/FloorSlice";
import Loading from "components/Loading";
import { Dialog, Divider, PaperProvider, Portal, Switch } from "react-native-paper";
import Button from "components/Button";
import { ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import InfoText from "./InfoText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function Settings(): ReactElement {
  const [updateAvailabilityStatus] = useUpdateAvailabilityStatusMutation();
  const [dialogVisible, setDialogVisible] = React.useState(false);
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

  const handleConfirm = async () => {
    setDialogVisible(false);
    const successMsg = !myRoom.Resident.Available
      ? "You are now available to take tasks"
      : "Your are now unavailable to take tasks. Your current tasks have been assigned to next available resident.";
    await updateAvailabilityStatus({
      action: myRoom.Resident.Available
        ? "RESIDENT_UNAVAILABLE"
        : "RESIDENT_AVAILABLE",
    }).unwrap();
    ToastAndroid.show(successMsg, ToastAndroid.SHORT);
  };

  const ConfirmDialog = () => {
    return (
      <View>
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>
              Are you sure to change the Availability Status?
            </Dialog.Title>
            <Dialog.Content>
              <Text>
                If you set yourself to unavailable, then all your current tasks
                will be assigned to next available resident.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleConfirm}>Confirm</Button>
              <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };

  return (
    <PaperProvider>
      <ScrollView>
        <View style={styles.headerContainer}>
          <View style={styles.userRow}>
            <View style={styles.userImage}>
              <Text style={styles.userNameAvatar}>
                {data.userprofile.username.charAt(0)}
              </Text>
            </View>
            <View style={styles.userNameRow}>
              <Text style={styles.userNameText}>
                {data.userprofile.username}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <InfoText text="Account" />
          <ListItem>
            <MaterialIcons name="email" size={24} color="black" />
            <ListItem.Content>
              <ListItem.Title>{data.userprofile.email}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <Divider />
          <ListItem>
            <FontAwesome5 name="umbrella-beach" size={24} color="black" />
            <ListItem.Content>
              <ListItem.Title>Available</ListItem.Title>
            </ListItem.Content>
            <Switch
              value={myRoom.Resident.Available}
              onValueChange={() =>
                myRoom.Resident.Available
                  ? setDialogVisible(true)
                  : handleConfirm()
              }
            />
          </ListItem>
        </View>
        <ConfirmDialog />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 10,
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
    backgroundColor: "#f0f0f0",
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: "#5B5A5A",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userRow: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 12,
  },
  userNameAvatar: {
    color: "#000",
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    margin: "auto",
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: "#ECECEC",
  },
});
