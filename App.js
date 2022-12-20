import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from "./Home/HomeScreen";
import {RegistrationForm} from "./RegistrationForm";
import {Formik} from "formik";
import axios from "./lib/axiosConfig";

const Stack = createStackNavigator();

export default function App({navigation}) {
    const [authState, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RENEW_TOKEN':
                    return {
                        ...prevState,
                        accessToken: action.accessToken,
                        isLoading: false,
                    };
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        accessToken: action.accessToken,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        accessToken: action.accessToken,
                        isSignout: false,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        accessToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            accessToken: null,
        }
    )

    React.useEffect(() => {
        // const bootStrapAsync = async () => {
        //     let accessToken;
        //     try {
        //         accessToken = await SecureStore.getItemAsync("accessToken");
        //     } catch (e) {
        //         // restore token failed
        // }
        // dispatch({type: 'RESTORE_TOKEN', token: accessToken});
        // }
        // bootStrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async (data, errors) => {
                axios.post('/login', {
                    headers: {
                        'Authorization': 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
                    }
                })
                    .then(response => {
                        if (response.status === 200) {
                            dispatch({type: 'SIGN_IN', accessToken: response.data.accessToken});
                        }
                    }).catch(response => {
                    if (response.status === 401) {
                        errors.setErrors({username: 'username or password incorrect', password: 'username or password incorrect'})
                    }
                })
                //sign in
                //save token in securestore
                //handle errors
            },
            signOut: () => dispatch({type: 'SIGN_OUT'}),
            signUp: async (data) => {
                //register api call
                //handle error
                //save token
                dispatch({type: 'SIGN_IN', token: 'dummy_token'});
            },
        }),
        []
    )

    const AuthContext = React.createContext(authContext);

    // return (
    //     <View style={styles.container}>
    //         <RegistrationForm/>
    //     </View>
    // );
    function LoginScreen() {
        const {signIn} = React.useContext(AuthContext);
        return (
            <Formik
                initialValues={{username: '', password: ''}}
                onSubmit={(values, errors) => signIn(values, errors)}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <View>
                        <TextInput
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            style={loginScreenStyles.input}
                            value={values.username}
                            placeholder={'username'}
                        />
                        <TextInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            style={loginScreenStyles.input}
                            value={values.password}
                            placeholder={'password'}
                            secureTextEntry
                        />
                        {errors.username && errors.password && <Text style={styles.fieldError}>{errors.username}</Text>}
                        <Button
                            onPress={handleSubmit}
                            title={'Login'}
                        />
                    </View>
                )}
            </Formik>
        );
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    {authState.accessToken == null ? (
			    <Stack.Screen name="Login" component={LoginScreen}/>
                //        <Stack.Screen name="Login" component={RegistrationForm}/>
                    ) : (
                        <Stack.Screen name="Home" component={HomeScreen}/>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
    }
});
