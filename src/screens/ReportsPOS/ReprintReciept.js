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
  Platform,
} from 'react-native';
//import i18n from 'i18n-js';
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
// import boximages from '../../images/SoldPosImages';
// import printerImages from '../../images/printerimages'
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
import Barcode from 'react-native-barcode-svg';
import QRCode from 'react-native-qrcode-svg';
import {NumericFormat} from 'react-number-format';
// import  from 'react-native-scalable-image';
import aimtidadImage from '../../../assets/icon16.jpeg';
import circleimages from '../../images/circleLogos';
import {useTranslation} from 'react-i18next';

const SoldPOS = ({navigation, route}) => {
  // console.log("route", route);
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
  const [posid, setposid] = React.useState('');
  const [modal, setmodal] = React.useState(false);
  const [selectedstate, setselectedstate] = React.useState('');
  const [phone, setphonenumber] = React.useState();
  const [userfName, setuserName] = React.useState('');
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [pinallowed, setPinallowed] = React.useState(0);
  const [show1, setShow1] = React.useState('');
  const [ImageCircle, SetImageCircle] = React.useState(null);
  const [coverPrinter, setCoverPrinter] = React.useState();
  const [coverPrinterSrc, setCoverPrinterSrc] = React.useState();
  // const arrayBufferToBase64 = buffer => {
  //   let binary = '';
  //   let bytes = new Uint8Array(buffer);
  //   let len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   // console.log((binary));
  //   return binary;
  // };
  // const uriPrinter = `data:image/png;base64,${arrayBufferToBase64(coverPrinter)}`

  // const companyPrinterImage = async (companyId) => {
  //   // const companyId = route.params.company_id
  //   console.log({ companyId });
  //   try {
  //     const user_id = await AsyncStorage.getItem('userIdInUsers');
  //     // company_id = 14
  //     const response = await axios.get(
  //       API_URL + `company/${companyId}/printer?s=${parseInt(user_id)}`

  //       ,
  //       {
  //         headers: {
  //           'x-access-token': `${await AsyncStorage.getItem('Token')}`
  //         }
  //       }
  //     )
  //     console.log({ "responseeeeprinter": response?.data.printer_logo.data });
  //     setCoverPrinter(response?.data.printer_logo.data)
  //     let uri = `data:image/png;base64,${arrayBufferToBase64(coverPrinter)}`
  //     return uri
  //   }
  //   catch (e) {
  //     console.log("errr", e.message);
  //   }
  // }

  React.useEffect(() => {
    // console.log("uriPrinter", uriPrinter);
    // setCoverPrinterSrc(uriPrinter)
    // console.log(coverPrinterSrc);
    // console.log("route.params", route.params);
  }, [coverPrinter]);

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

  // useEffect(async () => {
  //   try {
  //     NetInfo.fetch().then(state => {
  //       console.log('Connection type taken money', state.type);
  //       setconnectionType(state.type)
  //       console.log('Is connected? taken money', state.isConnected);
  //       setconnection(state.isConnected)
  //     });
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: "Storage Permission",
  //         message: "App needs access to your media files",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK"
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('granted')
  //     } else {
  //       console.log('Permission denied!')
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }, []);

  async function copyToClipboard1(
    card_id,
    pin,
    pos,
    company,
    category1,
    serial,
    sellprice,
    expire_date,
    selldate,
    daily_serial,
    soldtoname,
    companyId,
  ) {
    // console.log("=================================================", daily_serial);
    console.log({companyId, company});

    let arr = [];
    let show33 = '';
    arr.push({pin, serial, expire_date, daily_serial});
    const aimtidadImage = require('../../../assets/icon11.png');

    let category = category1 + '-IQD';
    try {
      console.log('diddmount');
      const response = await axios.get(
        API_URL +
          `admin/companycodes?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      console.log('ressss', response);
      for (let i = 0; i < response.data.message.length; i++) {
        if (response.data.message[i].company_id === companyId) {
          console.log('Currentcredit', response.data.message[i].QR_code);

          show33 = response.data.message[i].QR_code;
        }
      }
    } catch (e) {
      console.log(e.message);
    }

    navigation.navigate('PrintReceipt', {
      PosComercialName: pos,
      arrStr: arr,
      status: 'Copy Copy طباعة نسخة اضافية',
      newprice: sellprice,
      soldtoname: soldtoname,
      posId: phone,
      category,
      company,
      selldate,
      // image: coverPrinter,
      aimtidadImage,
      showID: show33,
      companyId,
    });
    let data = {
      user_id: parseInt(await AsyncStorage.getItem('userIdInUsers')),
      card_id: card_id,
    };
    // console.log("=================================================", card_id, data);
    try {
      const response = await axios.post(
        API_URL +
          `user/addprints?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        data,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      console.log('response', response);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function SaveImageIngallary() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      console.log('PermissionsAndroid.RESULTS.GRANTED==>', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        viewShot?.current?.capture().then(async uri => {
          console.log('do something with ', uri);
          setmodal(false);
          CameraRoll?.save(uri, 'photo')
            .then(() => {
              Toast.show(t('DonSaveToStudio'), Toast.LONG, {
                position: 660,
                backgroundColor: 'green',
                fontSize: 19,
                mask: true,
                color: 'white',
              });
            })
            .catch(e => console.log('error in saving', e));
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }

    let data = {
      user_id: parseInt(await AsyncStorage.getItem('userIdInUsers')),
      card_id: selectedstate.card_id,
    };
    // console.log("=================================================", selectedstate.card_id, data);
    try {
      const response = await axios.post(
        API_URL +
          `user/addprints?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        data,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      console.log('response', response);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function SaveImage(
    card_id,
    pin,
    pos,
    company,
    category,
    serial,
    sellprice,
    expire_date,
    selldate,
    profit,
    rm_cards_receipt,
  ) {
    SetImageCircle(circleimages[`${company}`]);

    let itemBarcCodeText = pin;
    if (company == 'Asiacell') {
      itemBarcCodeText = '*133*' + pin + '#';
    } else if (company == 'Korek') {
      itemBarcCodeText = '*221*' + pin + '#';
      console.log(itemBarcCodeText);
    } else if (company == 'Zain') {
      itemBarcCodeText = '*101#' + pin + '#';
      console.log(itemBarcCodeText);
    }
    setmodal(true);
    setselectedstate({
      card_id,
      pin,
      pos,
      company,
      category,
      serial,
      sellprice,
      expire_date,
      selldate,
      profit,
      rm_cards_receipt,
      itemBarcCodeText,
    });
  }

  async function SharImage() {
    console.log('share image', viewShot);
    viewShot?.current?.capture().then(async uri => {
      // const { base64 } = await ImageManipulator.manipulateAsync(
      //   uri,
      //   [],
      //   { format: "png", base64: true }
      // );
      let urlToShare = 'data:image/png;base64,'; //+ base64
      Share.open({url: uri})
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log('error from sharing', err);
        });
      // Sharing.shareAsync(url.uri)
    });
    let data = {
      user_id: parseInt(await AsyncStorage.getItem('userIdInUsers')),
      card_id: selectedstate.card_id,
    };
    // console.log("=================================================", selectedstate.card_id, data);
    try {
      const response = await axios.post(
        API_URL +
          `user/addprints?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        data,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      console.log('response', response);
    } catch (e) {
      console.log(e.message);
    }
  }

  async function downloadPDF(item) {
    let options = {
      html: `     
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pdf Content</title>
                <style>
                    body {
                        font-size: 15px;
                    }
        
                    h1 {
                        text-align: left;
                        margin-bottom: -17px;
                    }

                    h2 {
                      text-align: center;
                      margin-bottom: -17px;
                      font-size: 49px;
                      color: black;
                      margin-top:-14px;

                  }

                    img {

                      width:80%;
                      height:100%;
                      margin-top:7px;
                    }
                </style>
            </head>
                    
                    
                           
     <body>             

     <br> 
<h1  style="       margin-top:-35px;  align-items: center; text-align: center;" >Copy Copy طباعة نسخة اضافية</h1>
<br>   
<h1 style="font-size: 30px; align-items: center; text-align: center;">
AMOUNT
</h1 > 
<br>  
<h1 style="font-size: 30px;  align-items: center; text-align: center;" >
${item.category_value}-IQD
</h1> 
<br>  
<h1 style="font-size: 30px; align-items: center; text-align: center;">
PIN CODE
</h1>
<br> 
     <h1 style="color: red; font-size: 50px;  align-items: center; text-align: center;">
  
     ${item.pin}

     </h1>
     <h1 style=" font-size: 50px;  align-items: center; text-align: center;">
  
- - - - - - - - - - - - - - - - - - - - - - - - 

     </h1>
     <br>
     <h1>
 Serial            :${item.serial}
     </h1>


     <h1>
   Expiry                :${item.expire_date} 0:00:00
     </h1>
     <h1>
   Merchant ID          :${posid} 
     </h1>
     <h1>
   Merchant Name    :${POS}
     </h1>   
     <h1>
     Time                       :${item.creation_date_tr}
     </h1>

     
                                       
                                        </body> 
                                        </html>
            
            `,
      fileName: 'Document',
      base64: true,
    };
    RNHTMLtoPDF.convert(options)
      .then(async file => {
        console.log('condition', Platform.constants['Release'].split('.')[0]);
        if (Platform.constants['Release'].split('.')[0] < 6) {
          console.log('file.filePath', `file://${file.filePath}`);
          await RNPrint.print({filePath: `file://${file.filePath}`});
        } else {
          console.log(file.filePath);
          await RNPrint.print({filePath: file.filePath});
        }
      })
      .catch(e => console.log('console log error', e));

    let data = {
      user_id: parseInt(await AsyncStorage.getItem('userIdInUsers')),
      card_id: selectedstate.card_id,
    };
    // console.log("=================================================", selectedstate.card_id, data);
    try {
      const response = await axios.post(
        API_URL +
          `user/addprints?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        data,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      console.log('response', response);
    } catch (e) {
      console.log(e.message);
    }
  }

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
        Toast.show(t('You Have to login again'));
        setTokenStatus(false);
      } else {
        setTokenStatus(true);
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
      }
    } catch (e) {
      console.log(e.message);
    }
    try {
      const response = await axios.get(
        API_URL +
          `user/pinallowed/${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}?s=${parseInt(await AsyncStorage.getItem('userIdInUsers'))}`,
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
        Toast.show(t('You Have to login again'));
        setTokenStatus(false);
      } else {
        setTokenStatus(true);
        console.log('response', response.data.message);
        setPinallowed(response.data.message);
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
    console.log({'item-itemmmmmmmsss': item});

    return (
      <>
        <Card containerStyle={styles.cardCnt} key={item.transaction_id}>
          <ViewShot ref={viewShot2} options={{format: 'png', quality: 0.9}}>
            <View style={{backgroundColor: '#fff', marginTop: hp('-2%')}}>
              <Card.Title
                style={{color: '#4e31c1', fontSize: 20, marginTop: hp('2%')}}>
                {t('sellcards')}
              </Card.Title>
            </View>
            <Card.Divider />
            <Text
              style={{
                marginBottom: 10,
                color: '#4e31c1',
                fontFamily: 'Cairo-SemiBold',
                fontSize: wp('5%'),
              }}>
              رقم التسلسل اليومي: {item.daily_serial}
            </Text>
            <Card.Divider />
            <Text
              style={{
                marginBottom: 10,
                color: '#4e31c1',
                fontFamily: 'Cairo-SemiBold',
                fontSize: wp('5%'),
              }}>
              {t('numberreciept')}: {item.transaction_id}
            </Text>
            <Card.Divider />
            {(console.log('pin', pinallowed), pinallowed === 0) ? (
              <>
                <View style={{backgroundColor: '#fff'}}>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(item.pin, item.company_card_id)
                    }>
                    <Text
                      style={{
                        marginBottom: 10,
                        fontSize: wp('6%'),
                        color: '#f00',
                        alignItems: 'flex-start',
                        alignSelf: 'flex-start',
                      }}>
                      {item.pin} :{t('Cardnumber')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Card.Divider />
              </>
            ) : (
              <>
                <View></View>
              </>
            )}
            <Text
              style={{
                marginBottom: 10,
                color: '#4e31c1',
                fontFamily: 'Cairo-SemiBold',
                fontSize: wp('5%'),
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
              }}>
              {item.serial} :{t('Serialnumber')}
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
              {t('Companyname')}: {item.company_name}
            </Text>
            <Card.Divider />
            {item.sold_to == '' ? (
              <></>
            ) : (
              <>
                <Text
                  style={{
                    marginBottom: 10,
                    color: '#4e31c1',
                    fontFamily: 'Cairo_600SemiBold',
                    fontSize: wp('5%'),
                  }}>
                  مبيوعة الى: {item.sold_to}
                </Text>
                <Card.Divider />
              </>
            )}
            <Text
              style={{
                marginBottom: 10,
                color: '#4e31c1',
                fontFamily: 'Cairo-SemiBold',
                fontSize: wp('5%'),
              }}>
              {t('thedate')}: {item.creation_date_tr}
            </Text>
            <Card.Divider />
            {/* <Text style={{marginBottom: 10,color:'#4e31c1', fontFamily:'Cairo_600SemiBold', fontSize:wp('5%')}}>
                                {t('purchase')}: <NumericFormat
  renderText={value => <Text  style={styles.POS1} >{value}</Text>} 
  value={item.sell_price} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} /> 
                                </Text>
                           
                                <Card.Divider/> */}
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
                value={item.cards_pos_sell_price}
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
              {t('profit')}:{' '}
              <NumericFormat
                renderText={value => <Text style={styles.POS9}>{value}</Text>}
                value={item.cards_pos_profit}
                displayType={'text'}
                thousandSeparator={true}
                fixedDecimalScale={true}
                decimalScale={0}
              />{' '}
              دينار
            </Text>
            <Card.Divider />
          </ViewShot>

          <View style={{backgroundColor: '#fff'}}>
            <TouchableOpacity
              style={styles.button2}
              onPress={() =>
                SaveImage(
                  item.company_card_id,
                  item.pin,
                  POS,
                  item.company_name,
                  item.category_value,
                  item.serial,
                  item.cards_pos_sell_price,
                  item.expire_date,
                  item.creation_date_tr,
                  item.cards_pos_profit,
                  item.rm_cards_receipt,
                  item.company_id,
                )
              }>
              <Text style={styles.btnText2}>حفظ في الاستوديو</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button2}
              onPress={() =>
                copyToClipboard1(
                  item.company_card_id,
                  item.pin,
                  POS,
                  item.company_name,
                  item.category_value,
                  item.serial,
                  item.cards_pos_sell_price,
                  item.expire_date,
                  item.creation_date_tr,
                  item.daily_serial,
                  item.sold_to,
                  item.company_id,
                )
              }>
              <Text style={styles.btnText2}>اعادة طباعة الفاتورة</Text>
            </TouchableOpacity>

            <Button title={'تنزيل PDF'} onPress={() => downloadPDF(item)} />
          </View>
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
    //  console.log("From",from.toISOString().split('T')[0]);
    //   console.log("To",to.toISOString().split('T')[0]);
    let user_id = 0;
    let user_type_id = 0;
    // if(from ==''||to=='')
    // {
    //   Toast.show(t('SelectDatePlz'),{
    //     position:660,
    //     containerStyle:{backgroundColor:"red"},
    //     textStyle: {fontSize:19},
    //     mask: true,
    //     maskStyle:{},

    //   })
    // }
    // else
    // {
    try {
      user_id = await AsyncStorage.getItem('userIdInUsers');
      user_type_id = await AsyncStorage.getItem('user_type_id');
      const response = await axios.post(
        API_URL +
          `posoldcardsrepo?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          user_id: parseInt(user_id),
          user_type_id: parseInt(user_type_id),
          companyId: 0,
          fromDate: fromDate,
          toDate: fromDate,
        },
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      // console.log("responses---------------", response.data.message);

      if (
        response.data == 'Token UnAuthorized' ||
        response.data == 'Token Expired'
      ) {
        Toast.show(t('You Have to login again'));
        setTokenStatus(false);
      } else {
        // console.log("response777777", response.data.message);

        setTokenStatus(true);
        setCards({sell: response.data.message});
        setSendlength(response.data.message.length);
      }
    } catch (e) {
      console.log(e.message);
    }
    // }
  };

  async function copyToClipboard(PinNumber, company_card_id) {
    console.log(PinNumber, company_card_id);
    Clipboard.setString(PinNumber);
    // Toast.show(t('Copied to Clipboard'))
    Alert.alert('تم نسخها');
    let data = {
      user_id: parseInt(await AsyncStorage.getItem('userIdInUsers')),
      card_id: company_card_id,
    };
    // console.log("=================================================", company_card_id, data);
    try {
      const response = await axios.post(
        API_URL +
          `user/addprints?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        data,
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      console.log('response', response);
    } catch (e) {
      console.log(e.message);
    }
  }

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
    const tableData = [
      [
        <Text style={styles.tabletextred}>{selectedstate.pin}</Text>,
        <Text style={styles.tabletextblack}>PIN-code</Text>,
      ],
      [
        <Text style={styles.tabletextred}>{selectedstate.serial}</Text>,
        <Text style={styles.tabletextblack}>Serial</Text>,
      ],
      [
        <Text style={styles.tabletextred}>
          {selectedstate.expire_date?.trim()}
        </Text>,
        <Text style={styles.tabletextblack}>Expiry</Text>,
      ],
      [
        <Text style={styles.tabletextred}>{selectedstate.pos}</Text>,
        <Text style={styles.tabletextblack}>Market Name</Text>,
      ],
      [
        <Text style={styles.tabletextred}>{phone}</Text>,
        <Text style={styles.tabletextblack}>Merchant Id</Text>,
      ],
      //   [<Text style={styles.tabletextProfit} >{selectedstate.company + ' ' + selectedstate.category} </Text>, 'RC'],
      [
        <Text style={styles.tabletextredDate}>{selectedstate.selldate}</Text>,
        <Text style={styles.tabletextblack}>Time</Text>,
      ],
    ];
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            Alert.alert('يجب الضغط على زر اغلاق اولا');
          }}>
          <View style={styles.modalView1}>
            <ScrollView>
              <AntDesign
                style={{
                  marginTop: hp('1%'),
                  alignSelf: 'flex-end',
                  marginRight: wp('1%'),
                }}
                name="closecircle"
                size={24}
                color="#f00"
                onPress={() => setmodal(false)}
              />
              <ViewShot ref={viewShot} options={{format: 'png', quality: 0.9}}>
                <View style={{backgroundColor: '#fff'}}>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignSelf: 'center',
                      marginTop: 30,
                    }}>
                    <Image
                      width={Dimensions.get('window').width * 0.15}
                      source={ImageCircle}
                      style={styles.ImageAsiacell1}
                    />
                    <Text
                      style={{
                        color: 'grey',
                        fontSize: 20,
                        alignSelf: 'center',
                        marginTop: hp('2%'),
                        fontFamily: 'Cairo-SemiBold',
                      }}>
                      {selectedstate.company + '-' + selectedstate.category}
                    </Text>
                  </View>
                  <View style={styles.tablecontainer}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#fff'}}>
                      <Rows data={tableData} textStyle={styles.tabletext} />
                    </Table>
                    <View
                      style={{
                        borderBottomColor: '#808080',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    />
                    {/* <BarCodeView
                      text={selectedstate.itemBarcCodeText}
                      style={styles.barcode}
                    /> */}

                    <Barcode
                      value={selectedstate.itemBarcCodeText}
                      format="CODE128"
                      style={styles.barcode}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingTop: 10,
                        paddingBottom: 10,
                      }}>
                      <View style={{marginTop: hp('5%')}}>
                        <QRCode
                          value={selectedstate.itemBarcCodeText}
                          size={100}
                        />
                      </View>
                      <Image style={styles.tinyLogo1} source={aimtidadImage} />
                    </View>
                  </View>
                </View>
              </ViewShot>
              <TouchableOpacity
                style={styles.button2111}
                onPress={() => SaveImageIngallary()}>
                <Text style={styles.btnText2}>حفظ في الاستوديو</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => SharImage()}>
                <Text style={styles.btnText2}>مشاركة</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

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
                    {cards.sell.length == 0 ? (
                      <></>
                    ) : cards.sell == 'no cards sold in that range' ? (
                      <View style={styles.containerBig}>
                        <Text style={styles.nodata}>
                          لا يوجد كارتات مباعة في هذا اليوم
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
                            fontSize: wp('8%'),
                            color: '#4e31c1',
                            fontFamily: 'Cairo-SemiBold',
                            alignSelf: 'center',
                            marginBottom: hp('2%'),
                          }}>
                          عدد الكارتات المباعة اليوم: {sendlength}{' '}
                        </Text>

                        <FlatList
                          data={cards.sell}
                          renderItem={renderCompanies}
                          keyExtractor={item => item.transaction_id}
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

export default SoldPOS;
