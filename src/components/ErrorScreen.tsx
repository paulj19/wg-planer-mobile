import { ReactElement } from "react";
import { View, Text } from "react-native";

type ErrorScreenProps = {
  errorMsg?: string;
};
export function ErrorScreen({errorMsg} : ErrorScreenProps): ReactElement {
  return (
    <View
      style={{
        padding: 20,
        marginTop: "60%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Text>{errorMsg ?? "An error occurred, please try again later."}</Text>
    </View>
  );
}
