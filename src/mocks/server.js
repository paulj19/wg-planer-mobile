import { authHandlers } from "./AuthHandlers";
import { setupServer } from "msw/native";

export const server = setupServer(...authHandlers);
