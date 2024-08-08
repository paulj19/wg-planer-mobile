import { useGetPostLoginInfoQuery } from "features/registration/FloorSlice";
import { ToastAndroid, View, Text } from "react-native";
import Loading from "components/Loading";
import {
  Checkbox,
  DataTable,
  Dialog,
  Divider,
  PaperProvider,
  Portal,
} from "react-native-paper";
import Button from "components/Button";
import { ScrollView, StyleSheet } from "react-native";
import AllResidentsRecord from "features/floor/AllResidentsRecord";
import { ScrollViewWithRefresh } from "components/ScrollViewWithRefresh";
import { useGenerateCodeMutation } from "features/user/UserSlice";
import { useState } from "react";
import { setStringAsync } from "expo-clipboard";

export default function AllResidents() {
  const [codeGenerated, setCode] = useState("");
  const { data, isLoading, isError, error, refetch } =
    useGetPostLoginInfoQuery(undefined);
  const [generateCode] = useGenerateCodeMutation();

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

  const handleCodeCopy = async () => {
    try {
      const copied = await setStringAsync(codeGenerated);
      if (!copied) {
        throw new Error("Error copying code");
      }
      ToastAndroid.show("Code copied to clipboard", ToastAndroid.SHORT);
      setTimeout(() => setCode(""), 1000);
    } catch (e) {
      console.error("Error copying code", e);
      ToastAndroid.show("Error copying code", ToastAndroid.SHORT);
    }
  };

  const DisplayCodeDialog = () => {
    return (
      <View>
        <Portal>
          <Dialog
            visible={codeGenerated === "" ? false : true}
            onDismiss={() => setCode("")}
          >
            <Dialog.Title style={styles.codeGenerated}>
              {codeGenerated}
            </Dialog.Title>
            <Dialog.Content>
              <Text>
               Please share this code with the new resident. The code is needed to sign up! It is valid for 20 minutes.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleCodeCopy}>Copy</Button>
              <Button onPress={() => setCode("")}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };

  //how to send code to dialog and save it for 10 min, when multiple codes/rooms are ther
  return (
    <PaperProvider>
      <DisplayCodeDialog />
      <ScrollViewWithRefresh
        refetch={refetch}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <DisplayCodeDialog />
          <Text style={styles.residentName}>Resident Name</Text>
          <Text>Room</Text>
          <Text>Availability</Text>
        </View>
        <Divider />
        {data.floor.Rooms?.map((room) => {
          return (
            <>
              <AllResidentsRecord
                room={room}
                generateCode={generateCode}
                setCode={setCode}
                key={room.Id}
              />
              <Divider />
            </>
          );
        })}
      </ScrollViewWithRefresh>
    </PaperProvider>
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
  codeGenerated: {
    textAlign: "center",
    fontSize: 24,
  },
});
