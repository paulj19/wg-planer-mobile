import axios from "./lib/axiosConfig";

export const submitRegistrationData = (formValues: string) => {
    axios
        .postForm("/registration/new", formValues, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => console.log(response))
        .catch((e) => {
            console.log(e);
        });
}

export const isUsernameAvailable = (username: string): Promise<boolean> => {
    return axios
        .get("/registration/username-available", {
            params: {
                username: username
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data === true
        })
        .catch((e) => {
            console.log(e);
            return true;
        });
}

export const isEmailAvailable = (email: string): Promise<boolean> => {
    return axios
        .get("/registration/email-available", {
            params: {
                email: email
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data === true
        })
        .catch((e) => {
            console.log(e);
            //todo retry until form submission
            return true;
        });
}
