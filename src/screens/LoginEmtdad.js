import * as React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Modal,
  TouchableHighlight,
  BackHandler,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
// import { Icon } from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { getUniqueId } from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info';

import Geolocation from '@react-native-community/geolocation';

// import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

// import { DotIndicator } from 'react-native-indicators';

// import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-simple-toast';

import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import i18n from 'i18next';
import API_URL from './URL';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from '@brooons/react-native-bluetooth-escpos-printer';
import {withTranslation} from 'react-i18next';

// const requestBluetoothPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//       {
//         title: 'App Bluetooth Permission',
//         message:
//           'Alamtidad needs access to your Bluetooth ',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('You can use the Bluetooth');
//     } else {
//       console.log('Bluetooth permission denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

class Login extends React.Component {
  state = {
    user_phonenumber: '',
    user_password: '',
    Count: 0,
    modalVisible: false,
    modalVisible1: false,
    ExpoPushToken: '',
    flag: true,
    locationPermission: '',
    pos_longitude: null,
    pos_latitude: null,
    userphonenumber: '',
    telephone: '',
    showEnterCodeModal: false,
    activationCode: '',
    deviceId: '',
  };

  phonevalidation = '';
  passvalidtation = '';

  validatePhone = user_phonenumber => {
    if (user_phonenumber == '') {
      this.phonevalidation = 'Enterphonenumber';
      return false;
    } else {
      const reg = /^[0]?[789]\d{9}$/;
      if (reg.test(user_phonenumber) === false) {
        console.log('wrong regixxx');
        this.setState({
          validatePhone: false,
          telephone: user_phonenumber,
        });
        return false;
      } else {
        this.setState({
          validatePhone: true,
          telephone: user_phonenumber,
          message: i18n.t('userisfoundphonenumbernotverified'),
        });
        return true;
      }
    }
  };

  async CloseModal() {
    this.setState({modalVisible: false});
    try {
      await AsyncStorage.removeItem('Token');
      await AsyncStorage.removeItem('user_type_id');
      await AsyncStorage.removeItem('commercialName');
      await AsyncStorage.removeItem('regionId');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('user_phonenumber');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userFirstName');
      await AsyncStorage.removeItem('usermiddleName');
      await AsyncStorage.removeItem('userLastName');
      await AsyncStorage.removeItem('virtualMoneyBalance');
      await AsyncStorage.removeItem('area');
      await AsyncStorage.removeItem('region');
      await AsyncStorage.removeItem('userIdInUsers');
      BackHandler.exitApp();
    } catch (e) {
      console.log(e.message);
    }
  }

  async getDeviceLocation() {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log(position);
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        console.log(currentLongitude, '----------------------------');
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.setState({
          pos_latitude: currentLatitude,
          pos_longitude: currentLongitude,
        });
      },
      error => {
        console.log('HERE', error);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  }
  // new logic.....................................................>salma commit
  getDeviceId = () => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      console.log('deviceId', uniqueId);
      this.setState({deviceId: uniqueId});
      AsyncStorage.setItem('deviceId', uniqueId);
    });
    console.log('deviceId', this.state.deviceId);
  };

  requirePermission = () => {
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
      // …
      console.log({result});
      this.getUserLocation();
    });
  };

  checkPermission = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            this.requirePermission();
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            this.getUserLocation();

            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        // …
        console.log(error);
      });
  };

  getUserLocation = () => {
    Geolocation.getCurrentPosition(info => {
      console.log('getUserLocation', info);
      if (info?.coords) {
        const currentLongitude = JSON.stringify(info.coords.longitude);
        const currentLatitude = JSON.stringify(info.coords.latitude);
        this.setState({
          pos_latitude: currentLatitude,
          pos_longitude: currentLongitude,
        });
      }
    });
  };

  // ----------------------------------------------------------------------------------------
  componentDidMount = async () => {
    console.log(
      "Platform.constants['Release']============>",
      Platform.constants['Release'].split('.')[0] >= 7,
    );

    if (Platform.constants['Release'].split('.')[0] >= 10) {
      let granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION
      ]);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Bluetooth');
      } else {
        console.log('Bluetooth permission denied');
      }
    }
    // new way to get device id
    this.getDeviceId();
    // new way to check location permission and ask for permission...........................................
    this.getUserLocation();
    // ...............................................................
    let user_phonenumber = await AsyncStorage.getItem('user_phonenumber');
    this.setState({user_phonenumber});
    // start new hash ----------------------------------->salma
    // const locationPermission = await AsyncStorage.getItem('locationPermission')
    // try {
    //   if (locationPermission != "denied") {

    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {}
    //       // {
    //       //   title: "Location Permission",
    //       //   message: "يرجى فتح نظام تحديد المواقع",
    //       //   buttonNeutral: "لاحقا",
    //       //   buttonNegative: "إلغاء",
    //       //   buttonPositive: "موافق"
    //       // }
    //     );
    //     await AsyncStorage.setItem('locationPermission', granted)

    //     // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     //   Geolocation.getCurrentPosition(
    //     //     (position) => {
    //     //       //do stuff with location
    //     //       const currentLongitude =
    //     //         JSON.stringify(position.coords.longitude);
    //     //       //getting the Latitude from the location json
    //     //       const currentLatitude = JSON.stringify(position.coords.latitude);
    //     //       this.setState({ pos_latitude: currentLatitude, pos_longitude: currentLongitude })
    //     //       //  this.getDeviceLocation()
    //     //     },
    //     //     (error) => {
    //     //       this.setState({ pos_latitude: null, pos_longitude: null })
    //     //       console.log("ERROR position", error)
    //     //     },
    //     //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    //     //   );
    //     //   // LocationServicesDialogBox.checkLocationServicesIsEnabled({
    //     //   //   message: "يرجى فتح نظام تحديد المواقع",
    //     //   //   ok: "موافق",
    //     //   //   cancel: "إلغاء"
    //     //   // }).then((success) => {
    //     //   //   this.getDeviceLocation()

    //     //   // })
    //     //   // .catch((error) => {
    //     //   //   console.log(error.message); // error.message => "disabled"
    //     //   // });
    //     //   // this.setState({pos_latitude: 'unDetermined', pos_longitude: 'unDetermined'})
    //     // }
    //   }
    //   else {
    //     console.log('Permission denied!')
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
    // end new hash-------------------------------------------> salma commit

    //   const unsubscribe = this.navigation.addListener('focus', async () => {
    //   this.setState({user_password:''})

    //     //BackHandler.addEventListener('hardwareBackPress', () =>_handleBackButtonClick())
    // return () =>
    BackHandler.removeEventListener('hardwareBackPress', () =>
      _handleBackButtonClick(),
    );

    // this._loadFontsAsync();

    // const gpsEnabledornot=await Location.getProviderStatusAsync();
    // console.log("gpsEnabledornot",gpsEnabledornot);
    // if(gpsEnabledornot.gpsAvailable==true)
    // {
    // const  status= await Permissions.getAsync(Permissions.LOCATION)
    //  if(status.status=="granted")
    //  {  //  console.log("status in login",status.status);
    //      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
    //   // setLocation(location);
    //       this.setState({pos_longitude:location.coords.longitude,pos_latitude:location.coords.latitude})
    //  }
    // }
    //  await Font.loadAsync({
    //   'Cairo-SemiBold': require('../../assets/fonts/Cairo-SemiBold.ttf'),
    // });
    // this.setState({ fontLoaded: true});

    // const deviceId = getUniqueId();
  };

  validatePassword = user_password => {
    if (user_password == '') {
      this.passvalidtation = 'EnterPassword';
      return false;
    } else {
      return true;
    }
  };

  async ChangeDevice2() {
    // const deviceId = getUniqueId();
    let data = {
      user_phonenumber: this.state.user_phonenumber,
      requestesd_device_number: 2,
      device_identifier: this.state.deviceId,
    };

    if (this.state.user_phonenumber == '') {
      Toast.show(i18n.t('pleaseEnterRightDataa'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
      });
    } else {
      try {
        const response = await axios.post(API_URL + 'addrequesteddevice', data);
        console.log('Responseeeeee', response.data);
        if (response.data == 'Token UnAuthorized') {
          // console.log("ssss");
          Toast.show(i18n.t('The System Is Off'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
        } else {
          Toast.show('sended', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
          this.setState({modalVisible1: false});
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async ChangeDevice3() {
    // const deviceId = getUniqueId();
    let data = {
      user_phonenumber: this.state.user_phonenumber,
      requestesd_device_number: 3,
      device_identifier: this.state.deviceId,
    };

    if (this.state.user_phonenumber == '') {
      Toast.show(i18n.t('pleaseEnterRightDataa'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
      });
    } else {
      try {
        const response = await axios.post(API_URL + 'addrequesteddevice', data);
        if (response.data == 'Token UnAuthorized') {
          Toast.show(i18n.t('The System Is Off'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
        } else {
          Toast.show('sended', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
          this.setState({modalVisible1: false});
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  sayhi = () => {
    this.setState({flag: true});
  };
  async SuspendUser() {
    if (this.state.Count >= 10) {
      //axios call to make user suspended
      //open modal to tell him
      try {
        const response = await axios.post(API_URL + 'block-device', {
          deviceId: this.state.deviceId,
        });
        //  console.log("Response",response);
        if (
          response.data.message == 'user is suspended for multiple fail loggin'
        ) {
          //  console.log("Suspend User");
          this.setState({modalVisible: true});

          try {
            await AsyncStorage.setItem('FailedToLOGIN3Time', '3');
          } catch (e) {
            console.log(e.message);
          }
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  async LogLogin() {
    console.log('entered to log login');
    // const deviceId = getUniqueId();
    let data = {
      userPhoneNumber: this.state.user_phonenumber,
      password: this.state.user_password,
      deviceId: this.state.deviceId,
      deviceType: 'نقطة بيع',
    };
    console.log({data});
    axios
      .post(API_URL + 'log/login', data)
      .then(response => {
        console.log('response', response);
      })
      .catch(e => {
        console.log(e);
      });
  }

  async onLoginPressed() {
    let Phonevalidationflag = this.validatePhone(this.state.user_phonenumber);
    let passvalidationflag = this.validatePassword(this.state.user_password);

    // const deviceId = getUniqueId();
    await this.getDeviceLocation();

    let data = {
      user_phonenumber: this.state.user_phonenumber,
      user_password: this.state.user_password,
      device_identifier: this.state.deviceId,
      deviceType: 3,
      posCurrentLongitude: this.state.pos_longitude,
      posCurrentLatitude: this.state.pos_latitude,
    };
    let passpattern = /^.{4,}$/;
    //
    console.log('sttaate', this.state);
    if (
      this.state.user_phonenumber == '' ||
      this.state.user_phonenumber.length != 11 ||
      this.state.user_password.match(passpattern) == null
    ) {
      Toast.show(i18n.t('pleaseEnterRightDataa'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
      });
      this.SuspendUser();
      this.LogLogin();
    } else {
      this.setState({flag: false});
      setTimeout(this.sayhi, 4000);
      try {
        console.log('entered to login');
        const response = await axios.post(API_URL + 'login', data);
        console.log('login response', response);
        if (response.data == 'Token UnAuthorized') {
          Toast.show(i18n.t('The System Is Off'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ==
          'user account not activated'
        ) {
          Toast.show(i18n.t('useraccountnotactivated'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ==
          'incorrect username or password'
        ) {
          Toast.show(i18n.t('Usernotregistered'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
          this.SuspendUser();
          this.LogLogin();
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ==
          'user account not activated'
        ) {
          Toast.show(i18n.t('userisfoundphonenumbernotverified'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ==
          'incorrect username or password'
        ) {
          Toast.show(
            // (
            i18n.t('IncorrectPasswordOrphonenumber'),
            Toast.LONG,
            {
              backgroundColor: 'red',
              fontSize: 19,
            },
          );
          this.SuspendUser();
          this.LogLogin();
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ===
          'user Logged in successfully'
        ) {
          if (response.data.user_type_id != 3) {
            //  console.log("usernotpos");
            Toast.show(i18n.t('IncorrectPasswordOrphonenumber'), Toast.LONG, {
              backgroundColor: 'red',
              fontSize: 19,
            });
            this.SuspendUser();
            this.LogLogin();
          } else {
            const AccessToken = JSON.stringify(response.data.usertoken).replace(
              /\"/g,
              '',
            );
            const posType = JSON.stringify(response.data.posType).replace(
              /\"/g,
              '',
            );
            const dealerId = JSON.stringify(response.data.dealerId).replace(
              /\"/g,
              '',
            );
            const user_type_id = JSON.stringify(
              response.data.user_type_id,
            ).replace(/\"/g, '');
            const user_phonenumber = JSON.stringify(
              response.data.phoneNumber,
            ).replace(/\"/g, '');
            const userEmail = JSON.stringify(response.data.userEmail).replace(
              /\"/g,
              '',
            );
            const userFirstName = JSON.stringify(
              response.data.userFirstName,
            ).replace(/\"/g, '');
            const usermiddleName = JSON.stringify(
              response.data.usermiddleName,
            ).replace(/\"/g, '');
            const userLastName = JSON.stringify(
              response.data.userLastName,
            ).replace(/\"/g, '');
            const virtualMoneyBalance = JSON.stringify(
              response.data.virtualMoneyBalance,
            ).replace(/\"/g, '');
            const area = JSON.stringify(response.data.area).replace(/\"/g, '');
            const region = JSON.stringify(response.data.region).replace(
              /\"/g,
              '',
            );
            const regionId = JSON.stringify(response.data.regionId).replace(
              /\"/g,
              '',
            );
            const userId = JSON.stringify(response.data.userId).replace(
              /\"/g,
              '',
            );
            const userIdInUsers = JSON.stringify(
              response.data.userIdInUsers,
            ).replace(/\"/g, '');
            const commercialName = JSON.stringify(
              response.data.commercialName,
            ).replace(/\"/g, '');
            const poslimit = JSON.stringify(response.data.poslimit).replace(
              /\"/g,
              '',
            );
            AsyncStorage.setItem('Token', AccessToken);
            AsyncStorage.setItem('dealerId', dealerId);
            AsyncStorage.setItem('posType', posType);
            AsyncStorage.setItem('poslimit', poslimit);
            AsyncStorage.setItem('regionId', regionId);
            AsyncStorage.setItem('commercialName', commercialName);
            AsyncStorage.setItem('userId', userId);
            AsyncStorage.setItem('user_type_id', user_type_id);
            AsyncStorage.setItem('user_phonenumber', user_phonenumber);
            AsyncStorage.setItem('userEmail', userEmail);
            AsyncStorage.setItem('userFirstName', userFirstName);
            AsyncStorage.setItem('usermiddleName', usermiddleName);
            AsyncStorage.setItem('userLastName', userLastName);
            AsyncStorage.setItem('virtualMoneyBalance', virtualMoneyBalance);
            AsyncStorage.setItem('area', area);
            AsyncStorage.setItem('region', region);
            AsyncStorage.setItem('userIdInUsers', userIdInUsers);

            let data = {};
            const notificationToken = await AsyncStorage.getItem(
              'notificationToken',
            );
            const userID = parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
              10,
            );
            let Token = await AsyncStorage.getItem('Token');
            let user_type_id2 = await AsyncStorage.getItem('user_type_id');
            console.log('deviceId', this.state.deviceId);
            axios
              .post(
                API_URL +
                  `log/blocked?s=${parseInt(
                    await AsyncStorage.getItem('userIdInUsers'),
                  )}`,
                {deviceId: this.state.deviceId},
                {
                  headers: {
                    'x-access-token': `${await AsyncStorage.getItem('Token')}`,
                  },
                },
              )
              .then(response2 => {
                console.log('response', response2);
                //  this.registerForPushNotificationsAsync().then(async token => {
                //  //  console.log("Tokennn",token);
                if (typeof notificationToken === 'string') {
                  console.log({
                    'type of notificationToken': typeof notificationToken,
                    notificationToken,
                  });
                  axios
                    .post(
                      API_URL + `notificationtoken?s=${parseInt(userID)}`,
                      {userId: userID, userToken: notificationToken},
                      {
                        headers: {
                          'x-access-token': `${Token}`,
                        },
                      },
                    )
                    .then(response => {
                      console.log({response});
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }
                //   });
                console.log({user_type_id2});
                if (user_type_id2 == 3) {
                  //POS

                  Toast.show(i18n.t('Welcome'), Toast.LONG, {
                    backgroundColor: 'green',
                    fontSize: 19,
                  });
                  // console.log("HIII");
                  //  console.log("PushTokennnn",this.state.ExpoPushToken);
                  this.props.navigation.navigate('test', {
                    virtualMoneyBalance,
                    previousScreen: 'Login',
                  });
                  this.setState({user_password: ''});
                } else {
                  this.setState({Count: this.state.Count + 1});
                  Toast.show(
                    'انت لست نقطة بيع برجاء التأكد من استعمال التطبيق الصحيح',

                    Toast.LONG, //  {
                    //   containerStyle: { backgroundColor: "red" },
                    //   textStyle: { fontSize: 19 }

                    // }
                  );
                  this.SuspendUser();
                  this.LogLogin();
                }
              })
              .catch(e => {
                console.log(e);
                this.setState({Count: this.state.Count + 1});
                Toast.show(
                  'يوجد مشكلة في الانترنت يرجى الانتظار قليلا',
                  Toast.LONG, //  {
                  //   containerStyle: { backgroundColor: "red" },
                  //   textStyle: { fontSize: 19 }
                  // }
                );
                this.SuspendUser();
                this.LogLogin();
              });
          }
        }
      } catch (error) {
        if (error.response.data.message == 'user account not activated') {
          // console.log("if");
          this.setState({showEnterCodeModal: true});
        } else if (error.response.data.message == 'user account is suspended') {
          // console.log("if");
          // this.setState({showEnterCodeModal: true})
          Toast.show(
            'لقد تم وقف حسابك برجاء التواصل مع الادارة للتفعيل',
            Toast.LONG, // {
            //   containerStyle: { backgroundColor: "red" },
            //   textStyle: { fontSize: 19 }

            // }
          );
        } else if (
          error.response.data.message == 'user is blocked with Blocked status'
        ) {
          // console.log("if");
          Toast.show('لقد تم حظر هذا الجهاز', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });
        } else if (
          error.response.data.message ==
          'user tried to login from unauthroized device update a device'
        ) {
          Toast.show(
            i18n.t(
              'user tried to login from unauthroized device update a device',
            ),
            Toast.LONG,
            {
              backgroundColor: 'red',
              fontSize: 19,
            },
          );
          this.setState({modalVisible1: true});
        } else if (
          error.response.data.message == 'incorrect username or password'
        ) {
          this.setState({Count: this.state.Count + 1});
          //   console.log("Password Error", this.state.Count);
          Toast.show(i18n.t('IncorrectPasswordOrphonenumber'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
          });

          this.SuspendUser();
          //this.LogLogin();
        }
        // else if (error.response.data.message == "incorrect username or password") {    //  console.log("if");
        //   this.setState({ Count: this.state.Count + 1 })
        //   Toast.show (('Usernotregistered'), {
        //     containerStyle: { backgroundColor: "red" },
        //     textStyle: { fontSize: 19 }

        //   })
        //   this.SuspendUser()
        //  // this.LogLogin()
        // }
        else {
          Toast.show(
            'يوجد مشكلة في الانترنت يرجى الانتظار قليلا',
            Toast.LONG, //  {
            //   containerStyle: { backgroundColor: "red" },
            //   textStyle: { fontSize: 19 }

            // }
          );
          this.SuspendUser();
          this.LogLogin();
        }
      }
    }
  }

  activateAccount = () => {
    console.log(
      'ACTIVATE ACCOUNT',
      this.state.user_phonenumber,
      this.state.activationCode,
    );
    if (
      !this.state.activationCode.trim() ||
      this.state.activationCode === null ||
      isNaN(this.state.activationCode)
    ) {
      console.log(
        'modified price is not a valid number',
        this.state.activationCode,
      );
      Toast.show(i18n.t('pleaseEnterRightDataa'), Toast.LONG, {
        position: 660,
        backgroundColor: 'red',
        fontSize: 19,
        mask: true,
      });
    } else {
      axios
        .post(API_URL + 'pos/activate', {
          user_phonenumber: this.state.user_phonenumber,
          activation_digits: parseInt(this.state.activationCode),
        })
        .then(response => {
          console.log('RESPONSE', response.status);
          if (response.status == 200) {
            this.setState({showEnterCodeModal: false});
          }
        })
        .catch(error => {
          console.log(
            'ERROR',
            error.response.data.message,
            'Activation code is expired',
          );

          if (error.response.data.message == 'Activation code is incorrect') {
            Toast.show(
              i18n.t('incorrectActivationCode'),
              Toast.LONG, // {
              //   containerStyle: { backgroundColor: "red" },
              //   textStyle: { fontSize: 19 },
              //   position: Toast.position.bottom,
              // }
            );
          } else if (
            error.response.data.message == 'Activation code is expired'
          ) {
            Toast.show(
              i18n.t('expiredActivationCode'),
              Toast.LONG, //  {
              //   containerStyle: { backgroundColor: "red" },
              //   textStyle: { fontSize: 19 },
              //   position: Toast.position.bottom,
              // }
            );
          }
        });
    }
  };

  render() {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible1}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <View style={styles.centeredView}>
            <ScrollView>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{i18n.t('Would')} </Text>

                <TouchableHighlight
                  style={styles.button13}
                  onPress={() => this.ChangeDevice2()}>
                  <Text style={styles.btnText33}>
                    {' '}
                    {i18n.t('SecondDevice')}
                  </Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.button13}
                  onPress={() => this.ChangeDevice3()}>
                  <Text style={styles.btnText33}> {i18n.t('ThirdDevice')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.button13}
                  onPress={() => {
                    this.setState({modalVisible1: false});
                  }}>
                  <Text style={styles.btnText33}> {i18n.t('close')}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showEnterCodeModal}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <AntDesign
                style={{
                  marginBottom: hp('1%'),
                  marginTop: hp('-4%'),
                  alignSelf: 'flex-end',
                  marginRight: wp('-9%'),
                }}
                name="closecircle"
                size={24}
                color="#f00"
                onPress={() => this.setState({showEnterCodeModal: false})}
              />

              <Text style={styles.modalText}>
                {i18n.t('EnterActivationCode')}{' '}
              </Text>
              <TextInput
                placeholder={'الرقم'}
                placeholderTextColor="#4e31c1"
                underlineColorAndroid="transparent"
                style={styles.modalInputStyle}
                onChangeText={text => this.setState({activationCode: text})}
                keyboardType="number-pad"
                maxLength={4}
              />

              <TouchableHighlight
                style={styles.button}
                onPress={this.activateAccount}>
                <Text style={styles.btnText}> {i18n.t('ok')}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <View style={styles.centeredView}>
            <ScrollView>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{i18n.t('SuspendUser')} </Text>
                <Text
                  style={styles.modalText}
                  onPress={() => Linking.openURL(`tel:07721991133`)}>
                  07721991133
                </Text>
                <Text
                  style={styles.modalText}
                  onPress={() => Linking.openURL(`tel:07821991133`)}>
                  07821991133
                </Text>
                <Text style={styles.modalText}>{i18n.t('toactivate')} </Text>
                <TouchableHighlight
                  style={styles.button13}
                  onPress={() => {
                    this.CloseModal();
                  }}>
                  <Text style={styles.btnText33}> {i18n.t('close')}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <View style={styles.containerBig}>
          <ImageBackground
            source={require('../../assets/top1.png')}
            style={{
              height: '100%',
              width: Dimensions.get('window').width,
              alignself: 'center',
              flex: 1,
            }}></ImageBackground>
        </View>
        <View
          style={{
            flex: 2,
            backgroundColor: '#8a53e5',
          }}>
          <ScrollView
            style={{
              backgroundColor: '#fff',
              alignself: 'center',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              marginTop: hp('-1%'),
            }}>
            <View>
              {/* style={{marginTop:hp('11%')} */}

              {/* <Image
      width={Dimensions.get('window').width*0.6} // height will be calculated automatically
       source={require('../../assets/user.png')}
       style={{alignself:'center'}}
       
   /> */}
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: hp('1%'),
                }}>
                <EvilIcons name="user" size={94} color="#7d54e1" />
              </View>
              {/* <Text style={styles.Title1} >  {i18n.t('userPhone')}</Text> */}
              <View style={[styles.searchSection, {marginRight: 10}]}>
                <TextInput
                  underlineColorAndroid="transparent"
                  value={this.state.user_phonenumber}
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={text => this.setState({user_phonenumber: text})}
                  placeholder={this.state.user_phonenumber}
                  placeholderTextColor="#cbb8ef"
                />
                {/* <View 
     style={{
      borderColor:'#909093',
      borderBottomWidth:1,
      borderTopWidth:1,
      borderRightWidth:1,
      paddingTop:'4%',
      paddingBottom:'4%',
      paddingRight:'5%',
      paddingLeft:'5%',
     }}> */}
                {/* <MaterialCommunityIcons name='cellphone-iphone' size={25} color="#7d54e1" /> */}
                <Image
                  source={require('../../assets/001-smartphone-call.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#7d54e1',
                  }}
                />
                {/* </View> */}
              </View>

              {/* <Text style={styles.Title1} >  {i18n.t('password')}</Text> */}

              <View style={styles.searchSection}>
                <TextInput
                  secureTextEntry={true}
                  value={this.state.user_password}
                  placeholder={i18n.t('password')}
                  placeholderStyle={styles.inputPlaceholder}
                  placeholderTextColor="#cbb8ef"
                  style={styles.input}
                  autoCompleteType="password"
                  onChangeText={text => this.setState({user_password: text})}
                  underlineColorAndroid="transparent"
                  //  keyboardType='visible-password'
                  keyboardAppearance="light"
                />
                {/* <Text style={styles.errormessage}>{this.passvalidtation}</Text> */}
                <AntDesign
                  name="lock"
                  size={25}
                  color="#7d54e1"
                  style={{marginRight: 12}}
                />
              </View>

              {this.state.flag == true ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.onLoginPressed()}>
                  <Text style={styles.btnText}>{i18n.t('signin')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} disabled={true}>
                  <Text style={styles.btnTextfalse}>{i18n.t('signin')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.signupBtn}>
                <Text
                  onPress={() => {
                    this.props.navigation.navigate('Registration');
                  }}
                  style={styles.signupText}>
                  {i18n.t('SignUp')}
                </Text>
              </TouchableOpacity>
              {/* <Text
style={{
color:'#7d54e1',
alignSelf:'center',
fontFamily:'Cairo_600SemiBold',
fontSize:30,
marginTop:hp('9%'),
marginBottom:hp('1%'),
fontFamily:"Cairo_600SemiBold"
}}
onPress={() => { this.props.navigation.navigate('Registration')}}>
{("SignUp")}

</Text> */}
              {/* <TouchableOpacity style={styles.button}  onPress={() =>this.props.navigation.navigate('Registration')}   >
 <Text style={styles.btnText}>{i18n.t('SignUp')}</Text>
</TouchableOpacity> */}
              {/* 
<TouchableOpacity style={styles.Registerbutton}  onPress={() =>this.props.navigation.navigate('Registration')}   >
 <Text style={styles.RegisterbtnText}>{i18n.t('SignUp')}</Text>
</TouchableOpacity> */}
            </View>
          </ScrollView>
        </View>
      </>
    );
    //}
  }
}
export default withTranslation()(Login);
const styles = StyleSheet.create({
  modalInputStyle: {
    //backgroundColor: 'transparent',
    //color: 'transparent',
    fontSize: wp('7%'),
    borderRadius: 6,
    borderColor: '#4e31c1',
    borderWidth: 0.7,
    marginBottom: hp('3'),
    paddingHorizontal: wp('5%'),
    color: '#000000',

    backgroundColor: 'transparent',
    textAlign: 'right',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  Registerbutton: {
    // width: 300,
    marginBottom: hp('2%'),
    //   marginLeft: 110,
    backgroundColor: '#7d54e1',
    borderColor: '#DCDCDC',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: wp('1%'),
    borderWidth: wp('0.3%'),
    width: wp('64%'),
    marginRight: wp('6%'),
    height: hp('6%'),
    alignSelf: 'center',
    marginTop: hp('5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,

    textAlign: 'center',
    //marginBottom:hp('5%'),
  },
  RegisterbtnText: {
    color: '#fff',
    fontSize: wp('6%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    //  marginLeft:wp('5%'),
    marginTop: hp('-0.5%'),
  },
  signupBtn: {
    boder: 2,
    borderColor: '#562dc7',
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('15%'),
    alignSelf: 'center',
    marginRight: wp('4.5%'),
    marginTop: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#7d54e1',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    fontSize: 25,
    zIndex: 9,
  },
  button: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('15%'),
    alignSelf: 'center',
    marginRight: wp('4.5%'),
    marginTop: hp('5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: wp('70%'),
    alignSelf: 'center',
    marginTop: hp('4%'),
    marginLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  inputPlaceholder: {
    fontFamily: 'Cairo-SemiBold',
  },
  input: {
    marginTop: hp('-0.9%'),
    fontSize: wp('5%'),
    borderRadius: 10,
    // borderColor:"#D3D3D3",
    // borderWidth:2.5,
    alignSelf: 'center',
    color: '#000000',
    // height:hp('6%'),
    width: wp('67.6%'),
    backgroundColor: '#fafafc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,

    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
  },
  button2: {
    backgroundColor: 'transparent',
    marginLeft: wp('10%'),
  },
  btnText2: {
    color: '#4e31c1',
    marginLeft: hp('10%'),
    fontSize: wp('7%'),
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginBottom: hp('25%'),
    marginTop: hp('5%'),
  },
  btnText: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
    marginTop: hp('-1%'),
  },

  btnTextfalse: {
    color: '#59595A',
    textAlign: 'center',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    marginTop: hp('-1%'),
  },
  inputStyle: {
    marginTop: hp('-0.9%'),
    fontSize: wp('5%'),
    borderRadius: 100,
    borderColor: '#D3D3D3',
    borderWidth: 2.5,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6%'),
    width: wp('67.6%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,

    textAlign: 'center',
  },
  errormessage: {
    color: '#fff',
    marginTop: hp('1%'),
  },

  InputsOut: {
    //  marginBottom:hp('2%'),
    fontSize: wp('5%'),
    borderRadius: 70,
    borderColor: '#4e31c1',
    borderWidth: 9,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6.9%'),
    width: wp('69.8%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
  },

  Inputs: {
    marginTop: hp('-1%'),
    //  marginBottom:hp('2%'),
    fontSize: wp('5%'),
    borderRadius: 70,
    borderColor: '#FFF',
    borderWidth: 9,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6.5%'),
    width: wp('69%'),
    backgroundColor: '#FFFAFA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
  },

  InputsContainer: {
    top: hp('30%'),
    marginBottom: hp('2%'),
  },
  InputsContainer2: {
    top: hp('30.5%'),
    marginBottom: hp('2%'),
  },

  InputsContainerbutton: {
    top: hp('7%'),
    alignSelf: 'flex-start',
  },

  tinyLogo: {
    top: hp('20%'),
    height: hp('30%'),
    width: wp('50%'),
  },
  image: {
    position: 'absolute',
    height: hp('100%'),
    width: wp('100%'),
    // marginTop:hp('-5%'),
  },

  subTitle: {
    // top: hp('33%'),
    color: '#4e31c1',
    //  marginLeft:hp('4%'),
    //  marginRight:wp('5%'),
    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',

    //marginBottom:hp('3%')
  },
  NotAuthorizrd: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    marginTop: hp('16%'),
  },

  btnText6: {
    color: '#C81717',
    fontSize: wp('8%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    marginTop: wp('129%'),
  },

  btnText7: {
    color: '#C81717',
    fontSize: wp('6%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    marginTop: wp('12%'),
  },

  Title: {
    top: hp('27%'),
    color: '#FFFFFF',
    //  marginLeft:hp('7.5%'),
    //  marginRight:wp('5%'),
    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
  },
  TitleNewaccount: {
    marginTop: hp('15%'),
    color: '#4e31c1',
    marginLeft: hp('10%'),
    fontSize: wp('7%'),
    fontFamily: 'Cairo-SemiBold',

    // marginBottom:hp('2%'),
  },

  modalView: {
    margin: wp('10%'),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: wp('15%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: wp('85%'),
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: wp('10%'),
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#4e31c1',
  },

  button13: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: hp('7%'),
    alignSelf: 'center',
    marginRight: wp('9%'),
    marginTop: hp('5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
  },
  btnText33: {
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
    // marginTop:hp("1.5%")
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  Title1: {
    top: hp('4%'),
    color: '#4e31c1',
    marginLeft: hp('6.5%'),
    //  marginRight:wp('1%'),
    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
  },
  inputStyle1: {
    marginTop: hp('-0.9%'),
    fontSize: wp('5%'),
    borderRadius: 100,
    borderColor: '#D3D3D3',
    borderWidth: 2.5,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6%'),
    width: wp('67.6%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
  },

  InputsOut1: {
    //  marginBottom:hp('2%'),
    fontSize: wp('5%'),
    borderRadius: 70,
    borderColor: '#4e31c1',
    borderWidth: 9,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6.9%'),
    width: wp('69.8%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
  },
  Inputs1: {
    marginTop: hp('-1%'),
    //  marginBottom:hp('2%'),
    fontSize: wp('5%'),
    borderRadius: 70,
    borderColor: '#FFF',
    borderWidth: 9,
    alignSelf: 'center',
    color: '#000000',
    height: hp('6.5%'),
    width: wp('69%'),
    backgroundColor: '#FFFAFA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
  },
  InputsContainer1: {
    top: hp('27.3%'),
    marginBottom: hp('2%'),
  },
  POS1: {
    fontSize: wp('7%'),
    textAlign: 'left',
    // marginTop: hp('15%'),
    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    marginBottom: hp('11%'),
  },
  POS3: {
    fontSize: wp('7%'),
    textAlign: 'left',
    marginTop: hp('2%'),
    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',
  },
  POS: {
    fontSize: wp('7%'),
    textAlign: 'left',

    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',

    //marginTop:hp('15%'),
    //marginBottom:hp('2%'),
  },
  containerBig: {
    flex: 1,
    backgroundColor: '#8a53e5',
  },

  POSphone: {
    fontSize: wp('5%'),
    textAlign: 'center',
    marginTop: hp('5%'),
  },
  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('120%'),
  },
  container: {
    borderWidth: wp('0.2'),
    borderColor: '#C81717',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: wp('2%'),
    marginLeft: wp('20%'),
    top: hp('1%'),
    height: hp('30%'),
    width: hp('30%'),
    //marginBottom:hp('1%'),
  },
  tinyLogo: {
    top: hp('1%'),
    height: hp('30%'),
    width: wp('60%'),
    marginLeft: wp('20%'),
  },

  NotAuthorizrd: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    marginTop: wp('16%'),
  },

  btnText6: {
    color: '#C81717',
    fontSize: wp('8%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    marginTop: wp('129%'),
  },
  ImageAsiacell: {
    //  marginLeft:wp('25%'),
    marginBottom: hp('1%'),
    marginTop: hp('-1%'),
    //padding:wp('11%'),
    //marginRight:wp('-1.5%')
  },
  ImageAsiacell3: {
    //  marginLeft:wp('25%'),
    marginBottom: hp('1%'),
    marginTop: hp('-0.32%'),
    //padding:wp('11%'),
    //marginRight:wp('-1.5%')
  },
  ImageAsiacell1: {
    //  marginLeft:wp('25%'),
    marginBottom: hp('1%'),
    marginTop: hp('2%'),
    //padding:wp('11%'),
    //marginRight:wp('-1.5%')
  },
  ImageAsiacell22: {
    alignSelf: 'flex-end',
    marginBottom: hp('5%'),
    //marginTop:wp('15%'),
    //padding:wp('11%'),
    //marginRight:wp('-1.5%')
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
