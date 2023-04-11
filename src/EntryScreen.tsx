import * as React from "react";
import Login from "./login/Login";

export default function EntryScreen({ route, navigation }) {
  const { setIsTokenLoaded } = route.params;
  return(
    <Login setIsTokenLoaded={setIsTokenLoaded} />
  );
}
