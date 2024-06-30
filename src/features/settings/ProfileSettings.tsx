import Logout from "components/Logout";
import { ReactElement } from "react";
import { Text, View } from "react-native";
import {
  Avatar,
  Card,
  Divider,
  Menu,
  Button,
  PaperProvider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import MyComponent from "./MyComponent";

export function Settings(): ReactElement {
  const [menuVisible, setMenuVisible] = useState(false);
 const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  return (
    <View style={{ marginTop: 20 }}>
      <MyComponent />
    </View>
  );
}
