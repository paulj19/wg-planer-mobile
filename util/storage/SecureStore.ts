import * as SecureStore from 'expo-secure-store';
enum SavedItemKeys {
    ACCESS_TOKEN, REFRESH_TOKEN
}

async function save(key:string, value:string) {
    await SecureStore.setItemAsync(key, value);
}

async function getItemValue(key):Promise<string> {
    return await SecureStore.getItemAsync(key);
}
