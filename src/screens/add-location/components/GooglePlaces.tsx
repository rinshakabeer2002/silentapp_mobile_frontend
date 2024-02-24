import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import colors from '../../../res/colors';
// import {translate} from 'res/translations/translate';

import Config from 'react-native-config';
// import {Icon, Text} from 'react-native-elements';
// import {SafeAreaView} from 'react-native-safe-area-context';
import LocationService from '../../../utils/LocationService';

export interface Props {
  visible: true | false;
  selectionHandler?: (data?: any) => void;
  onPressClose?: () => void;
  showCurrentLocation?: boolean;
  history?: any[];
}

interface Location {
  description: string;
  geometry: {location: {lat: number; lng: number}};
  code?: string;
}

const GooglePlaces: React.FC<Props> = ({
  visible = false,
  onPressClose,
  selectionHandler,
  showCurrentLocation = false,
  history = [],
}) => {
  const [currentLocation] = useState<Location | null>({
    description: 'Current location',
    geometry: {location: {lat: 0, lng: 0}},
    code: 'currentLocation',
  });
  const [searchHistory, setSearchHistory] = useState<Location[]>([]);

  useEffect(() => {
    setUserSearchHistory(history);
  }, [history]);

  const fetchCurrentLocation = async () => {
    const address = await LocationService.getUserAddress();
    selectionHandler?.(address);
  };

  const setUserSearchHistory = (history: any[] = []) => {
    if (!history || history === undefined) return;

    const arrayHistory: Location[] | undefined = history.map(item => {
      const location = {location: item.coordinates};
      return {
        description: item.address,
        geometry: location,
      };
    });

    setSearchHistory(arrayHistory || []);
  };

  const getAddressComponent = (details: any) => {
    const formattedAddress = details.formatted_address || details.description;
    const coordinates = details.geometry.location;

    const locality =
      details.address_components &&
      details.address_components.find(item => item.types.includes('locality'));
    let localityName = '';
    if (!locality) {
      localityName = formattedAddress.split(',')[0];
    } else {
      localityName = locality.long_name;
    }

    return {
      address: formattedAddress,
      coordinates: coordinates,
      name: localityName,
    };
  };

  const RightButton = () => {
    return (
      <View style={styles.icon}>
        {/* <Icon
          size={30}
          name="ios-close"
          type="ionicon"
          color={colors.primary}
          onPress={onPressClose}
        /> */}
      </View>
    );
  };

  return (
    <Modal visible={visible} onRequestClose={onPressClose}>
      <View style={styles.header}></View>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.mainContainer}>
          <GooglePlacesAutocomplete
            placeholder={'Search'}
            keyboardShouldPersistTaps="always"
            minLength={3}
            listViewDisplayed="auto"
            returnKeyType={'default'}
            fetchDetails={true}
            predefinedPlaces={[currentLocation, ...searchHistory]}
            onPress={(data, details = null) => {
              if (data.code !== 'currentLocation') {
                const locationData = getAddressComponent(details);
                selectionHandler?.(locationData);
              } else {
                fetchCurrentLocation();
              }
            }}
            query={{
              key: Config.GOOGLE_API,
              language: 'en',
            }}
            styles={{
              textInputContainer: styles.inputContainer,
              textInput: styles.textInput,
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
            onFail={error => {
              console.log('error', error);
            }}
            renderRightButton={() => <RightButton />}
            debounce={200}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default GooglePlaces;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginLeft: 15,
    marginRight: 0,
    marginTop: 10,
  },
  inputContainer: {
    height: 50,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.textColor,
    overflow: 'hidden',
  },
  textInput: {
    color: '#5d5d5d',
    fontSize: 16,
    height: 55,
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
