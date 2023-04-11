import Logout from "../login/Logout";
import {Text, View} from "react-native";

export default function HomeScreen({navigation}) {
    // console.log('linet');

    return (
        <View>
            <Text>{'home screen'}</Text>
            <Logout />
        </View>
    )
};
