import { useGetPostLoginyInfoQuery } from "features/registration/FloorSlice";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from "react-native";
import TaskCardFloor from "./TaskCardFloor";
import type { Room } from "types/types";
import Loading from "components/Loading";

export default function AllTasks() {
  const { data, isLoading, isError, error } = useGetPostLoginyInfoQuery(
    undefined,
    {
      refetchOnFocus: true,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.error("Error loading floor data ", error);
    ToastAndroid.show(
      "Error loading page, please refresh or try again later",
      ToastAndroid.SHORT
    );
  }
  let assignedTo: Room | undefined;

  return (
    <ScrollView>
      {data?.floor?.Tasks?.map((task) => {
        assignedTo = task.AssignedTo
          ? data.floor?.Rooms?.find(
              (room) => room.Id === task.AssignedTo
            )
          : undefined;
        return <TaskCardFloor task={task} assignedTo={assignedTo} />;
      })}
    </ScrollView>
  );
}
