import { ReactElement, useEffect, useMemo, useRef } from "react";
import TaskCardFeed from "features/feed/TaskCardFeed";
import NewResidentCard from "features/feed/NewResidentCard";
import NewTaskCard from "features/feed/NewTaskCard";
import { Text, ScrollView, Platform } from "react-native";
import {
  floorSlice,
  useGetPostLoginInfoQuery,
} from "features/registration/FloorSlice";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { FloorItem, Task } from "types/types";
import * as Notifications from "expo-notifications";
import {ScrollViewWithRefresh} from "components/ScrollViewWithRefresh";

export default function Feed(): ReactElement {
  const notificationListener = useRef<Notifications.Subscription>();
  const dispatch = useDispatch();
  let userId;

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
          floor?.Tasks?.filter((task: Task) => task.AssignedTo === userId).sort(
            sortCriteria
          ) || emptyArray,
      })
    );
  }, []);

  if (Platform.OS === "ios") {
    userId = 0;
  } else {
    userId = 1;
  }

  const { floorInfo, refetch } = useGetPostLoginInfoQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      // floorInfo: selectUserTasksById(result, result.data?.userprofile?.id),
      floorInfo: selectUserTasksById(result, userId),
    }),
  });

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        if (notification.request.content.data) {
          try {
            if (notification.request.content.data) {
              const { FloorId, Type } = notification.request.content.data;
              const Task = JSON.parse(notification.request.content.data.Task);

              if (Type === "TASK_DONE" || Type === "TASK_ASSIGN"|| Type === "TASK_REMINDER") {
                dispatch(
                  //@ts-ignore
                  floorSlice.util.updateQueryData(
                    "getPostLoginInfo",
                    undefined,
                    (draft) => {
                      if (draft.floor.Id !== FloorId) {
                        throw new Error(
                          "Notification flooId does not match user floorId"
                        );
                      }
                      let i = 0;
                      for (; i < draft.floor.Tasks.length; i++) {
                        if (draft.floor.Tasks[i].Id === Task.Id) {
                          Object.assign(draft.floor.Tasks[i], Task);
                          break;
                        }
                      }
                      if (i === draft.floor.Tasks.length) {
                        throw new Error("Task not found in user tasks");
                      }
                    }
                  )
                );
              }
            }
          } catch (e) {
            console.error("error updating task with notification", e);
            refetch();
          }
        }
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
    };
  }, [dispatch]);

  return (
    <ScrollViewWithRefresh
      refetch={refetch}
    >
      {floorInfo?.Tasks?.map((task) => (
        <TaskCardFeed
          task={task}
          reminders={task.Reminders}
          floorId={floorInfo.Id}
        />
      ))}
      {floorInfo?.Feed?.map((feedItem) => {
        if (feedItem.Type === "NEW_RESIDENT") {
          return (
            <NewResidentCard name={feedItem.NewResident} room={feedItem.Room} />
          );
        } else if (feedItem.Type === "NEW_TASK") {
          return (
            <NewTaskCard
              creator={feedItem.Creator}
              taskName={feedItem.TaskName}
            />
          );
        }
      })}
    </ScrollViewWithRefresh>
  );
}
