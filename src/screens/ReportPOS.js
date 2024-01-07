// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import * as React from 'react';
import {
  Button,
  View,
  Text,
  Dimensions,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
// import Image from 'react-native-scalable-image';
import {NumericFormat} from 'react-number-format';
// import i18n from '../screens/i18n'
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import API_URL from '../screens/URL';
import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
const ReportPOS = ({navigation, route}) => {
  const {t} = useTranslation();
  const [token, settoken] = React.useState('');
  const [user_type_id, settype] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
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
        console.log('HI ya magdi Again From POS_Fill_the_machine ');
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

  const sellcardsPressed = () => {
    navigation.navigate('SimCompanyClassification', {comingfrom: 'SoldPOS'});
  };
  const simcardsPressed = () => {
    navigation.navigate('SIM', {comingfrom: 'Reports'});
  };
  const accountstatmentPressed = () => {
    navigation.navigate('AccountStatmentPOS');
  };

  const winaccountPressed = () => {
    navigation.navigate('WinAccountPOS');
  };
  const dailymovementPressed = () => {
    navigation.navigate('DailyMovementPOS');
  };
  const discountpointsPressed = () => {
    navigation.navigate('DiscountPoints');
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
                <Text style={styles.texttitle}>{t('Reports2')}</Text>
                <View style={{flex: 2, flexDirection: 'row'}}>
                  <Pressable
                    style={styles.adsl}
                    onPress={() => sellcardsPressed()}>
                    <Image
                      width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                      source={require('../../assets/squares/5.png')}
                      style={styles.ImageAsiacell}
                    />
                  </Pressable>

                  <Pressable
                    style={styles.adsl}
                    onPress={() => dailymovementPressed()}>
                    <Image
                      width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                      source={require('../../assets/squares/4.png')}
                      style={styles.ImageAsiacell}
                    />
                  </Pressable>

                  {/* <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/2.png')}
       style={styles.ImageAsiacell}
       onPress={() =>simcardsPressed()} 
   /> */}
                </View>
                <View style={{flex: 2, flexDirection: 'row'}}>
                  <Pressable
                    style={styles.adsl}
                    onPress={() => accountstatmentPressed()}>
                    <Image
                      width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                      source={require('../../assets/report_1.png')}
                      style={styles.ImageAsiacell}
                    />
                  </Pressable>

                  <Pressable
                    style={styles.adsl}
                    onPress={() => winaccountPressed()}>
                    <Image
                      width={Dimensions.get('window').width * 0.5} // height will be calculated automatically
                      source={require('../../assets/squares/6.png')}
                      style={styles.ImageAsiacell}
                    />
                  </Pressable>
                </View>
                {/* <View style={{flex: 2,flexDirection:'row'}}> */}

                {/* 
   <Image
       width={Dimensions.get('window').width*0.5} // height will be calculated automatically
       source={require('../../assets/61.png')}
       style={styles.ImageAsiacell}
       onPress={() =>discountpointsPressed()} 
   /> */}

                {/* </View> */}
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
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

  ImageAsiacell: {
    //  marginLeft:wp('25%'),
    width: '90%',
    height: '90%',
    //padding:wp('11%'),
    //marginRight:wp('-1.5%')
  },
  ImageAsiacell1: {
    marginLeft: wp('25%'),
    marginBottom: hp('1%'),
    alignSelf: 'center',

    //padding:wp('11%'),
    //marginRight:wp('-1.5%')
  },
  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },

  texttitle: {
    fontSize: wp('10%'),
    textAlign: 'center',
    top: hp('2%'),
    fontFamily: 'Cairo-SemiBold',

    color: '#4e31c1',
    marginBottom: hp('4%'),
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

export default ReportPOS;
