import * as React from 'react';

import {
  View,
  Dimensions,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// //import i18n from 'i18n-js';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
// import { NumberFormat } from 'react-number-format';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import API_URL from '../screens/URL';
import DeviceInfo from 'react-native-device-info';
import {useTranslation} from 'react-i18next';
import {NumericFormat} from 'react-number-format';

const Pos_homepage = ({navigation, route}) => {
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [user_type_id, settype] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');
  const [fontLoaded, setfontloaded] = React.useState(false);
  const [currency, setcurrency] = React.useState('');
  const [deviceId, setDeviceId] = React.useState('');

  const userDeviceId = () => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      console.log('uniqueId', uniqueId);
      setDeviceId(uniqueId);
    });
  };
  async function getDate() {
    try {
      axios
        .post(
          API_URL +
            `log/blocked?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {deviceId: deviceId},
          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        )
        .then(response => {
          console.log('response', response);
        })
        .catch(e => {
          console.log(e);
          setTokenStatus(false);
        });
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
        if (route.params.previousScreen == 'Login') {
          setMoney(response.data[0].current_balance);
          setcurrency('IQD');
        }
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
        setcurrency('IQD');
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  React.useEffect(() => {
    getDate();
  }, []);

  React.useEffect(() => {
    userDeviceId();
    // FirstmainCallfunction()
    // secondMainFunction()
  }, []);

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

  const FirstmainCallfunction = async () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('HI Again From Pos_homepage ');
      getDate();
      // function sayHi() {
      //   navigation.navigate('SaleCarts')
      // }

      // setTimeout(sayHi, 3000);
    });

    getDate();
  };

  const secondMainFunction = async () => {
    let Token = '';
    let user_type_id = '';
    try {
      Token = await AsyncStorage.getItem('Token');
      user_type_id = await AsyncStorage.getItem('user_type_id');
      settoken(Token);
      settype(user_type_id);
    } catch (e) {
      console.log(e.message);
    }
  };
  if (token == null && user_type_id !== 3) {
    return (
      <View>
        <Image
          width={Dimensions.get('window').width}
          source={require('../../assets/unauthorized.png')}
          style={styles.NotAuthorizrd}></Image>
        <Text style={styles.btnText6}>{t('NotAuthorizrd')}</Text>
        {/* <Text>NotAuthorizrd</Text> */}
      </View>
    );
  }

  // else if (TokenStatus == false) {
  //   return
  // (
  //   <View>
  //     <Text style={{ color: '#1c79f2', fontSize: wp('7%'), alignSelf: 'center' }}>
  //       {t('You Have to login again')}
  //     </Text>
  //   </View>
  // )
  // }
  else {
    return (
      <View style={styles.containerBig}>
        <ScrollView>
          <ImageBackground
            source={require('../../assets/upper.png')}
            style={{
              height: '124%',
              width: '100%',
              alignself: 'center',
              flex: 1,
            }}>
            <Text style={styles.POS3}> {userName}</Text>
            <View style={{flex: 2, flexDirection: 'row', marginTop: hp('2%')}}>
              <Text style={styles.POS1}>{t('CurrentCredit')}</Text>
            </View>
            {/* <Text style={styles.POSyellow}>
              {currency + " " + virtualMoneyBalance}

            </Text> */}
            <Text style={styles.POSyellow}>
              {currency}
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
          </ImageBackground>
          <View style={styles.allRowsContainer}>
            <View style={styles.allImagesContainer}>
              <Text style={{width: Dimensions.get('window').width * 0.015}}>
                {''}
              </Text>
              <Pressable
                style={styles.ImageAsiacell1Pressable}
                onPress={() => navigation.navigate('CompanyClassification')}>
                <Image
                  style={styles.ImageAsiacell1}
                  width={Dimensions.get('window').width * 0.25} // height will be calculated automatically
                  source={require('../../assets/1_top.png')}
                />
              </Pressable>

              <Pressable
                style={styles.ImageAsiacell1Pressable}
                onPress={() => navigation.navigate('AllAccountStatment')}>
                <Image
                  width={Dimensions.get('window').width * 0.25} // height will be calculated automatically
                  source={require('../../assets/2_top.png')}
                  style={styles.ImageAsiacell1}
                />
              </Pressable>
              <Pressable
                style={styles.ImageAsiacell1Pressable}
                onPress={() => navigation.navigate('SendCredit')}>
                <Image
                  width={Dimensions.get('window').width * 0.25} // height will be calculated automatically
                  source={require('../../assets/3_top.png')}
                  style={styles.ImageAsiacell1}
                />
              </Pressable>

              <Pressable
                style={styles.ImageAsiacell1Pressable}
                onPress={() => navigation.navigate('POS_Fill_the_machine')}>
                <Image
                  width={Dimensions.get('window').width * 0.25} // height will be calculated automatically
                  source={require('../../assets/4_top.png')}
                  style={styles.ImageAsiacell1}
                />
              </Pressable>
            </View>
            {/* The Four Square */}
            <View
              style={{
                marginTop: hp('1%'),
                marginBottom: hp('17%'),
              }}>
              <View style={styles.secondRowContainer}>
                <Pressable
                  style={styles.secondRowPressable}
                  onPress={() => navigation.navigate('SendedMoney')}>
                  <Image
                    width={'100%'} // height will be calculated automatically
                    source={require('../../assets/squares/3.png')}
                    style={styles.secondRowImage}
                  />
                </Pressable>
                <Pressable
                  style={styles.secondRowPressable}
                  onPress={() => navigation.navigate('SIM')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../assets/squares/9.png')}
                    style={styles.secondRowImage}
                  />
                </Pressable>
              </View>
              <View style={styles.thirdRowContainer}>
                <Pressable
                  style={styles.thirdRowPressable}
                  onPress={() => navigation.navigate('PaidMoney')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../assets/squares/PaidMoney.png')}
                    style={styles.thirdRowImage}
                  />
                </Pressable>

                <Pressable
                  style={styles.thirdRowPressable}
                  onPress={() => navigation.navigate('TakenMoney')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../assets/squares/2.png')}
                    style={styles.thirdRowImage}
                  />
                </Pressable>
              </View>
              <View style={styles.fourthRowContainer}>
                <Pressable
                  style={styles.fourthRowPressable}
                  onPress={() => navigation.navigate('dailymovementhomepage')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../assets/squares/4.png')}
                    style={styles.fourthRowImage}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  POS1Font: {
    fontFamily: 'Cairo-SemiBold',
    color: '#FFFFFF',
    fontSize: 35,
    marginLeft: wp('4%'),
    textAlign: 'left',
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
    marginBottom: hp('2.3%'),
    fontSize: 24,
  },
  POS1: {
    fontFamily: 'Cairo-SemiBold',
    color: '#FFFFFF',
    fontSize: 25,
    marginLeft: wp('4%'),
    textAlign: 'left',
  },
  POS: {
    fontSize: wp('7%'),
    textAlign: 'left',

    color: '#FFFFFF',
    fontFamily: 'Cairo-SemiBold',

    //marginTop:hp('15%'),
    //marginBottom:hp('2%'),
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
  allRowsContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  allImagesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 11,
  },
  ImageAsiacell1Pressable: {
    height: 130,
    width: 93,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageAsiacell1: {
    height: '100%',
    width: '100%',
    // marginBottom: hp('1%'),
    marginTop: hp('2%'),
    resizeMode: 'contain',
    marginHorizontal: 9,
  },
  secondRowContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  secondRowPressable: {
    // backgroundColor: "grey",
    height: '77%',
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondRowImage: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  thirdRowContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: "red"
  },
  thirdRowPressable: {
    height: '77%',
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "green"
  },
  thirdRowImage: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    width: '100%',
  },

  fourthRowContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    // backgroundColor: "green"
  },
  fourthRowPressable: {
    height: '77%',
    width: '53%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "red"
  },
  fourthRowImage: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    resizeMode: 'contain',
    width: '100%',
  },
  ImageAsiacell22: {
    alignSelf: 'flex-end',
    // marginBottom: hp('5%'),
  },
});

export default Pos_homepage;
