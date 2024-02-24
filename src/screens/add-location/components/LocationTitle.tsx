import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Text,
} from 'react-native';

import images from '../../../res/images';

import colors from '../../../res/colors';

export interface Props {
  location?: any;
  onPressLocation?: () => void;
  style?: StyleProp<ViewStyle>;
}

const LocationTitle: React.FC<Props> = ({location, onPressLocation, style}) => {
  return (
    <View style={[style]}>
      <TouchableOpacity onPress={onPressLocation}>
        <View style={styles.locationDetailsStyle}>
          <Image style={styles.locaionIconStyle} source={images.ic_location} />
          <View style={styles.addressContianer}>
            <Text
              numberOfLines={1}
              style={[
                {
                  fontSize: 21,
                  fontFamily: 'Roboto-Bold',
                  fontWeight: 'bold',
                  color: colors.textColor,
                },
              ]}>
              {(location && location.name) || 'Fetching...'}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                {
                  fontSize: 15,
                  fontFamily: 'Roboto-Regular',
                  color: colors.textColor,
                },
              ]}>
              {(location && location.address) || ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LocationTitle;

const styles = StyleSheet.create({
  locaionIconStyle: {
    height: 35,
    width: 35,
    marginRight: 10,
    tintColor: colors.primary,
  },
  locationDetailsStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressContianer: {
    flex: 1,
  },
});
