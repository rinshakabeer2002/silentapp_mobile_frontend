import React from 'react';
import {StyleSheet, Image, View, Dimensions} from 'react-native';
import {TitleScreenNavigationProp} from '../AppNavigation';
import images from '../../res/images';

export const Title: React.FC<TitleScreenNavigationProp> = ({navigation}) => {
  React.useEffect(() => {
    setTimeout(() => {
      navigation.push('Locations');
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={images.logo}
        style={styles.logoStyle}
        resizeMode="contain"
      />
    </View>
  );
};
const screenWidthForImage = Dimensions.get('window').width * 0.8;
const ratio = screenWidthForImage / 546;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appItem: {
    width: '100%',
    paddingLeft: 20,
    height: 60,
    justifyContent: 'center',
    borderBottomColor: '#d3d3de',
    borderBottomWidth: 1,
  },
  logoStyle: {
    width: Dimensions.get('window').width * 0.8,
    height: 413 * ratio,
  },
});
