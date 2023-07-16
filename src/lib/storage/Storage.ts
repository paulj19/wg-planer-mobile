import AsyncStorage from '@react-native-async-storage/async-storage';


export function setItem(key_: string, value: object): Promise<void> {
  return AsyncStorage.setItem(key_, JSON.stringify(value));
}

export async function getItem(key_: string) {
  const jsonValue = await AsyncStorage.getItem(key_);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}

export function removeItem(key_: string): Promise<void> {
  return AsyncStorage.removeItem(key_);
}
