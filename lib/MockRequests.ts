import MockAdapter from "axios-mock-adapter";
import {PATH_LOGIN, PATH_VALIDATE_ACCESS_TOKEN} from "./UrlPaths";

let mock;

export function initializeMocks(client) {
    mock = new MockAdapter(client);
    login();
    validateAccessToken();
}

const mockUser = {
    id: '1',
    username: 'test user',
    password: 'Password123!',
    email: 'testuser@email.com',
}

const login = () => mock.onPost(PATH_LOGIN).reply(200,
    mockUser,
    {
        authentication: 'Bearer: eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlLWViYXlrLXNpZy0yMDIxLTEwLTA4VDA0OjUxOjExLjIyMzYyOVoifQ.eyJpc3MiOiJodHRwczovL2lkLmViYXkta2xlaW5hbnplaWdlbi5kZS9vaWRjIiwianRpIjoiVEdULTExNDY4OC1ZdUdFQjY1OWh4U0txSG5RUmFXcTNWRTdnZWhKeGo2bDFCUjVyeFQ0QUZ6dWF2LXlOc0loZ28zeEsxNlhuMVpWRUUwLWNpcy1hdXRoLTVkODRjNjc3NmItam01Znc7QVQtMTQ1NDkzMTgtN204ZXBBYkNCek1EbS0wcVRjRzI0a3h0VW90RUxzSUoiLCJpYXQiOjE2NzIyMzc3MjAsImV4cCI6MTY3MjIzOTUyMCwic3ViIjoiNTk1MGUwNDUtZjE5MC00NWQzLWIyOGItMzIwOTZlY2I3ZWJjIiwiYXpwIjoiZWJheWtfd2ViX2ZiVVJ5REtnIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSB1cm46ZWJheS1rbGVpbmFuemVpZ2VuOnVzZXIiLCJlY2c6aWQ6YmxvY2tlZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6IjgyMTU4NjMzIn0.Xn2xBhgwsCz5hD8d6tcM4ZlmdNNUlaqaXGPJgUuFOfp2alDNmPFmTW3F7lIrJZtU7mB05VwYiPuq1-BwGfaVYX5IIsNAYQr2G9bVAq5Bi7rVHe-2lQ8_6Au6pnJHnzNXcZsoEfIxhl2pwktBKzfl_eIoNblgKA8o8i0gnFHFpHQ13q4Mdu-vbgSrHROuA9N4iJxbB-Yd92G21a1koSYnqtY_iqGrgJrOgVx0hbUyZKp6gtuGFia-ej1Z8prDbgmAADbyOxX-jnvCIxt8mZOCmt7u4OHS4cLhsE9kohFcUQGA1KV-OzavkM3e0qyBgxMSWLQfnCD2SUcnR6eqkyAwaA',
        refresh_token: 'refreshToken123!',
    },
);

const validateAccessToken = () => mock.onGet(PATH_VALIDATE_ACCESS_TOKEN).reply(200,
    mockUser,
    {
        authentication: 'Bearer: newAccessToken123.',
        refresh_token: 'refreshToken123!',
    },
);




