import {useState} from "react";
import {RefreshControl, ScrollView} from "react-native";

export function ScrollViewWithRefresh({
  children, refetch, contentContainerStyle
} ) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Simulate a 1-second refresh
  };

  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
}

