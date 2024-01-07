import * as React from 'react';

import {
  View,
  ImageBackground,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  BackHandler,
  Text,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// //import i18n from 'i18n-js';
import {NumericFormat} from 'react-number-format';
// import Image from 'react-native-scalable-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Sound from 'react-native-sound';
import API_URL from './URL';
import Toast from 'react-native-simple-toast';
import {DotIndicator} from 'react-native-indicators';
import {useTranslation} from 'react-i18next';
import {StackActions} from '@react-navigation/native';

const NewPassword = ({navigation}) => {
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [sound, setSound] = React.useState();
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [user_type_id, settype] = React.useState('');
  const [first, setfirst] = React.useState('');
  const [second, setsecond] = React.useState('');
  const [third, setthird] = React.useState('');
  const [old, setold] = React.useState('');
  const [new1, setnew] = React.useState('');
  const [new2, setnew2] = React.useState('');

  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');

  const [website, setWebsite] = React.useState({
    info: null,
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const response = await axios.post(
          API_URL +
            `user/userdata?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {userData: await AsyncStorage.getItem('user_phonenumber')},
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show('You Have to login again', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          setTokenStatus(false);
        }
        //  console.log("response",response.data.message);
        else {
          setTokenStatus(true);

          setMoney(response.data[0].current_balance);
          setuserName(response.data[0].userName);
          console.log('balance updated');
        }
      } catch (e) {
        console.log(e.message);
      }

      console.log('// do something');
    });

    return unsubscribe;
  }, [navigation]);

  async function getCompanyData() {
    try {
      const response = await axios.get(
        API_URL +
          `alaimtidad?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      setWebsite({info: response.data.message[0]});
      console.log('response-----------*********', {
        info: response.data.message[0],
      });
    } catch (e) {
      console.log(e.message);
    }
  }
  React.useEffect(() => {
    getCompanyData();
  }, []);

  async function getDate() {
    try {
      const response = await axios.post(
        API_URL +
          `user/userdata?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {userData: await AsyncStorage.getItem('user_phonenumber')},
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      if (
        response.data == 'Token UnAuthorized' ||
        response.data == 'Token Expired'
      ) {
        Toast.show(t('You Have to login again'), Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setTokenStatus(false);
      }
      //  console.log("response",response.data.message);
      else {
        setTokenStatus(true);
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  React.useEffect(() => {
    (async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From POS_Fill_the_machine ');
        getDate();
      });

      getDate();
      let Token = '';
      let user_type_id = '';
      let userFirstName = '';
      let usermiddleName = '';
      let userLastName = '';
      try {
        Token = await AsyncStorage.getItem('Token');
        user_type_id = await AsyncStorage.getItem('user_type_id');
        userFirstName = await AsyncStorage.getItem('userFirstName');
        usermiddleName = await AsyncStorage.getItem('usermiddleName');
        userLastName = await AsyncStorage.getItem('userLastName');
        settoken(Token);
        settype(user_type_id);
        setfirst(userFirstName);
        setsecond(usermiddleName);
        setthird(userLastName);
      } catch (e) {
        console.log(e.message);
      }

      console.log('user_type_idComponentDidmoundApp', user_type_id);
      console.log('TokenComponentDidmoundApp', Token);
    })();

    return sound
      ? () => {
          console.log('Unloading Sound');
          // sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  // async function playSound() {
  //   console.log('Loading Sound');
  //   const track = new Sound('soundok.mp3', null, (error) => {
  //     if (error)
  //       console.log("Can't play sound. ", error);
  //     else
  //       track.play();
  //   });

  //   setSound(track);

  //   console.log('Playing Sound');
  //   await sound.playAsync();
  // }

  function onPress(text) {
    setold(text);
  }
  function onPress1(text) {
    setnew(text);
  }
  function onPress2(text) {
    setnew2(text);
  }

  async function Submit() {
    let passpattern = /^.{4,}$/;
    console.log('changing password', new1, new2, old);
    if (new1 != new2) {
      console.log("doesn't match each other");
      Toast.show(t('passworderror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else if (
      new1.match(passpattern) == null ||
      new2.match(passpattern) == null ||
      old.match(passpattern) == null
    ) {
      Toast.show(t('PAsswordererror'), Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
    } else {
      try {
        const response = await axios.post(
          API_URL +
            `userresetpassword?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            user_phonenumber: await AsyncStorage.getItem('user_phonenumber'),
            old_password: old,
            new_password: new1,
          },
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        console.log('Reset pASS ', response.data);
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show(t('You Have to login again'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          setTokenStatus(false);
        } else if (response.data.message == 'Wrong Password') {
          Toast.show(t('oldnotcorrect'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
        } else if (response.data.message == 'Password Updated successfully') {
          setTokenStatus(true);

          Toast.show(t('sucesspassword'), Toast.LONG, {
            backgroundColor: 'green',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          // playSound();
          setold('');
          setnew('');
          setnew2('');
          await AsyncStorage.removeItem('Token');
          await AsyncStorage.removeItem('user_type_id');
          await AsyncStorage.removeItem('commercialName');
          await AsyncStorage.removeItem('regionId');
          await AsyncStorage.removeItem('userId');
          // await AsyncStorage.removeItem('user_phonenumber');
          await AsyncStorage.removeItem('userEmail');
          await AsyncStorage.removeItem('userFirstName');
          await AsyncStorage.removeItem('usermiddleName');
          await AsyncStorage.removeItem('userLastName');
          await AsyncStorage.removeItem('virtualMoneyBalance');
          await AsyncStorage.removeItem('area');
          await AsyncStorage.removeItem('region');
          await AsyncStorage.removeItem('userIdInUsers');
          await AsyncStorage.removeItem('printerAddress');
          await AsyncStorage.removeItem('printerName');
          // navigation.navigate('Login');
          // BackHandler.exitApp()
          navigation.dispatch(StackActions.popToTop());
        } else {
          Toast.show('خطأ في الاتصال', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
        }
      } catch (e) {
        console.log(e.message);
        Toast.show('خطأ في الاتصال', Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
      }
    }
  }

  if (token == null && user_type_id !== 3) {
    console.log('Not Authorizrd');
    return (
      <View>
        <Image
          width={Dimensions.get('window').width}
          source={require('../../assets/unauthorized.png')}
          style={styles.NotAuthorizrd}></Image>
        <Text style={styles.btnText6}>{t('NotAuthorizrd')}</Text>
      </View>
    );
  }

  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.containerBig}>
          <ScrollView>
            <ImageBackground
              source={require('../../assets/upper.png')}
              style={{
                height: '100%',
                width: '100%',
                alignself: 'center',
                flex: 1,
              }}>
              {/* <Text style={styles.POS3}> {userName}</Text> */}

              <View style={{marginTop: hp('1%')}}>
                <Text style={styles.POS3}> {userName}</Text>
                <Text style={styles.POS1}>{t('CurrentCredit')}</Text>
                <Text style={styles.POSyellow}>
                  IQD
                  <NumericFormat
                    renderText={value => (
                      <Text style={styles.POSyellow}> {value}</Text>
                    )}
                    value={virtualMoneyBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={0}
                  />
                </Text>
              </View>

              {/* <Image
                 width={Dimensions.get('window').width*0.3} // height will be calculated automatically
                 source={require('../../../assets/24_7_icon2.png')}
                 style={styles.ImageAsiacell22}
                //  onPress={() =>sellcardsPressed()} 
             /> */}
            </ImageBackground>
            <View style={styles.containerBig1}>
              <View
                style={{
                  backgroundColor: '#fff',
                  marginTop: hp('-4%'),
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                }}>
                {/*  

    <View style={{marginTop:hp('5%')}}> */}

                <Text style={styles.subTitle1}>
                  {' '}
                  اذا نسيت كلمة السر الحالية{' '}
                </Text>
                <Text style={styles.subTitle11}>
                  {' '}
                  يرجى التواصل مع الادارة على الارقام الاتية{' '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={styles.subTitle11}
                    onPress={() =>
                      Linking.openURL(
                        `tel:+964${website?.info?.website_phonenumber}`,
                      )
                    }>
                    {website?.info?.website_phonenumber}
                  </Text>
                  <Text> _ </Text>
                  <Text
                    style={styles.subTitle11}
                    onPress={() =>
                      Linking.openURL(
                        `whatsapp://send?text=hello&phone=+964${website?.info?.website_whatsapp}`,
                      )
                    }>
                    {website?.info?.website_whatsapp}
                  </Text>
                </View>

                {/* <Text style={styles.subTitle} > كلمة السر الحالية:</Text> */}

                <View style={styles.searchSection}>
                  <TextInput
                    placeholder="كلمة السر الحالية"
                    placeholderTextColor="#cbb8ef"
                    style={styles.inputStyle}
                    autoCompleteType="password"
                    textAlign="center"
                    secureTextEntry={true}
                    clearButtonMode="always"
                    onChangeText={text => onPress(text)}
                    value={old}

                    // onChangeText={(text) => this.setState({user_password: text})}
                  />
                </View>

                {/* <Text style={styles.subTitle} > كلمة السر الجديدة:</Text> */}
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder="كلمة السر الجديدة"
                    placeholderTextColor="#cbb8ef"
                    style={styles.inputStyle}
                    autoCompleteType="password"
                    textAlign="center"
                    secureTextEntry={true}
                    clearButtonMode="always"
                    onChangeText={text => onPress1(text)}
                    value={new1}
                  />
                </View>

                {/* <Text style={styles.subTitle} > تأكيد كلمة السر الجديدة:</Text> */}
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder="تأكيد كلمة السر الجديدة "
                    placeholderTextColor="#cbb8ef"
                    style={styles.inputStyle}
                    autoCompleteType="password"
                    textAlign="center"
                    secureTextEntry={true}
                    clearButtonMode="always"
                    onChangeText={text => onPress2(text)}
                    value={new2}

                    // onChangeText={(text) => this.setState({user_password: text})}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => Submit()}>
                  <Text style={styles.btnText2}>{t('NewPassword')}</Text>
                </TouchableOpacity>

                {/*      
             </View> */}
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: wp('70%'),
    alignSelf: 'center',
    marginTop: hp('4%'),
    borderTopEndRadius: 5,
  },
  containerBig: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBig1: {
    flex: 1,
    backgroundColor: '#8a53e5',
  },
  POS3: {
    fontSize: wp('7%'),
    textAlign: 'left',
    marginTop: hp('0.5%'),
    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',
    marginLeft: wp('2%'),
    marginBottom: hp('1%'),
  },
  POS9: {
    fontSize: wp('7%'),
    textAlign: 'left',
    // marginTop: hp('15%'),
    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    // marginBottom:hp('11%'),
    fontSize: 21,
    marginLeft: wp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },
  POSyellow: {
    textAlign: 'left',
    // marginTop: hp('15%'),
    marginLeft: wp('4%'),
    color: '#ffd775',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    marginBottom: hp('5%'),
    fontSize: 24,
  },
  POS1: {
    fontFamily: 'Cairo-SemiBold',
    color: '#FFFFFF',
    fontSize: 25,
    marginLeft: wp('4%'),
    textAlign: 'left',
  },
  button2: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: 45,
    alignSelf: 'center',
    // marginRight:wp('9%'),
    marginTop: hp('7%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
    marginBottom: hp('7%'),
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('6%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('-1%'),
  },
  NotAuthorizrd: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    marginTop: wp('16%'),
  },
  inputStyle: {
    marginTop: hp('-0.9%'),
    fontSize: wp('6%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    // borderColor:"#D3D3D3",
    // borderWidth:2.5,
    alignSelf: 'center',
    color: '#000000',
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
  },
  subTitle: {
    top: hp('2%'),
    color: '#000',
    marginLeft: hp('5%'),
    marginRight: wp('3%'),
    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
    //
  },

  subTitle1: {
    top: hp('2%'),
    color: '#7d54e1',

    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',

    //
  },
  subTitle11: {
    top: hp('2%'),
    color: '#7d54e1',
    marginBottom: hp('2%'),
    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',

    //
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
    top: wp('8%'),
    marginBottom: hp('3%'),
  },

  InputsContainerbutton: {
    top: hp('-13%'),
  },

  BalanceBeforeAndAfter: {
    fontSize: wp('7%'),
    textAlign: 'left',
    // marginTop: hp('15%'),
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    // marginBottom:hp('11%'),
    fontSize: 30,
    marginLeft: wp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },
});

export default NewPassword;
