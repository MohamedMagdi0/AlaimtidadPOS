// eslint-disable-next-line prettier/prettier
import React from 'react';
import {
  View,
  TouchableOpacity,
  alert,
  TouchableHighlight,
  ImageBackground,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  Modal,
  Linking,
  PermissionsAndroid,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import i18n from 'i18next';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import i18n from '../screens/i18n';
import {Picker} from '@react-native-picker/picker';
import API_URL from './URL';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import Toast from 'react-native-simple-toast'
import Toast from 'react-native-simple-toast';

import Geolocation from '@react-native-community/geolocation';
import DeviceInfo, {getUniqueId} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withTranslation} from 'react-i18next';
// import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const {height, width} = Dimensions.get('screen');

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_password: '',
      user_confirm_password: '',
      pos_commercial_name: '',
      user_first_name: '',
      user_middle_name: '',
      user_last_name: '',
      user_phonenumber: '',
      user_email: '',
      image: null,
      data2: null,
      checked: false,
      userID: '',
      location: null,
      ErrorMsg: '',
      pos_longitude: 'unDetermined',
      pos_latitude: 'unDetermined',
      Regions: [],
      Areas: [],
      user_region_name: '',
      user_area_name: '',
      modalVisible: false,
      selectedregionid: '',
      RegionCurrentLabel: 'Select',
      AreaCurrentLabel: 'Select',
      language: 'java',
      fontsLoaded: false,
      showInstructionModal: false,
      locationEnabled: false,
      showOpenInternetModal: false,
      deviceId: '',
      isSubmitting: false,
      website: {
        info: null,
      },
    };
  }
  // Location
  //---------

  // Handle input changes:
  // ----------------------
  handleFirstNameChange(text) {
    this.setState({user_first_name: text});
  }
  handleMiddletNameChange(text) {
    this.setState({user_middle_name: text});
  }
  handleLastNameChange(text) {
    this.setState({user_last_name: text});
  }
  handlePhoneNumberChange(text) {
    this.setState({user_phonenumber: text});
  }
  handleEmailChange(text) {
    this.setState({user_email: text});
  }
  handlePasswordChange(text) {
    this.setState({user_password: text});
  }
  handleConfirmPasswordChange(text) {
    this.setState({user_confirm_password: text});
  }
  handleCommerialNameChange(text) {
    this.setState({pos_commercial_name: text});
  }

  handleSelectedRegion(value) {
    this.setState({user_region_name: value});
  }
  handleSelectedArea(value) {
    this.setState({user_area_name: value});
  }
  // End of handle input changes
  // -------------------------------------------------------------------

  getDeviceId = () => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      // console.log("deviceIdddd", uniqueId)
      this.setState({deviceId: uniqueId});
      console.log('deviceIdxx', this.state.deviceId);
    });
  };
  async componentDidMount() {
    this.getDeviceId();

    try {
      const response = await axios.get(
        API_URL +
          `info?s=${parseInt(await AsyncStorage.getItem('userIdInUsers'))}`,
      );
      this.setState({website: {info: response.data.message[0]}});
    } catch (e) {
      console.log(e);
    }

    // RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    //   interval: 10000,
    //   fastInterval: 5000,
    // })
    //   .then((data) => {
    //     console.log("dataaa",data);
    //     // The user has accepted to enable the location services
    //     // data can be :
    //     //  - "already-enabled" if the location services has been already enabled
    //     //  - "enabled" if user has clicked on OK button in the popup
    //   })
    //   .catch((err) => {
    //     console.log("err",err);

    //     // The user has not accepted to enable the location services or something went wrong during the process
    //     // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
    //     // codes :
    //     //  - ERR00 : The user has clicked on Cancel button in the popup
    //     //  - ERR01 : If the Settings change are unavailable
    //     //  - ERR02 : If the popup has failed to open
    //     //  - ERR03 : Internal error
    //   });
    // try {
    //   const {
    //     PRIORITIES: { HIGH_ACCURACY },
    //     addListener,
    //     checkSettings,
    //     requestResolutionSettings
    //   } = LocationEnabler
    //   // Get if location is enabled
    //   const listener = addListener(({ locationEnabled }) => {
    //     console.log('Location are', locationEnabled)
    //     this.setState({ locationEnabled })
    //   }
    //   );
    //   const config = {
    //     priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
    //     alwaysShow: true, // default false
    //     needBle: false, // default false
    //   };
    //   checkSettings(config);

    // } catch (error) {
    //   console.log("error location", error)
    // }
    // Get AllRegions //
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // {
        //   title: "اذن تحديد المواقع",
        //   message: "يرجى فتح نظام تحديد المواقع",
        //   buttonNeutral: "لاحقا",
        //   buttonNegative: "إلغاء",
        //   buttonPositive: "موافق"
        // }
      );
      // console.log("granted---------", granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("PermissionsAndroid.RESULTS.GRANTED*******", PermissionsAndroid.RESULTS.GRANTED);
        // Alert.alert("يرجى فتح نظام تحديد المواقع")
        // LocationServicesDialogBox.checkLocationServicesIsEnabled({
        //   message: "يرجى فتح نظام تحديد المواقع",
        //   ok: "موافق",
        //   cancel: "إلغاء"
        // }).then((success) => {

        this.getDeviceLocation();
        // })
        //   .catch((error) => {
        //     if (error.message == "disabled") {
        //       this.setState({ showInstructionModal: true })
        //     }
        //     console.log(error.message); // error.message => "disabled"
        //   });
      } else {
        console.log('Permission denied!');
        this.setState({showInstructionModal: true});
        // this.props.navigation.navigate('Login')
      }
    } catch (err) {
      console.warn(err);
    }
    try {
      await fetch(API_URL + `allregions`)
        .then(res => res.json())
        .then(res => {
          this.setState({
            Regions: res.regions.slice(1),
          });
        })
        .catch(error => alert('error', error));
    } catch (error) {
      Alert.alert('error');
    }
    const locationPermission = await AsyncStorage.getItem('locationPermission');
  }

  getDeviceLocation = async () => {
    // console.log("getDeviceLocation called")
    Geolocation.getCurrentPosition(
      position => {
        //do stuff with location
        // console.log({ position });
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.setState({
          pos_latitude: currentLatitude,
          pos_longitude: currentLongitude,
        });
        // console.log(this.state.pos_latitude, this.state.pos_longitude);
      },
      error => {
        this.setState({
          pos_latitude: 'unDetermined',
          pos_longitude: 'unDetermined',
        });
        console.log('ERROR position registration', error);
      },
    );
  };

  AreaPickerChange = async (itemValue, index) => {
    if (itemValue == 0) {
      this.setState({user_area_name: ''});
      Toast.show(i18n.t('user_area_nameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    }

    this.state.Areas.map(async (v, i) => {
      if (index == i) {
        this.setState({
          user_area_name: this.state.Areas[index].area_arabic_name,
        });
      }
    });

    this.setState({AreaCurrentLabel: itemValue});
  };

  RegionPickerChange = async (itemValue, index) => {
    if (itemValue == 0) {
      this.setState({user_region_name: '', user_area_name: '', Areas: []});
      Toast.show(i18n.t('user_region_nameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    }

    this.state.Regions.map(async (v, i) => {
      if (index == i) {
        this.setState({
          user_region_name: this.state.Regions[index].region_arabic_name,
          currentLabel: this.state.Regions[index].region_arabic_name,
        });
        this.setState({selectedregionid: this.state.Regions[index].region_id});
        //  Get Areas
        try {
          const response = await axios.post(API_URL + `aresbyregionid`, {
            regionId: this.state.Regions[index].region_id,
          });
          this.setState({
            Areas: response.data.areas,
            user_region_name: this.state.Regions[index].region_arabic_name,
            user_area_name: '',
          });
        } catch (error) {
          Alert.alert('error');
        }
      }
    });

    this.setState({RegionCurrentLabel: itemValue});
  };

  SubmitData = async () => {
    // get location

    // console.log('this.state.locationEnabled', this.state.locationEnabled)
    this.getDeviceLocation();

    const pattern = /^.{4,}$/;
    const phoneReg =
      /^(077)(\d{0})[0-9]?\d{8}$|^(078)(\d{0})[0-9]?\d{8}$|^(079)(\d{0})[0-9]?\d{8}$|^(075)(\d{0})[0-9]?\d{8}$/;
    const mailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // console.log("------------------------------- LONG", this.state.pos_longitude)
    if (this.state.isSubmitting) {
      return; // Prevent multiple submissions
    }

    if (this.state.user_first_name == '') {
      Toast.show(i18n.t('firstnameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (this.state.user_middle_name == '') {
      Toast.show(i18n.t('middlenameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (this.state.user_last_name == '') {
      Toast.show(i18n.t('lastnameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (
      this.state.user_phonenumber == '' ||
      this.state.user_phonenumber.length != 11 ||
      this.state.user_phonenumber.match(phoneReg) == null
    ) {
      console.log('');
      Toast.show(i18n.t('phonenumbererror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (
      this.state.user_password == '' ||
      this.state.user_password.match(pattern) == null
    ) {
      Toast.show(i18n.t('PAsswordererror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (
      this.state.user_confirm_password == '' ||
      this.state.user_confirm_password != this.state.user_password
    ) {
      Toast.show(i18n.t('ConfirmPAsswordererror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    }

    //email vaildation
    else if (
      this.state.user_email !== '' &&
      !this.state.user_email.match(mailPattern)
    ) {
      Toast.show(i18n.t('mailPatternError'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (this.state.pos_commercial_name == '') {
      Toast.show(i18n.t('pos_commercial_nameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (this.state.user_region_name == '') {
      Toast.show(i18n.t('user_region_nameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (this.state.user_area_name == '') {
      Toast.show(i18n.t('user_area_nameerror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (this.state.checked == false) {
      Toast.show(i18n.t('PolicyError'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    }
    // else if (this.state.pos_longitude == "unDetermined" || this.state.pos_latitude == "unDetermined" || this.state.pos_longitude == undefined || this.state.pos_latitude == undefined || this.state.pos_longitude == '' || this.state.pos_latitude == '') {
    //   console.log('this.state.locationEnabled', this.state.locationEnabled)
    //   if (this.state.locationEnabled == false) {
    //     console.log("hello form undetermineeee");
    //     this.setState({ pos_longitude: "unDetermined", pos_latitude: "unDetermined", showInstructionModal: true })
    //   }
    //   else {
    //     this.setState({ showOpenInternetModal: true })
    //   }
    // }
    else {
      console.log('data are ok!');
      this.setState({isSubmitting: true});
      // const deviceId = getUniqueId();
      // console.log("ddddddddddddd", deviceId?._z)

      // getDeviceId()
      let formData = new FormData();
      formData.append('user_type_id', 3);
      formData.append('user_password', this.state.user_password);
      formData.append('pos_commercial_name', this.state.pos_commercial_name);
      formData.append('user_first_name', this.state.user_first_name);
      formData.append('user_middle_name', this.state.user_middle_name);
      formData.append('user_last_name', this.state.user_last_name);
      formData.append('user_phonenumber', this.state.user_phonenumber);
      formData.append('user_region_name', this.state.user_region_name);
      formData.append('user_area_name', this.state.user_area_name);
      formData.append('user_email', this.state.user_email);
      formData.append('longatude', this.state.pos_longitude);
      formData.append('latitude', this.state.pos_latitude);
      formData.append('user_region_id', 1);
      formData.append('device_identifier', this.state.deviceId);
      if (this.state.image == null) {
        formData.append('user_personal_image', 'notselected');
      } else {
        formData.append('user_personal_image', this.state.image.uri);
        formData.append('user_personal_image', {
          uri: this.state.image.uri, // this is the path to your file. see Expo ImagePicker or React Native ImagePicker
          type: `image/jpg`, // example: image/jpg
          name: `${this.state.user_phonenumber}.jpg`, // example: upload.jpg
        });
      }
      try {
        // let url = API_URL + 'pos/createaccount'
        // const response = await fetch(url, {
        //   method: 'POST',
        //   body: formData,
        // })
        let axiosConfig = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
          },
        };
        console.log('formData========>', formData);
        const response = await axios.post(
          API_URL + 'pos/createaccount',
          formData,
          axiosConfig,
        );
        console.log('responsee------->>', response);
        // console.log("responsee------->>", JSON.parse(response));
        // console.log("ressssss", response.status);
        // const responseM = await response.json()
        // console.log("ressssss", responseM);
        console.log(
          `JSON.stringify(response.status).replace(/\"/g, "")`,
          JSON.stringify(response.status).replace(/\"/g, ''),
        );
        if (JSON.stringify(response.status).replace(/\"/g, '') == 200) {
          this.setState({modalVisible: true});
          this.setState({isSubmitting: false});
        }
        // else if (JSON.stringify(response.status).replace(/\"/g, "") == 409) {
        //   console.log("a7eeeeeeeeeeeeeeh", response);
        //   // const responseMessage = await response.json()
        //   // console.log(responseMessage, 'PPPPPPPPPPPPPPPPPPPPPPPPPPP')
        //   if (response.message == 'user name already registered') {
        //     Toast.show(i18n.t('userNameAlreadyRegistered'), Toast.LONG,
        //       {
        //         backgroundColor: "red",
        //         fontSize: 19,
        //         position: 660,
        //         mask: true,

        //       })
        //   }
        //   if (response.message == 'user name already registered') {
        //     Toast.show(i18n.t('userPhoneAlreadyRegistered'), Toast.LONG,
        //       {
        //         backgroundColor: "red",
        //         fontSize: 19,
        //         position: 660,
        //         mask: true,

        //       })
        //   }
        // }

        // console.log(JSON.stringify(response));
      } catch (e) {
        console.log('caaaaaaatchhhhhhhhhh', e);
        // console.log({ "response": response });
        if (e.response.status == 409) {
          this.setState({isSubmitting: false});

          console.log('a7eeeeeeeeeeeeeeh');
          // const responseMessage = await response.json()
          // console.log(responseMessage, 'PPPPPPPPPPPPPPPPPPPPPPPPPPP')
          if (e.response.data.message == 'user name already registered') {
            this.setState({isSubmitting: false});

            Toast.show(i18n.t('userNameAlreadyRegistered'), Toast.LONG, {
              backgroundColor: 'red',
              fontSize: 19,
              position: 660,
              mask: true,
            });
            console.log(i18n.t('userNameAlreadyRegistered'));
            return;
          }
          if (e.response.data.message == 'user already registered') {
            this.setState({isSubmitting: false});

            Toast.show(i18n.t('userPhoneAlreadyRegistered'), Toast.LONG, {
              backgroundColor: 'red',
              fontSize: 19,
              position: 660,
              mask: true,
            });
            console.log(i18n.t('userPhoneAlreadyRegistered'));
            return;
          }
        }

        Toast.show(i18n.t('WrongPasswordOrphonenumber'), Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
      }
    }
  };

  render() {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
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
                  onPress={() => this.setState({modalVisible: false})}
                />

                <Text style={styles.modalText}>
                  {i18n.t('Registrationmessage')}{' '}
                </Text>
                <Text
                  style={styles.modalText}
                  onPress={() =>
                    Linking.openURL(
                      `tel:+964${this.state.website?.info?.website_phonenumber}`,
                    )
                  }>
                  {this.state.website?.info?.website_phonenumber}
                </Text>
                <Text
                  style={styles.modalText}
                  onPress={() =>
                    Linking.openURL(
                      `whatsapp://send?text=hello&phone=+964${this.state.website?.info?.website_whatsapp}`,
                    )
                  }>
                  {this.state.website?.info?.website_whatsapp}
                </Text>

                <Text style={styles.modalText}>{i18n.t('toactivate')} </Text>
                <Text style={styles.modalText}>
                  {i18n.t('activateThroughCode')}{' '}
                </Text>
                <TouchableHighlight
                  style={styles.button2}
                  onPress={() => {
                    this.setState(
                      {modalVisible: false},
                      this.props.navigation.navigate('Login'),
                    );
                  }}>
                  <Text style={styles.btnText2}> {i18n.t('ok')}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showInstructionModal}
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
                  onPress={() => BackHandler.exitApp()}
                />

                <Text style={styles.instructionModalText}>
                  {' '}
                  لانشاء حساب يجب فتح نظام تحديد المواقع
                </Text>
                <Text style={styles.instructionModalText}>
                  {' '}
                  انتقل الى الاعدادات ثم التطبيقات
                </Text>
                <Text style={styles.instructionModalText}>
                  {' '}
                  انقر على الاذونات ثم معلومات الموقع{' '}
                </Text>
                <Text style={styles.instructionModalText}>
                  {' '}
                  قم باعطاء اذن الموقع لتطبيق الامتداد ثم تفعيل تحديد المواقع{' '}
                </Text>
                <Text style={styles.instructionModalText}>
                  {' '}
                  أو قم باعادة تثبيت التطبيق{' '}
                </Text>
              </View>
            </View>
          </ScrollView>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showOpenInternetModal}
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
                  onPress={() => this.setState({showOpenInternetModal: false})}
                />

                <Text style={styles.instructionModalText}>
                  {' '}
                  الاتصال بشبكة الانترنت ضعيف
                </Text>
                <Text style={styles.instructionModalText}>
                  {' '}
                  برجاء المحاولة مرة أخرى لاحقا
                </Text>
              </View>
            </View>
          </ScrollView>
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
              marginTop: hp('-3.7%'),
            }}>
            <View style={{marginTop: hp('1%')}}>
              <View
                style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder={i18n.t('firstName')}
                    placeholderTextColor="#cbb8ef"
                    underlineColorAndroid="transparent"
                    style={styles.inputStyle}
                    onChangeText={text => this.handleFirstNameChange(text)}
                  />
                </View>
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder={i18n.t('secondName')}
                    placeholderTextColor="#cbb8ef"
                    underlineColorAndroid="transparent"
                    style={styles.inputStyle}
                    onChangeText={text => this.handleMiddletNameChange(text)}
                  />
                </View>
              </View>

              <View
                style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder={i18n.t('thirdName')}
                    placeholderTextColor="#cbb8ef"
                    underlineColorAndroid="transparent"
                    style={styles.inputStyle}
                    onChangeText={text => this.handleLastNameChange(text)}
                  />
                </View>

                <View style={styles.searchSection}>
                  <TextInput
                    placeholder={i18n.t('phonenumber')}
                    placeholderTextColor="#cbb8ef"
                    underlineColorAndroid="transparent"
                    style={styles.inputStyle}
                    keyboardType="phone-pad"
                    onChangeText={text => this.handlePhoneNumberChange(text)}
                  />
                </View>
              </View>
              <View
                style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <View style={styles.searchSection}>
                  <TextInput
                    secureTextEntry={true}
                    placeholder={i18n.t('password')}
                    placeholderTextColor="#cbb8ef"
                    style={styles.inputStyle}
                    autoCompleteType="password"
                    onChangeText={text => this.handlePasswordChange(text)}
                    // keyboardType='visible-password'
                    keyboardAppearance="light"
                  />
                </View>
                <View style={styles.searchSection}>
                  <TextInput
                    secureTextEntry={true}
                    placeholder={i18n.t('Confirmpassword')}
                    placeholderTextColor="#cbb8ef"
                    style={styles.inputStyle}
                    autoCompleteType="password"
                    onChangeText={text =>
                      this.handleConfirmPasswordChange(text)
                    }
                    //keyboardType='visible-password'
                    keyboardAppearance="light"
                  />
                </View>
              </View>
              <View
                style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder={i18n.t('email')}
                    placeholderTextColor="#cbb8ef"
                    underlineColorAndroid="transparent"
                    style={styles.inputStyle}
                    keyboardType="email-address"
                    onChangeText={text => this.handleEmailChange(text)}
                  />
                </View>
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder={i18n.t('CommercialName')}
                    placeholderTextColor="#cbb8ef"
                    underlineColorAndroid="transparent"
                    style={styles.inputStyle}
                    onChangeText={text => this.handleCommerialNameChange(text)}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'transparent',
                  justifyContent: 'space-around',
                }}>
                <View style={styles.dropDownContainer}>
                  {/* <AntDesign name="arrowdown" size={24} color="#7d54e1" style={{ position: 'absolute', marginTop: hp('1.1%'), marginLeft: 20 }} /> */}

                  <Picker
                    selectedValue={this.state.RegionCurrentLabel}
                    style={styles.regionPicker}
                    dropdownIconColor="#4e31c1"
                    onValueChange={(itemValue, itemIndex) =>
                      this.RegionPickerChange(itemValue, itemIndex - 1)
                    }>
                    <Picker.Item
                      key={0}
                      label={i18n.t('City')}
                      value={0}
                      color="#4e31c1"
                    />
                    {this.state.Regions.map(item => {
                      return (
                        <Picker.Item
                          key={item.region_id}
                          label={' ' + item.region_arabic_name}
                          value={item.region_id}
                          color="#4e31c1"
                        />
                      );
                    })}
                  </Picker>
                </View>
                <View style={styles.dropDownContainer}>
                  <Picker
                    selectedValue={this.state.AreaCurrentLabel}
                    style={styles.picker}
                    dropdownIconColor="#4e31c1"
                    onValueChange={(itemValue, itemIndex) =>
                      this.AreaPickerChange(itemValue, itemIndex - 1)
                    }>
                    <Picker.Item
                      style={{
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}
                      key={0}
                      label={i18n.t('Area')}
                      value={0}
                      color="#7d54e1"
                      fontFamily="Cairo-SemiBold"
                    />
                    {this.state.Areas.map(item => {
                      return (
                        <Picker.Item
                          key={item.area_id}
                          label={'' + item.area_arabic_name}
                          value={item.area_id}
                          color="#4e31c1"
                          fontFamily="Cairo-SemiBold"
                        />
                      );
                    })}
                  </Picker>
                  {/* <AntDesign name="arrowdown" size={24} color="#7d54e1" style={{ position: 'absolute', marginTop: hp('1.1%'), marginLeft: 20 }} /> */}
                </View>
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => this.setState({checked: !this.state.checked})}>
                  {this.state.checked && (
                    <View
                      style={{
                        flex: 1,
                        height: 18,
                        width: 18,
                        backgroundColor: '#4e31c1',
                        borderRadius: 2,
                      }}></View>
                  )}
                </TouchableOpacity>
                <Text style={styles.label}>{i18n.t('policies')}</Text>
              </View>
              <TouchableOpacity
                disabled={this.state.isSubmitting}
                style={styles.button2}
                onPress={() => this.SubmitData()}>
                {this.state.isSubmitting ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.signUpButton}>{i18n.t('SignUp')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    backgroundColor: '#8a53e5',
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'Cairo_600SemiBold',
    alignSelf: 'center',
    marginTop: hp('-1%'),
  },
  regionPicker: {
    height: 40,
    width: wp('50%'),
    color: '#7d54e1',
    backgroundColor: 'transparent',
    fontFamily: 'Cairo-SemiBold',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    width: 200,
    color: '#7d54e1',
    backgroundColor: 'transparent',
    fontFamily: 'Cairo-SemiBold',
  },
  dropDownContainer: {
    borderRadius: 15,
    backgroundColor: '#fff',
    marginTop: hp('6%'),
    width: wp('40%'),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    justifyContent: 'center',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: wp('70%'),
    alignSelf: 'center',
    marginTop: hp('4%'),
  },
  tinylogoimage: {
    width: wp('7%'),
    height: hp('2%'),
    position: 'absolute',
    marginTop: hp('1.1%'),
    marginLeft: wp('3%'),
    zIndex: 1,
  },
  button2: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('15%'),
    alignSelf: 'center',
    marginRight: wp('4.5%'),
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

  signUpButton: {
    color: '#fff',
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
  },
  Imageuploadbutton: {
    marginTop: hp('3%'),
    padding: wp('2%'),
    width: wp('60%'),
    height: hp('7%'),
    alignSelf: 'center',
    marginBottom: hp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  container: {
    marginTop: hp('5%'),
  },

  button: {
    backgroundColor: '#4e31c1',
    padding: wp('2%'),
    borderRadius: 50,
    width: wp('40%'),
    marginLeft: wp('2%'),
    marginBottom: hp('1%'),
  },
  btnText: {
    color: 'white',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp('2%'),
    marginTop: hp('3%'),
    color: '#fff',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    borderColor: '#4e31c1',
    height: 20,
    width: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  label: {
    margin: wp('1%'),
    fontSize: wp('5%'),
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
  },

  Dropdownlist: {
    width: width - 150,
    color: '#fff',
    fontSize: wp('5%'),
    height: wp('10%'),
    marginLeft: wp('7%'),
    marginRight: wp('7%'),
    textAlign: 'right',
    marginBottom: hp('60%'),
  },
  DropdownlistArea: {
    width: width - 60,
    color: '#fff',
    fontSize: wp('5%'),
    height: wp('10%'),
    marginLeft: wp('7%'),
    marginRight: wp('7%'),

    textAlign: 'right',
  },
  inputStyle: {
    fontFamily: 'Cairo-SemiBold',

    marginTop: hp('-0.9%'),
    fontSize: wp('5%'),
    borderRadius: 10,
    alignSelf: 'center',
    color: '#000000',
    // height:hp('6%'),
    width: wp('45%'),
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
  },
  errormessage: {
    color: '#fff',
    marginTop: hp('1%'),
  },
  InputsOut: {
    marginBottom: hp('2%'),
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
    marginBottom: hp('2%'),
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
    flex: 2,
    top: hp('5%'),
  },
  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#ffffff',
  },

  InputsContainerCheckBox: {
    flex: 1,
  },
  modalView: {
    margin: wp('5%'),
    backgroundColor: 'white',
    borderRadius: 20,
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
  },
  modalText: {
    marginBottom: wp('5%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    fontSize: wp('4.5%'),
    color: '#4e31c1',
  },
  instructionModalText: {
    marginBottom: wp('5%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    fontSize: wp('4.5%'),
    color: '#4e31c1',
  },
  button1: {
    backgroundColor: '#fff',
    borderColor: '#DCDCDC',
    padding: wp('2%'),
    fontFamily: 'Cairo_600SemiBold',
    borderRadius: wp('1%'),
    borderWidth: wp('0.3%'),
    width: wp('64%'),
    marginRight: wp('6%'),
    height: hp('6%'),
    alignSelf: 'center',
    marginTop: hp('5%'),
    shadowColor: '#000',
    marginBottom: hp('5%'),
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,

    textAlign: 'center',
  },
  btnText3: {
    color: '#4e31c1',
    fontSize: wp('6%'),
    textAlign: 'center',
    fontFamily: 'Cairo_600SemiBold',

    alignSelf: 'center',
    //  marginLeft:wp('5%'),
    marginTop: hp('-0.5%'),
  },
});

export default withTranslation()(Registration);
