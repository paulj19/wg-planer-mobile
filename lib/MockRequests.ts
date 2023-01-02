import MockAdapter from "axios-mock-adapter";
import client from "./axiosConfig";

const mock = new MockAdapter(client);

mock.onPost("/login").reply(200,
    {
        id: '1',
        username: 'test user',
        password: 'Password123!',
        email: 'testuser@email.com',
        accessToken: 'abc',
    }
);

