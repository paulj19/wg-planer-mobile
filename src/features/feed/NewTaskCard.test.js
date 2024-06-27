import { render, screen } from "@testing-library/react-native";
import NewTaskCard from "features/feed/NewTaskCard";

describe("NewTaskCard", () => {
  it("should render the new task card feed", () => {
    render(<NewTaskCard creator="Max" taskName="new task"/>);
    expect(screen.getByText(/.*Max.*/)).toBeTruthy();
    expect(screen.getByText(/.*new task.*/)).toBeTruthy();
    expect(screen.getByTestId('accept')).toBeTruthy();
    expect(screen.getByTestId('reject')).toBeTruthy();
  });
});
