import React, {useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {View, Text, StyleSheet, Alert, ScrollView, Modal} from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RemotePushController = () => {
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [message, setmessage] = React.useState('');
  const [title, settitle] = React.useState('');
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function (token) {
        console.log('TOKEN=================:', token.token);
        await AsyncStorage.setItem('notificationToken', token.token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('notificationn');
        console.log(
          'REMOTE NOTIFICATION =========================>',
          notification,
        );
        console.log(
          'REMOTE NOTIFICATION =========================>',
          notification.title,
        );
        setmessage(notification.message);
        settitle(notification.title);
        if (notification.title) {
          setmodalVisible(true);
        }

        // PushNotification.localNotification(notification);
        // (required) Called when a remote is received or opened, or local notification is opened
        //  notification.finish(PushNotificationIOS.FetchResult.NoData);
        // process the notification here
        if (notification.foreground == false) {
          console.log('foreground');
          PushNotification.localNotification({
            title: notification.title,
            message: notification.message,
            // sound: true,
            soundName: 'testmoney.mp3',
            smallIcon: 'ic_launcher_notification',
          });
        }
        //   if (notification.background) {
        //     console.log("background")
        //     PushNotification.localNotification({
        //         title:notification.title,
        //         message:notification.message
        //     });
        //  }
      },
      // Android only: GCM or FCM Sender ID
      senderID: '538543691184',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return (
    console.log('message', typeof message),
    (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <ScrollView>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <AntDesign
                  style={{
                    marginTop: hp('-8%'),
                    alignSelf: 'flex-end',
                    marginRight: wp('-18%'),
                  }}
                  name="closecircle"
                  size={24}
                  color="#f00"
                  onPress={() => setmodalVisible(false)}
                />
                {/* <Text style={styles.modalText}>{title}</Text> */}
                <Text style={styles.modalText}>{title}</Text>
                <Text style={styles.modalText}>{message}</Text>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </>
    )
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalView: {
    margin: wp('10%'),
    backgroundColor: 'white',
    borderColor: '#4e31c1',
    borderRadius: 30,
    borderWidth: 10,
    padding: wp('20%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: wp('90%'),
    alignSelf: 'center',
  },
  modalText: {
    marginBottom: wp('10%'),
    textAlign: 'center',
    fontSize: 105,
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#4e31c1',
  },
});
export default RemotePushController;
