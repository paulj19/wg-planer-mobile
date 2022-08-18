import React from 'react';
import {Button, TextInput, View, StyleSheet, Text} from 'react-native';
import {ErrorMessage, Formik} from 'formik';
import * as Yup from 'yup';
import * as httpRequest from "./RegistrationFormRequests.tsx";
import {RegistrationDto} from "./RegistrationFormRequests.tsx";

const registrationValidationSchema = Yup.object().shape({
    username: Yup
        .string()
        // .matches(/(\w.+\s).+/, 'Enter at least 2 names')
        .min(5, ({min}) => `Username must be at least ${min} characters`)
        .required('username is required'),
    // phoneNumber: Yup
    //     .string()
    //     .matches(/(01)(\d){8}\b/, 'Enter a valid phone number')
    //     .required('Phone number is required'),
    email: Yup
        .string()
        .email("Please enter valid email")
        .required("Email is required"),
    password: Yup
        .string()
        .matches(/\w*[a-z]\w*/, "Password must have a small letter")
        .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
        .matches(/\d/, "Password must have a number")
        .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
        .min(8, ({min}) => `Password must be at least ${min} characters`)
        .required("Password is required"),
    confirmPassword: Yup
        .string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required('Confirm password is required'),
    //todo should enter password first?
})
export const RegistrationForm = props => (
    <Formik
        initialValues={{username: '', email: '', password: '', confirmPassword: ''}}
        validationSchema={registrationValidationSchema}
        // onSubmit={(values, { setSubmitting }) => {
        //     setTimeout(() => {
        //         alert(JSON.stringify(values, null, 2));
        //         setSubmitting(false);
        //     }, 400);
        // }}
        onSubmit={values => {
            console.log(values);
            httpRequest.submitRegistrationData(values);
            }
        }
    >
        {({handleChange, handleBlur, handleSubmit, values, touched, errors}) => (
            <View>
                <TextInput
                    name="username"
                    style={styles.input}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    placeholder="Enter your username"
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
                <Button onPress={handleSubmit} title="Submit"/>
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