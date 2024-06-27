import TaskCardFeed from "features/feed/TaskCardFeed";
import { render, screen } from "@testing-library/react-native";

describe("TaskCardFeed", () => {
  it("should render the task card feed", () => {
    render(<TaskCardFeed taskName={"taskName"} reminders={1} />);
    expect(screen.getByText('taskName')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByTestId('reminder')).toBeTruthy();
    expect(screen.getByTestId('done-button')).toBeTruthy();
  });
  it("should render without reminder", () => {
    render(<TaskCardFeed taskName={"taskName"} />);
    expect(screen.getByText('taskName')).toBeTruthy();
    expect(screen.queryByText('1')).toBeFalsy()
    expect(screen.queryByText('reminder')).toBeFalsy()
    expect(screen.getByTestId('done-button')).toBeTruthy();
  });
});
