import { ReactElement, useMemo } from "react";
import TaskCardFeed from "features/feed/TaskCardFeed";
import NewResidentCard from "features/feed/NewResidentCard";
import NewTaskCard from "features/feed/NewTaskCard";
import { Text, ScrollView } from "react-native";
import { useGetPostLoginInfoQuery } from "features/user/UserSlice";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { FloorItem, Task } from "types/types";

export default function Feed(): ReactElement {
  const sortCriteria = (a, b) =>
    a.Reminders === b.Reminders
      ? a.AssignmentDate - b.AssignmentDate
      : b.Reminders - a.Reminders;
  const selectUserTasksById = useMemo(() => {
    const emptyArray = [];
    return createSelector(
      (result) => result?.data?.floor,
      (state, userId) => userId,
      (floor: FloorItem, userId) => ({
        ...floor,
        Tasks:
          floor?.Tasks?.filter(
            (task: Task) => task.AssignedTo === userId
          ).sort(sortCriteria) || emptyArray,
      })
    );
  }, []);

  const { floorInfo } = useGetPostLoginInfoQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      floorInfo: selectUserTasksById(result, result.data?.userprofile?.id),
    }),
  });

  return (
    <ScrollView>
      {floorInfo?.Tasks?.map((task) => (
        <TaskCardFeed taskName={task.Name} reminders={task.Reminders} />
      ))}
      {floorInfo?.Feed?.map((feedItem) => {
        if (feedItem.Type === "NEW_RESIDENT") {
          return (
            <NewResidentCard name={feedItem.NewResident} room={feedItem.Room} />);
        } else if (feedItem.Type === "NEW_TASK") {
          return (
            <NewTaskCard
              creator={feedItem.Creator}
              taskName={feedItem.TaskName}
            />
          );
        }
      })}
    </ScrollView>
  );
}
