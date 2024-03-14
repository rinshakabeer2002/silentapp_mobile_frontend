import React, {useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Button,
  ScrollView,
  Dimensions,
} from 'react-native';
import LocationTitle from './components/LocationTitle';
import GooglePlaces from './components/GooglePlaces';
import {DEFAULT_LOCATION} from '../../utils/constants';
import Slider from '@react-native-community/slider';
import RadioGroup from 'react-native-radio-buttons-group';
import MapView, {Marker, Circle} from 'react-native-maps';
import {LocalStore} from '../../utils/LocalStore';
import {AddLocationScreenNavigationProp} from '../AppNavigation';
import EmergencyContacts from './components/EmergencyContacts';

export const AddLocation: React.FC<AddLocationScreenNavigationProp> = ({
  navigation,
}) => {
  const [selectedContacts, setSelectedContacts] = useState<Array<any>>([]);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showContactsPicker, setShowContactsPicker] = useState(false);
  const [radius, setRadius] = useState(1000);
  const [selectedPhoneMode, setSelectedPhoneMode] = useState('1');
  const [showOverlay, setShowOVerlay] = useState(false);
  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Silent',
        value: ' 1',
      },
      {
        id: '2',
        label: 'Vibrate',
        value: '2',
      },
      // {
      //   id: '3',
      //   label: 'Reject',
      //   value: '3',
      // },
    ],
    [],
  );
  const onPressLocation = () => {
    setShowLocationPicker(true);
  };
  const onPressCloseHandler = () => {
    setShowLocationPicker(false);
  };

  const onPlaceSelection = async (details: any) => {
    setShowLocationPicker(false);
    setLocation(details);
    // console.log('onPlaceSelection ', details);
    // updateAppState({
    //   type: APPCONTEXT_UPDATE_USER_LOCATION,
    //   payload: details,
    // });
    // const result = {...details, date: new Date().getTime()};
    // await LocalStore.saveLocationSearch(result);
    // getUserSearchHistory();
    // // getAstrologersAroundMe({});
    // loadNearestAstrologers(
    //   details.coordinates.lat + ',' + details.coordinates.lng,
    //   getFilterTags(),
    //   0,
    // );
  };
  const handleSave = () => {
    setShowOVerlay(true);
    const data = {
      location: location,
      radius: radius,
      selectedPhoneMode: selectedPhoneMode,
      emergencyContacts: selectedContacts,
    };
    setTimeout(async () => {
      const currentLocations = await LocalStore.getLocations();

      if (!currentLocations || !currentLocations.length) {
        await LocalStore.setLocations([data]);
        setShowOVerlay(false);
        navigation.pop();
      } else {
        const isAlreadyAdded = currentLocations.findIndex(
          (item: any) =>
            item.location.coordinates.lat === data.location.coordinates.lat &&
            item.location.coordinates.lng === data.location.coordinates.lng,
        );
        if (isAlreadyAdded < 0) {
          await LocalStore.setLocations([...currentLocations, data]);
          setShowOVerlay(false);
          navigation.pop();
        } else {
          setShowOVerlay(false);
          Alert.alert('Error', 'Location already added', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        }
      }
    }, 300);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{}}>
        <LocationTitle
          location={location}
          onPressLocation={onPressLocation}
          style={{
            marginTop: 10,
            paddingHorizontal: 10,
          }}
        />
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height * 0.4,
            backgroundColor: 'grey',
            marginTop: 20,
          }}>
          <MapView
            minZoomLevel={2} // default => 0
            maxZoomLevel={15} // default => 20
            region={{
              latitude: location.coordinates.lat,
              longitude: location.coordinates.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            initialRegion={{
              latitude: location.coordinates.lat,
              longitude: location.coordinates.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{width: '100%', height: '100%'}}>
            <Circle
              center={{
                latitude: location.coordinates.lat,
                longitude: location.coordinates.lng,
              }}
              radius={radius}
              fillColor={'rgba(255, 0, 0, 0.5)'}
            />
            <Marker
              coordinate={{
                latitude: location.coordinates.lat,
                longitude: location.coordinates.lng,
              }}
            />
          </MapView>
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 20,
            paddingHorizontal: 20,
            height: 60,
          }}>
          <Text style={{color: 'black'}}>Radius: {radius / 1000} KM</Text>
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={500}
            maximumValue={3000}
            step={500}
            value={radius}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={value => setRadius(value)}
          />
        </View>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 20,
            height: 60,
          }}>
          <Text style={{color: 'black'}}>Phone Mode</Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={setSelectedPhoneMode}
            selectedId={selectedPhoneMode}
            layout="row"
          />
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 20,
            paddingHorizontal: 20,
            minHeight: 80,
          }}>
          <View style={{flexDirection: 'row', height: 40}}>
            <Text style={{color: 'black'}}>Emergency Contacts</Text>
            <View style={{flex: 1}} />
            <Button
              title="Add"
              onPress={() => {
                setShowContactsPicker(true);
              }}
            />
          </View>
          {selectedContacts.map(item => (
            <View style={{width: '100%', height: 50}}>
              <Text style={{color: 'black'}}>{item.displayName}</Text>
              <Text style={{color: 'black'}}>
                {item.phoneNumbers.join(',')}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            paddingHorizontal: 20,
            height: 50,

            marginBottom: 50,
          }}>
          <Pressable onPress={handleSave}>
            <View
              style={{
                backgroundColor: '#1589FF',
                paddingLeft: 10,
                paddingRight: 10,
                paddingVertical: 5,
              }}>
              <Text style={{color: 'white'}}>Save</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      {showLocationPicker && (
        <GooglePlaces
          visible={showLocationPicker}
          onPressClose={onPressCloseHandler}
          selectionHandler={onPlaceSelection}
          showCurrentLocation
          history={[]}
        />
      )}
      {showContactsPicker && (
        <EmergencyContacts
          visible={showContactsPicker}
          onPressClose={() => {
            setShowContactsPicker(false);
          }}
          selectionHandler={(data: any) => {
            setShowContactsPicker(false);
            setSelectedContacts(data);
          }}
        />
      )}
      {showOverlay && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#d3d3d3',
            // elevation: 4
          }}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
