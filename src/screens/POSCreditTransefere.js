import * as React from 'react';
import {
  View,
  TextInput,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  TouchableHighlight,
  Alert,
  Image,
} from 'react-native';
import {NumericFormat} from 'react-number-format';
// import NumericFormat from 'react-number-format';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {DotIndicator} from 'react-native-indicators';
import {Picker} from '@react-native-picker/picker';
// import i18n from '../screens/i18n';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Image from 'react-native-scalable-image';
import axios from 'axios';
import API_URL from '../screens/URL';
import Sound from 'react-native-sound';
import {useTranslation} from 'react-i18next';

const POSCreditTransefere = ({navigation}) => {
  const {t} = useTranslation();
  const [ExtraFessFoundFlag, setExtraFessFoundFlag] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [Languagee, setLanguagee] = React.useState('JAava');
  const [token, settoken] = React.useState('');
  const [user_type_id, settype] = React.useState('');
  const [selectedSerials, setselectedSerials] = React.useState([]);
  const [ArrayToRender, setArrayToRender] = React.useState([]);
  const [ArrayToRendernotpaid, setArrayToRendernotpaid] = React.useState([]);
  const [currentLabel, setcurrentLabel] = React.useState('Select Extra fees');
  const [currentFees, setcurrentcurrentFees] = React.useState('');
  const [ExtraFeesArray, setExtraFeesArray] = React.useState([]);
  const [selectedValues, setselectedValues] = React.useState('');
  const [Totall, setTotall] = React.useState(0);
  const [TotalHeType, SetTotalHeType] = React.useState(0);
  const [HeTypeFlag, setHeTypeFlag] = React.useState(false);
  const [Phone, setPhoneNumber] = React.useState('');
  const [GetExtraFees, setGetExtraFees] = React.useState('');
  const [userId, setuserId] = React.useState(0);
  const [usertypeid, SetUserType] = React.useState('المرسل اليه');
  const [currency, setcurrency] = React.useState('');
  const [hascreditflag, sethascreditflag] = React.useState(true);
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [sound, setSound] = React.useState();
  const [Sure, setSure] = React.useState(false);
  const [modal, setmodal] = React.useState(false);
  const [flag, setflag] = React.useState(true);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [userName, setuserName] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [Res, SetResponse] = React.useState([]);
  const [stocks, setstocks] = React.useState([
    {
      SerialNumber: 0,
      Value: 0,
    },
  ]);
  const [userExist, setUserExist] = React.useState(false);

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
        } else {
          console.log('response==========>>', response);
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

  async function getData() {
    let Token = '';
    let user_type_id = '';

    let deviceId = await AsyncStorage.getItem('deviceId');
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
    try {
      Token = await AsyncStorage.getItem('Token');
      user_type_id = await AsyncStorage.getItem('user_type_id');
      settoken(Token);
      settype(user_type_id);
    } catch (e) {
      console.log(e.message);
    }

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
      // console.log("response",response);
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
        // console.log("Currentcredit",response.data.message[0]);
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
        console.log('HI Again From PSOCreditTransefere ');
        getData();
      });
      getData();
    })();

    Sound.setCategory('Playback');
  }, []);

  async function playSound() {
    const sound = new Sound('test.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound,sorry', error);
        return;
      }
      // loaded successfully ----
      console.log(
        'duration in seconds: ' +
          sound.getDuration() +
          'number of channels: ' +
          sound.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      sound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      setSound(sound);
    });
  }

  function ShowDetailsPOS(valuePhone) {
    (async () => {
      let usertypeId = '';
      let regionId = '';
      let user_phoneNumber = await AsyncStorage.getItem('user_phonenumber');
      if (user_phoneNumber === valuePhone) {
        Toast.show('لا يمكن التحويل لنفسك', Toast.LONG, {
          position: 660,
          backgroundColor: 'red',
          fontSize: 19,
          mask: true,
          color: 'white',
        });
        //Reset
        setPhoneNumber('');
      } else {
        try {
          user_phoneNumber = await AsyncStorage.getItem('user_phonenumber');
          usertypeId = await AsyncStorage.getItem('user_type_id');
          regionId = await AsyncStorage.getItem('regionId');
          const response = await axios.post(
            API_URL +
              `user/userdata?s=${parseInt(
                await AsyncStorage.getItem('userIdInUsers'),
              )}`,
            {userData: valuePhone},
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
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
            setTokenStatus(false);
          }
          //  console.log("response",response.data.message);
          else {
            setTokenStatus(true);
            if (user_phoneNumber === valuePhone) {
            } else {
              console.log('response', response.data[0]);
              SetResponse(response.data[0]);
              setUserExist(true)

              if (response.data[0].user_type_id == 1) {
                SetUserType('المندوب');
              } else if (response.data[0].user_type_id == 2) {
                SetUserType('الوكيل');
              } else if (response.data[0].user_type_id == 3) {
                SetUserType('نقطة بيع');
              } else if (response.data[0].user_type_id == 5) {
                SetUserType('الادارة');
              } else {
                Toast.show('هذا الرقم غير صحيح', Toast.LONG, {
                  position: 660,
                  backgroundColor: 'red',
                  fontSize: 19,
                  mask: true,
                  color: 'white',
                });
                setPhoneNumber('');
              }
            }
          }
        } catch (e) {
          console.log(e.message);
          setUserExist(false)
          Toast.show(t('userNotFount'), Toast.LONG, {
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
            color: 'white',
          });

        }
      }
    })();
  }
  async function onended(valuePhone) {
    console.log('on end editing');
    if ((await AsyncStorage.getItem('user_phonenumber')) != Phone) {
      ShowDetailsPOS(valuePhone);
    } else {
      Toast.show(t('ErrorSend'), Toast.LONG, {
        position: 660,
        backgroundColor: 'red',
        fontSize: 19,
        mask: true,
        color: 'white',
      });
    }
  }
  function onPress(valuePhone) {
    console.log('valuePhone', valuePhone);
    if (valuePhone.length == 11) {
      console.log('length equal 11');
      setPhoneNumber(valuePhone);
      onended(valuePhone);
    } else {
      console.log('length Not equal 11');
      setPhoneNumber(valuePhone);
    }
  }
  // function  Cancel() {

  //   Toast.show (('CancelSendCredit'),{
  //     containerStyle:{backgroundColor:"black"},
  //     textStyle: {fontSize:19, color:'white'}

  //    })
  //    navigation.navigate('Pos_homepage');
  // }

  async function cancelTransaction() {
    setPhoneNumber('');
    setTotall(0);
    SetTotalHeType(0);
    setselectedSerials([]);
    setExtraFeesArray(ArrayToRender);
    setGetExtraFees(0);
    setcurrentcurrentFees('');
    setSure(false);
    //////axiosToUpdateCredit
    getData();
  }

  async function OnSubmit() {
    //**********************************************SubmittData********************************************************

    console.log(
      'phone',
      Phone,
      parseInt(await AsyncStorage.getItem('user_phonenumber')),
    );
    if (Phone === (await AsyncStorage.getItem('user_phonenumber'))) {
      Toast.show('لا يمكن التحويل لنفسك', Toast.LONG, {
        position: 660,
        backgroundColor: 'red',
        fontSize: 19,
        mask: true,
        color: 'white',
      });
      //Reset
      setPhoneNumber('');
      setTotall(0);
      SetTotalHeType(0);
      setselectedSerials([]);
      setExtraFeesArray(ArrayToRender);
      setGetExtraFees(0);
      setcurrentcurrentFees('');
      setSure(false);
      setAmount(0);
      SetResponse([]);
      getData();
    } else {
      try {
        let objtosendtoaxiosdata = {
          status: 2,
          recieverPhone: Phone,
          amount: parseInt(amount),
          payment_method: 1,
          rm_balance: parseInt(amount),
        };
        console.log('data', objtosendtoaxiosdata);
        setflag(false);
        setTimeout(Re_enableBTn, 6000);
        const response = await axios.post(
          API_URL +
            `virttualmoney/transfervm?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          objtosendtoaxiosdata,

          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );
        // console.log("response",response);
        if (
          response.data == 'Token UnAuthorized' ||
          response.data == 'Token Expired'
        ) {
          Toast.show(t('You Have to login again'), Toast.LONG, {
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
            color: 'white',
          });
          setTokenStatus(false);
        }
        //  console.log("response",response.data.message);
        else {
          setTokenStatus(true);

          let rs2 = response.data.result;
          if (response.status === 200) {
            Toast.show(t('Done'), Toast.LONG, {
              position: 660,
              backgroundColor: 'green',
              fontSize: 19,
              mask: true,
              color: 'white',
            });

            playSound();
            //Reset
            setPhoneNumber('');
            setTotall(0);
            SetTotalHeType(0);
            setselectedSerials([]);
            setExtraFeesArray(ArrayToRender);
            setGetExtraFees(0);
            setcurrentcurrentFees('');
            setSure(false);
            setAmount(0);
            SetResponse([]);
            getData();
            setmodal(false);
          } else if (
            rs2 ==
            'transfer can not occur, money allowed to transfer to this person'
          ) {
            console.log('fgfgfgf');
            Toast.show(
              t(
                'transfer can not occur, money allowed to transfer to this person',
              ),
              Toast.LONG,
              {
                position: 660,
                backgroundColor: '#5F7FA0',
                fontSize: 19,
                mask: true,
                color: 'white',
              },
            );
          } else if (rs2 == 'wrong phone number') {
            console.log('fgfgfgf');
            Toast.show(t('wrong phone number'), Toast.LONG, {
              position: 660,
              backgroundColor: '#5F7FA0',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
          } else if (rs2 == 'this user is no longer available') {
            console.log('fgfgfgf');
            Toast.show('هذا الشخص غير مفعل الان.', Toast.LONG, {
              position: 660,
              backgroundColor: '#5F7FA0',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
          } else if (rs2 == 'that dealer is unauthorized') {
            console.log('fgfgfgf');
            Toast.show('عفوا هذا الوكيل غير مسؤول عنك', Toast.LONG, {
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
          }
        }
      } catch (e) {
        //End Else

        if (e.response.data.message === 'not enough balance') {
          Toast.show(
            'لا يوجد رصيد كافي للتحويل يرجى الشحن و اعادة المحاولة مرة اخرى',
            Toast.LONG,
            {
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'white',
            },
          );
          //Reset
          setPhoneNumber('');
          setTotall(0);
          SetTotalHeType(0);
          setselectedSerials([]);
          setExtraFeesArray(ArrayToRender);
          setGetExtraFees(0);
          setcurrentcurrentFees('');
          setSure(false);
          setAmount(0);
          SetResponse([]);
          getData();
        } else if (e.response.data.message === 'Exceeded debt limit') {
          Toast.show(
            'لا يمكن التحويل لهذا الحساب لأن الحساب تعدى المبلغ المديون به',
            Toast.LONG,
            {
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'white',
            },
          );
          //Reset
          setPhoneNumber('');
          setTotall(0);
          SetTotalHeType(0);
          setselectedSerials([]);
          setExtraFeesArray(ArrayToRender);
          setGetExtraFees(0);
          setcurrentcurrentFees('');
          setSure(false);
          setAmount(0);
          SetResponse([]);
          getData();
        } else {
          console.log('In catch', e);
          Toast.show(t('SorryError'), Toast.LONG, {
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
            color: 'white',
          });
        }
      }
    }
  }
  async function Send() {
    if (Phone === (await AsyncStorage.getItem('user_phonenumber'))) {
      Toast.show('لا يمكن التحويل لنفسك', Toast.LONG, {
        position: 660,
        backgroundColor: 'red',
        fontSize: 19,
        mask: true,
        color: 'white',
      });
      //Reset
      setPhoneNumber('');
      setTotall(0);
      SetTotalHeType(0);
      setselectedSerials([]);
      setExtraFeesArray(ArrayToRender);
      setGetExtraFees(0);
      setcurrentcurrentFees('');
      setSure(false);
      setAmount(0);
      SetResponse([]);
      getData();
    } else {
      setSure(true);
      OnSubmit();
    }
  }
  async function Cancel() {
    setSure(false);
    setmodal(false);
    setPhoneNumber('');
    setTotall(0);
    SetTotalHeType(0);
    setselectedSerials([]);
    SetResponse([]);
    SetUserType('');
    setExtraFeesArray(ArrayToRender);
    setGetExtraFees(0);
    setcurrentcurrentFees('');
    getData('');
    setAmount(0);
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

  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  }

  //  else if(hascreditflag==false)
  //  {

  // return(
  //   <ImageBackground
  //   source={require('../../assets/backgroumd34.png')}
  //   style={{height:"100%",
  //   width:"100%", flex:1}}>
  // <View>
  // <Text style={styles.nodata}>لا يوجد رصيد كافي للتحويل</Text>
  // </View>
  // </ImageBackground>

  // );

  //  }
  else if (hascreditflag == false) {
    return (
      <View style={styles.containerBig}>
        <Text style={styles.nodata}>لا يوجد رصيد لارساله</Text>
      </View>
    );
  } else {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <View style={styles.centeredView}>
            <ScrollView>
              <View style={styles.modalView}>
                {Res.user_type_id == 5 ? (
                  <>
                    <Text style={styles.modalText}>رصيدك الحالي</Text>
                    <Text style={styles.modalText}>
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.modalText33}>{value}</Text>
                        )}
                        value={virtualMoneyBalance}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                    <Text style={styles.modalText}>{t('AskbeforSend')} </Text>
                    <Text style={styles.modalText}>
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.modalText33}>{value}</Text>
                        )}
                        value={amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                    <Text style={styles.modalText}>{t('AskbeforSendTo')} </Text>

                    <Text style={styles.modalTextYellow}>{usertypeid}</Text>
                    <Text style={styles.modalText}>{Res.userName} </Text>
                    <Text style={styles.modalText}>{Phone}</Text>
                    <Text style={styles.modalText}>نقدى</Text>
                    <Text style={styles.modalText}>
                      مجموع رصيدك بعد التحويل
                    </Text>
                    {HeTypeFlag == false ? (
                      <Text style={styles.modalText}>
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.modalText33}>{value}</Text>
                          )}
                          value={virtualMoneyBalance - amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      </Text>
                    ) : (
                      <Text style={styles.modalText}>
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.modalText33}>{value}</Text>
                          )}
                          value={virtualMoneyBalance - amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.modalText}>رصيدك الحالي</Text>
                    <Text style={styles.modalText}>
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.modalText33}>{value}</Text>
                        )}
                        value={virtualMoneyBalance}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                    <Text style={styles.modalText}>{t('AskbeforSend')} </Text>
                    <Text style={styles.modalText}>
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.modalText33}>{value}</Text>
                        )}
                        value={amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                    <Text style={styles.modalText}>{t('AskbeforSendTo')} </Text>

                    <Text style={styles.modalTextYellow}>{usertypeid}</Text>
                    <Text style={styles.modalText}>{Res.userName} </Text>
                    <Text style={styles.modalText}>{Phone}</Text>
                    <Text style={styles.modalText}>نقدى</Text>

                    <Text style={styles.modalText}>
                      مجموع رصيدك بعد التحويل
                    </Text>

                    {HeTypeFlag == false ? (
                      <Text style={styles.modalText}>
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.modalText33}>{value}</Text>
                          )}
                          value={
                            virtualMoneyBalance -
                            amount -
                            Res?.extrafees * 0.01 * amount
                          }
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      </Text>
                    ) : (
                      <Text style={styles.modalText}>
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.modalText33}>{value}</Text>
                          )}
                          value={virtualMoneyBalance - amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      </Text>
                    )}
                  </>
                )}
                {flag == true ? (
                  <TouchableHighlight
                    style={styles.button13}
                    onPress={() => {
                      Send();
                    }}>
                    <Text style={styles.btnText33}> {t('Send')}</Text>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight style={styles.button13} disabled={true}>
                    <Text style={styles.btnText33Disabled}> {t('Send')}</Text>
                  </TouchableHighlight>
                )}

                <TouchableHighlight
                  style={styles.button15}
                  onPress={() => {
                    Cancel();
                  }}>
                  <Text style={styles.btnText33}> {t('Cancel')}</Text>
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
<View style={{alignItems: 'center', marginLeft:wp('6%')}}>
<Text style={styles.texttitle}>
      {t('FirstOption')}
     </Text>
</View> */}

                <View style={{marginTop: hp('1%')}}>
                  <View style={styles.searchSection2}>
                    <TextInput
                      placeholder={t('phonenumber')}
                      value={Phone}
                      style={styles.inputStyle1}
                      keyboardType="phone-pad"
                      textAlign="center"
                      clearButtonMode="always"
                      placeholderTextColor="#cbb8ef"
                      onChangeText={text => onPress(text)}
                      maxLength={11}
                      // enablesReturnKeyAutomatically={true}
                    />
                    {/* <MaterialCommunityIcons name="cellphone-iphone" size={26} color="#7d54e1" style={{padding:2}}  /> */}
                    <Image
                      source={require('../../assets/001-smartphone-call.png')}
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: '#7d54e1',
                      }}
                    />
                  </View>

                  <View style={styles.searchSection}>
                    <TextInput
                      placeholder="المبلغ المطلوب تحويله"
                      style={styles.inputStyle}
                      keyboardType="number-pad"
                      textAlign="center"
                      clearButtonMode="always"
                      placeholderTextColor="#cbb8ef"
                      value={amount}
                      onChangeText={text => setAmount(text)}
                    />
                    {/* <NumericFormat
 
    renderText={value => 
      <TextInput 
        keyboardType='phone-pad' 
        onChangeText={(text) => SetTotalHeTypeFunction(text)}
        style={styles.inputStyle} placeholder={value}>
          </TextInput>
      } 
    value={Totall+''} displayType={'text'} thousandSeparator={true}  /> */}
                    <FontAwesome5
                      name="money-bill-wave"
                      size={22}
                      color="#7d54e1"
                      style={{padding: 2}}
                    />
                  </View>
                  <Text
                    style={[
                      styles.SelectExtraFees,
                      {alignSelf: 'center', marginTop: 10},
                    ]}>
                    المبلغ المطلوب تحويله:{' '}
                    <NumericFormat
                      renderText={value => (
                        <Text style={styles.SelectExtraFees}>{value}</Text>
                      )}
                      value={amount}
                      displayType={'text'}
                      thousandSeparator={true}
                      fixedDecimalScale={true}
                      decimalScale={0}
                    />{' '}
                  </Text>
                  {/* <Text style={styles.Total}>
 {t('Total')}  {Totall}
</Text> */}
                  {/* ------------------------------------DropDown --------------------------------------------*/}

                  {/* {(ArrayToRender.length==0)?

<Text>{''}</Text>


:

<>

<Text style={styles.SelectStocks}>
      {t('SelectStocks')}
     </Text>
<View style={{
   borderRadius:wp('6%'),marginBottom:hp('3%')}}>
            {
               ArrayToRender.map((item, index) => (
                
                  <TouchableOpacity
                     key = {item.virtual_money_id}
                     
                     style={ (selectedSerials.includes(item.virtual_money_id)) ? styles.containerTestClicked : styles.containerTest}
                     onPress = {() => SelectedStocks(item)}>
                     <Text style = {styles.textTest}>
                        {("Serial")}  {item.virtual_mony_serial_number}    {("Value")} <NumericFormat
        renderText={value => <Text  style={styles.textTest} >{value}</Text>} 
        value={item.virtual_money_balance} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} />
                     </Text>
                  </TouchableOpacity>
               ))
            }
         </View>

         </>



 } */}

                  {/*{(ArrayToRendernotpaid.length==0)?

<Text>{''}</Text>


:

<>
<Text style={styles.SelectStocks2}>
   ارصدة لا يمكن تحويلها
</Text>
<Text style={styles.SelectStocks2}>
  لانها مسددة كاملا او جزئيا
</Text>
<View style={{
   borderRadius:wp('6%'),marginBottom:hp('3%')}}>
            {
               ArrayToRendernotpaid.map((item, index) => (
                
                  <TouchableOpacity
                     key = {item.virtual_money_id}
                     disabled={true}
                     style={styles.containerTestClicked2}
                     onPress = {() => SelectedStocks(item)}>
                     <Text style = {styles.textTest}>
                        {("Serial")}  {item.virtual_mony_serial_number}    {("Value")} <NumericFormat
        renderText={value => <Text  style={styles.textTest} >{value}</Text>} 
        value={item.virtual_money_balance} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} />
                     </Text>
                  </TouchableOpacity>
               ))
            }
         </View>

         </>



} */}

                  {/* <Text style={styles.SelectExtraFees}>{("ExtraFees")}</Text> */}
                  {/* <View  style={{
 
 backgroundColor:"#562dc7",
// marginTop:hp('1%'),
 width:wp('98%'),
 alignSelf:'center',
 borderRadius:10,
 
 }}> */}
                  {/* <Image
   <Ionicons name="arrow-down-circle-sharp" size={24} color="black" />
      <Ionicons name="ios-arrow-down-sharp" size={24} color="black" />
       source={require('../../assets/down-arrow(1).png')} 
       style={styles.tinylogoimage}
   ></Image> */}
                  {/* <Ionicons name="ios-arrow-down-sharp" size={24} color="white" style={{position:'absolute',marginTop:hp('1.1%'),
}} />

<Picker
  selectedValue={currentFees}
  style={{
  height: 40,
  width: 900,
  color:"#fff",
  backgroundColor: 'transparent',
  marginLeft:20,
  }}
  onValueChange={(itemValue, itemIndex) =>
    pickerChange(itemIndex-1)}>
    <Picker.Item key={0} label={("ChooseExtrafess")} value={0} />
 {
   
    ExtraFeesArray.map( (item)=>{
   return <Picker.Item key={item.virtual_money_id} label={"الفئة"+item.virtual_money_balance +" Serial  "+item.virtual_mony_serial_number} value={item.virtual_money_id} />
  })
 }
</Picker>
</View> */}

                  {Res.user_type_id == 5 ? (
                    <View style={styles.ContainerSmall}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-SemiBold',
                          color: '#4e31c1',
                        }}>
                        {usertypeid}{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-SemiBold',
                          color: '#4e31c1',
                        }}>
                        {t('name')} : {Res.userName}{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-SemiBold',
                          color: '#4e31c1',
                        }}>
                        {t('extraCost')} : {Res.extrafees}{' '}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.ContainerSmall}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-SemiBold',
                          color: '#4e31c1',
                        }}>
                        {usertypeid}{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-SemiBold',
                          color: '#4e31c1',
                        }}>
                        {t('name')} : {Res.userName}{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-SemiBold',
                          color: '#4e31c1',
                        }}>
                        {t('Area')} : {Res.area_arabic_name}{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-SemiBold',
                          color: '#4e31c1',
                        }}>
                        {t('extraCost')} :
                        {Res.extrafees >= 0 ? `%` + Res.extrafees : ``}{' '}
                      </Text>
                      {/* <Text style={{fontSize:20,  fontFamily:'Cairo-SemiBold', color:'#4e31c1'}}>{t('extraCost')} : {GetExtraFees} </Text> */}
                    </View>
                  )}

                  {/* ------------------------------------End DropDown --------------------------------------------*/}

                  {/* ------------------------------------ExtraFees DropDown --------------------------------------------*/}

                  {/* <Picker
  selectedValue={Languagee}
  style={{height: 50, width: 100}}
  onValueChange={(itemValue, itemIndex) =>
    setLanguagee(itemValue)
  }>
    {extraaray2.map((item, index) => 
                
   ( <Picker.Item label={item.virtual_money_balance} value={item.virtual_money_id} />)
  
             )
    }
  
  <Picker.Item label="JavaScript" value="js" />
</Picker>  */}
                  {/* ------------------------------------ End ExtraFees DropDown --------------------------------------------*/}

                  {/* <TouchableOpacity style={styles.button2}>
         <Text style={styles.btnText2}
         // onPress={() =>ShowDetails()} 
        // Aya
        onPress={() => ShowDetailsPOS()}
         >{t('showuserdata')}</Text>
      </TouchableOpacity>/ */}

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: hp('1%'),
                      marginBottom: hp('2%'),
                      justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity
                      disabled={Phone.length != 11 || amount == 0 || !userExist }
                      style={{
                        ...styles.button1,
                        backgroundColor:
                          Phone.length != 11 || amount == 0 || !userExist 
                            ? 'grey'
                            : '#4e31c1',
                        borderColor:
                          Phone.length != 11 || amount == 0 || !userExist 
                            ? 'grey'
                            : '#4e31c1',
                      }}
                      onPress={() => setmodal(true)}>
                      <Text style={styles.btnText2}>{t('FirstOption')}</Text>

                      {/* onPress={() =>navigation.navigate('ThirdPage')}   */}
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.button3}     onPress={() => Cancel()    }       >
         <Text style={styles.btnText2}>{t('cancel')}</Text>
     </TouchableOpacity> */}
                  </View>
                </View>
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

  searchSection2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: wp('70%'),
    alignSelf: 'center',
    marginTop: hp('8%'),
  },

  tinylogoimage: {
    width: wp('7%'),
    height: hp('2%'),
    position: 'absolute',
    marginTop: hp('0.5%'),
    marginLeft: wp('3%'),
    zIndex: 1,
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
    width: wp('95%'),
    alignSelf: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  Total: {
    fontSize: wp('7%'),
    alignSelf: 'center',
    //   top:hp('2%'),
    fontFamily: 'Cairo-SemiBold',

    color: '#fff',
    marginBottom: hp('1%'),
  },
  modalText33: {
    marginBottom: wp('5%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#f00',
  },
  modalText: {
    marginBottom: wp('16%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#4e31c1',
    marginTop: hp('-8%'),
  },
  modalTextYellow: {
    marginBottom: wp('16%'),
    textAlign: 'center',
    fontSize: wp('6%'),
    color: '#ffd775',
    marginTop: hp('-8%'),
    fontFamily: 'Cairo-SemiBold',
  },
  SelectExtraFees: {
    fontSize: wp('6%'),
    alignSelf: 'center',
    //   top:hp('2%'),
    fontFamily: 'Cairo-SemiBold',

    color: '#4e31c1',
  },
  SelectStocks: {
    fontSize: wp('6%'),
    alignSelf: 'center',
    //   top:hp('2%'),
    fontFamily: 'Cairo-SemiBold',

    color: '#4e31c1',
    marginBottom: hp('1%'),
    marginTop: hp('2%'),
  },

  SelectStocks2: {
    fontSize: wp('6%'),
    alignSelf: 'center',
    //   top:hp('2%'),
    fontFamily: 'Cairo-SemiBold',

    color: '#4e31c1',
    marginBottom: hp('1%'),
    marginTop: hp('2%'),
  },
  containerTestClicked: {
    padding: 10,
    marginTop: 3,
    backgroundColor: '#A6ACAF',
    borderColor: '#F2FFFF',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('98%'),
    height: 45,
    alignSelf: 'center',
    // marginRight:wp('9%'),
    marginTop: hp('3%'),
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

  containerTestClicked2: {
    padding: 10,
    marginTop: 3,
    backgroundColor: '#A6ACAF70',
    borderColor: '#F2FFFF',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('98%'),
    height: 45,
    alignSelf: 'center',
    // marginRight:wp('9%'),
    marginTop: hp('3%'),
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
  btnText33Disabled: {
    color: '#59595A',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('-0.5%'),
  },
  button13: {
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
    marginTop: hp('-6%'),
    marginBottom: hp('9%'),
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
  button15: {
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
    marginTop: hp('-8%'),
    marginBottom: hp('-5%'),
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
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('-0.5%'),
  },
  containerTest: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('98%'),
    height: 45,
    alignSelf: 'center',
    // marginRight:wp('9%'),
    marginTop: hp('3%'),
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
  textTest: {
    color: '#fff',
    fontSize: wp('4%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
    //  marginTop:hp('-1%'),
  },
  ContainerSmall: {
    marginTop: hp('1%'),
    alignSelf: 'flex-start',
    marginLeft: wp('9%'),
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

  container: {
    backgroundColor: '#AACCFA',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginVertical: hp('50%'),
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

  texttitle: {
    fontSize: wp('11%'),
    alignSelf: 'center',
    //   top:hp('2%'),
    fontFamily: 'Cairo-SemiBold',

    color: '#4e31c1',
  },

  nodata: {
    fontSize: wp('6%'),
    marginTop: hp('12%'),
    alignSelf: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
  },
  inputStyle: {
    fontFamily: 'Cairo-SemiBold',
    //marginTop:hp('-0.9%'),
    fontSize: wp('4%'),
    borderRadius: 10,
    alignSelf: 'center',
    color: '#000000',
    width: wp('60%'),
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
  inputStyle1: {
    fontFamily: 'Cairo-SemiBold',
    marginTop: hp('4%'),
    fontSize: wp('6%'),
    borderRadius: 10,
    alignSelf: 'center',
    color: '#000000',
    width: wp('60%'),
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

  image: {
    position: 'absolute',

    width: wp('100%'),
    height: hp('150%'),
  },

  tinyLogo: {
    top: hp('-9%'),
    height: hp('30%'),
    width: wp('60%'),
    //marginLeft:wp('20%'),
    alignItems: 'center',
  },
  button1: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: 52,
    alignSelf: 'center',
    // marginRight:wp('9%'),
    marginTop: hp('1%'),
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
  button2: {
    marginTop: hp('2%'),
    padding: wp('2%'),

    width: wp('60%'),
    height: hp('7%'),
    alignSelf: 'center',
    marginBottom: wp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  button3: {
    //  marginTop:wp('-19%'),

    padding: wp('2%'),

    width: wp('37%'),
    height: hp('7%'),
    //  marginLeft:wp('-50%'),
    //  marginBottom:wp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('-1%'),
  },

  InputsContainer: {
    //top: wp('-29%'),
  },
});

export default POSCreditTransefere;
