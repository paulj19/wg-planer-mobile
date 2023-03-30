import axios from "./src/lib/axiosConfig";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

jest.mock('expo-linking', () => {
    const module: typeof import('expo-linking') = {
        ...jest.requireActual('expo-linking'),
        createURL: jest.fn(),
    };

    return module;
});
