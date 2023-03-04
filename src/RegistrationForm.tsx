import React from 'react';
import {Button, TextInput, View, StyleSheet, Text} from 'react-native';
import {ErrorMessage, Form, Formik} from 'formik';
import * as Yup from 'yup';
import * as httpRequest from "./RegistrationFormRequests";
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const registrationValidationSchema = Yup.object().shape({
    username: Yup
        .string()
        // .matches(/(\w.+\s).+/, 'Enter at least 2 names')
        .min(5, ({min}) => `Username must be at least ${min} characters`)
        .required("username is required"),
       //.test("unique username", "username is not available", function (value) {
       //   return httpRequest.verifyIsUsernameAvailable(value)
       //       .then((result) => {
       //           return !result;
       //   })
       // })
    // phoneNumber: Yup
    //     .string()
    //     .matches(/(01)(\d){8}\b/, 'Enter a valid phone number')
    //     .required('Phone number is required'),
    email: Yup
        .string()
        .matches(/^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/, "Invalid email")
        .required("Email is required"),
       // .test("unique email", "email is not available", function (value) {
       //     return httpRequest.verifyIfEmailAvailable(value)
       //         .then((result) => {
       //             return !result;
       //         })
       // }),
    password: Yup
        .string()
        .matches(/\w*[a-z]\w*/, "Password must have a small letter")
        .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
        .matches(/\d/, "Password must have a number")
        .matches(/(?=^\S+$)/, "Password must not have white space")
        .matches(/[!@#$%^&*()\-_"=+{};:,<.>]/, "Password must have a special character")
        .min(8, ({min}) => `Password must be at least ${min} characters`)
        .required("Password is required"),
    confirmPassword: Yup
        .string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required('Confirm password is required'),
})

export const RegistrationForm = props => (
    <Formik
        initialValues={{username: '', email: '', password: '', confirmPassword: ''}}
        validationSchema={registrationValidationSchema}
        validateOnMount={true}
        validateOnChange={true}
        // onSubmit={(values, { setSubmitting }) => {
        //     setTimeout(() => {
        //         alert(JSON.stringify(values, null, 2));
        //         setSubmitting(false);
        //     }, 400);
        // }}
        onSubmit={(values, errors) => {
            console.log(values);
            
            httpRequest.isUsernameAvailable(values.username)
                            .then((usernameAvailable) => {
                                if(!usernameAvailable) {
                                    errors.setErrors({username: "username is not available"})
                                    return false;
                                }
                                return true;
                            }).then((usernameAvailable) => {
                                if(usernameAvailable) {
                                    httpRequest.isEmailAvailable(values.email)
                                        .then((emailAvailable) => {
                                            if(!emailAvailable) {
                                                errors.setErrors({email: "email is not available"})
                                                return false;
                                            }
                                            return true;
                                        }).then((usernameAndEmailAvailable) => {
                                            if(usernameAndEmailAvailable) {
                                                httpRequest.submitRegistrationData(values);
                                            }
                                        });
                                }
                            });
        }
        }
    >
        {({handleChange, handleBlur, handleSubmit, values, touched, errors, isValid}) => (
            <View>
                <TextInput
                    name="username"
                    style={styles.input}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    placeholder="Enter your username"
                    testID='username'
                />
                {errors.username && touched.username && <Text style={styles.fieldError}>{errors.username}</Text>}
                <TextInput
                    style={styles.input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder="Enter your email"
                />
                {errors.email && touched.email && <Text style={styles.fieldError}>{errors.email}</Text>}
                <TextInput
                    style={styles.input}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder="Enter your password"
                />
                {errors.password && touched.password && <Text style={styles.fieldError}>{errors.password}</Text>}
                <TextInput
                    style={styles.input}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    placeholder="Re-enter your password"
                />
                {errors.confirmPassword && touched.confirmPassword &&
                    <Text style={styles.fieldError}>{errors.confirmPassword}</Text>}
                <Button
                    onPress={handleSubmit}
                    disabled={!isValid}
                    title="Submit"
                />
            </View>
        )}
    </Formik>
);

const styles = StyleSheet.create({
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