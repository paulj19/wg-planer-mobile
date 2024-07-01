import { ReactElement } from "react";
import { Text } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllTasks from "features/floor/AllTasks";
import AllResidents from "features/floor/AllResidents";

const Tab = createMaterialTopTabNavigator();

export function Floor(): ReactElement {
    return (<Tab.Navigator>
      <Tab.Screen name="AllTasks" component={AllTasks} />
      <Tab.Screen name="AllResidents" component={AllResidents} />
    </Tab.Navigator>);
}
