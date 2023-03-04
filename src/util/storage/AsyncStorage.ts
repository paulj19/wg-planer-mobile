import Storage from "react-native-storage";

export const aStorage = new Storage({
    storageBackend: window.localStorage,
    defaultExpires: null,
})