import { URL_REGISTER_NEW } from "../lib/UrlPaths";
import axios from "../lib/axiosConfig";
import { authProps } from "../lib/Authentication/AuthProps";

export const submitRegistrationData = (formValues: string) => {
  return axios({
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
  })
    .then((response) => console.log(response))
    .catch((e) => {
      console.log(e);
    });
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
