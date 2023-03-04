import React from 'react';
import {Formik} from "formik";
import {TextInput, View, Text, StyleSheet, Button} from "react-native";
//import {errors, response} from "msw";
// import {AuthContext} from '../App'

//// const {signIn} = React.useContext(AuthContext);
//export const LoginScreen = props => (
//    <Formik
//        initialValues={{username: '', password: ''}}
//        onSubmit={(values, errors) => {}}>
//
//        {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
//            <View>
//                <TextInput
//                    onChangeText={handleChange('username')}
//                    onBlur={handleBlur('username')}
//                    style={styles.input}
//                    value={values.username}
//                    placeholder={'username'}
//                />
//                <TextInput
//                    onChangeText={handleChange('password')}
//                    onBlur={handleBlur('password')}
//                    style={styles.input}
//                    value={values.password}
//                    placeholder={'password'}
//                />
//                {errors.username && errors.password && <Text style={styles.fieldError}>{errors.username}</Text>}
//                <Button
//                    onPress={handleSubmit}
//                    title={'Login'}
//                />
//            </View>
//        )}
//    </Formik>
//);

