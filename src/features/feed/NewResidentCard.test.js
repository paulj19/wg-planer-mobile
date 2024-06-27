import { render, screen } from "@testing-library/react-native";
import NewResidentCard from "features/feed/NewResidentCard";

describe("NewResidentCard", () => {
  it("should render the new residnet card", () => {
    render(
      <NewResidentCard name={"Max"} room={"222"} />
    );
    expect(screen.getByText(/.*Max.*/)).toBeTruthy();
    expect(screen.getByText(/.*222.*/)).toBeTruthy();
    expect(screen.getByTestId("accept")).toBeTruthy();
    expect(screen.getByTestId("reject")).toBeTruthy();
  });
});
