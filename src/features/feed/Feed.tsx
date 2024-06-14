import { ReactElement } from "react";
import TaskCardFeed from "features/feed/TaskCardFeed";
import { FeedItem, Task } from "types/types";

export function Feed({ route, navigation }): ReactElement {
console.log(route.params)
  const { myTasks, myFeed }: { myTasks: Task[]; myFeed: FeedItem[] } =
    route.params;
    console.log("MYTAKS", myTasks)
  return (
    <>
      {myTasks.map((task) => (
        <TaskCardFeed taskName={task.Name} reminders={task.Reminders} />
      ))}
    </>
  );
}
