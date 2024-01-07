import * as React from 'react';

import {
  Button,
  View,
  TextInput,
  Dimensions,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import  from 'react-native-scalable-image';
//import i18n from 'i18n-js';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import API_URL from '../URL';

import {DotIndicator} from 'react-native-indicators';
import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NumericFormat} from 'react-number-format';
const Dailymovementhomepage = ({navigation, route}) => {
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [user_type_id, settype] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');
  const [fontLoaded, setfontloaded] = React.useState(false);
  const [currency, setcurrency] = React.useState('');

  async function getDate() {
    try {
      const deviceId = await AsyncStorage.getItem('deviceId');
      console.log('deviceId', deviceId);

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
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
        setcurrency('IQD');
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  React.useEffect(() => {
    (async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From Pos_homepage ');
        getDate();
      });

      getDate();
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
          source={require('../../../assets/unauthorized.png')}
          style={styles.NotAuthorizrd}></Image>
        <Text style={styles.btnText6}>{t('NotAuthorizrd')}</Text>
        {/* <Text>NotAuthorizrd</Text> */}
      </View>
    );
  }

  // else if (TokenStatus == false) {
  //   return (
  //     <View>
  //       <Text style={{ color: '#1c79f2', fontSize: wp('7%'), alignSelf: 'center' }}>
  //         {t('You Have to login again')}
  //       </Text>
  //     </View>
  //   )
  // }
  else {
    return (
      <View style={styles.containerBig}>
        <ScrollView>
          <ImageBackground
            source={require('../../../assets/upper.png')}
            style={{
              height: '124%',
              width: '100%',
              alignself: 'center',
              flex: 1,
            }}>
            <Text style={styles.POS3}> {userName}</Text>
            <View style={{flex: 2, flexDirection: 'row', marginTop: hp('2%')}}>
              {/* <Text style={styles.POS1}>
        {t('CurrentCredit')} 
        </Text> */}
              {/* <Text style={{color:"#FFFFFF",fontSize:30}}>
        {t('CurrentCredit')} 
        </Text> */}
            </View>

            <View style={{flex: 2, flexDirection: 'row', marginTop: hp('2%')}}>
              <Text style={styles.POS1}>{t('CurrentCredit')}</Text>
            </View>
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
          </ImageBackground>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 50,
              marginTop: hp('-4%'),
            }}>
            {/* <View style={{flex: 2,flexDirection:'row',marginBottom:hp('3%'),marginTop:hp('1%')}}>
 {/* DA by3ml aih ?? 
  <Text style={{width:Dimensions.get('window').width*0.015}}>{''}</Text>
 <Image
       width={Dimensions.get('window').width*0.25} // height will be calculated automatically
       source={require('../../assets/1_top.png')}
       style={styles.ImageAsiacell1}
       onPress={() =>navigation.navigate('SaleCarts')} 
   />
    <Image
       width={Dimensions.get('window').width*0.25} // height will be calculated automatically
       source={require('../../assets/2_top.png')}
       style={styles.ImageAsiacell1}
       onPress={() =>navigation.navigate('AllAccountStatment')}  
   />
      <Image
       width={Dimensions.get('window').width*0.25} // height will be calculated automatically
       source={require('../../assets/3_top.png')}
       style={styles.ImageAsiacell1}
       onPress={() =>navigation.navigate('SendCredit')}  
   />
    <Image
       width={Dimensions.get('window').width*0.25} // height will be calculated automatically
       source={require('../../assets/4_top.png')}
       style={styles.ImageAsiacell1}
       onPress={() =>navigation.navigate('POS_Fill_the_machine')}   
   />
 </View> */}

            {/* The Four Square */}
            <View style={{marginTop: hp('3%'), marginBottom: hp('5%')}}>
              <View style={{flex: 2, flexDirection: 'row'}}>
                {/* <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/squares/1.png')}
       style={styles.ImageAsiacell}
       onPress={() =>navigation.navigate('NewPassword')}  
   /> */}

                {/* <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/squares/2.png')}
       style={styles.ImageAsiacell3}
       onPress={() =>navigation.navigate('TakenMoney')}  
   /> */}
              </View>

              <View style={{flex: 2, flexDirection: 'row'}}>
                <Pressable
                  style={styles.adsl}
                  onPress={() => navigation.navigate('DrawnMoney')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../../assets/squares/DrawnMoney.png')}
                    style={styles.ImageAsiacell}
                  />
                </Pressable>

                <Pressable
                  style={styles.adsl}
                  onPress={() => navigation.navigate('DailyMovementPOS')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../../assets/squares/4.png')}
                    style={styles.ImageAsiacell}
                  />
                </Pressable>
              </View>

              <View style={{flex: 2, flexDirection: 'row'}}>
                <Pressable
                  style={styles.adsl}
                  onPress={() => navigation.navigate('CompensatedMoney')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../../assets/squares/CompensatedMoney.png')}
                    style={styles.ImageAsiacell}
                  />
                </Pressable>

                <Pressable
                  style={styles.adsl}
                  onPress={() =>
                    navigation.navigate('CompensatedMoneyOfDeletedCards')
                  }>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../../assets/squares/CompensatedMoneyOfDeletedCards.png')}
                    style={styles.ImageAsiacell}
                  />
                </Pressable>

                {/* <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../../assets/squares/SystemTransferMoney.png')}
       style={styles.ImageAsiacell}
       onPress={() =>navigation.navigate('SystemTransferMoney')}  
   /> */}
              </View>
              <View
                style={{flex: 2, flexDirection: 'row', alignSelf: 'center'}}>
                <Pressable
                  style={styles.adsl}
                  onPress={() => navigation.navigate('PrintedMoney')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../../assets/squares/PrintedMoney.png')}
                    style={styles.ImageAsiacell}
                  />
                </Pressable>

                <Pressable
                  style={styles.adsl}
                  onPress={() => navigation.navigate('debtAmountPOS')}>
                  <Image
                    width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                    source={require('../../../assets/squares/10.png')}
                    style={styles.ImageAsiacell}
                  />
                </Pressable>
              </View>
              {/* <View style={{flex: 2,flexDirection:'row'}}> */}
              {/* <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/squares/DrawnMoney.png')}
       style={styles.ImageAsiacell}
       onPress={() =>navigation.navigate('DrawnMoney')}  
   /> */}

              {/* <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/squares/PaidMoney.png')}
       style={styles.ImageAsiacell}
       onPress={() =>navigation.navigate('PaidMoney')}  
   /> */}

              {/* </View> */}
            </View>
            {/* <View style={{flex: 2,flexDirection:'row'}}>
   <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/squares/5.png')}
       style={styles.ImageAsiacell}
       onPress={() =>navigation.navigate('SoldPOS')}  
   />

   <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/squares/6.png')}
       style={styles.ImageAsiacell}
       onPress={() =>navigation.navigate('WinAccountPOS')}   
   />
</View> */}
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
    width: '90%',
    height: '90%',
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

export default Dailymovementhomepage;
