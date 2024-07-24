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
import { useCallback, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {ScrollViewWithRefresh} from "components/ScrollViewWithRefresh";

export default function AllTasks() {
  const { data, isLoading, isError, error, refetch } =
    useGetPostLoginInfoQuery(undefined);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
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
  <ScrollViewWithRefresh refetch={refetch}>
      {data?.floor?.Tasks?.map((task) => {
        assignedTo =
          task.AssignedTo !== -1
            ? data.floor?.Rooms?.find((room) => room.Id === task.AssignedTo)
            : undefined;
        return <TaskCardFloor task={task} assignedTo={assignedTo} />;
      })}
    </ScrollViewWithRefresh >
  );
}
