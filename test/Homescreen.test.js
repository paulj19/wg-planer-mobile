import Storage from "../src/util/storage/Storage";

describe("Homescreen", () => {
  beforeAll(() => server.listen());
  beforeEach(() => AuthToken.clear());
  afterEach(() => server.resetHandlers());
  beforeAll(() => server.close());

  // it("loads userprofile", async () => {
  //   jest.spyOn(Storage, "getItem").mockReturnValue(Promise.resolve(
  // });
});
