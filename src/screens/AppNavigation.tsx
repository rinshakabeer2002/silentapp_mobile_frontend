import * as React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import {Locations} from './locations/Locations';
import {AddLocation} from './add-location/AddLocation';
import {EditLocation} from './edit-location/EditLocation';
import {Title} from './title/Title';

type AppNavigationParamsList = {
  Title: undefined;
  Locations: undefined;
  AddLocation: undefined;
  EditLocation: {location: any; index: number};
};

const StackNavigator = createNativeStackNavigator<AppNavigationParamsList>();

export type TitleScreenNavigationProp = NativeStackScreenProps<
  AppNavigationParamsList,
  'Title'
>;
export type LocationsScreenNavigationProp = NativeStackScreenProps<
  AppNavigationParamsList,
  'Locations'
>;
export type AddLocationScreenNavigationProp = NativeStackScreenProps<
  AppNavigationParamsList,
  'AddLocation'
>;
export type EditLocationScreenNavigationProp = NativeStackScreenProps<
  AppNavigationParamsList,
  'EditLocation'
>;

export const AppNavigation = () => {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        initialRouteName={'Title'}
        screenOptions={
          {
            //   headerShown: false,
          }
        }>
        <StackNavigator.Screen
          name={'Title'}
          component={Title}
          options={{headerShown: false}}
        />
        <StackNavigator.Screen
          name={'Locations'}
          component={Locations}
          options={{title: 'Locations'}}
        />
        <StackNavigator.Screen
          name={'AddLocation'}
          component={AddLocation}
          options={{title: 'AddLocation'}}
        />
        <StackNavigator.Screen
          name={'EditLocation'}
          component={EditLocation}
          options={{title: 'EditLocation'}}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
};
