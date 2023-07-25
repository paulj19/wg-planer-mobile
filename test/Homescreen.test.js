import Storage from "../src/util/storage/Storage";
import { AuthContext } from "App";

describe("Homescreen", () => {
  beforeAll(() => server.listen());
  beforeEach(() => AuthToken.clear());
  afterEach(() => server.resetHandlers());
  beforeAll(() => server.close());

  // it("loads userprofile", async () => {
  //   jest.spyOn(Storage, "getItem").mockReturnValue(Promise.resolve(
  // });

  it("calls analytics init exactly once", () => {
    jest.spyOn(Analytics, "init");
    render(
      <AuthContext.Provider
        value={{
          authContext: {},
          authState: {
            signedIn: false,
            newLogin: false,
            analyticsInitialized: false,
          },
        }}
      >
        <Homescreen />
      </AuthContext.Provider>
    );
  });
});
