import axios from "axios";
import axiosRetry from 'axios-retry';

axiosRetry(axios, {retries: 3});

// const MockAdapter = require("axios-mock-adapter");

// const mock = new MockAdapter(axios);

axiosRetry(axios, {
    retryDelay: (retryCount) => {
        return retryCount * 1000;
    }
});

const client = axios.create({baseURL: 'http://localhost:8080'});
axiosRetry(client, {retries: 3});

// mock.onPost("/login").reply(200, {
//     id: '1',
//     username: 'test user',
//     password: 'Password123!',
//     email: 'testuser@email.com',
//     accessToken: 'abc',
// });

export default client;