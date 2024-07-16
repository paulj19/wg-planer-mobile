import { useGetPostLoginInfoQuery } from "features/registration/FloorSlice";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from "react-native";
import TaskCardFloor from "./TaskCardFloor";
import type { Room } from "types/types";
import Loading from "components/Loading";
import { useState } from "react";

export default function AllTasks() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, isError, error, refetch } = useGetPostLoginInfoQuery(
    undefined,
    {
      refetchOnFocus: true,
    }
  );
  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate a 2-second refresh
  };

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
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {data?.floor?.Tasks?.map((task) => {
        assignedTo =
          task.AssignedTo !== -1
            ? data.floor?.Rooms?.find((room) => room.Id === task.AssignedTo)
            : undefined;
        return <TaskCardFloor task={task} assignedTo={assignedTo} />;
      })}
    </ScrollView>
  );
}
