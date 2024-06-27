import { render, screen } from "@testing-library/react-native";
import Feed from "features/feed/Feed";
import floorStub from "./../../mocks/stubs/floorStub";
import {userSlice} from "features/user/UserSlice";

// describe("Feed", () => {
//   it("should render the feed", () => {
//     jest.spyOn(userSlice, 'useGetPostLoginInfoQuery').mockReturnValue(floorStub);
//     render(<Feed />);
//     expect(screen.getAllByTestId("task-card")).toHaveLength(6)
//   });
// });
