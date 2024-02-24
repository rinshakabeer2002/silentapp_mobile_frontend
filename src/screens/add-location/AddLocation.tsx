import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LocationTitle from './components/LocationTitle';
import GooglePlaces from './components/GooglePlaces';
import {DEFAULT_LOCATION} from '../../utils/constants';

export const AddLocation: React.FC = () => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const onPressLocation = () => {
    setShowLocationPicker(true);
  };
  const onPressCloseHandler = () => {
    setShowLocationPicker(false);
  };

  const onPlaceSelection = async (details: any) => {
    setShowLocationPicker(false);
    console.log('onPlaceSelection ', details);
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
  return (
    <View style={styles.container}>
      <LocationTitle
        location={DEFAULT_LOCATION}
        onPressLocation={onPressLocation}
        style={{
          marginTop: 10,
        }}
      />
      <Text>Add</Text>
      {showLocationPicker && (
        <GooglePlaces
          visible={showLocationPicker}
          onPressClose={onPressCloseHandler}
          selectionHandler={onPlaceSelection}
          showCurrentLocation
          history={[]}
        />
      )}
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
});
