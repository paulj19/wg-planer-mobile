import axios from "axios";

export const submitRegistrationData = (formValues: string) => {
    axios
        .post("http://localhost:8080/register", formValues, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => console.log(response));
}

export const verifyIsUsernameAvailable = (username: string): Promise<boolean> => {
    return axios
        .get("http://localhost:8080/register/username-available", {
            params: {
                username: username
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data === 'true'
        });
}
