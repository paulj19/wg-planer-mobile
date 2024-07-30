import React, { ReactElement } from "react";
import {
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
import { Dialog, PaperProvider, Portal, Switch } from "react-native-paper";
import Button from "components/Button";

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
      <ConfirmDialog />
      <Switch
        value={myRoom.Resident.Available}
        onValueChange={() =>
          myRoom.Resident.Available ? setDialogVisible(true) : handleConfirm()
        }
      />
    </PaperProvider>
  );
}

