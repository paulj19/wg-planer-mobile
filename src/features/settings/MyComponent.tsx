import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button, Menu, Divider, PaperProvider, Provider } from 'react-native-paper';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
      <View
        style={{
          marginTop: 100,
          zIndex: 100,
        }}
      >
        <PaperProvider>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color="black"
              />
              </TouchableOpacity>
            }
 style={{ backgroundColor: "#222", borderWidth: 2, top:150, left:-100 , position: 'absolute', zIndex:100 }}
         
          >
            <Menu.Item onPress={() => {}} title="Item 1" />
          </Menu>
        </PaperProvider>
      </View>
  );
};

export default MyComponent;
