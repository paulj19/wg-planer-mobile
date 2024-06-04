import { URL_REGISTER_NEW } from "util/UrlPaths";
import axios from "util/axiosConfig";
import { authProps } from "features/auth/AuthProps";

export async function submitRegistrationData(formValues: string): Promise<void> {
console.log("UUU", formValues)
        const response = await axios({
            method: "post",
            url: URL_REGISTER_NEW,
            auth: {
                username: authProps.clientId,
                password: authProps.clientSecret,
            },
            headers: {
                "Content-Type": "application/json",
            },
            data: formValues,
        });
        return console.log("XXX OOO YYY", response);
};

export const isUsernameAvailable = (username: string): Promise<boolean> => {
  return axios
    .get("/registration/username-available", {
      params: {
        username: username,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data === true;
    })
    .catch((e) => {
      console.log(e);
      return true;
    });
};

export const isEmailAvailable = (email: string): Promise<boolean> => {
  return axios
    .get("/registration/email-available", {
      params: {
        email: email,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data === true;
    })
    .catch((e) => {
      console.log(e);
      //todo retry until form submission
      return true;
    });
};
