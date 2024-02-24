import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {LocalStore} from '../../utils/LocalStore';
import {LocationsScreenNavigationProp} from '../AppNavigation';

export const Locations: React.FC<LocationsScreenNavigationProp> = ({
  navigation,
}) => {
  const [locations, setLocations] = useState<Array<any>>([]);
  const loadLocations = async () => {
    const data = await LocalStore.getLocations();
    setLocations(data);
  };
  useEffect(() => {
    loadLocations();
  }, []);
  const handleAdd = () => {
    navigation.push('AddLocation');
  };
  if (!locations || !locations.length) {
    return (
      <View style={styles.addContainer}>
        <Text style={{textAlign: 'center'}}>
          Please add locations where you want phone to remain silent
        </Text>
        <Pressable onPress={handleAdd}>
          <View
            style={{
              marginTop: 30,
              backgroundColor: 'cyan',
              paddingLeft: 10,
              paddingRight: 10,
              paddingVertical: 5,
            }}>
            <Text>Add</Text>
          </View>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>Locations</Text>
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
});
