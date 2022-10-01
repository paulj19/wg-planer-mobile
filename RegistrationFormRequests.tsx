import axios from "axios";

export const submitRegistrationData = (formValues: string) => {
    axios
        .post("http://localhost:8080/registration/new", formValues, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => console.log(response));
}

export const isUsernameAvailable = (username: string): Promise<boolean> => {
    return axios
        .get("http://localhost:8080/registration/username-available", {
            params: {
                username: username
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data === true
        });
}

export const isEmailAvailable = (email: string): Promise<boolean> => {
    return axios
        .get("http://localhost:8080/registration/email-available", {
            params: {
                email: email
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            debugger;
            return response.data === true
        });
}
