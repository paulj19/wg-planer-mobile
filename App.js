import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./Home/HomeScreen";
import { Formik } from "formik";
import axios from "./lib/axiosConfig";
import * as secureStorage from "./util/storage/SecureStore";
import { StoredItems } from "./util/storage/SecureStore";
import {
  PATH_LOGIN,
  PATH_VALIDATE_ACCESS_TOKEN,
  URL_AUTH_SERVER,
} from "./lib/UrlPaths";
import LoginScreen from "./lib/Authentication/Authentication";

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [authState, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RENEW_TOKEN":
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            accessToken: action.accessToken,
            refreshToken: action.refreshToken,
            isSignout: false,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            accessToken: null,
            refreshToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      accessToken: null,
      refreshToken: null,
    }
  );

  React.useEffect(() => {
    const bootStrapAsync = async () => {
      //non-lenient if any internal or http error => set token to null, go to login.
      //remove this after fixing stack.nav flow
      //isAvail check instead
      let accessToken = await secureStorage
        .load(StoredItems.ACCESS_TOKEN)
        .catch(() => null);
      let refreshToken = await secureStorage
        .load(StoredItems.REFRESH_TOKEN)
        .catch(() => null);
      if (accessToken || refreshToken) {
        axios
          .get(PATH_VALIDATE_ACCESS_TOKEN)
          .then((response) => {
            if (
              response.status === 200 &&
              response.headers.authentication &&
              response.headers.refresh_token
            ) {
              dispatch({
                type: "RENEW_TOKEN",
                accessToken: response.headers.authentication,
                refreshToken: response.headers.refresh_token,
              });
            } else {
              //will go to login screen
              clearTokens();
            }
          })
          .catch(() => {
            clearTokens();
          });
      }
    };

    // bootStrapAsync();
  }, []);

  const clearTokens = async () => {
    await secureStorage.remove(StoredItems.ACCESS_TOKEN);
    await secureStorage.remove(StoredItems.REFRESH_TOKEN);
    dispatch({ type: "RENEW_TOKEN", accessToken: null, refreshToken: null });
  };
  const authContext = React.useMemo(
    () => ({
      signIn: async (data, errors) => {
        let errorMsg = null;
        axios
          .post(PATH_LOGIN)
          .then((response) => {
            if (
              response.status === 200 &&
              response.headers.authentication &&
              response.headers.refresh_token
            ) {
              dispatch({
                type: "SIGN_IN",
                accessToken: response.headers.authentication,
                refreshToken: response.headers.refresh_token,
              });
            } else {
              errorMsg = "could not log in, please try again later";
            }
          })
          .catch((error) => {
            if (error.response.status === 401) {
              errorMsg = "username or password incorrect";
            } else {
              errorMsg = "could not log in, please try again.";
            }
          })
          .then(() => {
            if (errorMsg !== null) {
              errors.setErrors({
                username: errorMsg,
                password: errorMsg,
              });
            }
          });
      },
      signOut: () =>
        dispatch({
          type: "SIGN_OUT",
          accessToken: "dummy_token",
          refreshToken: "dummy_token",
        }),
      signUp: async (data) => {
        //register api call
        //handle error
        //save token
        dispatch({
          type: "SIGN_IN",
          accessToken: "dummy_token",
          refreshToken: "dummy_token",
        });
      },
    }),
    []
  );

  const AuthContext = React.createContext(authContext);

  // return (
  //     <View style={styles.container}>
  //         <RegistrationForm/>
  //     </View>
  // );
  // function LoginScreen() {
  //   return (
  //     <Button
  //       title="Login"
  //       onPress={() => startAuth(Authentication.useProxy)}//todo take useProxy from Authentication
  //     />
  //   );
  // const { signIn } = React.useContext(AuthContext);
  // return (
  //   <Formik
  //     initialValues={{ username: "", password: "" }}
  //     onSubmit={(values, errors) => signIn(values, errors)}
  //   >
  //     {({
  //       handleChange,
  //       handleBlur,
  //       handleSubmit,
  //       values,
  //       errors,
  //       touched,
  //     }) => (
  //       <View>
  //         <TextInput
  //           onChangeText={handleChange("username")}
  //           onBlur={handleBlur("username")}
  //           style={loginScreenStyles.input}
  //           value={values.username}
  //           placeholder={"username"}
  //         />
  //         <TextInput
  //           onChangeText={handleChange("password")}
  //           onBlur={handleBlur("password")}
  //           style={loginScreenStyles.input}
  //           value={values.password}
  //           placeholder={"password"}
  //           secureTextEntry
  //         />
  //         {errors.username && errors.password && (
  //           <Text style={styles.fieldError}>{errors.username}</Text>
  //         )}
  //         <Button onPress={handleSubmit} title={"Login"} />
  //       </View>
  //     )}
  //   </Formik>
  // );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {authState.accessToken == null ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            //<Stack.Screen name="Login" component={RegistrationForm}/>
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
const loginScreenStyles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  fieldError: {
    color: "#ff0000",
  },
});
