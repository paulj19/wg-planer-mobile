import { ReactElement } from "react";
import TaskCardFeed from "features/feed/TaskCardFeed";
import { FeedItem, Task } from "types/types";
import NewResidentCard from "features/feed/NewResidentCard";
import NewTaskCard from "features/feed/NewTaskCard";
import { Text, ScrollView } from "react-native";


export function Feed({ route, navigation }): ReactElement {
  console.log(route.params);
  const { myTasks, myFeed }: { myTasks: Task[]; myFeed: FeedItem[] } =
    route.params;
  console.log("MYTAKS", myTasks);
  return (
    <ScrollView>
      {myTasks.map((task) => (
        <TaskCardFeed taskName={task.Name} reminders={task.Reminders} />
      ))}
      {myFeed.map((feedItem) => {
        if (feedItem.Type === "NEW_RESIDENT") {
          return <NewResidentCard name={feedItem.NewResident} room={feedItem.Room} />;
        } else if (feedItem.Type === "NEW_TASK") {
          return <NewTaskCard creator={feedItem.Creator} taskName={feedItem.TaskName} />;
        }
      })}
    </ScrollView>
  );
}
