
export const initJestPlatformMock = () => {
  jest.mock("react-native/Libraries/Utilities/Platform", () => ({
    OS: "web", // or 'ios'
    select: () => null,
  }));
};
