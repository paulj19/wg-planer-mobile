import Storage from "react-native-storage";

export const aStorage = new Storage({
  //todo check platform web
    storageBackend: window.localStorage,
    defaultExpires: null,
})
