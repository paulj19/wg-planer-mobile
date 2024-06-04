import { View, StyleSheet, Text, ToastAndroid } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as httpRequest from "features/registration/RegistrationFormRequests";
import { useGetFloorQuery } from "features/registration/FloorSlice";
import { ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput, Button } from "react-native-paper";
import { ErrorScreen } from "components/ErrorScreen";

const registrationValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, ({ min }) => `Username must be at least ${min} characters`)
    .required("username is required"),
  room: Yup.string().required("Room is required"),
  email: Yup.string()
    .matches(
      /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/,
      "Invalid email"
    )
    .required("Email is required"),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .matches(/(?=^\S+$)/, "Password must not have white space")
    .matches(
      /[!@#$%^&*()\-_"=+{};:,<.>]/,
      "Password must have a special character"
    )
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export const RegistrationForm = ({ route, navigation }) => {
  const floorId = route.params?.floorId;
  if (!floorId) {
    return (<ErrorScreen />);
  }

  const { data: floorData, isLoading, isError } = useGetFloorQuery(floorId);
  if (isLoading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    console.error("Error fetching floor data");
    ToastAndroid.show(
      "Error creating floor, please try again",
      ToastAndroid.SHORT
    );
    navigation.goBack();
  }
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        room: "",
      }}
      validationSchema={registrationValidationSchema}
      validateOnMount={true}
      validateOnChange={true}
      onSubmit={(values, errors) => {
        const { confirmPassword, room, ...valuesToSend } = values;
        httpRequest
          .submitRegistrationData(
            JSON.stringify({
              ...valuesToSend,
              oid: null,
              authServer: "HOME_BREW",
              floorId: floorData.Id,
            })
          )
          .then((r) => navigation.navigate("Login", { promptWindow: true }))
          .catch((e) => {
            console.error(e);
            ToastAndroid.showWithGravity(
              "An error occurred, please try again later.",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM
            );
          });
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
        resetForm,
      }) => (
        <View>
          <TextInput
            label="Username"
            mode="outlined"
            name="username"
            style={styles.textInput}
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            placeholder="Enter your username"
            testID="username"
          />
          {errors.username && touched.username && (
            <Text style={styles.fieldError}>{errors.username}</Text>
          )}
          <Dropdown
            name="room"
            search
            data={floorData.Rooms}
            onChange={(item) => handleChange("room")(item.Number)}
            onBlur={() => handleBlur("room")}
            labelField="Number"
            valueField="Number"
            value={values.room}
            placeholder="Select your room"
            style={[styles.dropdown, {}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
          />
          {errors.room && touched.room && (
            <Text style={styles.fieldError}>{errors.room}</Text>
          )}
          <TextInput
            label="Email"
            mode="outlined"
            name="email"
            style={styles.textInput}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            placeholder="Enter your email"
          />
          {errors.email && touched.email && (
            <Text style={styles.fieldError}>{errors.email}</Text>
          )}
          <TextInput
            name="password"
            mode="outlined"
            label="Password"
            style={styles.textInput}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            placeholder="Enter your password"
          />
          {errors.password && touched.password && (
            <Text style={styles.fieldError}>{errors.password}</Text>
          )}
          <TextInput
            name="confirmPassword"
            mode="outlined"
            label="Confirm Password"
            style={styles.input}
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            value={values.confirmPassword}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 5,
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Button
              mode="contained-tonal"
              style={{
                width: "48%",
              }}
              // disabled={true}
              onPress={() => handleSubmit()}
              disabled={!isValid}
            >
              Submit
            </Button>
            <Button
              mode="contained-tonal"
              style={{
                width: "48%",
              }}
              onPress={() => resetForm()}
            >
              Reset
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  input: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 3,
    marginBottom: 5,
  },
  fieldError: {
    color: "#ff0000",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 10,
    backgroundColor: "white",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    opacity: 0.8,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 3,
    marginBottom: 5,
  },
});
