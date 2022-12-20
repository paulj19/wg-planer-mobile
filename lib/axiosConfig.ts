import axios from 'axios';
import axiosRetry from 'axios-retry';

//axiosRetry(axios, {retries: 3});

// const MockAdapter = require("axios-mock-adapter");

// const mock = new MockAdapter(axios);


const client = axios.create({baseURL: 'http://localhost:8080'});
axiosRetry(client, {
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 1000;
    },
    retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return 500 <= error.response.status < 600;
    },
    retries: 3
});

// mock.onPost("/login").reply(200, {
//     id: '1',
//     username: 'test user',
//     password: 'Password123!',
//     email: 'testuser@email.com',
//     accessToken: 'abc',
// });

export default client;