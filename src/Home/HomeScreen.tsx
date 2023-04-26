import Logout from "../login/Logout";
import {Text, View} from "react-native";
import AuthToken from "../../src/lib/Authentication/AuthToken";

export default function HomeScreen({navigation}) {
    return (
        <View>
            <Text>{'home screen'}</Text>
            <Logout />
        </View>
    )
};
