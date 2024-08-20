import { ReactElement, useEffect, useMemo, useRef } from "react";
import TaskCardFeed from "features/feed/TaskCardFeed";
import NewResidentCard from "features/feed/NewResidentCard";
import TaskCardVoting from "features/feed/TaskCardVoting";
import { Text, ScrollView, Platform } from "react-native";
import {
  floorSlice,
  useGetPostLoginInfoQuery,
  useUpdateVotingMutation,
} from "features/registration/FloorSlice";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { FloorItem, Room, Task } from "types/types";
import * as Notifications from "expo-notifications";
import { ScrollViewWithRefresh } from "components/ScrollViewWithRefresh";
import {Link} from "@react-navigation/native";

export default function Feed(): ReactElement {
  const notificationListener = useRef<Notifications.Subscription>();
  const dispatch = useDispatch();
  const [updateVoting] = useUpdateVotingMutation();
  let userId;

  if (Platform.OS === "ios") {
    userId = "1";
  } else {
    userId = "2";
  }

  const selectUserTasksById = useMemo(() => {
    const emptyArray = [];
    return createSelector(
      (result) => result?.data?.floor,
      (state, userId) =>
        state?.currentData?.floor?.Rooms?.find(
          (room) => room.Resident?.Id === userId.toString()
        )?.Id,
      (floor: FloorItem, myRoomId) => ({
        ...floor,
        Tasks:
          floor?.Tasks?.filter(
            (task: Task) => task.AssignedTo === myRoomId
          ).sort(sortCriteria) || emptyArray,
      })
    );
  }, []);

  const { floorInfo, refetch } = useGetPostLoginInfoQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      // floorInfo: selectUserTasksById(result, result.data?.userprofile?.id),
      floorInfo: selectUserTasksById(result, userId),
    }),
  });

  const sortCriteria = (a, b) =>
    a.Reminders === b.Reminders
      ? a.AssignmentDate - b.AssignmentDate
      : b.Reminders - a.Reminders;

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        if (notification.request.content.data) {
          try {
            if (notification.request.content.data) {
              const { FloorId, Type } = notification.request.content.data;
              const Payload = JSON.parse(
                notification.request.content.data.Patch
              );
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
                    if (
                      Type === "TASK_DONE" ||
                      Type === "TASK_ASSIGN" ||
                      Type === "TASK_REMINDER"
                    ) {
                      let i = 0;
                      for (; i < draft.floor.Tasks.length; i++) {
                        //TODO array indexing buggy?
                        if (draft.floor.Tasks[i].Id === Payload[0].Id) {
                          Object.assign(draft.floor.Tasks[i], Payload[0]);
                          break;
                        }
                      }
                      if (i === draft.floor.Tasks.length) {
                        throw new Error("Task not found in user tasks");
                      }
                    } else if (Type === "RESIDENT_UNAVAILABLE") {
                      Object.assign(draft.floor.Tasks, Payload);
                    } else if (Type === "VOTING_ADD") {
                      Object.assign(draft.floor.Votings, Payload);
                    }
                  }
                )
              );
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
    <ScrollViewWithRefresh refetch={refetch}>
      <Link to="/Forgot">Assign Task</Link>
    </ScrollViewWithRefresh>
  );
}
