import * as React from 'react';
import {
  Button,
  View,
  Dimensions,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
//import i18n from 'i18n-js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '../URL';
import {NumericFormat} from 'react-number-format';
import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
// import Image from 'react-native-scalable-image';

const AccountStatmentPOS = ({navigation}) => {
  const {t} = useTranslation();
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [userName, setuserName] = React.useState('');

  const [userFirstName, setName] = React.useState('');
  const [user_phonenumber, setNumber] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userLastName, setMiddle] = React.useState('');
  React.useEffect(() => {
    (async () => {
      let userFirstName = '';
      let user_phonenumber = '';
      // let virtualMoneyBalance=''
      let userLastName = '';
      try {
        userFirstName = await AsyncStorage.getItem('userFirstName');
        user_phonenumber = await AsyncStorage.getItem('user_phonenumber');
        //virtualMoneyBalance=await AsyncStorage.getItem('virtualMoneyBalance');
        userLastName = await AsyncStorage.getItem('userLastName');
        setName(userFirstName);
        setNumber(user_phonenumber);
        //setMoney(virtualMoneyBalance)
        setMiddle(userLastName);
      } catch (e) {
        console.log(e.message);
      }
    })();

    (async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        let user_id = 0;
        let user_type_id = 0;

        try {
          user_id = await AsyncStorage.getItem('userIdInUsers');
          user_type_id = await AsyncStorage.getItem('user_type_id');

          const response = await axios.post(
            API_URL +
              `getuserdata?s=${parseInt(
                await AsyncStorage.getItem('userIdInUsers'),
              )}`,
            {userId: parseInt(user_id), userTypeId: parseInt(user_type_id)},

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

            setuserName(response.data.message[0].userName);
            setMoney(response.data.message[0].current_balance);
          }
        } catch (e) {
          console.log(e.message);
        }
      });
      (async () => {
        let user_id = 0;
        let user_type_id = 0;

        try {
          user_id = await AsyncStorage.getItem('userIdInUsers');
          user_type_id = await AsyncStorage.getItem('user_type_id');

          const response = await axios.post(
            API_URL +
              `getuserdata?s=${parseInt(
                await AsyncStorage.getItem('userIdInUsers'),
              )}`,
            {userId: parseInt(user_id), userTypeId: parseInt(user_type_id)},

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

            setMoney(response.data.message[0].current_balance);
          }
        } catch (e) {
          console.log(e.message);
        }
      })();
    })();
  }, []);

  return (
    <>
      <View style={styles.containerBig}>
        <ScrollView>
          <ImageBackground
            source={require('../../../assets/upper.png')}
            style={{
              height: '100%',
              width: '100%',
              alignself: 'center',
              flex: 1,
            }}>
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
          </ImageBackground>
          <View style={styles.containerBig1}>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: hp('-4%'),
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 23,
              }}>
              <Pressable
                style={styles.adsl}
                onPress={() => navigation.navigate('AllAccountStatment')}>
                <Image
                  // height will be calculated automatically
                  width={Dimensions.get('window').width * 0.5}
                  source={require('../../../assets/squares/7.png')}
                  style={styles.ImageAsiacell31}
                />
              </Pressable>

              <Pressable
                style={styles.adsl}
                onPress={() => navigation.navigate('TakenMoney')}>
                <Image
                  width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                  source={require('../../../assets/squares/2.png')}
                  style={styles.ImageAsiacell3}
                />
              </Pressable>

              <Pressable
                style={styles.adsl}
                onPress={() => navigation.navigate('SendedMoney')}>
                <Image
                  width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                  source={require('../../../assets/squares/3.png')}
                  style={styles.ImageAsiacell3}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  POS: {
    fontSize: wp('5.5%'),
    textAlign: 'center',
    marginTop: hp('2%'),
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
    marginBottom: hp('2%'),
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
  tinyLogo: {
    top: hp('7%'),
    height: hp('30%'),
    width: wp('60%'),
    marginLeft: wp('2%'),
  },
  ImageAsiacell3: {
    width: '90%',
    height: '90%',
    alignSelf: 'center',
    //width: Dimensions.get('window').width*0.5
  },
  ImageAsiacell31: {
    alignSelf: 'center',
    width: '90%',
    height: '90%',
    //width: Dimensions.get('window').width*0.5
  },
  container: {
    borderColor: '#C81717',
    alignItems: 'center',

    borderRadius: 10,
    marginRight: wp('2%'),
    top: hp('15%'),
    borderWidth: 0.5,
    height: hp('35%'),
    width: wp('95%'),
    marginLeft: wp('4%'),
    marginBottom: hp('-20%'),
    borderBottomWidth: wp('2%'),
    borderBottomLeftRadius: wp('8%'),
    borderBottomRightRadius: wp('8%'),
    //marginBottom:hp('1%'),
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },

  Title: {
    top: hp('1%'),
    color: '#C81717',
    marginRight: wp('4%'),
    fontSize: wp('7'),
    fontFamily: 'Cairo-SemiBold',
  },

  Title1: {
    top: hp('3%'),
    color: '#C81717',
    marginRight: wp('1%'),
    fontSize: wp('5'),
  },
  Title2: {
    top: hp('3.5%'),
    color: '#C81717',
    marginRight: wp('1%'),
    fontSize: wp('5'),
  },
  Title3: {
    top: hp('4%'),
    color: '#C81717',
    marginRight: wp('1%'),
    fontSize: wp('5'),
  },
  button2: {
    top: hp('-16%'),
    marginTop: hp('10%'),
    padding: wp('2%'),
    width: wp('90%'),
    height: hp('7%'),
    marginLeft: wp('-2%'),
    marginBottom: wp('-7%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },

  btnText2: {
    color: '#fff',
    fontSize: wp('6%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    //fontFamily:"JannaLT-Regular",
    //marginTop:wp('0%'),
  },
  adsl: {
    width: '50%',
    height: 120,
    //marginLeft:wp('25%'),
    // backgroundColor: "blue",
    // margin: 5,
    // padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AccountStatmentPOS;
