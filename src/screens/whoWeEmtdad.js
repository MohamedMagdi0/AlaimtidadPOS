import * as React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {DotIndicator} from 'react-native-indicators';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../screens/URL';
// import i18n from '../screens/i18n'
import {NumericFormat} from 'react-number-format';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
const whoWeEmtdad = ({navigation}) => {
  const {t} = useTranslation();

  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [website, setWebsite] = React.useState({
    info: null,
  });

  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');

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
        Toast.show(t('You Have to login again'), {
          position: 660,
          containerStyle: {backgroundColor: 'red'},
          textStyle: {fontSize: 19},
          mask: true,
          maskStyle: {},
        });
        setTokenStatus(false);
      }
      //  console.log("response",response.data.message);
      else {
        setTokenStatus(true);
        // console.log("Currentcredit",response.data.message[0].pos_vm_balance);
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

        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show(t('You Have to login again'), {
            position: 660,
            containerStyle: {backgroundColor: 'red'},
            textStyle: {fontSize: 19},
            mask: true,
            maskStyle: {},
          });
          setTokenStatus(false);
        }
        //  console.log("response",response.data.message);
        else {
          setTokenStatus(true);
          setWebsite({info: response.data.message[0]});
          console.log('response', {
            info: response.data.message[0].website_whatsapp,
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);

  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  } else if (website.info == null) {
    console.log('if', website.info);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4e31c1" />
      </View>
    );
  } else {
    console.log('else ', website.info);
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
                 source={require('../../assets/24_7_icon2.png')}
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
                <Text style={styles.text}>شركة الامتداد</Text>

                <Text style={styles.text2}>للخدمات اللوجيستية الرائدة</Text>
                <Text style={styles.text21}>في مجال الحلول الالكترونية</Text>

                <Text style={styles.text3}> للتواصل معنا يرجى الاتصال ب</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={styles.text21}
                    onPress={() =>
                      Linking.openURL(
                        `tel:+964${website?.info?.website_phonenumber}`,
                      )
                    }>
                    {website.info.website_phonenumber}
                  </Text>
                  <Feather name="phone-call" size={24} color="#4e31c1" />
                </View>
                <Text style={styles.text3}> للتواصل معنا عبر الواتساب </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={styles.text21}
                    onPress={() =>
                      Linking.openURL(
                        `whatsapp://send?text=hello&phone=+964${website?.info?.website_whatsapp}`,
                      )
                    }>
                    {website.info.website_whatsapp}
                  </Text>

                  <Ionicons name="logo-whatsapp" size={24} color="#4e31c1" />
                </View>

                <Text
                  style={styles.text8}
                  onPress={() =>
                    Linking.openURL('https://itlandcanada.com/alaimtidad/')
                  }>
                  {website.info.website_name}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
};
const styles = StyleSheet.create({
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

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    //marginBottom:100
  },
  POS: {
    fontSize: wp('5%'),
    textAlign: 'center',
    marginTop: hp('5%'),
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
  text: {
    color: '#4e31c1',
    fontSize: wp('15%'),
    marginTop: hp('1%'),
    alignSelf: 'center',
  },
  text2: {
    color: '#4e31c1',
    fontSize: wp('6%'),
    marginTop: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
  },
  text8: {
    color: '#fff',
    fontSize: wp('6%'),
    marginTop: hp('1%'),
    //fontFamily:'Cairo-SemiBold',
    alignSelf: 'center',
  },
  text21: {
    color: '#4e31c1',
    fontSize: wp('6%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
    marginRight: wp('3%'),
  },
  text3: {
    color: '#4e31c1',
    fontSize: wp('8%'),
    marginTop: hp('4%'),
    alignSelf: 'center',
  },

  POSphone: {
    fontSize: wp('5%'),
    textAlign: 'center',
    marginTop: hp('5%'),
  },
  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    //  marginTop:hp('-7%'),
  },
  container: {
    borderColor: '#4e31c1',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: hp('30%'),
    borderWidth: 0.5,
    height: hp('50%'),
    width: wp('80%'),
    borderBottomWidth: wp('2%'),
    borderBottomLeftRadius: wp('8%'),
    borderBottomRightRadius: wp('8%'),
    backgroundColor: '#cde6ff80',
  },
  containerSmall: {
    alignItems: 'center',
    alignSelf: 'center',
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

  button2: {
    width: wp('45%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('11%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
    alignSelf: 'center',
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('8%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
  },
});

export default whoWeEmtdad;
