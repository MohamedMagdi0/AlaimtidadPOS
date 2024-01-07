// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import * as React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  TouchableHighlight,
  BackHandler,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';

// import i18n from '../screens/i18n';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import Image from 'react-native-scalable-image';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import API_URL from '../screens/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NumericFormat} from 'react-number-format';
import {useTranslation} from 'react-i18next';

const POS_Fill_the_machine = ({navigation, route}) => {
  const {t} = useTranslation();
  const [pinNumber, setpinNumber] = React.useState('');
  const [token, settoken] = React.useState('');
  const [user_type_id, settype] = React.useState('');
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [Count, setCount] = React.useState(0);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [modalVisible1, setmodalVisible1] = React.useState(false);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [virtualMoneyBalanceBefore, setMoneyBefore] = React.useState('');
  const [sound, setSound] = React.useState();
  const [userName, setuserName] = React.useState('');
  const [currency, setcurrency] = React.useState('');
  const [flag, setflag] = React.useState(true);

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

  const Re_enableBTn = () => {
    console.log('Re Enable');
    setflag(true);
  };
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
        setcurrency('IQD');
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function getCredit() {
    setmodalVisible1(false);
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
        console.log('Currentcredit', response.data[0].current_balance);
        setMoneyBefore(response.data[0].current_balance);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  React.useEffect(() => {
    (async () => {
      //  setmodalVisible1(true)
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From POS_Fill_the_machine ');
        getDate();
        getCredit();
      });

      getDate();
      getCredit();
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
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
  }, [sound]);

  async function playSound() {
    console.log('Loading Sound');
    const track = new Sound('testmoney.mp3', null, error => {
      if (error) console.log("Can't play sound. ", error);
      else track.play();
    });

    setSound(track);
  }

  async function submit() {
    const deviceId = await AsyncStorage.getItem('deviceId');

    if (pinNumber == '') {
      Toast.show('يرجى ادخال رقم الكارت ', Toast.LONG, {
        backgroundColor: 'red',
        fontSize: 19,
        position: 660,
        mask: true,
      });
      console.log('Suspend User');

      return;
    }
    try {
      setflag(false);
      setTimeout(Re_enableBTn, 6000);
      const response = await axios.post(
        API_URL +
          `virttualmoney/fillvm?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          serialNumber: pinNumber,
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
        Toast.show(t('You Have to login again'), Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setTokenStatus(false);
      } else {
        setTokenStatus(true);
        console.log('Resssss', response.data);
        if (response.status === 200) {
          Toast.show('تمت التعبئة بنجاح', Toast.LONG, {
            backgroundColor: 'green',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          playSound();
          //Reset
          console.log('Reset');

          //Update Balance
          setmodalVisible1(true);
          getDate();
          setpinNumber('');
        } else if (response.data.result == 'this card owned') {
          let c = Count + 1;
          setCount(c);
          setpinNumber('');
          Toast.show('هذا الكارت مستخدم من قبل شخص اخر', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          let data = {
            wrongPinNumber: pinNumber,
            deviceId: deviceId,
            userId: parseInt(await AsyncStorage.getItem('userIdInUsers'), 10),
          };
          axios
            .post(
              API_URL +
                `log/pinlogs?s=${parseInt(
                  await AsyncStorage.getItem('userIdInUsers'),
                )}`,
              data,
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
            });
        } else if (response.data.result == 'this card is suspended') {
          let c = Count + 1;
          setCount(c);
          setpinNumber('');
          Toast.show('هذا الكارت موقوف من قبل الادارة', Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          let data = {
            wrongPinNumber: pinNumber,
            deviceId: deviceId,
            userId: parseInt(await AsyncStorage.getItem('userIdInUsers'), 10),
          };
          axios
            .post(
              API_URL +
                `log/pinlogs?s=${parseInt(
                  await AsyncStorage.getItem('userIdInUsers'),
                )}`,
              data,
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
            });
        } else {
          let c = Count + 1;
          setCount(c);
          setpinNumber('');
          Toast.show(t('CartNotFound'), Toast.LONG, {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          });
          let data = {
            wrongPinNumber: pinNumber,
            deviceId: deviceId,
            userId: parseInt(await AsyncStorage.getItem('userIdInUsers'), 10),
          };
          axios
            .post(
              API_URL +
                `log/pinlogs?s=${parseInt(
                  await AsyncStorage.getItem('userIdInUsers'),
                )}`,
              data,
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
            });
          ///Count Logic

          if (c >= 3) {
            getDate();
          }
        }
      }
    } catch (e) {
      console.log('pplaaa', e.response.data.errorMessage);
      if (
        e.response.data.errorMessage ==
        'transfer can not occur, money allowed to transfer to this person'
      ) {
        console.log('if');
        // setpinNumber('')
        Toast.show(
          `لقد تخطيت الحد الاقصي للدين, الرصيد المسموح تعبئته ${e.response.data.valueAllowedTransfer}`,
          Toast.LONG,
          {
            backgroundColor: 'red',
            fontSize: 19,
            position: 660,
            mask: true,
          },
        );
      } else if (
        e.response.data.errorMessage === 'bad request, serial already filled'
      ) {
        let c = Count + 1;
        setCount(c);
        Toast.show(`هذا الكارت مستخدم من قبل`, Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setpinNumber('');
      } else if (
        e.response.data.errorMessage === 'bad request, wrong serial' ||
        e.response.data.errorMessage === 'Invalid Data'
      ) {
        let c = Count + 1;
        setCount(c);
        Toast.show(`هذا الرقم غير صحيح`, Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setpinNumber('');
        let data = {
          wrongPinNumber: pinNumber,
          deviceId: deviceId,
          userId: parseInt(await AsyncStorage.getItem('userIdInUsers'), 10),
        };
        axios
          .post(
            API_URL +
              `log/pinlogs?s=${parseInt(
                await AsyncStorage.getItem('userIdInUsers'),
              )}`,
            data,
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
          });
      } else if (
        e.response.data.errorMessage === 'bad request, serial has problem'
      ) {
        let c = Count + 1;
        setCount(c);
        Toast.show(`يرجى ادخال الرقم بشكل صحيح`, Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setpinNumber('');
      } else if (
        e.response.data.errorMessage ===
        '500 Internal server Error, we are tracking these issues.'
      ) {
        let c = Count + 1;
        setCount(c);
        Toast.show(`يرجى المحاولة مرة اخرى`, Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setpinNumber('');
      } else if (
        e.response.data.errorMessage === '400 bad request, serial not printed'
      ) {
        let c = Count + 1;
        setCount(c);
        Toast.show(`هذا الرقم غير موجود`, Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        setpinNumber('');
      } else {
        let c = Count + 1;
        setCount(c);
        setpinNumber('');
        Toast.show(t('CartNotFound'), Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
          position: 660,
          mask: true,
        });
        let data = {
          wrongPinNumber: pinNumber,
          deviceId: deviceId,
          userId: parseInt(await AsyncStorage.getItem('userIdInUsers'), 10),
        };
        axios
          .post(
            API_URL +
              `log/pinlogs?s=${parseInt(
                await AsyncStorage.getItem('userIdInUsers'),
              )}`,
            data,
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
          });
      }
    }
  }

  function handleChangPinNumber(text) {
    setpinNumber(text);
  }
  async function CloseModal() {
    setmodalVisible(false);
    try {
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
      BackHandler.exitApp();
    } catch (e) {
      console.log(e.message);
    }
  }
  if (token == null && user_type_id !== 3) {
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <View style={styles.centeredView}>
            <ScrollView>
              <View style={styles.modalView1}>
                <Text style={styles.modalText1}>
                  لقد تم تعبئة الجهاز بنجاح{' '}
                </Text>
                <Text style={styles.modalText1}>رصيدك السابق:</Text>
                <Text style={styles.modalText1}>
                  <NumericFormat
                    renderText={value => (
                      <Text style={styles.BalanceBeforeAndAfter}>{value}</Text>
                    )}
                    value={virtualMoneyBalanceBefore}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={0}
                  />
                </Text>
                <Text style={styles.modalText1}>الرصيد المضاف:</Text>
                <Text style={styles.modalText1}>
                  <NumericFormat
                    renderText={value => (
                      <Text style={styles.BalanceBeforeAndAfter}>{value}</Text>
                    )}
                    value={virtualMoneyBalance - virtualMoneyBalanceBefore}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={0}
                  />
                </Text>
                <Text style={styles.modalText1}>رصيدك الحالي:</Text>
                <Text style={styles.modalText1}>
                  <NumericFormat
                    renderText={value => (
                      <Text style={styles.BalanceBeforeAndAfter}>{value}</Text>
                    )}
                    value={virtualMoneyBalance}
                    displayType={'text'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={0}
                  />
                </Text>

                <TouchableHighlight
                  style={styles.button1}
                  onPress={() => {
                    getCredit();
                  }}>
                  <Text style={styles.btnText2}> {t('close')}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <View style={styles.centeredView}>
            <ScrollView>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{t('SuspendUser')} </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={styles.modalText1}
                    onPress={() => Linking.openURL(`tel:07721991133`)}>
                    {' '}
                    07721991133
                  </Text>
                  <Text
                    style={styles.modalText1}
                    onPress={() => Linking.openURL(`tel:07821991133`)}>
                    07821991133 -
                  </Text>
                </View>
                <TouchableHighlight
                  style={styles.button1}
                  onPress={() => CloseModal()}>
                  <Text style={styles.btnText2}> {t('close')}</Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </Modal>
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
                <View style={{marginTop: hp('7%')}}>
                  {/* <Text style={styles.POS1}>
        {t('CurrentCredit')}<NumericFormat
        renderText={value => <Text  style={styles.POS1} >{value}</Text>} 
        value={virtualMoneyBalance} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} />
        </Text> */}
                </View>

                {/* <Text style={{fontSize:wp('10%'),color:"#4e31c1",fontFamily:'Cairo-SemiBold',alignSelf:'center',marginBottom:hp('2%')}}>تعبئة الجهاز</Text> */}
                <View style={styles.searchSection}>
                  <TextInput
                    placeholder="رقم الكارت"
                    style={styles.inputStyle}
                    placeholderTextColor="#cbb8ef"
                    keyboardType="phone-pad"
                    onChangeText={text => setpinNumber(text)}
                    value={pinNumber}
                    clearButtonMode="always"
                    maxLength={15}
                  />
                </View>

                {Count >= 3 ? (
                  <TouchableOpacity
                    disabled={true}
                    style={styles.buttonDisapled}>
                    <Text style={styles.btnText2}>
                      {t('POS_Fill_the_machine')}
                    </Text>
                  </TouchableOpacity>
                ) : flag == true ? (
                  <TouchableOpacity
                    style={{
                      ...styles.button1,
                      backgroundColor:
                        pinNumber.length !== 15 ? '#D1D1D1' : '#4e31c1',
                      borderColor:
                        pinNumber.length !== 15 ? '#D1D1D1' : '#4e31c1',
                    }}
                    disabled={pinNumber.length !== 15}
                    onPress={() => submit()}>
                    <Text style={styles.btnText2}>
                      {t('POS_Fill_the_machine')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button1} disabled={true}>
                    <Text style={styles.btnText2Disabled}>
                      {t('POS_Fill_the_machine')}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* <Button
          title="Print HTML"
          onPress={() => Print.printAsync({
            html: htmlString,
            height: 842,
            width: 595,
          })}
        /> */}
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
  Dropdownlist: {
    width: wp('68%'),

    color: '#fff',
    fontSize: wp('2%'),
    height: wp('10%'),
    margin: wp('7%'),
    marginBottom: wp('-3%'),
    marginTop: wp('30%'),
    paddingVertical: hp('-8%'),
  },

  image: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
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
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: wp('70%'),
    alignSelf: 'center',
    marginTop: hp('4%'),
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

  button1: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('66%'),
    // height:hp('8%'),
    marginRight: wp('1%'),

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
  },
  buttonDisapled: {
    backgroundColor: '#838383',
    borderColor: '#DCDCDC',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('66%'),
    // height:hp('8%'),
    marginRight: wp('1%'),

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
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('8%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    //  marginLeft:wp('5%'),
    marginTop: hp('0%'),
  },
  btnText2Disabled: {
    color: '#778899',
    fontSize: wp('8%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    //  marginLeft:wp('5%'),
    marginTop: hp('0%'),
  },

  button2: {
    marginTop: wp('10%'),

    padding: wp('2%'),

    width: wp('37%'),
    height: hp('7%'),
    //marginLeft:wp('45%'),
    marginBottom: wp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  subTitle11: {
    top: hp('1%'),
    color: '#4e31c1',
    marginBottom: hp('2%'),
    fontSize: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',

    //
  },
  button21: {
    backgroundColor: '#562dc7',
    //  borderColor:'#DCDCDC',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('64%'),
    marginRight: wp('1%'),
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
  },
  btnText3: {
    color: '#fff',
    fontSize: wp('6%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
  },

  modalView1: {
    margin: wp('10%'),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: wp('20%'),
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

  modalView: {
    margin: wp('10%'),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: wp('20%'),
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
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#4e31c1',
  },
  modalText1: {
    marginBottom: hp('5%'),
    marginTop: hp('-3%'),
    textAlign: 'center',
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
    width: wp('64%'),
    marginRight: wp('1%'),
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
  },
  btnText33: {
    color: '#fff',
    fontSize: wp('6%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    //  marginLeft:wp('5%'),
    marginTop: hp('-0.5%'),
  },
});

export default POS_Fill_the_machine;
