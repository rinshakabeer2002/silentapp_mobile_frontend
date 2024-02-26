import React, {useState, useEffect} from 'react';
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

export const Locations: React.FC<LocationsScreenNavigationProp> = ({
  navigation,
}) => {
  const [locations, setLocations] = useState<Array<any>>([]);
  const loadLocations = async () => {
    const data = await LocalStore.getLocations();
    if (data && data.length) setLocations(data);
    else setLocations([]);
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadLocations();
    });
    loadLocations();
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
  const renderLocation = ({item, index}: {item: any; index: number}) => {
    return (
      <Pressable
        onPress={() => {
          navigation.push('EditLocation', {location: item, index: index});
        }}>
        <View style={styles.location}>
          <Text style={{fontSize: 18, fontWeight: '600'}}>
            {item.location.name}
          </Text>
          <Text style={{fontSize: 13}}>
            {item.selectedPhoneMode === '1' ? 'Silent' : 'Vibrate'}
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
        keyExtractor={(item: {id: string; name: string; video: any}) => item.id}
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
    height: 60,
    justifyContent: 'center',
    borderBottomColor: '#d3d3de',
    borderBottomWidth: 1,
  },
});
