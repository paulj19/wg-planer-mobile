import { fireEvent, render, screen } from "@testing-library/react-native";
import * as storage from "../src/util/storage/Store";
import AuthToken from "../src/lib/Authentication/AuthToken";
import Logout from "../src/login/Logout"

describe("Logout", () => {
  it("clears AuthToken", () => {
    const dateNow = new Date("2023-02-28T21:38:45.189Z");
    const storedAuthToken = {
      _accessToken: "sam accessToken",
      _refreshToken: "sam refreshToken",
      _idToken: "sam idToken",
      _expiryDate: dateNow,
      _tokenType: "sam tokenType",
      _scope: "sam scope",
    };
    AuthToken.fromStorage(storedAuthToken);
    expect(AuthToken.isPresent()).toBe(true);

    render(<Logout />)

    const logoutButton = screen.getByText("LOGOUT");
    fireEvent.press(logoutButton);
    expect(AuthToken.isPresent()).toBe(false);
  });

  it("clears stored AuthToken", () => {
    jest.spyOn(storage, "remove").mockReturnValue(Promise.resolve());
    render(<Logout />)

    const logoutButton = screen.getByText("LOGOUT");
    fireEvent.press(logoutButton);
    expect(storage.remove).toHaveBeenCalledTimes(1);
  });
});
