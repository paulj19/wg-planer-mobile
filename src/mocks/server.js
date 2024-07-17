import { authHandlers } from "./AuthHandlers";
import { userHandlers } from "./UserHandlers";
import { setupServer } from "msw/native";


export const server = setupServer(...authHandlers, ...userHandlers);
