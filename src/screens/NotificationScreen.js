import * as React from 'react';
import {
  Image,
  View,
  Dimensions,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
} from 'react-native';
// import { Card } from 'react-native-elements'
import {Card} from '@rneui/themed';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import Image from 'react-native-scalable-image';
// //import i18n from 'i18n-js';
import {NumericFormat} from 'react-number-format';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import API_URL from '../screens/URL';
import {ScrollView} from 'react-native-gesture-handler';
import {FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';

const Aboutme = ({navigation}) => {
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [user_type_id, settype] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');
  const [user_phonenumber, setNumber] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [notifications, setNotifications] = React.useState([]);

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

  async function getData() {
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
      } else {
        console.log('response', response.data);
        let user_phonenumber = await AsyncStorage.getItem('user_phonenumber');
        setTokenStatus(true);
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
        setNumber(user_phonenumber);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function getnotification() {
    let userId = '';
    try {
      userId = await AsyncStorage.getItem('userIdInUsers');
      console.log('userId', userId);
      const response = await axios({
        url:
          API_URL +
          `notifications/${userId}?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        method: 'get',

        headers: {
          'x-access-token': `${await AsyncStorage.getItem('Token')}`,
        },
      });
      // console.log("resss", response.data);
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
      } else {
        setTokenStatus(true);
        setNotifications(response.data.message);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  function renderNotification({item}) {
    return (
      <>
        <Card containerStyle={styles.cardCnt} key={item.notification_id}>
          <View style={{backgroundColor: '#fff', marginTop: hp('-2%')}}></View>
          <Card.Divider />
          <Text
            style={{marginBottom: 10, color: '#023882', fontSize: wp('5%')}}>
            اسم المرسل: {item.full_name}
          </Text>

          <Card.Divider />
          <Text
            style={{marginBottom: 10, color: '#023882', fontSize: wp('5%')}}>
            العنوان: {item.title}
          </Text>

          <Card.Divider />
          <Text
            style={{marginBottom: 10, color: '#023882', fontSize: wp('5%')}}>
            الرسالة: {item.message}
          </Text>
        </Card>
      </>
    );
  }

  React.useEffect(() => {
    (async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        getData();
        getnotification();
      });

      getData();
      getnotification();
    })();

    (async () => {
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
    })();
  }, []);
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
  //   return (
  //     <View>
  //       <Text style={{ color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center' }}>
  //         {t('You Have to login again')}
  //       </Text>
  //     </View>
  //   )
  // }
  else {
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
              <View style={{marginTop: hp('1%')}}>
                <Text style={styles.POS3}> {userName}</Text>
                <Text style={styles.POS1}> {t('CurrentCredit')} </Text>
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
            </ImageBackground>
            <View style={styles.containerBig1}>
              <View
                style={{
                  backgroundColor: '#fff',
                  marginTop: hp('4%'),
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                }}>
                <FlatList
                  data={notifications}
                  renderItem={renderNotification}
                  keyExtractor={item => item.notification_id}></FlatList>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
};
const styles = StyleSheet.create({
  cardCnt: {
    borderWidth: 1, // Remove Border
    shadowColor: '#000', // Remove Shadow IOS
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1, // This is for Android
    backgroundColor: '#ffffff70',
    color: '#023882',
    marginBottom: 10,
  },
  containerBig: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBig1: {
    flex: 1,
    // backgroundColor: '#8a53e5',
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

  POSyellow17: {
    textAlign: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
    fontSize: 22,
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

  POS17: {
    fontSize: wp('7%'),
    textAlign: 'left',
    // marginTop: hp('15%'),
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    // marginBottom:hp('11%'),
    fontSize: 35,
    marginLeft: wp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },

  button: {
    backgroundColor: '#ffd775',
    borderColor: '#ffd775',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('95%'),
    height: 50,
    alignSelf: 'center',
    // marginRight:wp('9%'),
    // marginTop:hp('5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
    marginBottom: hp('3%'),
  },

  tinyLogo: {
    top: hp('1%'),
    height: hp('30%'),
    width: wp('60%'),
    marginLeft: wp('20%'),
  },
  POSphone: {
    fontSize: wp('8%'),
    textAlign: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
  },
  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },
  container: {
    // borderWidth:wp('0.4'),
    // borderColor:"#fff",
    alignItems: 'center',
    // borderRadius:10,
    alignSelf: 'center',
    top: hp('28%'),
    //height:hp('25%'),
    width: hp('35%'),
    marginBottom: hp('2%'),
  },
});

export default Aboutme;
