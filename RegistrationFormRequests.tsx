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