import Geolocation from '@react-native-community/geolocation';
import {DEFAULT_LOCATION} from './constants';
// import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
// import Geocoding from 'react-native-geocoding';

class LocationService {
  constructor() {}

  getCurrentUserLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {coords} = position;
          return resolve(coords);
        },
        error => {
          console.log('Error', JSON.stringify(error));
          return reject(error);
        },
        {enableHighAccuracy: false, timeout: 2000},
      );
    });
  };

  decodeLocation = (coordinates: {lat: number; lng: number}) => {
    // return Geocoding.from(coordinates.lat, coordinates.lng);
    return {results: [{formatted_address: {}}]};
  };

  getUserAddress = async () => {
    const currentLocation = await this.getCurrentUserLocation();
    const {latitude, longitude} = currentLocation as any;
    const coords = {lat: latitude, lng: longitude};
    const addressRes = await this.decodeLocation(coords);

    if (addressRes.results.length) {
      const address = addressRes.results[0].formatted_address;
      const name = this.getAddressName(addressRes.results[0]);
      return {
        address,
        name,
        coordinates: coords,
      };
    }
  };

  getAddressName = (address: any) => {
    const components = [
      'establishment',
      'point_of_interest',
      'neighborhood',
      'street_address',
      'sublocality',
      'locality',
      'administrative_area_level_2',
      'administrative_area_level_1',
      'country',
    ];
    const unacceptedNames = ['Unnamed Road'];
    const {address_components = []} = address;

    let name = '';
    for (let index = 0; index < address_components.length; index++) {
      const element = address_components[index];
      const currentItem = element.types.find((item: string) =>
        components.includes(item),
      );
      if (currentItem !== undefined) {
        if (unacceptedNames.includes(element.long_name)) {
          continue;
        }
        // set the name which is accepted.
        name = element.long_name;
        break;
      }
    }

    if (!name.length) {
      const _name = address.formatted_address.split(',')[0];
      if (unacceptedNames.includes(_name)) {
        name = address.formatted_address.split(',')[1];
      } else {
        name = _name;
      }
    }
    return name;
  };

  getFormatedAddress = (address: any, coordinates: any) => {
    const _address = address.results[0].formatted_address;
    const name = this.getAddressName(address.results[0]);

    return {
      address: _address,
      name,
      coordinates,
    };
  };

  getDefaultLocation = () => {
    return DEFAULT_LOCATION;
  };

  /**
   * This method is used to show the location enabler.
   * @param callback callback when a location service is enabled
   */
  enableLocationService = (
    callback: (
      response: {
        alreadyEnabled: Boolean;
        enabled: Boolean;
        status: string;
      } | null,
      error: any,
    ) => void,
    showPopup: boolean = false,
  ) => {
    // LocationServicesDialogBox.checkLocationServicesIsEnabled({
    //   message:
    //     "<h4 style='color: #0af13e'>Access Location</h4>Appstro needs your location to list nearby astrologers.",
    //   ok: 'Allow',
    //   cancel: 'NO',
    //   enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
    //   showDialog: showPopup, // false => Opens the Location access page directly
    //   openLocationServices: true, // false => Directly catch method is called if location services are turned off
    //   preventOutSideTouch: true, // true => To prevent the location services window from closing when it is clicked outside
    //   preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
    //   providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
    // })
    //   .then(function (success) {
    //     // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
    //     const {enabled} = success;
    //     callback?.(success, null);
    //   })
    //   .catch(error => {
    //     callback(null, error);
    //     console.log('LocationFailed', error.message); // error.message => "disabled"
    //   });
  };
}

export default new LocationService();
