import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  FlatList,
  Text,
  Button,
  PermissionsAndroid,
  Pressable,
} from 'react-native';
import Contacts from 'react-native-contacts';
import colors from '../../../res/colors';
import CheckBox from '@react-native-community/checkbox';

export interface Props {
  visible: true | false;
  selectionHandler: (data?: any) => void;
  onPressClose?: () => void;
}

const EmergencyContacts: React.FC<Props> = ({
  visible = false,
  onPressClose,
  selectionHandler,
}) => {
  const [userContacts, setuserContacts] = useState<Array<any>>([]);
  const [selectedContacts, setSelectedContacts] = useState<Array<any>>([]);

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        Contacts.getAll()
          .then(contacts => {
            // work with contacts

            console.log(contacts);
            let cdata: any[] = [];
            if (contacts.length) {
              cdata = contacts.map(item => {
                const citem = {
                  displayName: item.displayName,
                  phoneNumbers: item.phoneNumbers.map(pitem => pitem.number),
                  recordID: item.recordID,
                };
                return citem;
              });
            }
            setuserContacts(cdata);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  }, []);

  const RightButton = () => {
    return (
      <View style={styles.icon}>
        <Button
          title="Done"
          onPress={() => selectionHandler(selectedContacts)}
        />
      </View>
    );
  };
  const renderLocation = ({item, index}: {item: any; index: number}) => {
    const sid = selectedContacts.findIndex(
      citem => citem.recordID === item.recordID,
    );
    return (
      <Pressable
        onPress={() => {
          if (sid > -1) {
            const sitems = selectedContacts.filter(
              citem => citem.recordID !== item.recordID,
            );
            setSelectedContacts(sitems);
          } else if (selectedContacts.length < 3) {
            const sitems = [...selectedContacts, item];
            setSelectedContacts(sitems);
          }
        }}>
        <View style={styles.contact}>
          <View
            style={{
              width: 50,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',

              marginRight: 5,
            }}>
            <CheckBox disabled={false} value={sid < 0 ? false : true} />
          </View>
          <View>
            <Text style={{fontSize: 18, fontWeight: '600', color: 'black'}}>
              {item.displayName}
            </Text>
            <Text style={{fontSize: 13, color: 'black'}}>
              {item.phoneNumbers.join(', ')}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <Modal visible={visible} onRequestClose={onPressClose}>
      <View style={styles.header}>
        <Text
          style={{
            marginLeft: 20,
            fontSize: 16,
            fontWeight: 'bold',
            color: 'black',
          }}>
          Emergency Contacts ({selectedContacts.length}/3)
        </Text>
        <View style={{flex: 1}} />
        <RightButton />
      </View>
      <View style={styles.container}>
        <FlatList
          data={userContacts}
          renderItem={renderLocation}
          keyExtractor={(item: any) => `${item.displayNamet}${item.recordID}`}
        />
      </View>
    </Modal>
  );
};

export default EmergencyContacts;

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
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    height: 64,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  icon: {
    width: 80,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contact: {
    width: '100%',
    paddingLeft: 0,
    height: 60,
    // justifyContent: 'center',
    borderBottomColor: '#d3d3de',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
});
