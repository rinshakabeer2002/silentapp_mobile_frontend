import AsyncStorage from '@react-native-async-storage/async-storage';
const LOCAL_STORE_LOCATIONS = '@locations';

class LStore {
  setLocations = async (data: Array<any>) => {
    try {
      await AsyncStorage.setItem(LOCAL_STORE_LOCATIONS, JSON.stringify(data));
    } catch (e) {}
  };

  getLocations = async () => {
    let value: string | null = null;
    try {
      value = await AsyncStorage.getItem(LOCAL_STORE_LOCATIONS);
      if (value) {
        return JSON.parse(value);
      }
    } catch (e) {}
    return [];
  };
}
export const LocalStore = new LStore();
