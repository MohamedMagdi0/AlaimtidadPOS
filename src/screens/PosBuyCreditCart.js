// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import * as React from 'react';

import {
  Button,
  View,
  Text,
  Linking,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableHighlight,
  TextInput,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NumericFormat} from 'react-number-format';
// import Image from 'react-native-scalable-image';
import {DotIndicator} from 'react-native-indicators';

import AntDesign from 'react-native-vector-icons/AntDesign';

// import i18n from '../screens/i18n';
// import { Card } from 'react-native-elements';
import {Card} from '@rneui/themed';

import InputSpinner from 'react-native-input-spinner';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import API_URL from '../screens/URL';
import Sound from 'react-native-sound';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

const PosBuyCreditCart = ({navigation, route}) => {
  const {t} = useTranslation();
  var [count, setCount] = React.useState(0);
  const [html, sethtml] = React.useState('');
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [modalVisible1, setmodalVisible1] = React.useState(false);
  const [modalVisible2, setmodalVisible2] = React.useState(false);
  const [modalVisible5, setmodalVisible5] = React.useState(false);
  const [modalVisible7, setmodalVisible7] = React.useState(false);
  const [posid, setposid] = React.useState('');
  const [Number, SetNewNumber] = React.useState(1);
  const [State, setState] = React.useState([]);
  const [newprice, setnewprice] = React.useState(0);
  const [newSavedprice, setnewSavedprice] = React.useState(0);
  const [Send, SetSend] = React.useState([]);
  const [Image2, SetImage] = React.useState(null);
  const [aimtidadImage, SetAimtidadImage] = React.useState(
    require('../../assets/icon11.png'),
  );
  const [soldtoname, setsoldtoname] = React.useState('');
  const [useridpos, setuseridpos] = React.useState('');
  const [total, SetTotal] = React.useState('');
  const [sell, SetSell] = React.useState('');
  const [statusprinter, Setstatusprinter] = React.useState('');
  const [type, setType] = React.useState('');
  const [POS, StatePOS] = React.useState('');
  const [ImageSrc, setImageSrc] = React.useState('');
  const [EmdtdadLogo, setEmdtdadLogo] = React.useState('');
  const [discount, setdiscount] = React.useState('');
  const [InitialPrice, setInitialPrice] = React.useState(0);
  const [TokenStatus, setTokenStatus] = React.useState(false);
  const [virtualMoneyBalance, setMoney] = React.useState('');
  const [sound, setSound] = React.useState();
  const [playingSound, setPlayingSound] = React.useState(false);
  const [posType, setpostype] = React.useState();
  const [posLimit, setposLimit] = React.useState();
  const [phone, setphonenumber] = React.useState();
  const [flag, setflag] = React.useState(true);
  const [userName, setuserName] = React.useState('');
  const [loadingIndictor, setloadingIndictor] = React.useState(false);
  const [Catnum, setCatnum] = React.useState('');
  const [win, setwin] = React.useState('');
  const [initwin, setinitwin] = React.useState('');
  const [newwin, setnewwin] = React.useState('');
  const [finalnum, setfinalnum] = React.useState('');
  const [show, setShow] = React.useState('');
  const [dateNow, setCurrentDate] = React.useState('');
  const [cover, setCover] = React.useState('');
  // const [coverSrc, setCoverSrc] = React.useState()
  const [modifiedPrice, setModifiedPrice] = React.useState(0);
  const [coverPrinter, setCoverPrinter] = React.useState('');
  // const [coverPrinterSrc, setCoverPrinterSrc] = React.useState()

  // const coverImage = async () => {
  //   const companyId = route.params.company_id
  //   try {
  //     const user_id = await AsyncStorage.getItem('userIdInUsers');
  //     // company_id = 14
  //     const response = await axios.get(
  //       API_URL + `company/${companyId}/cover?s=${parseInt(user_id)}`

  //       ,
  //       {
  //         headers: {
  //           'x-access-token': `${await AsyncStorage.getItem('Token')}`
  //         }
  //       }
  //     )
  //     // console.log({ "responseeeeCover": response?.data?.cover?.data });
  //     setCover(response?.data?.cover?.data)
  //   }
  //   catch (e) {
  //     console.log("err", e.message);
  //   }
  // }
  useEffect(() => {
    console.log({
      coverPrinter,
      uriCoverPrinter: `data:image/png;base64,${arrayBufferToBase64(
        coverPrinter,
      )}`,
    });
    console.log('route.params.cover', route.params.cover);
  }, []);

  const arrayBufferToBase64 = buffer => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // console.log((binary));
    return binary;
  };
  // const uri = `data:image/png;base64,${arrayBufferToBase64(cover)}`

  // const uriPrinter = `data:image/png;base64,${arrayBufferToBase64(coverPrinter)}`

  const companyPrinterImage = async () => {
    const companyId = route.params.company_id;
    try {
      const user_id = await AsyncStorage.getItem('userIdInUsers');
      // company_id = 14
      const response = await axios.get(
        API_URL + `company/${companyId}/printer?s=${parseInt(user_id)}`,

        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      console.log({responseeeeprinter: response?.data.printer_logo.data});
      setCoverPrinter(response?.data.printer_logo.data);
    } catch (e) {
      console.log('err', e.message);
    }
  };

  React.useEffect(() => {
    // coverImage()
    // ----------------
    companyPrinterImage();
  }, []);

  const Re_enableBTn = () => {
    // //console.log("Re Enable");
    setflag(true);
  };

  const copyToClipboard1 = PinNumber => {
    // Clipboard.setString(PinNumber)
    Alert.alert('تم نسخها');
  };

  async function getsound() {
    setmodalVisible5(true);
  }
  async function getDateCat() {
    try {
      //console.log("diddmount");
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
      // //console.log("ressss", response);
      for (let i = 0; i < response.data.message.length; i++) {
        if (response.data.message[i].company_id === route.params.company_id) {
          // //console.log("lllll", response.data.message[i].company_id);
          // //console.log("ffffff", route.params.company_id);
          // //console.log("qqqqq", response.data.message[i].QR_code);

          setShow(response.data.message[i].QR_code);
        }
      }
      // //console.log("Currentcredit", response.data);
    } catch (e) {
      console.log(e.message);
    }
    try {
      const response201 = await axios.post(
        API_URL +
          `getTotalCardsNumberByCategory?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          companyId: route.params.company_id,
          categoryId: route.params.card_category_id,
        },
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );

      if (
        response201.data == 'Token UnAuthorized' ||
        response201.data == 'Token Expired'
      ) {
        Toast.show(t('You Have to login again'), Toast.LONG, {
          backgroundColor: 'red',
          fontSize: 19,
        });
        setTokenStatus(false);
      } else {
        setTokenStatus(true);
        // //console.log("response", response201.data[0]);
        setCatnum(response201.data[0].totalCardsCountByCategory);
        //  setMoney(response.data.message[0].pos_vm_balance);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  async function getDate() {
    // setinitwin(InitialPrice * Number)
    // //console.log("newprice * Number",newprice * Number);
    // setnewwin(newprice * Number)

    setposid(await AsyncStorage.getItem('userIdInUsers'));
    setphonenumber(await AsyncStorage.getItem('user_phonenumber'));
    try {
      const deviceId = await AsyncStorage.getItem('deviceId');

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
          // //console.log("response", response);
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
          position: 660,
          backgroundColor: 'red',
          fontSize: 19,
          mask: true,
        });
        setTokenStatus(false);
      } else {
        // //console.log("response",response.data.message);

        setTokenStatus(true);
        setMoney(response.data[0].current_balance);
        setuserName(response.data[0].userName);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  useEffect(() => {
    // console.log("route?.params?.coverSrc", route?.params?.coverSrc)
    // setCover(route?.params?.coverSrc)
    // console.log("route?.params",route?.params);
  }, []);

  async function getSavedPrice() {
    try {
      const response = await axios.get(
        API_URL +
          `user/pos/sellprice?company_category_id=${
            route.params.card_category_id
          }&s=${parseInt(await AsyncStorage.getItem('userIdInUsers'))}`,
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
        });
      } else {
        if (response.data.message.length === 0) {
          getPrice();
          // let posType = ''
          // let company_id = ''
          // let card_category_id = ''
          // let regionId = ''
          // let permission = ''
          // let userIdInUsers = ''
          // let posLimit = ''
          // try {
          //   company_id = route.params.company_id
          //   card_category_id = route.params.card_category_id
          //   regionId = await AsyncStorage.getItem('regionId');
          //   posType = await AsyncStorage.getItem('posType');
          //   userIdInUsers = await AsyncStorage.getItem('userIdInUsers');
          //   posLimit = await AsyncStorage.getItem('poslimit');
          //   //   permission = await MediaLibrary.requestPermissionsAsync();
          //   setuseridpos(userIdInUsers)
          //   setpostype(posType)
          //   setposLimit(posLimit)
          //   // //console.log("card_category_id", card_category_id);
          //   const response = await axios.post(
          //     API_URL + `getcardsbundledata?s=${parseInt(await AsyncStorage.getItem('userIdInUsers'))}`, {
          //     company_id: company_id,
          //     card_category_id: card_category_id,
          //     region_id: regionId,
          //     user_id: userIdInUsers,

          //   },
          //     {
          //       headers: {
          //         'x-access-token': `${await AsyncStorage.getItem('Token')}`
          //       }
          //     }

          //   )
          //   // //console.log("getcardsbundledata",response.data.message);
          //   const response201 = await axios.post(
          //     API_URL + `getTotalCardsNumberByCategory?s=${parseInt(await AsyncStorage.getItem('userIdInUsers'))}`, { companyId: route.params.company_id, categoryId: route.params.card_category_id }
          //     ,
          //     {
          //       headers: {
          //         'x-access-token': `${await AsyncStorage.getItem('Token')}`
          //       }
          //     }
          //   )
          //   ////console.log("response201",response201.data[0].totalCardsCountByCategory);
          //   // SetResponse(response.data.user[0])'
          //   if (response.data == "Token UnAuthorized" || response.data == "Token Expired" || response201.data == "Token UnAuthorized" || response201.data == "Token Expired") {
          //     Toast.show(('You Have to login again'), Toast.LONG, {
          //       position: 660,
          //       backgroundColor: "red",
          //       fontSize: 19,
          //       mask: true,

          //     })
          //     setTokenStatus(false)
          //   }

          //   else {
          //     // //console.log("Enteded else elkbera cArds", JSON.stringify(response.data.message).replace(/\"/g, ""));
          //     setTokenStatus(true);
          //     if (JSON.stringify(response.data.message).replace(/\"/g, "") === "No Cards Available For This Category") {
          //       Toast.show(('please'), Toast.LONG, {
          //         containerStyle: { backgroundColor: "black" },
          //         textStyle: { fontSize: 19, color: 'white' }

          //       })

          //     }
          //     else if (JSON.stringify(response.data.message).replace(/\"/g, "") === "Cards is finished") {
          //       Toast.show(('CardFinish'), Toast.LONG, {
          //         position: 660,
          //         backgroundColor: "red",
          //         fontSize: 19,
          //         mask: true,
          //         color: "black"

          //       })
          //     }

          //     else if (JSON.stringify(response.data.message).replace(/\"/g, "") === "No Cards Available For This Category or bundle is expired") {
          //       Toast.show(('CardFinish'), Toast.LONG, {
          //         position: 660,
          //         backgroundColor: "red",
          //         fontSize: 19,
          //         mask: true,
          //         color: "white"

          //       })
          //     }
          //     else if (JSON.stringify(response.data.message).replace(/\"/g, "") === "this card is paid now") {
          //       Toast.show("خطأ في الاتصال، يرجي المحاولة مرة اخري", Toast.LONG, {
          //         position: 660,
          //         backgroundColor: "red",
          //         fontSize: 19,
          //         mask: true,
          //         color: "black"
          //       })
          //     }

          //     else {
          //       // //console.log("Elseeeeeeeeee=======", response.data.message[0])
          //       // //console.log("final number", parseInt(response201.data[0].totalCardsCountByCategory) - parseInt(response.data.message[0].bundle_available_card));
          //       setfinalnum(parseInt(response201.data[0].totalCardsCountByCategory) - parseInt(response.data.message[0].bundle_available_card))
          //       if (response201.data[0].totalCardsCountByCategory > response.data.message[0].bundle_available_card) {
          //         // //console.log("Bigger than", response.data.message[0].sell_price);
          //         if (response.data.discount == null) {
          //           setState(response.data.message[0])
          //           setnewSavedprice(parseInt(response.data.message[0].sell_price))
          //           setnewwin(parseInt(response.data.message[0].sell_price) * Number)
          //           // //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
          //           setInitialPrice(parseInt(response.data.message[0].sell_price))
          //           setinitwin(parseInt(response.data.message[0].sell_price) * Number)
          //         }
          //         else {
          //           //  setfinalnum(parseInt(response201.data[0].totalCardsCountByCategory)- parseInt(response.data.message[0].bundle_available_card))
          //           setState(response.data.message[0])
          //           setnewSavedprice(parseInt(response.data.message[0].sell_price) + parseInt(response.data.discount))
          //           setnewwin(parseInt(response.data.message[0].sell_price) * Number)
          //           // //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
          //           setInitialPrice(parseInt(response.data.message[0].sell_price) + parseInt(response.data.discount))
          //           setinitwin(parseInt(response.data.message[0].sell_price) * Number)
          //         }
          //         // //console.log("Discount", response.data.discount);

          //       }
          //       else {
          //         // //console.log("smaller than or equal");
          //         if (response.data.discount == null) {
          //           setState(response.data.message[0])
          //           setnewSavedprice(parseInt(response.data.message[0].sell_price))
          //           setnewwin(parseInt(response.data.message[0].sell_price) * Number)
          //           // //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
          //           setInitialPrice(parseInt(response.data.message[0].sell_price))
          //           setinitwin(parseInt(response.data.message[0].sell_price) * Number)
          //         }
          //         else {
          //           //  setfinalnum(parseInt(response201.data[0].totalCardsCountByCategory)- parseInt(response.data.message[0].bundle_available_card))
          //           setState(response.data.message[0])
          //           setnewSavedprice(parseInt(response.data.message[0].sell_price) + parseInt(response.data.discount))
          //           setnewwin(parseInt(response.data.message[0].sell_price) * Number)
          //           // //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
          //           setInitialPrice(parseInt(response.data.message[0].sell_price) + parseInt(response.data.discount))
          //           setinitwin(parseInt(response.data.message[0].sell_price) * Number)
          //         }
          //         // //console.log("Discount else", response.data.discount);

          //       }
          //     }

          //   }
          // }
          // catch (e) {
          //   console.log(e.message);
          //   Toast.show("النت ضعيف، يرجي المحاولة مرة اخري", Toast.LONG, {
          //     position: 660,
          //     backgroundColor: "white",
          //     fontSize: 19,
          //     mask: true,
          //     color: "black"

          //   })
          // }
        } else {
          setnewSavedprice(response.data.message[0].sell_price);
          // console.log({ newSavedprice });
        }
      }
    } catch (e) {
      //console.log("erorrrrrr======", e.message);
    }
  }
  async function setSavedPrice(text) {
    console.log('modifed priceeeee', text);
    console.log('type of modifed priceeeee', typeof text);

    try {
      // setModifiedPrice
      if (text === null || isNaN(text)) {
        console.log('modified price is not a valid number', text);
        Toast.show(t('pleaseEnterRightDataa'), Toast.LONG, {
          position: 660,
          backgroundColor: 'red',
          fontSize: 19,
          mask: true,
        });
      } else if (modifiedPrice < newprice) {
        console.log('modifed priceeeee 1st condition', text);

        Toast.show(
          t('modifed price must be grater than new price'),
          Toast.LONG,
          {
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
          },
        );
      } else {
        console.log('in elsssse');

        setnewSavedprice(text);
        const response = await axios.post(
          API_URL +
            `user/pos/sellprice?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            company_category_id: route.params.card_category_id,
            sell_price: text,
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
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
          });
          setTokenStatus(false);
        } else {
          // //console.log("response", response.data);
          setTokenStatus(true);
        }
      }
    } catch (e) {
      setnewSavedprice(newSavedprice);
      Toast.show(t('pleaseEnterRightDataa'), Toast.LONG, {
        position: 660,
        backgroundColor: 'red',
        fontSize: 19,
        mask: true,
      });

      console.log(e.message);
    }
  }
  async function disabledfunction() {
    Toast.show('رصيدك لا يكفى يرجى الشحن', Toast.LONG, {
      position: 660,
      backgroundColor: 'red',
      fontSize: 19,
      mask: true,
      color: 'whie',
    });
  }
  async function getPrice() {
    let posType = '';
    let company_id = '';
    let card_category_id = '';
    let regionId = '';
    let permission = '';
    let userIdInUsers = '';
    let posLimit = '';
    try {
      company_id = route.params.company_id;
      card_category_id = route.params.card_category_id;
      regionId = await AsyncStorage.getItem('regionId');
      posType = await AsyncStorage.getItem('posType');
      userIdInUsers = await AsyncStorage.getItem('userIdInUsers');
      posLimit = await AsyncStorage.getItem('poslimit');
      //   permission = await MediaLibrary.requestPermissionsAsync();
      setuseridpos(userIdInUsers);
      setpostype(posType);
      setposLimit(posLimit);
      //console.log("card_category_id", card_category_id);
      const response = await axios.post(
        API_URL +
          `getcardsbundledata?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          company_id: company_id,
          card_category_id: card_category_id,
          region_id: regionId,
          user_id: userIdInUsers,
        },
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      // //console.log("getcardsbundledata",response.data.message);
      const response201 = await axios.post(
        API_URL +
          `getTotalCardsNumberByCategory?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          companyId: route.params.company_id,
          categoryId: route.params.card_category_id,
        },
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
      ////console.log("response201",response201.data[0].totalCardsCountByCategory);
      // SetResponse(response.data.user[0])'
      if (
        response.data == 'Token UnAuthorized' ||
        response.data == 'Token Expired' ||
        response201.data == 'Token UnAuthorized' ||
        response201.data == 'Token Expired'
      ) {
        Toast.show(t('You Have to login again'), Toast.LONG, {
          position: 660,
          backgroundColor: 'red',
          fontSize: 19,
          mask: true,
        });
        setTokenStatus(false);
      } else {
        //console.log("Enteded else elkbera cArds", JSON.stringify(response.data.message).replace(/\"/g, ""));
        setTokenStatus(true);
        if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ===
          'No Cards Available For This Category'
        ) {
          Toast.show(t('please'), Toast.LONG, {
            position: 660,
            backgroundColor: 'black',
            fontSize: 19,
            mask: true,
            color: 'white',
          });
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ===
          'Cards is finished'
        ) {
          Toast.show(t('CardFinish'), Toast.LONG, {
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
            color: 'black',
          });
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ===
          'No Cards Available For This Category or bundle is expired'
        ) {
          Toast.show(t('CardFinish'), Toast.LONG, {
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
            color: 'white',
          });
        } else if (
          JSON.stringify(response.data.message).replace(/\"/g, '') ===
          'this card is paid now'
        ) {
          Toast.show('خطأ في الاتصال، يرجي المحاولة مرة اخري', Toast.LONG, {
            position: 660,
            backgroundColor: 'white',
            fontSize: 19,
            mask: true,
            color: 'black',
          });
        } else {
          setfinalnum(
            parseInt(response201.data[0].totalCardsCountByCategory) -
              parseInt(response.data.message[0].bundle_available_card),
          );
          //Vimp case total available cards of all bundles bigger than bundle avavilable cards
          if (
            response201.data[0].totalCardsCountByCategory >
            response.data.message[0].bundle_available_card
          ) {
            if (response.data.discount == null) {
              setState(response.data.message[0]);
              setnewprice(parseInt(response.data.message[0].sell_price));
              setnewwin(parseInt(response.data.message[0].sell_price) * Number);
              //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
              setInitialPrice(parseInt(response.data.message[0].sell_price));
              setinitwin(
                parseInt(response.data.message[0].sell_price) * Number,
              );
            } else {
              //  setfinalnum(parseInt(response201.data[0].totalCardsCountByCategory)- parseInt(response.data.message[0].bundle_available_card))
              setState(response.data.message[0]);
              setnewprice(
                parseInt(response.data.message[0].sell_price) +
                  parseInt(response.data.discount),
              );
              setnewwin(parseInt(response.data.message[0].sell_price) * Number);
              //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
              setInitialPrice(
                parseInt(response.data.message[0].sell_price) +
                  parseInt(response.data.discount),
              );
              setinitwin(
                parseInt(response.data.message[0].sell_price) * Number,
              );
            }
            //console.log("Discount", response.data.discount);
          } else {
            //console.log("smaller than or equal");
            if (response.data.discount == null) {
              setState(response.data.message[0]);
              //s3r el be3 el mo7dd mn el adara
              setnewprice(parseInt(response.data.message[0].sell_price));
              setnewwin(parseInt(response.data.message[0].sell_price) * Number);
              //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
              setInitialPrice(parseInt(response.data.message[0].sell_price));
              setinitwin(
                parseInt(response.data.message[0].sell_price) * Number,
              );
            } else {
              //  setfinalnum(parseInt(response201.data[0].totalCardsCountByCategory)- parseInt(response.data.message[0].bundle_available_card))
              setState(response.data.message[0]);
              setnewprice(
                parseInt(response.data.message[0].sell_price) +
                  parseInt(response.data.discount),
              );
              setnewwin(parseInt(response.data.message[0].sell_price) * Number);
              //console.log("12333", parseInt(response.data.message[0].sell_price) * Number);
              setInitialPrice(
                parseInt(response.data.message[0].sell_price) +
                  parseInt(response.data.discount),
              );
              setinitwin(
                parseInt(response.data.message[0].sell_price) * Number,
              );
            }
            //console.log("Discount else", response.data.discount);
          }
        }
      }
    } catch (e) {
      console.log(e.message);
      Toast.show('النت ضعيف، يرجي المحاولة مرة اخري', Toast.LONG, {
        position: 660,
        backgroundColor: 'white',
        fontSize: 19,
        mask: true,
        color: 'black',
      });
    }
  }

  React.useEffect(() => {
    async () => {
      const unsubscribe = navigation.addListener('focus', async () => {
        //console.log("HI Again From PosBuyCreditCard ")
        getDate();
        getDateCat();
        getPrice();
        getSavedPrice();
      });
    };
    getDate();
    getDateCat();
    getPrice();
    getSavedPrice();

    // SetAimtidadImage(require('../../assets/icon11.png'))

    (async () => {
      return sound
        ? () => {
            // console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    })();
  }, [sound]);

  // useEffect(() => {
  //   // console.log("route.params", route.params)
  //   Sound.setCategory('Playback');

  //   let ding = new Sound('coin.mp3', Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log('failed to load the sound', error);
  //       return;
  //     } else {
  //       ding.setVolume(1);
  //       ding.play(success => {
  //         if (success) {
  //           console.log('successfully finished playing');
  //         } else {
  //           console.log('playback failed due to audio decoding errors');
  //         }
  //       });
  //     }
  //     // when loaded successfully
  //     console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
  //   });

  // }, [])

  async function playSound() {
    // console.log('Loading Sound');
    const track = new Sound('test.mp3', null, e => {
      if (e) console.log("Can't play sound. ", e);
      else track.play();
    });
  }

  const copyFromAssets = async asset => {
    // try {
    //   await Asset.loadAsync(asset);
    //   const { localUri } = Asset.fromModule(asset);
    //   return localUri;
    // } catch (error) {
    //   console.log(error);
    //   throw err;
    // }
  };

  const processLocalImageIOS = async imageUri => {
    try {
      const uriParts = imageUri.split('.');
      const formatPart = uriParts[uriParts.length - 1];
      let format;

      if (formatPart.includes('png')) {
        format = 'png';
      } else if (formatPart.includes('jpg') || formatPart.includes('jpeg')) {
        format = 'jpeg';
      }

      return `data:image/${format};base64,${base64}`;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  function Cancel() {
    Toast.show(t('CancelSendCredit'), Toast.LONG, {
      position: 660,
      backgroundColor: 'black',
      fontSize: 19,
      mask: true,
      color: 'white',
    });
    navigation.navigate('SaleCarts');
  }

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  // async function save()  {
  //   // Alert.alert("in function")
  //    try {
  //         //Alert.alert("in function")
  //         const { current } = refInput;
  //         //console.log("refInput",refInput.current.ViewShot());
  //       // //console.log("current",current);

  //         refInput.current.ViewShot.capture().then(async uri => {
  //          //console.log("do something with ", uri);
  //           await MediaLibrary.createAssetAsync(""+uri);
  //           console.log(await MediaLibrary.createAssetAsync(""+uri));

  //       //     Toast.show('تم حفظها بالاستوديو',{
  //       //      position:240,
  //       //      containerStyle:{backgroundColor:"green"},
  //       //      textStyle: {fontSize:19},
  //       //      mask: true,
  //       //      maskStyle:{},

  //      })
  //       //    // this.setState({"uri":uri})
  //       //  });
  //    }
  //    catch(snapshotError) {
  //      console.error(snapshotError);
  //    }
  //  };

  async function counter(cardid) {
    // console.log(cardid);
    try {
      const response = await axios.post(
        API_URL +
          `user/addprints?s=${parseInt(
            await AsyncStorage.getItem('userIdInUsers'),
          )}`,
        {
          user_id: parseInt(await AsyncStorage.getItem('userIdInUsers')),
          card_id: cardid,
        },
        {
          headers: {
            'x-access-token': `${await AsyncStorage.getItem('Token')}`,
          },
        },
      );
    } catch (e) {
      console.log(e.message);
    }
    //}
  }
  function Submit() {
    setloadingIndictor(true);
    playSound();
    setmodalVisible5(true);
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    (async () => {
      let company_id = '';
      let card_category_id = '';
      let bundle_id = '';
      let regionId = '';
      let pos_sell_price = '';
      let cardsnumber = '';
      let bundle_available_card = '';
      let user_id = '';
      let user_type_id = '';
      let selltotal = '';
      let PosComercialName = '';
      let user_phonenumber = '';
      let total = '';
      let dealer_id = '';
      try {
        company_id = route.params.company_id;
        card_category_id = route.params.card_category_id;
        bundle_id = State.bundle_id;
        bundle_available_card = State.bundle_available_card;
        user_id = await AsyncStorage.getItem('userIdInUsers');
        regionId = await AsyncStorage.getItem('regionId');
        user_type_id = await AsyncStorage.getItem('user_type_id');
        PosComercialName = await AsyncStorage.getItem('commercialName');
        user_phonenumber = await AsyncStorage.getItem('user_phonenumber');
        dealer_id = await AsyncStorage.getItem('dealerId');
        // console.log(dealer_id);
        // console.log(parseInt(dealer_id));
        pos_sell_price = newSavedprice ? newSavedprice : newprice;
        cardsnumber = Number;
        total = pos_sell_price * Number;
        selltotal = State.sell_price * Number;
        SetSell(selltotal);
        SetTotal(cardsnumber * pos_sell_price);
        StatePOS(PosComercialName);
        //console.log("card_category_id", card_category_id);
        //console.log("company_id", company_id);
        //console.log("regionId", regionId);
        console.log('bundle_id', bundle_id);
        //console.log("user_phonenumber", user_phonenumber);
        //console.log("bundle_available_card", bundle_available_card);
        //console.log("cardsnumber", cardsnumber);
        //console.log("userPhoneNumber:", user_phonenumber, "company_id:", company_id, "card_category_id:", card_category_id, " region_id:", regionId, "bundle_id:", bundle_id, "bundle_available_card:", bundle_available_card, "user_id:", user_id, "user_type_id:", user_type_id, "pos_sell_price:", pos_sell_price, " cardsnumber:", cardsnumber, "dealer_id:", dealer_id, "sold_to:", soldtoname);
        const res = await axios.post(
          API_URL +
            `possellcards?s=${parseInt(
              await AsyncStorage.getItem('userIdInUsers'),
            )}`,
          {
            userPhoneNumber: user_phonenumber,
            company_id: company_id,
            card_category_id: card_category_id,
            region_id: regionId,
            bundle_id: bundle_id,
            bundle_available_card: bundle_available_card,
            user_id: user_id,
            user_type_id: user_type_id,
            pos_sell_price: pos_sell_price,
            cardsnumber: cardsnumber,
            dealer_id: dealer_id,
            sold_to: soldtoname,
          },

          {
            headers: {
              'x-access-token': `${await AsyncStorage.getItem('Token')}`,
            },
          },
        );

        if (res.data == 'Token UnAuthorized' || res.data == 'Token Expired') {
          Toast.show(t('You Have to login again'), Toast.LONG, {
            position: 660,
            backgroundColor: 'red',
            fontSize: 19,
            mask: true,
          });
          setTokenStatus(false);
        } else {
          setTokenStatus(true);
          //console.log("Res", res.data.message);
          if (
            JSON.stringify(res.data.message).replace(/\"/g, '') ===
            'Cards is finished'
          ) {
            setmodalVisible5(false);
            Toast.show(t('CardFinish'), Toast.LONG, {
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'black',
            });
          } else if (
            JSON.stringify(res.data.message).replace(/\"/g, '') ==
            'No Cards Available For This Category or bundle is expired'
          ) {
            setmodalVisible5(false);
            Toast.show(t('CardFinish'), Toast.LONG, {
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
          } else if (
            JSON.stringify(res.data.message).replace(/\"/g, '') ==
            'You have no credit to continue'
          ) {
            setmodalVisible5(false);
            Toast.show(t('Youhavenocredittocontinue'), Toast.LONG, {
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
          } else if (
            JSON.stringify(res.data.message).replace(/\"/g, '') ==
            "can't find the requested amount"
          ) {
            setmodalVisible5(false);
            Toast.show(t('cant_find_the_requested_amount'), Toast.LONG, {
              position: 660,
              backgroundColor: 'red',
              fontSize: 19,
              mask: true,
              color: 'white',
            });
            setloadingIndictor(false);
          } else if (
            JSON.stringify(res.data.message).replace(/\"/g, '') ==
            'this card is paid now'
          ) {
            count = count + 1;
            //console.log("cccccccccccccccc", count);
            setCount(count);
            //console.log("cccccccccccccccc", count);
            setmodalVisible5(true);
            if (count <= 2) {
              Toast.show('جاري تنفيذ العملية، يرجي الانتظار ...', Toast.LONG, {
                position: 660,
                backgroundColor: 'yellow',
                fontSize: 19,
                mask: true,
                color: 'black',
              });
            }
            //console.log("Count", count);
            if (count >= 3) {
              Toast.show('خطأ في الاتصال، يرجي المحاولة مرة اخري', Toast.LONG, {
                position: 660,
                backgroundColor: 'black',
                fontSize: 19,
                mask: true,
                color: 'white',
              });
              setCount(0);
              setloadingIndictor(false);
            } else {
              setTimeout(() => {
                Submit();
              }, 6000);
            }
          } else if (res.data.message.length > 0) {
            {
              //console.log("res.data", res.data.message.length)
              setflag(false);
              setTimeout(Re_enableBTn, 6000);
              setloadingIndictor(false);
              Toast.show(t('CardsSoldSuccessfully'), Toast.LONG, {
                position: 660,
                backgroundColor: 'green',
                fontSize: 19,
                mask: true,
                color: 'white',
              });
              setmodalVisible5(false);
              //console.log("res.data", res.data.message);
              //setmodalVisible1(true)
              // save();
              // SetSend(res.data.message)
              //console.log("playingSound", playingSound);

              let PosComercialName = await AsyncStorage.getItem(
                'commercialName',
              );
              var arrStr = JSON.stringify(res.data.message);
              //console.log("arrStr", arrStr);
              //console.log("datatosend", JSON.parse(arrStr));
              //console.log("imageeeeeee name", route.params.Company);
              // navigate to print screen

              // const aimtidadImage = require('../../assets/icon10.jpeg');
              // setCurrentDate(
              //   date + '/' + month + '/' + year
              //   + ' ' + hours + ':' + min + ':' + sec
              // );
              navigation.navigate('PrintReceipt', {
                arrStr: res.data.message,
                status: statusprinter,
                soldtoname: soldtoname,
                category: route.params.category,
                response: res.data.message,
                PosComercialName,
                company: route.params.Company,
                newprice: newSavedprice,
                image: `data:image/png;base64,${arrayBufferToBase64(
                  coverPrinter,
                )}`,
                aimtidadImage,
                selldate:
                  date +
                  '/' +
                  month +
                  '/' +
                  year +
                  ' ' +
                  hours +
                  ':' +
                  min +
                  ':' +
                  sec,
                posId: phone,
                showID: show,
                company_id: route.params.company_id,
              });
              //date + '/' + month + '/' + year + ' ' + formatAMPM(new Date)
              // copyToClipboard()
              getDate();
              SetNewNumber(1);
              // for (let i = 0; i < res.data.message.length; i++) {
              // counter(res.data.message[i].card_id)
              // }
            }
          } else {
            setmodalVisible5(false);
            Toast.show('خطأ في الاتصال، يرجي المحاولة مرة اخري', Toast.LONG, {
              position: 660,
              backgroundColor: 'white',
              fontSize: 19,
              mask: true,
              color: 'black',
            });
            getDate();
          }
        }
      } catch (e) {
        setloadingIndictor(false);
        console.log(e.response.data.message);
        setmodalVisible5(false);
        Toast.show('خطأ في الاتصال، يرجي المحاولة مرة اخري', Toast.LONG, {
          position: 660,
          backgroundColor: 'white',
          fontSize: 19,
          mask: true,
          color: 'black',
        });
        getDate();
      }
    })();
  }
  // console.log(Image2, "Image2");
  if (TokenStatus == false) {
    <View>
      <Text style={{color: '#4e31c1', fontSize: wp('7%'), alignSelf: 'center'}}>
        {t('You Have to login again')}
      </Text>
    </View>;
  }

  // //console.log("winnn",newwin - initwin);
  // //console.log("winnnint",initwin);
  // //console.log("winnnnew",newwin);
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('يجب الضغط على زر اغلاق اولا');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign
              style={{
                marginBottom: hp('1%'),
                marginTop: hp('-4%'),
                alignSelf: 'flex-end',
                marginRight: wp('-9%'),
              }}
              name="closecircle"
              size={24}
              color="#f00"
              onPress={() => setmodalVisible(false)}
            />

            <Text style={styles.modalText}>{t('EditSellPrice')} </Text>
            <TextInput
              placeholder={t('NewPrice')}
              placeholderTextColor="#4e31c1"
              underlineColorAndroid="transparent"
              style={styles.inputStyle}
              onChangeText={text => {
                // if(parseInt(text) >= newprice) {
                setModifiedPrice(text);
                // }else {
                //   setnewprice(newprice)
                // }
              }}
              keyboardType="number-pad"
            />

            <TouchableHighlight
              style={{
                ...styles.button2,
                backgroundColor:
                  parseInt(modifiedPrice) < parseInt(newprice)
                    ? 'grey'
                    : '#562dc7',
                borderColor:
                  parseInt(modifiedPrice) < parseInt(newprice)
                    ? 'grey'
                    : '#562dc7',
              }}
              disabled={parseInt(modifiedPrice) < parseInt(newprice)}
              onPress={() => {
                setmodalVisible(false);
                setSavedPrice(parseFloat(modifiedPrice));
              }}>
              <Text style={styles.btnText2}> {t('ok')}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible7}
        onRequestClose={() => {
          Alert.alert('يجب الضغط على زر اغلاق اولا');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign
              style={{
                marginBottom: hp('1%'),
                marginTop: hp('-4%'),
                alignSelf: 'flex-end',
                marginRight: wp('-9%'),
              }}
              name="closecircle"
              size={24}
              color="#f00"
              onPress={() => setmodalVisible7(false)}
            />

            <Text style={styles.modalText}>اسم الشخص المبيوعة له</Text>
            <TextInput
              value={soldtoname}
              placeholderTextColor="#4e31c1"
              underlineColorAndroid="transparent"
              style={styles.inputStyle}
              onChangeText={text => setsoldtoname(text)}
              keyboardType="default"
            />

            <TouchableHighlight
              style={styles.button2}
              onPress={() => {
                setmodalVisible7(false);
              }}>
              <Text style={styles.btnText2}> {t('ok')}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible5}
        onRequestClose={() => {
          Alert.alert('يجب الضغط على زر اغلاق اولا');
        }}>
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView17}>
              <AntDesign
                style={{
                  marginBottom: hp('1%'),
                  marginTop: hp('-4%'),
                  alignSelf: 'flex-end',
                  marginRight: wp('-9%'),
                }}
                name="closecircle"
                size={24}
                color="#f00"
                onPress={() => setmodalVisible5(false)}
              />

              <View>
                <Text style={styles.POSyellow17}>{t('abouttobuy')}</Text>
              </View>

              <Image
                width={Dimensions.get('window').width * 0.85}
                // source={Image2}
                source={{
                  uri: `data:image/png;base64,${arrayBufferToBase64(
                    route?.params?.cover,
                  )}`,
                }}
                style={styles.ImageAsiacell17}></Image>

              <Card containerStyle={styles.cardCnt}>
                {/* <Card.Image source={Image2} style={styles.ImageAsiacell17} /> */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cardText17}>المنتج</Text>
                  <Text style={styles.cardText178}>
                    {route.params.Company} {route.params.category}
                  </Text>
                </View>

                <Card.Divider />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cardText17}>{t('CurrentCredit')}</Text>
                  <Text style={styles.cardText17}>
                    IQD
                    <NumericFormat
                      renderText={value => (
                        <Text style={styles.cardText17}> {value}</Text>
                      )}
                      value={virtualMoneyBalance}
                      displayType={'text'}
                      thousandSeparator={true}
                      fixedDecimalScale={true}
                      decimalScale={0}
                    />
                  </Text>
                </View>

                <Card.Divider />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cardText17}>المبلغ المالي المطلوب</Text>
                  {newSavedprice === 0 ? (
                    <Text style={styles.cardText17}>
                      IQD{' '}
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.cardText17}>{value}</Text>
                        )}
                        value={newprice * Number}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                  ) : (
                    <Text style={styles.cardText17}>
                      IQD{' '}
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.cardText17}>{value}</Text>
                        )}
                        value={newSavedprice * Number}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                  )}
                </View>

                <Card.Divider />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cardText17}>الارباح</Text>
                  {newSavedprice === 0 ? (
                    <Text style={styles.cardText17}>
                      IQD{' '}
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.cardText17}>{value}</Text>
                        )}
                        value={(newprice - InitialPrice) * Number}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                  ) : (
                    <Text style={styles.cardText17}>
                      IQD{' '}
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.cardText17}>{value}</Text>
                        )}
                        value={(newSavedprice - InitialPrice) * Number}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                  )}
                </View>
                {/* <Text style={styles.modalText17}>{t('willbuy1')}  </Text> */}
                <Card.Divider />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cardText17}>العدد</Text>
                  <Text style={styles.cardText17}> {Number} </Text>
                </View>
              </Card>

              {/* <Text style={styles.modalText1}>{t('willbuy')} {route.params.Company} </Text> */}

              {/* <Text style={styles.modalText17}>{t('number17')} {Number} </Text>
                <Text style={styles.category17}>{t('willbuy2')}</Text>
               
                <View style={{flexDirection: 'row',justifyContent:'space-between',alignSelf:'center'}}>
                <Text style={styles.category17}>
                  <NumericFormat
                    renderText={value => <Text style={styles.category17} >{value}</Text>}
                    value={InitialPrice * Number} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0} />
                </Text>
                <Text style={styles.category17}> دينار</Text>
                </View> */}
              <TouchableOpacity
                style={styles.button2}
                onPress={() => Submit()}
                disabled={loadingIndictor ? true : false}>
                {loadingIndictor ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText2}>تأكيد</Text>
                )}
              </TouchableOpacity>

              {/*} <TouchableOpacity style={styles.button2}
                  //   disabled={true}
                  // >
                  // </TouchableOpacity>
                {/* <Text style={styles.category12}>{t('total1')}</Text>
                <View style={{flexDirection: 'row',justifyContent:'space-between',alignSelf:'center'}}>
                <Text style={styles.category17}>
                 <NumericFormat
                    renderText={value => <Text style={styles.category17} >{value}</Text>}
                    value={newprice * Number} displayType={'text'} thousandSeparator={true} fixedDecimalScale={true} decimalScale={0}  />

                </Text>
                <Text style={styles.category17}> دينار</Text>
                </View> */}

              {/* <TouchableHighlight
                 style={styles.button2}
                  onPress={() => {
                    setmodalVisible5(false);
                  }}
                >
                  <Text style={styles.btnText2}>  {t('close')}</Text>
                </TouchableHighlight> */}
            </View>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          Alert.alert('يجب الضغط على زر اغلاق اولا');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{t('buyconfirm')} </Text>

            <TouchableOpacity
              style={styles.button1}
              onPress={() => setmodalVisible1(true)}>
              <Text style={styles.btnText3}>{t('Reciept')}</Text>
            </TouchableOpacity>

            <TouchableHighlight
              style={{
                ...styles.openButton,
                textAlign: 'center',
                width: wp('42%'),
                backgroundColor: '#4e31c1',
                borderWidth: 6,
                borderColor: '#fff',
                borderRadius: 50,
                marginTop: hp('2%'),
                color: '#FFF',
              }}
              onPress={() => {
                setmodalVisible2(false);
              }}>
              <Text style={{textAlign: 'center', color: '#fff'}}>
                {' '}
                {t('close')}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          Alert.alert('يجب الضغط على زر اغلاق اولا');
        }}>
        <ScrollView style={styles.centeredView}>
          <View style={styles.modalView1}>
            {Send.message === undefined ? (
              <Text> {t('waiting')} </Text>
            ) : (
              Send.message.map((item, i) => {
                return (
                  <Card style={{height: 80, width: 250}}>
                    <Card.Title
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'Cairo-SemiBold',
                        fontSize: 23,
                      }}>
                      {t('Reciept')}
                    </Card.Title>
                    <Card.Image
                      source={{
                        uri: `data:image/png;base64,${arrayBufferToBase64(
                          route?.params?.cover,
                        )}`,
                      }}
                      style={{height: 120, width: 360, alignSelf: 'center'}}
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 30,
                        marginTop: hp('-4%'),
                      }}>
                      - - - - - - - - - - - - - - - - - -
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 13,
                      }}>
                      AMOUNT
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 20,
                        marginBottom: 10,
                      }}>
                      {route.params.category}-IQD
                    </Text>

                    <TouchableOpacity
                      onPress={() => copyToClipboard1(item['pin'])}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: 'black',
                          fontSize: 13,
                        }}>
                        {t('PINNumber')}{' '}
                      </Text>
                      <Text
                        style={{
                          marginBottom: 10,
                          textAlign: 'center',
                          color: 'red',
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: 22,
                        }}>
                        {' '}
                        <NumericFormat
                          renderText={value => (
                            <Text
                              style={{
                                marginBottom: 10,
                                textAlign: 'center',
                                color: 'red',
                                fontFamily: 'Cairo-SemiBold',
                                fontSize: 22,
                              }}>
                              {value}
                            </Text>
                          )}
                          value={item.pin}
                          displayType={'text'}
                          format="## ## ## ## ## ## ## ##"
                        />
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 30,
                        marginTop: hp('-2%'),
                      }}>
                      - - - - - - - - - - - - - - - - - -
                    </Text>

                    <Text style={{marginBottom: 10, color: 'black'}}>
                      Serial :{item.serial}
                    </Text>

                    <Text style={{marginBottom: 10, color: 'black'}}>
                      Expiry :{item.expire_date} 0:00:00
                    </Text>
                    <Text style={{marginBottom: 10}}>
                      Merchant ID :{useridpos}
                    </Text>
                    <Text style={{marginBottom: 10}}>Merchant Name :{POS}</Text>
                    {/* <Card.Divider/>
                           <Text style={{marginBottom: 10}}>
                            {t('Company')} :  {route.params.Company}
                                    </Text>
                                    <Card.Divider/>
                               
                                    <Card.Divider/>
                                    <Text style={{marginBottom: 10}}>
                                    {t('SellPrice')} : {newprice} 
                                    </Text>
                                 
                                    <Card.Divider/> */}

                    <Text style={{marginBottom: 10}}>Time :{dateNow}</Text>

                    <Card.Image
                      source={require('../../assets/icon10.jpeg')}
                      style={styles.icon10}
                    />
                  </Card>
                );
              })
            )}

            <TouchableHighlight
              style={{
                ...styles.openButton,
                textAlign: 'center',
                width: wp('42%'),
                backgroundColor: '#4e31c1',
                borderWidth: 6,
                borderColor: '#fff',
                borderRadius: 50,
                marginTop: hp('5%'),
                color: '#FFF',
              }}
              onPress={() => {
                setmodalVisible1(false);
              }}>
              <Text style={{textAlign: 'center', color: '#fff'}}>
                {' '}
                {t('close')}
              </Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
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
            {!TokenStatus || !newprice ? (
              <ActivityIndicator color={'#4e31c1'} size="large" />
            ) : (
              <View
                style={{
                  backgroundColor: '#fff',
                  marginTop: hp('-4%'),
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                }}>
                <View
                  style={{
                    flex: 1,
                    height: '100%',
                    width: '90%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={styles.CoverContainer}>
                    <Image
                      // source={route?.params?.coverSrc}
                      source={{
                        uri: `data:image/png;base64,${arrayBufferToBase64(
                          route?.params?.cover,
                        )}`,
                      }}
                      style={styles.imgStyle}
                    />
                  </View>

                  {/* <Text style={styles.POS}>{t('YouWIllBuyCart')} </Text> */}

                  <View>
                    <Text style={styles.category6}>
                      {t('Category')}: {route.params.category}
                    </Text>
                    <Text style={styles.category}>
                      السعر المحدد من الادارة:
                      <NumericFormat
                        renderText={value => (
                          <Text style={styles.POS11}>{value}</Text>
                        )}
                        value={newprice}
                        displayType={'text'}
                        thousandSeparator={true}
                        fixedDecimalScale={true}
                        decimalScale={0}
                      />
                    </Text>
                    <Text style={styles.category}>
                      سعر البيع المحدد منك:
                      {newSavedprice === 0 ? (
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.POS11}>{value}</Text>
                          )}
                          value={newprice}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      ) : (
                        <NumericFormat
                          renderText={value => (
                            <Text style={styles.POS11}>{value}</Text>
                          )}
                          value={newSavedprice}
                          displayType={'text'}
                          thousandSeparator={true}
                          fixedDecimalScale={true}
                          decimalScale={0}
                        />
                      )}
                    </Text>
                  </View>

                  {soldtoname == '' ? (
                    <></>
                  ) : (
                    <Text style={styles.category}>
                      مبيوعة الى: {soldtoname}
                    </Text>
                  )}
                  {/* <Text style={styles.category}>{t('Count')}</Text> */}
                  {posType == 'piece' ? (
                    State.bundle_available_card < '5' ? (
                      <InputSpinner
                        max={State.bundle_available_card}
                        min={1}
                        step={1}
                        colorMax={'#4e31c1'}
                        colorMin={'#4e31c1'}
                        style={styles.inputStyle1}
                        fontSize={26}
                        textColor="#4e31c1"
                        value={Number}
                        onChange={num => SetNewNumber(num)}
                        onMax={max => {
                          const toast = Toast.show(
                            `الحد الاقصي للكوتة الحالية ${State.bundle_available_card}`,
                            Toast.LONG,
                            {
                              position: 660,
                              backgroundColor: 'red',
                              fontSize: 19,
                              mask: true,
                              color: 'white',
                            },
                          );
                          setTimeout(() => {
                            // Recommend
                            // Toast.hide(toast)
                            // or Toast.hide()
                            // If you don't pass toast，it will hide the last toast by default.
                          }, 10000);
                        }}
                        with
                        rounded={false}
                        showBorder={true}
                        buttonPressTextColor="#4e31c1"
                        colorPress="#4e31c1"
                        buttonFontSize={50}
                      />
                    ) : (
                      <>
                        <InputSpinner
                          max={5}
                          min={1}
                          step={1}
                          colorMax={'#4e31c1'}
                          colorMin={'#4e31c1'}
                          style={styles.inputStyle1}
                          fontSize={26}
                          textColor="#4e31c1"
                          value={Number}
                          onChange={num => SetNewNumber(num)}
                          onMax={max => {
                            const toast = Toast.show(
                              `الحد الاقصي لك في هذة العملية 5 كارتات`,
                              Toast.LONG,
                              {
                                position: 660,
                                backgroundColor: 'red',
                                fontSize: 19,
                                mask: true,
                                color: 'white',
                              },
                            );
                            setTimeout(() => {
                              // Recommend
                              // Toast.hide(toast)
                              // or Toast.hide()
                              // If you don't pass toast，it will hide the last toast by default.
                            }, 10000);
                          }}
                          with
                          rounded={false}
                          showBorder={true}
                          buttonPressTextColor="#4e31c1"
                          colorPress="#4e31c1"
                          buttonFontSize={50}
                        />
                      </>
                    )
                  ) : (
                    <></>
                  )}

                  {posType == 'retail' ? (
                    State.bundle_available_card < posLimit ? (
                      <InputSpinner
                        max={State.bundle_available_card}
                        min={1}
                        step={1}
                        colorMax={'#4e31c1'}
                        colorMin={'#4e31c1'}
                        style={styles.inputStyle1}
                        fontSize={26}
                        textColor="#4e31c1"
                        value={Number}
                        onChange={num => SetNewNumber(num)}
                        onMax={max => {
                          const toast = Toast.show(
                            `الحد الاقصي للكوتة الحالية ${State.bundle_available_card}`,
                            Toast.LONG,
                            {
                              position: 660,
                              backgroundColor: 'red',
                              fontSize: 19,
                              mask: true,
                              color: 'white',
                            },
                          );
                          setTimeout(() => {
                            // Recommend
                            // Toast.hide(toast)
                            // or Toast.hide()
                            // If you don't pass toast，it will hide the last toast by default.
                          }, 50000);
                        }}
                        with
                        rounded={false}
                        showBorder={true}
                        buttonPressTextColor="#4e31c1"
                        colorPress="#4e31c1"
                        buttonFontSize={50}
                      />
                    ) : (
                      <InputSpinner
                        max={posLimit}
                        min={1}
                        step={1}
                        colorMax={'#4e31c1'}
                        colorMin={'#4e31c1'}
                        style={styles.inputStyle1}
                        fontSize={26}
                        textColor="#4e31c1"
                        value={Number}
                        onChange={num => SetNewNumber(num)}
                        onMax={max => {
                          const toast = Toast.show(
                            `الحد الاقصي لك في هذة العملية ${posLimit} كارتات`,
                            Toast.LONG,
                            {
                              position: 660,
                              backgroundColor: 'red',
                              fontSize: 19,
                              mask: true,
                              color: 'white',
                            },
                          );
                          setTimeout(() => {
                            // Recommend
                            // Toast.hide(toast)
                            // or Toast.hide()
                            // If you don't pass toast，it will hide the last toast by default.
                          }, 10000);
                        }}
                        with
                        rounded={false}
                        showBorder={true}
                        buttonPressTextColor="#4e31c1"
                        colorPress="#4e31c1"
                        buttonFontSize={50}
                      />
                    )
                  ) : (
                    <></>
                  )}

                  <TouchableOpacity
                    style={styles.button21}
                    onPress={() => setmodalVisible(true)}>
                    <Text style={styles.btnText2}>{t('EditSellPrice')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => setmodalVisible7(true)}>
                    <Text style={styles.btnText2}>تحديد اسم الشخص</Text>
                  </TouchableOpacity>
                </View>

                {InitialPrice * Number > virtualMoneyBalance ? (
                  <TouchableOpacity
                    style={styles.button2disabled}
                    onPress={() => {
                      disabledfunction();
                    }}>
                    <Text style={styles.btnText2}>{t('ConfirmBUY')}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => {
                      console.log({newSavedprice, newprice, modifiedPrice});

                      if (
                        newSavedprice &&
                        parseInt(newSavedprice) < parseInt(newprice)
                      ) {
                        Toast.show(
                          t('modifedPriceMustBeGraterThanNewPrice'),
                          Toast.LONG,
                          {
                            backgroundColor: 'red',
                            fontSize: 19,
                          },
                        );
                      } else {
                        setmodalVisible5(true);
                      }
                    }}>
                    <Text style={styles.btnText2}>{t('ConfirmBUY')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBig1: {
    flex: 1,
    backgroundColor: '#fff',
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
  POS11: {
    textAlign: 'left',
    // marginTop: hp('15%'),
    color: '#8a53e5',
    fontFamily: 'Cairo-SemiBold',
    width: Dimensions.get('window').width * 0.7,
    marginBottom: hp('8%'),
    fontSize: wp('5%'),
    marginLeft: wp('4%'),
    fontFamily: 'Cairo-SemiBold',
  },

  ImageAsiacell12: {
    alignSelf: 'center',
  },
  POS2: {
    fontSize: wp('6%'),
    textAlign: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
  },
  inputStyle: {
    //backgroundColor: 'transparent',
    //color: 'transparent',
    fontSize: wp('7%'),
    borderRadius: 6,
    borderColor: '#4e31c1',
    borderWidth: 0.7,
    marginBottom: hp('3'),
    paddingHorizontal: wp('5%'),
    color: '#000000',

    backgroundColor: 'transparent',
    textAlign: 'right',
  },
  ImageAsiacell1: {
    marginTop: hp('1%'),
    alignSelf: 'center',
    // justifyContent: 'space-around',
    marginBottom: hp('15%'),
    width: Dimensions.get('window').width * 0.75,
    borderRadius: 25,
    // backgroundColor: "black",
    // padding: 5,
    // height: 150,
    resizeMode: 'contain',
  },
  ImageAsiacell17: {
    marginTop: hp('0%'),
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.7,
    // justifyContent: 'space-around',
    // marginBottom:hp('15%')
  },
  // image: {
  //   position: 'absolute',
  //   width: wp('100%'),
  //   height: hp('100%'),
  // },
  openButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: wp('2%'),
    elevation: 2,
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
  modalText17: {
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('6%'),
    color: '#4e31c1',
    alignSelf: 'flex-start',
  },
  cardText17: {
    // marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('4.5%'),
    color: '#4e31c1',
    alignSelf: 'flex-start',
  },
  cardText178: {
    // marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
    fontSize: wp('4.5%'),
    color: '#f00',
    alignSelf: 'flex-start',
  },
  modalView: {
    margin: wp('10%'),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: wp('10%'),
    alignItems: 'center',
    width: wp('90%'),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalView17: {
    margin: wp('10%'),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: wp('10%'),
    // alignItems: "center",
    width: wp('90%'),
    alignSelf: 'center',
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
    backgroundColor: 'white',
    width: wp('100%'),
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
  icon10: {
    width: wp('83.5%'),
    marginTop: wp('-11%'),
  },
  EditSellPrice: {
    marginTop: wp('-1%'),

    padding: wp('2%'),

    width: wp('44%'),
    height: hp('7%'),
    alignSelf: 'center',
    marginBottom: wp('2%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  POS: {
    fontSize: wp('9%'),
    marginTop: wp('-5%'),
    // marginLeft:wp('5%'),
    marginBottom: wp('1%'),
    color: '#8a53e5',
    alignSelf: 'center',
    fontFamily: 'Cairo-SemiBold',
  },
  category6: {
    fontSize: wp('8%'),
    color: '#8a53e5',
    alignSelf: 'center',
    //marginLeft:wp('5%'),
    // marginTop: hp('-17%'),
    marginBottom: hp('-1%'),
    fontFamily: 'Cairo-SemiBold',
  },

  category: {
    fontSize: wp('4%'),
    color: '#8a53e5',
    alignSelf: 'center',

    marginBottom: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
  },
  categorySold: {
    fontSize: wp('8%'),
    color: '#8a53e5',
    alignSelf: 'center',
    marginBottom: wp('6%'),
    fontFamily: 'Cairo-SemiBold',
  },
  category8: {
    fontSize: wp('8%'),
    color: '#000',
    alignSelf: 'center',
    //marginLeft:wp('5%'),
    marginBottom: wp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },
  category1: {
    fontSize: wp('7%'),
    color: '#fff',
    alignSelf: 'center',
    //marginLeft:wp('5%'),
    marginBottom: wp('3%'),
    fontFamily: 'Cairo-SemiBold',
  },
  cardCnt: {
    borderWidth: 0, // Remove Border
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
    shadowRadius: 1,
    // elevation: 1, // This is for Android
    backgroundColor: '#fff',
    // color: "#4e31c1",
    width: wp('80%'),
    alignSelf: 'center',
    marginTop: hp('0.5%'),
  },
  category12: {
    fontSize: wp('6%'),
    color: '#4e31c1',
    alignSelf: 'center',
    marginTop: hp('2%'),
    //alignSelf: 'center',
    //marginLeft:wp('5%'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },
  category17: {
    fontSize: wp('6%'),
    color: '#4e31c1',
    alignSelf: 'center',
    // marginTop: hp('2%'),
    //alignSelf: 'center',
    //marginLeft:wp('5%'),
    marginBottom: hp('1%'),
    fontFamily: 'Cairo-SemiBold',
  },
  button1: {
    marginTop: wp('1%'),

    alignSelf: 'center',

    width: wp('37%'),
    height: hp('7%'),
    marginLeft: wp('3%'),
    marginBottom: wp('15%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  button8: {
    marginTop: wp('4%'),

    alignSelf: 'center',

    width: wp('37%'),
    height: hp('7%'),
    marginLeft: wp('-3%'),
    marginBottom: wp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  POSyellow17: {
    textAlign: 'center',
    color: '#4e31c1',
    fontFamily: 'Cairo-SemiBold',
    fontSize: 19,
    backgroundColor: '#ffd775',
    width: wp('80%'),
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    borderColor: '#ffd775',
  },

  button17: {
    backgroundColor: '#ffd775',
    borderColor: '#ffd775',
    padding: wp('5%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('85%'),
    height: hp('8%'),
    alignSelf: 'center',
    // marginRight:wp('9%'),
    //   marginTop:hp('-6%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 10,
    },
    shadowOpacity: 50,
    shadowRadius: 60,
    elevation: 20,
    textAlign: 'center',
    marginBottom: hp('2%'),
  },

  button2: {
    display: 'flex',
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('15%'),
    alignSelf: 'center',
    //  marginRight:wp('9%'),
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2disabled: {
    backgroundColor: '#A6ACAF',
    borderColor: '#A6ACAF',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('15%'),
    alignSelf: 'center',
    //  marginRight:wp('9%'),
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

  button21: {
    backgroundColor: '#562dc7',
    borderColor: '#562dc7',
    padding: wp('2%'),
    fontFamily: 'Cairo-SemiBold',
    borderRadius: 10,
    borderWidth: wp('0.3%'),
    width: wp('68%'),
    height: wp('15%'),
    alignSelf: 'center',
    //  marginRight:wp('9%'),
    marginTop: hp('-3%'),
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
    marginTop: hp('-1%'),
  },
  button3: {
    marginTop: wp('-40%'),

    padding: wp('2%'),

    width: wp('37%'),
    height: hp('7%'),
    marginBottom: wp('5%'),
    borderWidth: wp('0.8%'),
    borderRadius: wp('6%'),
    borderColor: '#F2FFFF',
    backgroundColor: '#4e31c1',
  },
  btnText2: {
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
  },
  btnText3Disabled: {
    color: '#778899',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('1.5%'),
  },
  btnText3: {
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('1.5%'),
  },
  btnText4: {
    color: '#FFF',
    fontSize: wp('5%'),
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Cairo-SemiBold',

    alignSelf: 'center',
    marginTop: hp('1.5%'),
    marginLeft: wp('-8%'),
  },
  inputStyle1: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    color: '#4e31c1',
    marginBottom: hp('5%'),
    width: wp('55%'),
    fontSize: wp('50%'),
    // height: 100
  },
  CoverContainer: {
    // backgroundColor: "blue",
    width: '90%',
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  imgStyle: {
    width: '90%',
    height: 90,
    alignSelf: 'center',
  },
});

export default PosBuyCreditCart;
