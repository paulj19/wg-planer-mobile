import {useNavigation} from "@react-navigation/native";
import {useSubmitForgotPWCodeMutation} from "features/user/UserSlice";
import {ReactElement, useState} from "react";
import {Button, TextInput, View, Text, StyleSheet} from "react-native";
import {ToastAndroid} from "react-native";

export function EnterCode(): ReactElement {
  const [code, setCode] = useState("");
  const [submitCode, { data, error }] = useSubmitForgotPWCodeMutation();
  const navigation = useNavigation(); 

  const handleSubmitCode = async () => {
    try {
      await submitCode({
      code
      }).unwrap();

      navigation.navigate("ForgotPW_Reset");
    } catch (error) {
      console.error("Error entering password forgot", error);
      ToastAndroid.show(
        "Error sending code, please refresh or try again later",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Enter Code</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCode}
        value={code}
        placeholder="Code"
      />
      <Button title="Submit" onPress={handleSubmitCode} />
)      {data && <Text>{data.submitCode}</Text>}
    </View>
  );
}

const styles = StyleSheet.create( {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 1,
    marginBottom: 1,
    height: 85,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
  },
});
