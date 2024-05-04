import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import Contacts from 'react-native-contacts';
import { request, PERMISSIONS } from 'react-native-permissions';


const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const fetchContacts = async () => {
      
        Contacts.getAll()
            .then((contacts) => {
                
               
            })
            .catch((error) => {
             
            });
    };

    useEffect(() => {
      
        fetchContacts()
       //  requestContactsPermission();
    }, []);


    const requestContactsPermission = async () => {
        // Alert("i am nhit")
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: 'Contacts Permission',
                        message: 'This app requires access to your contacts.',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    fetchContacts();
                } else {
                  
                }
            } else {
                const status = await request(PERMISSIONS.IOS.CONTACTS);

                if (status === 'granted') {
                    fetchContacts();
                } else {
                   
                }
            }
        } catch (error) {
           
        }
    };

    // const renderItem = ({ item }) => (
    //     <View style={{ padding: 10 }}>
    //         <Text>ddddd</Text>
    //         {/* <Text style={{ fontSize: 18 }}>{item.givenName} {item.familyName}</Text>
    //     <Text style={{ fontSize: 14 }}>{item.phoneNumbers[0]?.number}</Text> */}
    //     </View>
    // );

    return (
        <Text>dddddd</Text>
        // <FlatList
        //     data={contacts}
        //     renderItem={renderItem}
        //     keyExtractor={item => item.recordID}
        // />
    );
};
export default ContactList;

