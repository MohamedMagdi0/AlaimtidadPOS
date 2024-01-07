import * as React from 'react';
import {
  Button,
  View,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
// //import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import {NumericFormat} from 'react-number-format';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
//import DeviceInfo from 'react-native-device-info';

import API_URL from '../screens/URL';
import {useTranslation} from 'react-i18next';
const ConnectionType = ({navigation}) => {
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [user_type_id, settype] = React.useState('');
  const [flag, setflag] = React.useState(false);
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [connection, setconnection] = React.useState('');
  const [connectionType, setconnectionType] = React.useState('');

  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');
  const [state, setState] = React.useState({
    pos_id: '',
    pos_commercial_name: '',
    pos_commercial_logo: '',
    pos_first_name: '',
    pos_middle_name: '',
    pos_last_name: '',
    pos_region_id: '',
    pos_area_id: '',
    pos_phone_number: '',
    pos_email: '',
    posDealers: null,
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

  async function getDate() {
    try {
      const response = await axios.post(
        API_URL +
          `getuserdata?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          userId: parseInt(await AsyncStorage.getItem('userIdInUsers')),
          userTypeId: parseInt(await AsyncStorage.getItem('user_type_id')),
        },
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
        console.log('Currentcredit', response.data.message[0].current_balance);
        setMoney(response.data.message[0].current_balance);
        setuserName(response.data.message[0].userName);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  React.useEffect(() => {
    (async () => {
      //   let macadd=  await Network.getMacAddressAsync();
      //  //   let uniqueId=  DeviceInfo.getUniqueId();
      //  console.log("macadd",macadd);
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From POS_Fill_the_machine ');
        getDate();
      });

      getDate();
      NetInfo.fetch().then(state => {
        console.log('Connection type', state.type);
        setconnectionType(state.type);
        console.log('Is connected?', state.isConnected);
        setconnection(state.isConnected);
      });
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

      // console.log("user_type_idComponentDidmoundApp",user_type_id);
      // console.log("TokenComponentDidmoundApp",Token);
    })();
  }, []);
  console.log('state.type', connection);
  console.log('Type', connectionType);
  if (connectionType == 'wifi')
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
            <View style={styles.containerBig}>
              <View
                style={{
                  backgroundColor: '#fff',
                  marginTop: hp('-4%'),
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                }}>
                <Text style={styles.nodata}>{t('ConnetionWifi')}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  else {
    return <Text style={styles.nodata}>{t('ConnetionData')}</Text>;
  }
};
const styles = StyleSheet.create({
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

  cardCnt: {
    borderWidth: 1, // Remove Border
    shadowColor: '#000', // Remove Shadow IOS
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1, // This is for Android
    backgroundColor: '#4e31c170',
  },
  nodata: {
    fontSize: wp('8%'),
    marginTop: hp('12%'),
    alignSelf: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
  },
  NotAuthorizrd: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    marginTop: wp('16%'),
  },

  btnText6: {
    color: '#4e31c1',
    fontSize: wp('8%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    marginTop: wp('129%'),
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },
});

export default ConnectionType;
