import React, {createRef, useEffect} from 'react';
import {
  TouchableHighlight,
  Alert,
  Modal,
  Button,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  Text,
  SafeAreaView,
  Linking,
  FlatList,
  Image,
} from 'react-native';
// //import i18n from 'i18n-js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
// import CameraRoll from '@react-native-community/cameraroll';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import {DotIndicator} from 'react-native-indicators';
import {Table, Row, Rows} from 'react-native-table-component';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { Card } from 'react-native-elements'
import {Card} from '@rneui/themed';
import NetInfo from '@react-native-community/netinfo';

import API_URL from '../URL';

// import * as ImageManipulator from '@pontusab/react-native-image-manipulator';
import RNPrint from 'react-native-print';
import QRCode from 'react-native-qrcode-svg';
import {NumericFormat} from 'react-number-format';
// import  from 'react-native-scalable-image';
import aimtidadImage from '../../../assets/icon16.jpeg';
import circleimages from '../../images/circleLogos';
import {useTranslation} from 'react-i18next';

const SimCardReport = ({navigation, route}) => {
  const viewShot = React.useRef();
  const viewShot2 = React.useRef();
  const {t} = useTranslation();
  const [cards, setCards] = React.useState({sell: []});
  const [sendlength, setSendlength] = React.useState(0);
  const [connection, setconnection] = React.useState('');
  const [connectionType, setconnectionType] = React.useState('');
  const [Image2, SetImage] = React.useState(null);
  const [from, setfrom] = React.useState('');
  const [fromDate, setfromDate] = React.useState(
    new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2),
  );
  const [toDate, settoDate] = React.useState(
    new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2),
  );
  const [html, sethtml] = React.useState('');
  const [to, setto] = React.useState('');
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const [dateTO, setDateTO] = React.useState(new Date(1598051730000));
  const [modeTO, setModeTO] = React.useState('date');
  const [showTO, setShowTO] = React.useState(false);
  const [TokenStatus, setTokenStatus] = React.useState(true);
  const [POS, StatePOS] = React.useState('');
  const [selectedstate, setselectedstate] = React.useState('');
  const [phone, setphonenumber] = React.useState();
  const [userfName, setuserName] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [pinallowed, setPinallowed] = React.useState(0);

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
      } else {
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
      StatePOS(await AsyncStorage.getItem('commercialName'));
      setphonenumber(await AsyncStorage.getItem('user_phonenumber'));
      setconnectionType('wifi');
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('HI Again From PosBuyCreditCard ');
        try {
          NetInfo.fetch().then(state => {
            console.log('Connection type taken money', state.type);
            setconnectionType('wifi');
            console.log('Is connected? taken money', state.isConnected);
            setconnection(state.isConnected);
          });
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your media files',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('granted');
          } else {
            console.log('Permission denied!');
          }
        } catch (err) {
          console.warn(err);
        }
        //////////////////////// pin is allowed or not //////////////////////////////

        getDate();
        // search();
      });

      getDate();
      //  search();
    })();
  }, []);

  const renderCompanies = ({item}) => {
    return (
      <>
        <Card
          containerStyle={styles.cardCnt}
          key={item.sim_card_transaction_id}>
          <View style={{backgroundColor: '#fff', marginTop: hp('-2%')}}>
            <Card.Title
              style={{color: '#4e31c1', fontSize: 20, marginTop: hp('2%')}}>
              التعبئة الالكترونية
            </Card.Title>
          </View>
          {/* <Card.Divider /> */}
          {item.sim_transfer_transaction_code != '' && (
            <Text
              style={{
                marginBottom: 10,
                color: '#4e31c1',
                fontFamily: 'Cairo-SemiBold',
                fontSize: wp('5%'),
              }}>
              رقم العملية: {item.sim_transfer_transaction_code}
            </Text>
          )}
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            نوع العملية: {item.status}
          </Text>
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('numberreciept')}: {item.sim_card_transaction_id}
          </Text>
          <Card.Divider />

          <Text
            style={{
              marginBottom: 10,
              fontSize: wp('6%'),
              color: '#f00',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
            }}>
            النوع: {item.category_type}
          </Text>

          <Card.Divider />

          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('category')}:{' '}
            <NumericFormat
              renderText={value => <Text style={styles.POS9}>{value}</Text>}
              value={item.category_value}
              displayType={'text'}
              thousandSeparator={true}
              fixedDecimalScale={true}
              decimalScale={0}
            />
          </Text>
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('Companyname')}: {item.company_name_ar}
          </Text>
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('thedate')}: {item.sim_card_transaction_datetime}
          </Text>
          <Card.Divider />

          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            {t('SellPrice')}:{' '}
            <NumericFormat
              renderText={value => <Text style={styles.POS9}>{value}</Text>}
              value={item.sell_price}
              displayType={'text'}
              thousandSeparator={true}
              fixedDecimalScale={true}
              decimalScale={0}
            />{' '}
            دينار
          </Text>
          <Card.Divider />
          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            مبيوعة الي: {item.sim_to_number}{' '}
          </Text>
          <Card.Divider />

          <Text
            style={{
              marginBottom: 10,
              color: '#4e31c1',
              fontFamily: 'Cairo-SemiBold',
              fontSize: wp('5%'),
            }}>
            مباعة إلى: {item.sold_to}{' '}
          </Text>
        </Card>
      </>
    );
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showModeTo = currentMode => {
    setShowTO(true);
    setModeTO(currentMode);
  };

  const showDatepickerTo = () => {
    showModeTo('date');
  };

  const onChange = (event, selectedDate) => {
    // console.log("SelectedDate",selectedDate);
    const currentDate = selectedDate;
    setShow(Platform.OS === 'ios');
    setfrom(selectedDate);
    setfromDate(selectedDate.toISOString().split('T')[0]);
  };

  const onChangeTo = (event, selectedDate) => {
    //   console.log("selectedDateTo",selectedDate);
    const currentDate = selectedDate;
    setShowTO(Platform.OS === 'ios');
    setto(selectedDate);
    settoDate(selectedDate.toISOString().split('T')[0]);
  };

  const search = async () => {
    try {
      const response = await axios.get(
        API_URL +
          `simcard/report/dailyreport?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}&fromDate=${fromDate}&toDate=${fromDate}`,

        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      console.log('response', response.data);
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
      } else {
        console.log('response777777', response.data);

        setTokenStatus(true);
        setCards({sell: response.data.simCards});
        setSendlength(response.data.simCards.length);
      }
    } catch (e) {
      console.log(e.message);
    }
    // }
  };

  console.log('TokenStatus', TokenStatus);
  if (TokenStatus == false) {
    return (
      <View>
        <Text
          style={{color: '#1c79f2', fontSize: wp('7%'), alignSelf: 'center'}}>
          {t('You Have to login again')}
        </Text>
      </View>
    );
  } else if (cards.sell.length == null) {
    return (
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
              <Text style={styles.POS3}> {userfName}</Text>

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
              }}>
              <SafeAreaView style={{flex: 1}}>
                {/* 
<Image
          width={Dimensions.get('window').width*0.8}
          source={Image2}
          style={styles.ImageAsiacell1}

        >
        </Image> */}
                {/* <Text style={{fontSize:wp('6%'),color:"#4e31c1",fontFamily:'Cairo_600SemiBold',alignSelf:'center',marginBottom:hp('2%')}}>{("ChooseDate")}</Text> */}
                <View style={styles.fixToTextTop}>
                  <Button
                    onPress={showDatepicker}
                    title={'اختار تاريخ اليوم'}
                    color="#4e31c1"
                  />

                  {/* <Button
    onPress={showDatepickerTo}
      title={t('ChooseDate')}  color="#4e31c1" /> */}
                </View>
                <View style={styles.fixToText}>
                  <Text
                    style={{
                      color: '#4e31c1',
                      fontSize: 20,
                      marginTop: hp('1%'),
                      fontFamily: 'Cairo-SemiBold',
                    }}>
                    {fromDate}
                  </Text>
                  {/* <Text style={{color:'#4e31c1' ,fontSize:20,marginTop:hp('1%'),fontFamily:'Cairo_600SemiBold',}} >{toDate}</Text> */}
                </View>
                {/* <View>
  showTO
    <Button onPress={showTimepicker} title="Show time picker!" />
  </View>  */}
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={mode}
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                  />
                )}

                {/* {showTO && (
    <DateTimePicker
      testID="dateTimePicker"
      value={new Date()}
      mode={mode}
      is24Hour={false}
      display="default"
      onChange={onChangeTo}
    />
  )}  */}

                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => search()}>
                  <Text style={styles.btnText2}>{t('Search')}</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // else if(cards.sell =="no cards sold in that range")
  // {

  // return(
  //   <View style={styles.containerBig}>
  // <Text style={styles.nodata}>لا يوجد كارتات مباعة في هذا اليوم</Text>
  // </View>

  // );
  // }

  // else if (connectionType != "wifi" && sendlength > 20) {
  //   console.log("not wifiii");
  //   return (
  //     <View style={styles.containerBig}>

  //       <Text style={styles.nodata}> لاتمام العملية يرجى فتح ال wifi</Text>
  //     </View>
  //   );

  // }

  // else if (Image2 == null) {
  //   return(

  //     <DotIndicator color="#4e31c1" />

  //     );
  //   }
  else {
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
                <Text style={styles.POS3}> {userfName}</Text>

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
              <View style={{backgroundColor: '#fff'}}>
                <SafeAreaView style={{flex: 1}}>
                  {/* <Image
                width={Dimensions.get('window').width*0.8}
                source={Image2}
                style={styles.ImageAsiacell1}

              >
              </Image> */}
                  {/* <Text style={{fontSize:wp('6%'),color:"#4e31c1",fontFamily:'Cairo_600SemiBold',alignSelf:'center',marginBottom:hp('2%')}}>{("ChooseDate")}</Text> */}

                  <View style={styles.fixToTextTop}>
                    <Button
                      onPress={showDatepicker}
                      title={'اختار تاريخ اليوم'}
                      color="#4e31c1"
                    />

                    {/* <Button
        onPress={showDatepickerTo}
          title={t('ChooseDate')}  color="#4e31c1" /> */}
                  </View>
                  <View style={styles.fixToText}>
                    <Text
                      style={{
                        color: '#4e31c1',
                        fontSize: 20,
                        marginTop: hp('1%'),
                        fontFamily: 'Cairo-SemiBold',
                      }}>
                      {fromDate}
                    </Text>
                    {/* <Text style={{color:'#4e31c1' ,fontSize:20,marginTop:hp('1%'),fontFamily:'Cairo_600SemiBold',}} >{toDate}</Text> */}
                  </View>
                  {/* <View>
      showTO
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>  */}
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={new Date()}
                      mode={mode}
                      is24Hour={false}
                      display="default"
                      onChange={onChange}
                    />
                  )}

                  {/* {showTO && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={onChangeTo}
        />
      )}  */}

                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => search()}>
                    <Text style={styles.btnText2}>{t('Search')}</Text>
                  </TouchableOpacity>

                  <View style={{flex: 1, padding: 16, marginTop: 12}}>
                    {cards.sell.length === 0 ? (
                      <View style={styles.containerBig}>
                        <Text style={styles.nodata}>
                          لا يوجد تعبئة الكترونية في هذا اليوم
                        </Text>
                      </View>
                    ) : connectionType != 'wifi' && sendlength > 20 ? (
                      <View style={styles.containerBig}>
                        <Text style={styles.nodata}>
                          {' '}
                          لاتمام العملية يرجى فتح ال wifi
                        </Text>
                      </View>
                    ) : (
                      <>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: wp('8%'),
                            color: '#4e31c1',
                            fontFamily: 'Cairo-SemiBold',
                            alignSelf: 'center',
                            marginBottom: hp('2%'),
                          }}>
                          عدد الكارتات التي تم تعبئتها في هذا اليوم:{' '}
                          {sendlength}{' '}
                        </Text>

                        <FlatList
                          data={cards.sell}
                          renderItem={renderCompanies}
                          keyExtractor={item => item.sim_card_transaction_id}
                        />
                      </>
                    )}
                  </View>
                </SafeAreaView>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
};
const styles = StyleSheet.create({
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor:'#4e31c1'
  },
  fixToTextTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('3px'),
    // backgroundColor:'#4e31c1'
  },
  tinyLogo1: {
    width: wp('20%'),
    height: hp('20%'),
    // justifyContent: 'center',
    // alignSelf: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
  },
  barcode: {
    height: 40,
    width: 300,
    marginTop: 20,
    alignSelf: 'center',
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
    color: '#4e31c1',
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
  tabletextred: {
    margin: 6,
    fontSize: wp('4.2'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'flex-start',
    //marginLeft: wp('0.85%'),
    //textAlign: 'center',
    color: '#808080',
  },
  tabletextredexpiry: {
    // margin: 6,
    fontSize: wp('4.7'),
    marginTop: hp('-4%'),
    fontFamily: 'Cairo-SemiBold',
    //textAlign: 'center',

    color: '#000',
  },
  tabletextredDate: {
    margin: 6,
    fontSize: wp('4.5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'flex-start',
    //textAlign: 'center',
    color: '#808080',
  },
  tabletextblack: {
    // margin: 6,
    fontSize: wp('4.7'),

    fontFamily: 'Cairo-SemiBold',
    //textAlign: 'center',
    color: '#000',
  },
  tabletextProfit: {
    margin: 6,
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    color: '#4EC447',
  },

  tabletext: {
    margin: 6,
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
  },
  tablecontainer: {
    flex: 1,
    padding: 6,
    paddingTop: 10,
    // backgroundColor: '#fff',

    width: wp('95%'),
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  Title0: {
    // top: hp('1%'),
    color: '#4e31c1',
    marginRight: wp('1%'),
    fontSize: wp('5'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },
  POS91: {
    fontSize: wp('7%'),
    textAlign: 'left',
    // marginTop: hp('15%'),
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    // marginBottom:hp('11%'),
    fontSize: 21,
    marginLeft: wp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },

  nodata: {
    fontSize: wp('6%'),
    marginTop: hp('3%'),
    alignSelf: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
  },

  cardCnt: {
    borderWidth: 1, // Remove Border
    shadowColor: '#000', // Remove Shadow IOS
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1, // This is for Android
    backgroundColor: '#fff',
    color: '#4e31c1',
  },

  cardCnt1: {
    borderWidth: 1, // Remove Border
    shadowColor: '#000', // Remove Shadow IOS
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1, // This is for Android
    backgroundColor: '#fff',
    width: wp('100%'),
    height: hp('65%'),
  },
  ImageAsiacell1: {
    alignSelf: 'center',
    width: wp('80%'),
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
    //backgroundColor: 'transparent',
    //color: 'transparent',
    fontSize: wp('5%'),
    borderRadius: 6,
    borderColor: '#F796A0',
    borderWidth: 2,
    margin: wp('10%'),
    paddingHorizontal: wp('2%'),
    color: '#000000',
    marginBottom: wp('-4%'),
    height: hp('4%'),
    width: wp('66%'),
    backgroundColor: 'transparent',
  },

  button1: {
    padding: wp('2%'),
    width: wp('60%'),
    height: hp('7%'),
    alignSelf: 'center',
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
    marginTop: hp('3%'),
  },
  btnText2: {
    color: '#fff',
    fontSize: wp('5%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    // marginTop:hp('-1%'),
  },

  button2: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('14%'),
    alignSelf: 'center',
    marginBottom: wp('1%'),
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
  button2111: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: 45,
    alignSelf: 'center',
    marginBottom: wp('1%'),
    marginTop: hp('-6%'),
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
    color: '#C81717',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    marginTop: wp('-3%'),
  },

  modalText1: {
    marginBottom: wp('4%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#4e31c1',
    marginTop: hp('-9%'),
  },
  modalText: {
    marginBottom: wp('4%'),
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#4e31c1',
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

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  modalView1: {
    // margin:30,
    backgroundColor: 'white',
    width: wp('95%'),
    alignSelf: 'center',
    //height: hp('90%'),
    borderRadius: 20,
    // padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SimCardReport;
