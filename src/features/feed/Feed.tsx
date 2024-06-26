import { ReactElement, useMemo } from "react";
import TaskCardFeed from "features/feed/TaskCardFeed";
import NewResidentCard from "features/feed/NewResidentCard";
import NewTaskCard from "features/feed/NewTaskCard";
import { Text, ScrollView } from "react-native";
import { useGetPostLoginInfoQuery } from "features/user/UserSlice";
import { useSelector } from "react-redux";
import { createSelector } from '@reduxjs/toolkit'
import {FloorItem, Task} from "types/types";


export function Feed(): ReactElement {
  // console.log("MYTAKS", myTasks);
  // const user = useSelector(state => selectUserById(state, userId))
  const selectUserTasksById = useMemo(() => {
    const emptyArray = []
    //todo remove refetchOnFocus
    return createSelector(
      result => result?.data?.floor,
      (state, userId) => userId,
      (floor: FloorItem, userId) => ({...floor, Tasks: floor?.Tasks?.filter((task: Task) => task.AssignedTo === userId).sort((a, b) => (a.Reminders === b.Reminders ? (a.AssignmentDate - b.AssignmentDate): (b.Reminders - a.Reminders))) || emptyArray}))
  }, [])

  const { floorInfo} = useGetPostLoginInfoQuery(undefined, {refetchOnFocus: true, selectFromResult: result => ({ ...result, floorInfo: selectUserTasksById(result, result.data?.userprofile?.id) }) })

  return (
    <ScrollView>
      {floorInfo?.Tasks?.map((task) => (
        <TaskCardFeed taskName={task.Name} reminders={task.Reminders} />
      ))}
      { floorInfo?.Feed?.map((feedItem) => {
        if (feedItem.Type === "NEW_RESIDENT") {
          return <NewResidentCard name={feedItem.NewResident} room={feedItem.Room} />;
        } else if (feedItem.Type === "NEW_TASK") {
          return <NewTaskCard creator={feedItem.Creator} taskName={feedItem.TaskName} />;
        }
      })}
    </ScrollView>
  );
}
