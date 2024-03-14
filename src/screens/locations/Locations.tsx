import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  FlatList,
} from 'react-native';
import {LocalStore} from '../../utils/LocalStore';
import {LocationsScreenNavigationProp} from '../AppNavigation';
import GetLocation from 'react-native-get-location';
import LocationService from '../../utils/LocationService';

import {
  useRingerMode,
  RINGER_MODE,
  RingerModeType,
  checkDndAccess,
  requestDndAccess,
} from 'react-native-volume-manager';

export const Locations: React.FC<LocationsScreenNavigationProp> = ({
  navigation,
}) => {
  const [locations, setLocations] = useState<Array<any>>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const {mode, error, setMode} = useRingerMode();
  const isLoading = useRef(true);

  const changeMode = async (newMode: RingerModeType) => {
    // From N onward, ringer mode adjustments that would toggle Do Not Disturb
    // are not allowed unless the app has been granted Do Not Disturb Access.
    // @see https://developer.android.com/reference/android/media/AudioManager#setRingerMode(int)
    if (newMode === RINGER_MODE.silent || mode === RINGER_MODE.silent) {
      const hasDndAccess = await checkDndAccess();
      if (hasDndAccess === false) {
        // This function opens the DND settings.
        // You can ask user to give the permission with a modal before calling this function.
        requestDndAccess();
        return;
      }
    }

    setMode(newMode);
  };

  const loadLocations = async () => {
    const data = await LocalStore.getLocations();
    if (data && data.length) setLocations(data);
    else setLocations([]);
    isLoading.current = false;
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadLocations();
    });
    loadLocations();
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        // console.log('Current location ', location);
        setCurrentLocation({lat: location.latitude, lng: location.longitude});
        //"latitude": 10.2593229, "longitude": 76.3381514
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
    return () => {
      unsubscribeFocus();
    };
  }, []);
  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.push('AddLocation')} title="Add" />
      ),
    });
  }, [navigation]);
  React.useEffect(() => {
    let didFoundLocation = false;
    if (currentLocation && locations.length) {
      locations.forEach(item => {
        // console.log('item ', item);
        const distance = LocationService.calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          item.location.coordinates.lat,
          item.location.coordinates.lng,
        );
        if (distance < item.radius / 1000) {
          didFoundLocation = true;
          changeMode(
            item.selectedPhoneMode === '1'
              ? RINGER_MODE.silent
              : RINGER_MODE.vibrate,
          );
        }
      });
    }
    if (!didFoundLocation) {
      changeMode(RINGER_MODE.normal);
    }
  }, [currentLocation, locations]);
  const handleAdd = () => {
    navigation.push('AddLocation');
  };
  if (isLoading.current) {
    return (
      <View style={styles.addContainer}>
        <Text style={{textAlign: 'center'}}>Loading....</Text>
      </View>
    );
  }
  if (!locations || !locations.length) {
    return (
      <View style={styles.addContainer}>
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
          Please add locations where you want phone to remain silent
        </Text>
        <Pressable onPress={handleAdd}>
          <View
            style={{
              marginTop: 30,
              backgroundColor: '#1589FF',
              paddingLeft: 10,
              paddingRight: 10,
              paddingVertical: 5,
            }}>
            <Text style={{color: 'white'}}>Add</Text>
          </View>
        </Pressable>
      </View>
    );
  }
  const renderLocation = ({item, index}: {item: any; index: number}) => {
    let selectedPhoneMode = 'Silent';
    if (item.selectedPhoneMode === '2') selectedPhoneMode = 'Vibrate';
    else if (item.selectedPhoneMode === '3') selectedPhoneMode = 'Reject';
    const econtacts = item.emergencyContacts
      ? item.emergencyContacts.map((eitem: any) => eitem.displayName)
      : [];
    return (
      <Pressable
        onPress={() => {
          navigation.push('EditLocation', {location: item, index: index});
        }}>
        <View style={styles.location}>
          <Text style={{fontSize: 18, fontWeight: '600', color: 'black'}}>
            {item.location.name}
          </Text>
          <Text style={{fontSize: 13, color: 'black'}}>
            {item.location.address}
          </Text>
          <Text style={{fontSize: 13, color: 'black'}}>
            {selectedPhoneMode} Mode
          </Text>
          <Text style={{fontSize: 13, color: 'black'}}>
            {econtacts.length ? econtacts.join(', ') : ''}
          </Text>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        renderItem={renderLocation}
        keyExtractor={(item: any) => `${item.location.lat}${item.location.lng}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 25,
  },
  addContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  location: {
    width: '100%',
    paddingLeft: 20,
    minHeight: 80,
    justifyContent: 'center',
    borderBottomColor: '#d3d3de',
    borderBottomWidth: 1,
  },
});
